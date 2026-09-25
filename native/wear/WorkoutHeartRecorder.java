package com.mrcdrnzz.dailytracker.wear;

import android.content.Context;
import android.provider.Settings;
import com.mrcdrnzz.dailytracker.watch.core.HeartRateMeasurement;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.IntSupplier;
import java.util.function.Supplier;
import org.json.JSONObject;

/**
 * Process-owned worker, independent of the WebView's listener/lifetime. Inert for phone-owned
 * workouts. BLE never waits for disk and cannot start or transfer workout ownership.
 */
public final class WorkoutHeartRecorder {
    static final int MAX_PENDING = 128, BATCH_SIZE = 32;
    static final long FLUSH_INTERVAL_MS = 5000;
    private static final String PROCESS_CLOCK = "process-" + UUID.randomUUID();
    private static WorkoutHeartRecorder instance;
    private final Context context;
    private final Scheduler worker;
    private final Supplier<WorkoutCommandStore> storeFactory;
    private WorkoutCommandStore store; // Only the worker may open, use or close it.
    private volatile boolean captureEnabled = true;
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

    interface Scheduler extends Executor { Runnable later(Runnable task, long delayMs); }
    private static Scheduler serialWorker() {
        ScheduledExecutorService serial = Executors.newSingleThreadScheduledExecutor();
        return new Scheduler() {
            public void execute(Runnable task) { serial.execute(task); }
            public Runnable later(Runnable task, long delayMs) {
                java.util.concurrent.ScheduledFuture<?> scheduled = serial.schedule(task, delayMs, TimeUnit.MILLISECONDS);
                return () -> scheduled.cancel(false);
            }
        };
    }
    public static synchronized WorkoutHeartRecorder get(Context context) {
        if (instance == null) instance = new WorkoutHeartRecorder(context.getApplicationContext(), serialWorker());
        return instance;
    }

    WorkoutHeartRecorder(Context context, Scheduler worker) { this(context, worker, () -> new WorkoutCommandStore(context)); }
    /** Injectable worker/clock and store factory exercise real SQLite with deterministic timing. */
    WorkoutHeartRecorder(Context context, Scheduler worker, Supplier<WorkoutCommandStore> factory) {
        this.context = context;
        this.worker = worker;
        this.storeFactory = factory;
        submit(() -> {
            clock = clockIdentity(() -> Settings.Global.getInt(context.getContentResolver(), Settings.Global.BOOT_COUNT, -1), this::captureFailure);
            try { refreshTarget(store()); }
            catch (Exception error) { captureFailure(error); /* Ordinary BLE remains usable. */ }
        });
    }

    private WorkoutCommandStore store() {
        if (store == null) {
            WorkoutCommandStore opened = storeFactory.get();
            try { opened.getWritableDatabase(); store = opened; }
            catch (RuntimeException error) { opened.close(); throw error; }
        }
        return store;
    }
    private void closeStore() {
        WorkoutCommandStore prior = store; store = null;
        if (prior != null) try { prior.close(); } catch (RuntimeException error) { captureFailure(error); }
    }
    private void submit(Runnable task) {
        try { worker.execute(task); } catch (RuntimeException error) { captureFailure(error); }
    }
    public void serviceStarted() {
        captureEnabled = true;
        submit(() -> {
            try {
                refreshTarget(store());
                Target current = target;
                if (current != null) synchronized (current) { schedule(current); }
            } catch (Exception error) { captureFailure(error); }
        });
    }
    public void serviceStopped() {
        captureEnabled = false; // Late BLE callbacks cannot reopen a stopped service's store.
        submit(() -> { try { flush(target); } finally { closeStore(); } });
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
        private boolean scheduled, immediate, writeFailed;
        private long dispatch;
        private Runnable cancelTimer;
        private Target(String handoverId, ClockIdentity clock) { this.handoverId = handoverId; this.clock = clock; }
    }

    public Target targetAtReceipt() { return captureEnabled ? target : null; }

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
                try {
                    // A reply must include every buffered receipt up to this bounded flush.
                    flush(target);
                    WorkoutCommandStore store = store();
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
                                // flush() already made one bounded retry; never spin on failure.
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
        if (atReceipt == null || !captureEnabled) return;
        synchronized (atReceipt) {
            try {
                Sample sample = new Sample(sourceId, sequence, epochMs, elapsedMs, measurement.bpm, measurement.contactDetected);
                if (atReceipt.pending.size() < MAX_PENDING) atReceipt.pending.addLast(sample);
                else atReceipt.dropped++;
            } catch (IllegalArgumentException invalid) { captureFailure(invalid); atReceipt.dropped++; }
            schedule(atReceipt);
        }
    }

    /** Caller holds the target lock. A size threshold promotes an existing timer immediately. */
    private void schedule(Target current) {
        if (!captureEnabled || (current.pending.isEmpty() && current.dropped == 0)) return;
        boolean immediate = current.pending.size() >= BATCH_SIZE;
        if (current.scheduled && (current.immediate || !immediate)) return;
        cancelDrain(current);
        long dispatch = current.dispatch;
        current.scheduled = true; current.immediate = immediate;
        Runnable task = () -> {
            synchronized (current) {
                if (current.dispatch != dispatch) return; // Timer cancelled/promoted/flushed.
                current.scheduled = false; current.cancelTimer = null;
            }
            // An old owner's delayed timer is not necessarily the current target at stop.
            if (!captureEnabled) return;
            if (drainBatch(current) >= 0) synchronized (current) { schedule(current); }
        };
        try {
            if (immediate) worker.execute(task);
            else current.cancelTimer = worker.later(task, FLUSH_INTERVAL_MS);
        } catch (RuntimeException error) {
            captureFailure(error); current.scheduled = false; current.writeFailed = true;
        }
    }

    private void cancelDrain(Target current) {
        current.dispatch++;
        if (current.cancelTimer != null) current.cancelTimer.run();
        current.cancelTimer = null; current.scheduled = false;
    }

    /** Worker only. At most MAX_PENDING receipts; newly arriving packets cannot starve a read/stop. */
    private void flush(Target current) {
        if (current == null) return;
        int remaining;
        synchronized (current) {
            cancelDrain(current);
            remaining = current.pending.size();
            if (remaining == 0 && current.dropped == 0) return;
        }
        do {
            int drained = drainBatch(current);
            if (drained < 0) return; // Retain tail and failed status until the next packet/read/start.
            remaining -= drained;
            if (drained == 0) break;
        } while (remaining > 0);
        synchronized (current) { schedule(current); }
    }

    private int drainBatch(Target current) {
        List<Sample> batch = new ArrayList<>();
        long lost;
        synchronized (current) {
            for (Sample sample : current.pending) { batch.add(sample); if (batch.size() == BATCH_SIZE) break; }
            lost = current.dropped;
        }
        // Never hold the BLE queue lock during database I/O. One connection, one transaction/batch.
        try {
            boolean owned = store().appendHeart(current.handoverId, current.clock.id(), current.clock.scope(), batch, lost);
            synchronized (current) {
                if (owned) {
                    for (int i = 0; i < batch.size(); i++) current.pending.removeFirst();
                    current.dropped -= lost;
                } else { current.pending.clear(); current.dropped = 0; }
                current.writeFailed = false;
            }
            return batch.size();
        } catch (Exception error) {
            captureFailure(error);
            synchronized (current) { current.writeFailed = true; }
            return -1;
        }
    }
}
