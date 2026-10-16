package com.mrcdrnzz.dailytracker.wear;

import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.huawei.wearengine.HiWear;
import com.huawei.wearengine.WearEngineException;
import com.huawei.wearengine.auth.AuthCallback;
import com.huawei.wearengine.auth.Permission;
import com.huawei.wearengine.common.WearEngineErrorCode;
import com.huawei.wearengine.device.Device;
import com.huawei.wearengine.p2p.Message;
import com.huawei.wearengine.p2p.P2pClient;
import com.huawei.wearengine.p2p.PingCallback;
import com.huawei.wearengine.p2p.Receiver;
import com.huawei.wearengine.p2p.SendCallback;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Gate A question 2 (docs/WATCH-ARCHITECTURE.md): a thin pass-through to Huawei Wear Engine 5.0.3.304
 * for the hidden Watch lab. The request/acknowledgement logic lives in src/native/wearEngine.ts; this
 * class only connects, sends text and forwards what arrives. Debug APK only: when MARC_WEAR_LAB=1,
 * native/wear/android/prepare_android.py copies it in and lists it in capacitor.plugins.json.
 * Nothing is stored, and the watch's uuid and name are never read.
 *
 * Methods: connect({peerPkg, peerFp}) resolves {started:true} at once, then runs authorize, bonded
 * devices, peer setup, registerReceiver and ping, each reported as a "log" event; ping() and
 * send({text}) resolve {code} from Huawei's callback, {code:-1, error} on a task failure or
 * {code:-1, timeout:true} after 15 s; stop() unregisters the receiver and resolves {ok};
 * setNativeAck({on}) resolves {on}.
 * Events: "log" {step, ok, text}; "message" {type, data, desc, dataLen, descLen, rxAt} per watch
 * message, plus {by:"native", dup} when this class answered it.
 *
 * GATE-A-PROBE-2 (Gate A question 4): rxAt is System.currentTimeMillis() taken in Huawei's receiver
 * callback, before anything else runs, so JS can show how late it handled the message. With Native
 * ack on (in memory only, off at start) this class answers a valid request or heart-rate report at
 * once, without waiting for JS, with the ack src/native/wearEngine.ts would build ("by":"native",
 * dup over the last 32 ids), and logs its send result as an "ack" row. Wire holds those message rules.
 */
@CapacitorPlugin(name = "WearEngine")
public class WearEnginePlugin extends Plugin {
    /** Huawei's message limit, both directions. */
    static final int MAX_BYTES = 1024;
    private static final long TIMEOUT_MS = 15000;
    /** The Huawei Health authorization screen waits on the user. */
    private static final long AUTH_TIMEOUT_MS = 90000;
    /** Ping 202: the watch app is running (Huawei: 200 not installed, 201 installed, not running). */
    private static final int PING_RUNNING = 202;
    /** Huawei's send result for a message handed to the watch. */
    private static final int SEND_OK = 207;

    private final Handler main = new Handler(Looper.getMainLooper());
    // Read and written on the main thread only. A new connect or a stop bumps generation, so late
    // callbacks from an earlier chain are ignored.
    private int generation;
    private P2pClient p2p;
    private Device device;
    private Receiver receiver;
    // Native ack (GATE-A-PROBE-2), main thread only, never stored: off at start, ids oldest first.
    private boolean nativeAck;
    private final List<String> ackSeen = new ArrayList<>();
    // Liveness ticker (GATE-A-PROBE-2 review), main thread only, never stored. A tick that runs late by
    // uptime means the process was frozen (Android); late by real time only means the phone slept; a
    // late native receipt while ticks kept time means the message itself was held back.
    private static final long TICK_MS = 1000;
    private static final long GAP_MS = 2000;
    private Runnable ticker;
    private long tickUp;
    private long tickReal;

    @PluginMethod
    public void connect(PluginCall call) {
        String peerPkg = call.getString("peerPkg", "").trim();
        String peerFp = call.getString("peerFp", "").trim();
        if (peerPkg.isEmpty() || peerPkg.length() > 200 || peerFp.isEmpty() || peerFp.length() > 512) {
            call.reject("peerPkg and peerFp are required");
            return;
        }
        onMain("connect", () -> {
            int g = ++generation;
            dropReceiver();
            p2p = null;
            device = null;
            log("phone", true, "phone " + Build.MODEL + " android " + Build.VERSION.RELEASE + " sdk " + Build.VERSION.SDK_INT);
            startTicker(g);
            call.resolve(new JSObject().put("started", true));
            authorize(g, peerPkg, peerFp);
        });
    }

    @PluginMethod
    public void ping(PluginCall call) {
        onMain("ping", () -> {
            if (p2p == null || device == null) {
                call.reject("Connect first");
                return;
            }
            doPing(generation, call);
        });
    }

    @PluginMethod
    public void send(PluginCall call) {
        byte[] bytes = call.getString("text", "").getBytes(StandardCharsets.UTF_8);
        if (bytes.length == 0 || bytes.length > MAX_BYTES) {
            call.reject("text must be 1 to " + MAX_BYTES + " bytes");
            return;
        }
        onMain("send", () -> {
            if (p2p == null || device == null) {
                call.reject("Connect first");
                return;
            }
            transmit("send", bytes, call::resolve);
        });
    }

    /** Native ack on or off. In memory only; the change is logged as a "native" row. */
    @PluginMethod
    public void setNativeAck(PluginCall call) {
        Boolean value = call.getBoolean("on");
        if (value == null) {
            call.reject("on is required");
            return;
        }
        boolean on = value;
        onMain("native", () -> {
            nativeAck = on;
            log("native", true, "native ack " + (on ? "on" : "off"));
            call.resolve(new JSObject().put("on", on));
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        onMain("stop", () -> {
            generation++;
            stopTicker();
            Receiver r = receiver;
            P2pClient client = p2p;
            receiver = null;
            if (r == null || client == null) {
                log("stop", true, "rx off");
                call.resolve(new JSObject().put("ok", true));
                return;
            }
            boolean[] done = {false};
            try {
                client.unregisterReceiver(r)
                    .addOnSuccessListener(v -> onMain("stop", () -> {
                        if (done[0]) return;
                        done[0] = true;
                        log("stop", true, "rx off");
                        call.resolve(new JSObject().put("ok", true));
                    }))
                    .addOnFailureListener(e -> onMain("stop", () -> {
                        if (done[0]) return;
                        done[0] = true;
                        fail("stop", e);
                        call.resolve(new JSObject().put("ok", false).put("error", codeOf(e)));
                    }));
            } catch (RuntimeException e) {
                done[0] = true;
                fail("stop", e);
                call.resolve(new JSObject().put("ok", false).put("error", codeOf(e)));
                return;
            }
            main.postDelayed(() -> {
                if (done[0]) return;
                done[0] = true;
                log("stop", false, "stop timeout");
                call.resolve(new JSObject().put("ok", false).put("timeout", true));
            }, TIMEOUT_MS);
        });
    }

    /** Huawei: unregister the receiver when the app leaves. Runs on the main thread. */
    @Override
    protected void handleOnDestroy() {
        generation++;
        stopTicker();
        dropReceiver();
    }

    /** Ticks every second while connected and logs a gap row when a tick runs more than GAP_MS late. */
    private void startTicker(int g) {
        stopTicker();
        tickUp = SystemClock.uptimeMillis();
        tickReal = SystemClock.elapsedRealtime();
        ticker = new Runnable() {
            @Override
            public void run() {
                if (g != generation || ticker != this) return;
                long up = SystemClock.uptimeMillis();
                long real = SystemClock.elapsedRealtime();
                long upLate = up - tickUp - TICK_MS;
                long realLate = real - tickReal - TICK_MS;
                if (upLate > GAP_MS || realLate > GAP_MS) {
                    log("gap", false, "! native gap up " + seconds(up - tickUp) + "s real " + seconds(real - tickReal) + "s");
                }
                tickUp = up;
                tickReal = real;
                main.postDelayed(this, TICK_MS);
            }
        };
        main.postDelayed(ticker, TICK_MS);
    }

    private void stopTicker() {
        if (ticker != null) {
            main.removeCallbacks(ticker);
            ticker = null;
        }
    }

    private static String seconds(long ms) {
        return String.valueOf(Math.round(ms / 100.0) / 10.0);
    }

    private void authorize(int g, String peerPkg, String peerFp) {
        boolean[] done = {false};
        AuthCallback callback = new AuthCallback() {
            @Override
            public void onOk(Permission[] granted) {
                onMain("auth", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    boolean ok = false;
                    if (granted != null) {
                        for (Permission p : granted) {
                            if (p != null && Permission.DEVICE_MANAGER.getName().equals(p.getName())) ok = true;
                        }
                    }
                    log("auth", ok, ok ? "auth ok" : "auth denied");
                    if (ok) findDevice(g, peerPkg, peerFp);
                });
            }

            @Override
            public void onCancel() {
                onMain("auth", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    log("auth", false, "auth cancel");
                });
            }
        };
        try {
            HiWear.getAuthClient(getActivity()).requestPermission(callback, Permission.DEVICE_MANAGER)
                .addOnFailureListener(e -> onMain("auth", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    fail("auth", e);
                }));
        } catch (RuntimeException e) {
            done[0] = true;
            fail("auth", e);
            return;
        }
        timeout(g, "auth", done, AUTH_TIMEOUT_MS);
    }

    /** The first bonded watch that reports isConnected(). Logs model and firmware only. */
    private void findDevice(int g, String peerPkg, String peerFp) {
        boolean[] done = {false};
        try {
            HiWear.getDeviceClient(getActivity()).getBondedDevices()
                .addOnSuccessListener(list -> onMain("devices", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    Device chosen = pick(list);
                    if (chosen == null) {
                        log("devices", false, "no connected watch");
                        return;
                    }
                    device = chosen;
                    register(g, peerPkg, peerFp);
                }))
                .addOnFailureListener(e -> onMain("devices", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    fail("devices", e);
                }));
        } catch (RuntimeException e) {
            done[0] = true;
            fail("devices", e);
            return;
        }
        timeout(g, "devices", done, TIMEOUT_MS);
    }

    private Device pick(List<Device> list) {
        int n = list == null ? 0 : list.size();
        log("devices", n > 0, "devices " + n);
        Device chosen = null;
        if (list == null) return null;
        for (Device d : list) {
            if (d == null) continue;
            boolean on = d.isConnected();
            log("device", on, "watch " + d.getModel() + " sw " + d.getSoftwareVersion() + (on ? " connected" : " offline"));
            if (chosen == null && on) chosen = d;
        }
        return chosen;
    }

    private void register(int g, String peerPkg, String peerFp) {
        P2pClient client;
        try {
            client = HiWear.getP2pClient(getActivity());
            client.setPeerPkgName(peerPkg);
            client.setPeerFingerPrint(peerFp);
        } catch (RuntimeException e) {
            fail("peer", e);
            return;
        }
        p2p = client;
        log("peer", true, "peer " + peerPkg);
        Receiver r = message -> {
            // Stamped on Huawei's callback thread, before the hop to the main thread and to JS.
            long rxAt = System.currentTimeMillis();
            onMain("rx", () -> {
                if (g == generation) forward(message, rxAt);
                else log("rx", false, "late rx type " + message.getType());
            });
        };
        receiver = r;
        boolean[] done = {false};
        try {
            client.registerReceiver(device, r)
                .addOnSuccessListener(v -> onMain("rx", () -> {
                    if (g != generation) {
                        // A newer connect or a stop came first: do not leave a second receiver behind.
                        client.unregisterReceiver(r);
                        return;
                    }
                    if (done[0]) return;
                    done[0] = true;
                    log("rx", true, "rx ok");
                    doPing(g, null);
                }))
                .addOnFailureListener(e -> onMain("rx", () -> {
                    if (g != generation || done[0]) return;
                    done[0] = true;
                    if (receiver == r) receiver = null;
                    fail("rx", e);
                }));
        } catch (RuntimeException e) {
            receiver = null;
            fail("rx", e);
            return;
        }
        timeout(g, "rx", done, TIMEOUT_MS);
    }

    /** Resolves call (when given) with Huawei's ping code; also logs it while g is current. */
    private void doPing(int g, PluginCall call) {
        boolean[] done = {false};
        PingCallback callback = code -> onMain("ping", () -> {
            if (done[0]) return;
            done[0] = true;
            if (g == generation) log("ping", code == PING_RUNNING, "ping " + code);
            if (call != null) call.resolve(new JSObject().put("code", code));
        });
        try {
            p2p.ping(device, callback).addOnFailureListener(e -> onMain("ping", () -> {
                if (done[0]) return;
                done[0] = true;
                if (g == generation) fail("ping", e);
                if (call != null) call.resolve(new JSObject().put("code", -1).put("error", codeOf(e)));
            }));
        } catch (RuntimeException e) {
            done[0] = true;
            fail("ping", e);
            if (call != null) call.resolve(new JSObject().put("code", -1).put("error", codeOf(e)));
            return;
        }
        main.postDelayed(() -> {
            if (done[0]) return;
            done[0] = true;
            if (g == generation) log("ping", false, "ping timeout");
            if (call != null) call.resolve(new JSObject().put("code", -1).put("timeout", true));
        }, TIMEOUT_MS);
    }

    /**
     * Both fields go to JS (the 2026-10-16 run found the watch's text in data), with the native
     * receipt time. With Native ack on, a valid message is answered here first.
     */
    private void forward(Message message, long rxAt) {
        byte[] data = message.getData();
        String desc = message.getDescription();
        if (desc == null) desc = "";
        int dataLen = data == null ? 0 : data.length;
        int descLen = desc.getBytes(StandardCharsets.UTF_8).length;
        String dataText = dataLen > 0 && dataLen <= 4 * MAX_BYTES ? new String(data, StandardCharsets.UTF_8) : "";
        String descText = descLen <= 4 * MAX_BYTES ? desc : "";
        JSObject event = new JSObject()
            .put("type", message.getType())
            .put("data", dataText)
            .put("desc", descText)
            .put("dataLen", dataLen)
            .put("descLen", descLen)
            .put("rxAt", rxAt);
        // The same text wearEngine.ts reads: data, else the description.
        if (nativeAck) ackNatively(dataText.isEmpty() ? descText : dataText, rxAt, event);
        notifyListeners("message", event);
    }

    /** Answers a valid message at once and marks the event, so JS logs it without answering again. */
    private void ackNatively(String text, long rxAt, JSObject event) {
        String id = Wire.requestId(text);
        // An invalid message gets no answer; JS logs why it is bad.
        if (id == null || p2p == null || device == null) return;
        boolean dup = Wire.remember(ackSeen, id);
        event.put("by", "native").put("dup", dup);
        byte[] ack = Wire.ack(id, dup, Wire.bytes(text), "native").getBytes(StandardCharsets.UTF_8);
        transmit("ack", ack, r -> log("ack", r.optInt("code") == SEND_OK,
            "ack " + id + " " + Wire.result(r) + " native " + (System.currentTimeMillis() - rxAt) + "ms"));
    }

    /** What a send to the watch ended with: {code}, {code:-1, error} or {code:-1, timeout:true}. */
    private interface SendEnd {
        void end(JSObject result);
    }

    /** Sends bytes to the connected watch (main thread, p2p and device set); end runs once. */
    private void transmit(String step, byte[] bytes, SendEnd end) {
        int g = generation;
        boolean[] done = {false};
        SendCallback callback = new SendCallback() {
            @Override
            public void onSendResult(int code) {
                onMain(step, () -> {
                    if (done[0]) return;
                    done[0] = true;
                    end.end(new JSObject().put("code", code));
                });
            }

            @Override
            public void onSendProgress(long progress) {
                // Messages only, no file transfer.
            }
        };
        try {
            Message message = new Message.Builder().setPayload(bytes).build();
            p2p.send(device, message, callback).addOnFailureListener(e -> onMain(step, () -> {
                if (done[0]) return;
                done[0] = true;
                if (g == generation) fail(step, e);
                end.end(new JSObject().put("code", -1).put("error", codeOf(e)));
            }));
        } catch (RuntimeException e) {
            done[0] = true;
            fail(step, e);
            end.end(new JSObject().put("code", -1).put("error", codeOf(e)));
            return;
        }
        main.postDelayed(() -> {
            if (done[0]) return;
            done[0] = true;
            end.end(new JSObject().put("code", -1).put("timeout", true));
        }, TIMEOUT_MS);
    }

    private void dropReceiver() {
        Receiver r = receiver;
        P2pClient client = p2p;
        receiver = null;
        if (r == null || client == null) return;
        try {
            client.unregisterReceiver(r);
        } catch (RuntimeException e) {
            fail("stop", e);
        }
    }

    private void timeout(int g, String step, boolean[] done, long ms) {
        main.postDelayed(() -> {
            if (g != generation || done[0]) return;
            done[0] = true;
            log(step, false, step + " timeout");
        }, ms);
    }

    /** Every SDK callback lands here, so an exception becomes a log row instead of a crash. */
    private void onMain(String step, Runnable action) {
        main.post(() -> {
            try {
                action.run();
            } catch (RuntimeException e) {
                fail(step, e);
            }
        });
    }

    private void fail(String step, Throwable e) {
        log(step, false, step + " fail " + describe(e));
    }

    private void log(String step, boolean ok, String text) {
        notifyListeners("log", new JSObject().put("step", step).put("ok", ok).put("text", text));
    }

    private static int codeOf(Throwable e) {
        return e instanceof WearEngineException ? ((WearEngineException) e).getErrorCode() : -1;
    }

    /** Huawei's code and its fixed message; other exceptions give only their class name. */
    private static String describe(Throwable e) {
        if (e instanceof WearEngineException) {
            int code = ((WearEngineException) e).getErrorCode();
            return code + " " + WearEngineErrorCode.getErrorMsgFromCode(code);
        }
        return e == null ? "unknown" : e.getClass().getSimpleName();
    }

    /**
     * The message rules of src/native/wearEngine.ts (parseRequest, buildAck and the send result
     * text) for the native ack. Pure and free of Android and Capacitor calls, so a plain JVM can
     * check it against the TypeScript (tests/watch-lab-a2.test.ts checks the ack text and limits).
     * Trailing text after the object is rejected, as JSON.parse does. One known difference remains:
     * org.json also reads some text that is not strict JSON (unquoted names, hex numbers) that
     * JSON.parse rejects. The watch sends JSON.stringify output only; such text would be answered here
     * and logged as bad by JS.
     */
    static final class Wire {
        static final String TAG = "marc-a2";
        static final int ACK_MEMORY = 32;
        static final int BPM_MIN = 20;
        static final int BPM_MAX = 250;
        private static final Pattern ID = Pattern.compile("[A-Za-z0-9-]{3,32}");

        private Wire() {
        }

        /** The id of a valid request ("req") or heart-rate report ("hr", integer bpm 20 to 250), else null. */
        static String requestId(String text) {
            if (text == null || bytes(text) > MAX_BYTES) return null;
            JSONObject o;
            try {
                JSONTokener tk = new JSONTokener(text);
                Object v = tk.nextValue();
                if (!(v instanceof JSONObject) || tk.nextClean() != 0) return null;
                o = (JSONObject) v;
            } catch (JSONException | RuntimeException e) {
                // Never throws: forward() must still pass the message to JS.
                return null;
            }
            Object k = o.opt("k");
            if (!TAG.equals(o.opt("t")) || !isNumber(o.opt("v"), 1) || !("req".equals(k) || "hr".equals(k))) return null;
            Object id = o.opt("id");
            if (!(id instanceof String) || !ID.matcher((String) id).matches()) return null;
            if ("hr".equals(k)) {
                Object bpm = o.opt("bpm");
                if (!(bpm instanceof Number)) return null;
                double b = ((Number) bpm).doubleValue();
                if (b != Math.rint(b) || b < BPM_MIN || b > BPM_MAX) return null;
            }
            return (String) id;
        }

        /** True when id is among the last ACK_MEMORY ids; seen is updated in place, oldest first. */
        static boolean remember(List<String> seen, String id) {
            boolean dup = seen.remove(id);
            seen.add(id);
            while (seen.size() > ACK_MEMORY) seen.remove(0);
            return dup;
        }

        /** The ack text, key for key as buildAck's JSON.stringify; id has passed requestId. */
        static String ack(String id, boolean dup, int n, String by) {
            return "{\"t\":\"" + TAG + "\",\"v\":1,\"k\":\"ack\",\"id\":\"" + id + "\",\"dup\":" + dup + ",\"n\":" + n + ",\"by\":\"" + by + "\"}";
        }

        static int bytes(String text) {
            return text.getBytes(StandardCharsets.UTF_8).length;
        }

        /** A send result as wearEngine.ts's sendText shows it: code, then "timeout" or "e<error>". */
        static String result(JSONObject r) {
            String s = String.valueOf(r.optInt("code"));
            if (r.optBoolean("timeout")) s += " timeout";
            if (r.has("error")) s += " e" + r.optInt("error");
            return s;
        }

        /** A JSON number equal to want, as JS's === sees 1 and 1.0. */
        private static boolean isNumber(Object v, double want) {
            return v instanceof Number && ((Number) v).doubleValue() == want;
        }
    }
}
