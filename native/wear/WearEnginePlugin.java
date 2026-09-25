package com.mrcdrnzz.dailytracker.wear;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.os.SystemClock;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.huawei.hmf.tasks.Task;
import com.huawei.wearengine.HiWear;
import com.huawei.wearengine.WearEngineException;
import com.huawei.wearengine.auth.AuthCallback;
import com.huawei.wearengine.auth.Permission;
import com.huawei.wearengine.device.Device;
import com.huawei.wearengine.p2p.Message;
import com.huawei.wearengine.p2p.P2pClient;
import com.huawei.wearengine.p2p.Receiver;
import com.huawei.wearengine.p2p.SendCallback;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import org.json.JSONArray;
import org.json.JSONObject;

/** Gate A diagnostics plus isolated ownership recovery. No workout-command receiver. */
@CapacitorPlugin(name = "WearEngine")
public class WearEnginePlugin extends Plugin {
    private static final String PREFS = "marc_wear_gate_a_v1";
    private static final int MAX_EVENTS = 1200;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService disk = Executors.newSingleThreadExecutor();
    private final List<JSObject> events = new ArrayList<>();
    private final Map<String, Device> devices = new HashMap<>();
    private final Map<String, Long> pending = new HashMap<>();
    private JSArray deviceList = new JSArray();
    private JSObject environment = new JSObject();
    private String run = "", hrRequest = "";
    private int generation, count, dropped, lastHrSequence = -1;
    private String lastHeartbeatBoot = "";
    private int lastHeartbeatSequence = -1;
    private boolean loaded, active, authorized, receiverReady, foreground = true, authPending;
    private volatile boolean persisted = true;
    private P2pClient p2p;
    private Receiver receiver;
    private Device selected;

    /** Local SQLite only. Never sends a watch acknowledgement or touches lab diagnostics. */
    @PluginMethod public void workoutOwnership(PluginCall call) {
        try {
            WorkoutHeartRecorder.get(getContext()).ownership(call.getString("action", ""), call.getObject("seed"),
                    call.getString("handoverId"), result -> {
                        try { call.resolve(new JSObject(result.toString())); }
                        catch (Exception e) { call.reject("Workout ownership could not be verified."); }
                    }, () -> call.reject("Workout ownership could not be verified."));
        } catch (RuntimeException e) {
            // No workout payload or arbitrary database error goes into diagnostics.
            call.reject("Workout ownership could not be verified.");
        }
    }

    private JSObject obj(String key, Object value) { return new JSObject().put(key, value); }
    private void onMain(Runnable action) {
        main.post(() -> { try { action.run(); } catch (Exception | LinkageError e) { error("callback", e); } });
    }
    private boolean current(int g) { return active && generation == g; }
    private boolean interactive() {
        PowerManager power = (PowerManager) getContext().getSystemService(Context.POWER_SERVICE);
        return power != null && power.isInteractive();
    }
    private void record(String kind, JSObject data) {
        if (events.size() == MAX_EVENTS) { events.remove(0); dropped++; }
        events.add(new JSObject().put("n", ++count).put("at", System.currentTimeMillis())
            .put("elapsed", SystemClock.elapsedRealtime()).put("kind", kind).put("data", data)
            .put("foreground", foreground).put("interactive", interactive()));
        persist();
    }
    private void error(String operation, Throwable e) {
        JSObject data = obj("operation", operation).put("type", e.getClass().getSimpleName());
        if (e instanceof WearEngineException) data.put("code", ((WearEngineException) e).getErrorCode());
        // Do not export arbitrary SDK error messages: they may contain device identifiers.
        record("error", data);
    }
    private JSObject snapshot() {
        return new JSObject().put("schema", 1).put("run", run).put("active", active)
            .put("authorized", authorized).put("receiverReady", receiverReady).put("devices", deviceList)
            .put("events", new JSArray(events)).put("dropped", dropped).put("persisted", persisted)
            .put("environment", environment);
    }
    private void persist() {
        final String json = snapshot().toString();
        final Context context = getContext().getApplicationContext();
        disk.execute(() -> {
            try { persisted = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("report", json).commit(); }
            catch (RuntimeException e) { persisted = false; }
        });
    }
    private void loadReport() throws Exception {
        if (loaded) return;
        loaded = true;
        String saved = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("report", "");
        if (saved == null || saved.isEmpty()) return;
        JSONObject old = new JSONObject(saved);
        run = old.optString("run"); dropped = old.optInt("dropped");
        environment = new JSObject(old.getJSONObject("environment").toString());
        JSONArray entries = old.getJSONArray("events");
        for (int i = Math.max(0, entries.length() - MAX_EVENTS); i < entries.length(); i++) {
            JSObject event = new JSObject(entries.getJSONObject(i).toString());
            events.add(event); count = Math.max(count, event.optInt("n"));
        }
        record("process_restored", obj("previousRunWasActive", old.optBoolean("active"))
            .put("note", "No automatic reauthorization or receiver restoration; gaps are unknown."));
    }
    private String version(String pkg) {
        try { return getContext().getPackageManager().getPackageInfo(pkg, 0).versionName; }
        catch (Exception e) { return "not visible or not installed"; }
    }
    @SuppressWarnings("deprecation")
    private String certificate() {
        try {
            PackageInfo info = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 64);
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(info.signatures[0].toByteArray());
            StringBuilder out = new StringBuilder();
            for (byte b : digest) { if (out.length() > 0) out.append(':'); out.append(String.format(java.util.Locale.ROOT, "%02X", b & 255)); }
            return out.toString();
        } catch (Exception e) { return "unavailable"; }
    }
    private <T> void observe(Task<T> task, String operation, int g, Consumer<T> success) {
        final boolean[] finished = {false}; // Accessed only on main, including SDK callbacks.
        task.addOnSuccessListener(value -> onMain(() -> { if (current(g)) { finished[0] = true; record("sdk_accepted", obj("operation", operation)); success.accept(value); } }))
            .addOnFailureListener(e -> onMain(() -> { if (current(g)) { finished[0] = true; error(operation, e); } }));
        main.postDelayed(() -> { if (current(g) && !finished[0]) record("sdk_timeout", obj("operation", operation).put("lateResultStillPossible", true)); }, 15000);
    }
    private void require(boolean condition, String message) { if (!condition) throw new IllegalStateException(message); }

    @PluginMethod
    public void execute(PluginCall call) {
        main.post(() -> {
            try {
                loadReport();
                String action = call.getString("action", "snapshot");
                if ("begin".equals(action)) begin(call);
                else if (!"snapshot".equals(action)) {
                    require(active, "Begin a diagnostic run first.");
                    switch (action) {
                        case "authorize": authorize(); break;
                        case "devices": discover(); break;
                        case "connect": connect(call); break;
                        case "ping": ping(); break;
                        case "probe": send(call.getString("op", ""), call.getInt("bytes", 0)); break;
                        case "mark": record("observation", obj("userReported", bounded(call.getString("note", ""), 200))); break;
                        case "stop": stop("user"); break;
                        default: throw new IllegalArgumentException("Unknown lab action.");
                    }
                }
                call.resolve(snapshot());
            } catch (Exception | LinkageError e) {
                error("execute", e);
                call.reject(e instanceof IllegalStateException || e instanceof IllegalArgumentException ? e.getMessage() : "Wear Engine request failed; export the diagnostic report.");
            }
        });
    }
    private String bounded(String text, int limit) { return text.length() > limit ? text.substring(0, limit) : text; }
    private void begin(PluginCall call) {
        require(!active, "Stop and export the current run first.");
        generation++; events.clear(); devices.clear(); deviceList = new JSArray(); pending.clear(); count = dropped = 0;
        run = UUID.randomUUID().toString(); authorized = receiverReady = authPending = false;
        selected = null; p2p = null; receiver = null; hrRequest = ""; lastHrSequence = -1; active = true;
        lastHeartbeatBoot = ""; lastHeartbeatSequence = -1;
        environment = new JSObject().put("phoneModel", Build.MANUFACTURER + " " + Build.MODEL)
            .put("androidApi", Build.VERSION.SDK_INT).put("androidVersion", Build.VERSION.RELEASE)
            .put("package", getContext().getPackageName()).put("appVersion", version(getContext().getPackageName()))
            .put("certificateSHA256", certificate()).put("huaweiAppId", "119100049").put("wearEngineSDK", "5.0.3.300")
            .put("huaweiHealthVersion", version("com.huawei.health"))
            .put("accountRegionUserReported", bounded(call.getString("region", ""), 60))
            .put("timeMeaning", "phone wall time and elapsedRealtime; watch timestamps are not latency measurements")
            .put("foregroundService", false).put("deviceVerification", "PENDING - inspect actual GT6 and exported evidence");
        record("begin", obj("maximumMinutes", 10));
        int g = generation;
        main.postDelayed(() -> { if (current(g)) stop("10 minute limit"); }, 600000);
    }
    private void authorize() {
        require(!authPending, "Authorization is already pending.");
        authPending = true; int g = generation;
        record("authorization_requested", obj("permission", "DEVICE_MANAGER"));
        try {
            observe(HiWear.getAuthClient(getActivity()).requestPermission(new AuthCallback() {
                @Override public void onOk(Permission[] granted) { onMain(() -> {
                    if (!current(g) || !authPending) return;
                    authPending = false; authorized = false;
                    if (granted != null) for (Permission p : granted) if (Permission.DEVICE_MANAGER.getName().equals(p.getName())) authorized = true;
                    record("authorization_result", obj("granted", authorized));
                }); }
                @Override public void onCancel() { onMain(() -> { if (current(g)) { authPending = false; authorized = false; record("authorization_cancelled", new JSObject()); } }); }
            }, Permission.DEVICE_MANAGER), "authorize", g, unused -> {});
        } catch (RuntimeException e) { authPending = false; throw e; }
        main.postDelayed(() -> { if (current(g) && authPending) { authPending = false; record("authorization_timeout", new JSObject()); } }, 90000);
    }
    private void discover() {
        require(authorized, "Authorize Wear Engine first.");
        require(selected == null, "Use a new run to change devices.");
        int g = generation;
        observe(HiWear.getDeviceClient(getActivity()).getBondedDevices(), "devices", g, result -> {
            if (selected != null) return;
            devices.clear(); deviceList = new JSArray(); int i = 0;
            for (Device d : result) {
                String token = "device-" + ++i; devices.put(token, d);
                deviceList.put(new JSObject().put("token", token).put("model", d.getModel())
                    .put("firmware", d.getSoftwareVersion()).put("connected", d.isConnected()));
            }
            record("devices", obj("items", deviceList));
        });
    }
    private void connect(PluginCall call) {
        require(authorized, "Authorize Wear Engine first.");
        require(selected == null, "Receiver already configured. Start a new run to change it.");
        String peer = call.getString("peer", ""), fingerprint = call.getString("fingerprint", "").trim();
        require(peer.matches("[A-Za-z][A-Za-z0-9_.]{2,199}") && !fingerprint.isEmpty() && fingerprint.length() <= 512, "Enter the watch bundle name and watch certificate fingerprint.");
        Device candidate = devices.get(call.getString("token", ""));
        require(candidate != null, "Discover and select a watch first.");
        int g = generation;
        p2p = HiWear.getP2pClient(getActivity()); p2p.setPeerPkgName(peer); p2p.setPeerFingerPrint(fingerprint);
        selected = candidate;
        environment.put("watchModel", candidate.getModel()).put("watchFirmware", candidate.getSoftwareVersion()).put("watchBundle", peer);
        receiver = message -> onMain(() -> { if (current(g)) receive(message); });
        record("receiver_requested", obj("peer", peer));
        final P2pClient registrationClient = p2p;
        final Receiver registrationReceiver = receiver;
        p2p.registerReceiver(selected, receiver)
            .addOnSuccessListener(unused -> onMain(() -> {
                if (current(g)) { receiverReady = true; record("receiver_ready", new JSObject()); }
                else registrationClient.unregisterReceiver(registrationReceiver)
                    .addOnFailureListener(e -> onMain(() -> { if (generation == g) error("late_receiver_cleanup", e); }));
            }))
            .addOnFailureListener(e -> onMain(() -> { if (current(g)) error("registerReceiver", e); }));
        main.postDelayed(() -> { if (current(g) && !receiverReady) record("receiver_timeout", new JSObject()); }, 15000);
    }
    private void ping() {
        require(receiverReady, "Register the watch receiver first.");
        int g = generation;
        record("ping_requested", new JSObject());
        final boolean[] received = {false};
        observe(p2p.ping(selected, code -> onMain(() -> { if (current(g)) { received[0] = true; record("ping_result", obj("code", code).put("watchOpened", "requires observation")); } })), "ping", g, unused -> {});
        main.postDelayed(() -> { if (current(g) && !received[0]) record("ping_timeout", new JSObject()); }, 15000);
    }
    private void send(String op, int size) {
        require(receiverReady, "Register the watch receiver first.");
        require(java.util.Arrays.asList("echo", "capabilities", "hr_start", "hr_stop", "storage_write", "storage_read", "vibrate", "payload").contains(op), "Unknown probe.");
        require(pending.size() < 8, "Wait for pending probes to finish.");
        String id = UUID.randomUUID().toString();
        JSObject body = new JSObject().put("tag", "marc-watch-lab").put("v", 1).put("run", run).put("id", id).put("op", op);
        if ("payload".equals(op)) {
            require(size == 256 || size == 512 || size == 1024, "Unsupported payload size.");
            body.put("pad", ""); int pad = size - body.toString().getBytes(StandardCharsets.UTF_8).length;
            StringBuilder padding = new StringBuilder(); for (int i = 0; i < pad; i++) padding.append('x');
            body.put("pad", padding.toString());
        }
        byte[] bytes = body.toString().getBytes(StandardCharsets.UTF_8);
        require(bytes.length <= 1024, "Probe exceeds 1 KB.");
        int g = generation;
        pending.put(id, SystemClock.elapsedRealtime());
        if ("hr_start".equals(op)) { hrRequest = id; lastHrSequence = -1; }
        record("send_requested", obj("id", id).put("op", op).put("bytes", bytes.length));
        observe(p2p.send(selected, new Message.Builder().setPayload(bytes).build(), new SendCallback() {
            @Override public void onSendResult(int code) { onMain(() -> { if (current(g)) record("send_result", obj("id", id).put("code", code)); }); }
            @Override public void onSendProgress(long progress) { /* No file transfer. */ }
        }), "send:" + op, g, unused -> {});
        main.postDelayed(() -> { if (current(g) && pending.remove(id) != null) record("reply_timeout", obj("id", id).put("op", op)); }, 15000);
    }
    private void receive(Message message) {
        try {
            byte[] bytes = message.getData();
            if (bytes == null || bytes.length > 1024) { record("invalid_message", obj("reason", "size or type")); return; }
            JSONObject body = new JSONObject(new String(bytes, StandardCharsets.UTF_8));
            if (!"marc-watch-lab".equals(body.optString("tag")) || body.optInt("v") != 1 || !run.equals(body.optString("run"))) return;
            String kind = body.optString("kind"), id = body.optString("id");
            if ("heartbeat".equals(kind)) {
                String boot = bounded(body.optString("boot"), 40); int seq = body.optInt("seq", -1);
                if (boot.equals(lastHeartbeatBoot) && seq <= lastHeartbeatSequence) return;
                lastHeartbeatBoot = boot; lastHeartbeatSequence = seq;
                record("watch_heartbeat", obj("boot", boot).put("seq", seq).put("watchAt", body.optLong("watchAt"))
                    .put("shows", body.optInt("shows")).put("hides", body.optInt("hides")).put("swipes", body.optInt("swipes")));
            } else if ("sensor_error".equals(kind) && id.equals(hrRequest)) {
                record("watch_sensor_error", obj("code", bounded(String.valueOf(body.opt("code")), 40)));
            } else if ("hr".equals(kind)) {
                double bpm = body.optDouble("bpm", Double.NaN); int seq = body.optInt("seq", -1);
                if (!id.equals(hrRequest) || !Double.isFinite(bpm) || bpm <= 0 || bpm > 300 || seq <= lastHrSequence) {
                    record("hr_rejected", obj("reason", "request, value or sequence")); return;
                }
                lastHrSequence = seq;
                record("hr_sample", obj("bpm", bpm).put("seq", seq).put("watchAt", body.optLong("watchAt"))
                    .put("source", "watch sensor probe; broadcast state must be user-confirmed"));
            } else if ("reply".equals(kind)) {
                Long sent = pending.remove(id);
                if (sent == null) { record("unmatched_reply", obj("id", bounded(id, 40))); return; }
                // Allowlisted probe data only, never export arbitrary received messages.
                JSObject data = obj("id", id).put("roundTripMs", SystemClock.elapsedRealtime() - sent);
                for (String key : new String[]{"op", "status", "code", "bytes", "sensor", "storage", "vibrator", "stored", "value", "swipes", "shows", "hides", "boot"}) {
                    if (body.has(key)) data.put(key, bounded(String.valueOf(body.opt(key)), 120));
                }
                record("watch_reply", data);
            }
        } catch (Exception e) { error("decode", e); }
    }
    private void stop(String reason) {
        if (!active) return;
        // Remote HR also has an independent 5-minute timeout. Local stop cannot prove remote stop.
        if (receiverReady) { try { send("hr_stop", 0); } catch (Exception e) { error("best_effort_hr_stop", e); } }
        active = false; authorized = false; receiverReady = false; authPending = false; pending.clear();
        record("stop", obj("reason", reason).put("remoteStopConfirmed", false));
        if (p2p != null && receiver != null) {
            final int g = generation;
            try {
                p2p.unregisterReceiver(receiver)
                    .addOnSuccessListener(unused -> onMain(() -> { if (generation == g) record("receiver_removed", new JSObject()); }))
                    .addOnFailureListener(e -> onMain(() -> { if (generation == g) error("unregisterReceiver", e); }));
            } catch (Exception e) { error("unregisterReceiver", e); }
        }
    }
    @Override protected void handleOnResume() { onMain(() -> { foreground = true; if (active) record("phone_resume", new JSObject()); }); }
    @Override protected void handleOnPause() { onMain(() -> { foreground = false; if (active) record("phone_pause", new JSObject()); }); }
    @Override protected void handleOnDestroy() { onMain(() -> stop("activity destroyed")); }
}
