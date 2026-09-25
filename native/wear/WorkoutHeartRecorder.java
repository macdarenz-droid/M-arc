package com.mrcdrnzz.dailytracker.wear;

import android.content.Context;
import android.provider.Settings;
import com.mrcdrnzz.dailytracker.watch.core.HeartRateMeasurement;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.IntSupplier;
import org.json.JSONObject;

/**
 * Process-owned worker, independent of the WebView's listener/lifetime. Inert for phone-owned
 * workouts. BLE never waits for disk and cannot start or transfer workout ownership.
 */
public final class WorkoutHeartRecorder {
    static final int MAX_PENDING = 128, BATCH_SIZE = 32;
    private static final String PROCESS_CLOCK = "process-" + UUID.randomUUID();
    private static WorkoutHeartRecorder instance;
    private final Context context;
    private final Executor worker;
    private ClockIdentity clock;
    private volatile Target target;
    private final ArrayDeque<String> captureErrors = new ArrayDeque<>();

    private synchronized void captureFailure(Exception error) {
        captureErrors.addLast(error.getClass().getSimpleName());
        while (captureErrors.size() > 32) captureErrors.removeFirst();
    }
    /** Exception classes only: never messages, SQL, IDs, sensor values or stack traces. */
    public synchronized String diagnostics() { return String.join("\n", captureErrors); }
    public static synchronized String processDiagnostics() { return instance == null ? "" : instance.diagnostics(); }

    public static synchronized WorkoutHeartRecorder get(Context context) {
        if (instance == null) instance = new WorkoutHeartRecorder(context.getApplicationContext(),
                Executors.newSingleThreadExecutor());
        return instance;
    }

    /** Injectable serial executor lets tests hold disk work while real receipt times keep moving. */
    WorkoutHeartRecorder(Context context, Executor worker) {
        this.context = context;
        this.worker = worker;
        worker.execute(() -> {
            clock = clockIdentity(() -> Settings.Global.getInt(context.getContentResolver(), Settings.Global.BOOT_COUNT, -1), this::captureFailure);
            try (WorkoutCommandStore store = new WorkoutCommandStore(context)) { refreshTarget(store); }
            catch (Exception error) { captureFailure(error); /* Ordinary BLE remains usable. */ }
        });
    }

    record ClockIdentity(String id, String scope) {}
    static ClockIdentity clockIdentity(IntSupplier bootCount) { return clockIdentity(bootCount, error -> {}); }
    private static ClockIdentity clockIdentity(IntSupplier bootCount, Consumer<Exception> failure) {
        try {
            int count = bootCount.getAsInt();
            if (count >= 0) return new ClockIdentity("boot-" + count, "boot");
        } catch (RuntimeException error) { failure.accept(error); }
        // Never infer a boot from wall time; unknown boot identity is process-local only.
        return new ClockIdentity(PROCESS_CLOCK, "process");
    }

    record Sample(String sourceId, long sequence, long epochMs, long elapsedMs, int bpm, Boolean contact) {
        Sample {
            if (sourceId == null || !sourceId.matches("[A-Za-z0-9][A-Za-z0-9_-]{0,79}") || sequence < 1
                    || epochMs < 1 || epochMs > 8_640_000_000_000_000L || elapsedMs < 0 || bpm < 0 || bpm > 300)
                throw new IllegalArgumentException("Invalid heart sample");
        }
    }

    /** Opaque receipt-time owner ticket. A delayed callback cannot choose a later workout. */
    public static final class Target {
        private final String handoverId;
        private final ClockIdentity clock;
        private final ArrayDeque<Sample> pending = new ArrayDeque<>();
        private long dropped;
        private boolean scheduled, writeFailed;
        private Target(String handoverId, ClockIdentity clock) { this.handoverId = handoverId; this.clock = clock; }
    }

    public Target targetAtReceipt() { return target; }

    private void refreshTarget(WorkoutCommandStore store) {
        String owner = store.heartOwner();
        Target prior = target;
        if (owner == null) target = null;
        else if (prior == null || !owner.equals(prior.handoverId)) target = new Target(owner, clock);
    }

    /** Shares serialization with capture, but command requests never enter the bounded sample queue. */
    void ownership(String action, JSONObject seed, String token, Consumer<JSONObject> success, Runnable failure) {
        try {
            worker.execute(() -> {
                try (WorkoutCommandStore store = new WorkoutCommandStore(context)) {
                    JSONObject result;
                    switch (action) {
                        case "read": result = store.readOwnership(); break;
                        case "reset": result = store.resetForPhone(); break;
                        case "settle": result = store.settleHandover(token); break;
                        case "handover": result = store.handover(seed); break;
                        default: throw new IllegalArgumentException("Unknown ownership action");
                    }
                    try {
                        refreshTarget(store);
                        if ("native".equals(result.optString("owner"))) {
                            JSONObject capture = store.heartCapture(result.getJSONObject("seed").getString("handoverId"));
                            Target current = target;
                            if (current != null) synchronized (current) {
                                capture.put("pendingSamples", current.pending.size()).put("writeFailed", current.writeFailed);
                                schedule(current); // Retry a retained tail after an earlier storage failure.
                            }
                            result.put("heartCapture", capture.put("available", true));
                        }
                    } catch (Exception captureUnavailable) {
                        captureFailure(captureUnavailable);
                        // Optional capture metadata must never turn a confirmed owner into a failed
                        // ownership read (the phone may be recovering a lost local marker).
                        result.put("heartCapture", new JSONObject().put("available", false)
                                .put("coverage", "unverified").put("writeFailed", true));
                    }
                    success.accept(result);
                } catch (Exception e) {
                    captureFailure(e);
                    if ("read".equals(action)) {
                        try {
                            // Read only a known core schema; never use this to acknowledge a write,
                            // cancel a prepared handover or infer that the phone owns the workout.
                            JSONObject recovered = WorkoutCommandStore.readKnownOwnerWithoutUpgrade(context);
                            recovered.put("heartCapture", new JSONObject().put("available", false)
                                    .put("coverage", "unverified").put("writeFailed", true));
                            success.accept(recovered);
                            return;
                        } catch (Exception unavailable) { captureFailure(unavailable); }
                    }
                    failure.run();
                }
            });
        } catch (RuntimeException e) { captureFailure(e); failure.run(); }
    }

    /** Called on the service thread after parsing, with times/owner captured on the BLE callback. */
    public void record(Target atReceipt, String sourceId, long sequence, HeartRateMeasurement measurement,
                       long epochMs, long elapsedMs) {
        if (atReceipt == null) return;
        synchronized (atReceipt) {
            try {
                Sample sample = new Sample(sourceId, sequence, epochMs, elapsedMs, measurement.bpm, measurement.contactDetected);
                if (atReceipt.pending.size() < MAX_PENDING) atReceipt.pending.addLast(sample);
                else atReceipt.dropped++;
            } catch (IllegalArgumentException invalid) { captureFailure(invalid); atReceipt.dropped++; }
            schedule(atReceipt);
        }
    }

    /** Caller holds the target lock; one queued drain at a time bounds worker pressure. */
    private void schedule(Target current) {
        if (current.scheduled || (current.pending.isEmpty() && current.dropped == 0)) return;
        current.scheduled = true;
        try { worker.execute(() -> drain(current)); }
        catch (RuntimeException e) { captureFailure(e); current.scheduled = false; current.writeFailed = true; }
    }

    private void drain(Target current) {
        List<Sample> batch = new ArrayList<>();
        long lost;
        synchronized (current) {
            for (Sample sample : current.pending) { batch.add(sample); if (batch.size() == BATCH_SIZE) break; }
            lost = current.dropped;
        }
        // Do not hold the service's queue lock while doing any database work.
        try (WorkoutCommandStore store = new WorkoutCommandStore(context)) {
            boolean owned = store.appendHeart(current.handoverId, current.clock.id(), current.clock.scope(), batch, lost);
            synchronized (current) {
                if (owned) {
                    for (int i = 0; i < batch.size(); i++) current.pending.removeFirst();
                    current.dropped -= lost;
                } else { current.pending.clear(); current.dropped = 0; }
                current.scheduled = false; current.writeFailed = false;
                schedule(current); // Yield to already queued ownership work between small batches.
            }
        } catch (Exception e) {
            captureFailure(e);
            synchronized (current) { current.scheduled = false; current.writeFailed = true; }
            // Preserve the bounded tail. A new packet or ownership read retries it; no busy loop.
        }
    }
}
