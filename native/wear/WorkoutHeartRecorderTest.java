package com.mrcdrnzz.dailytracker.wear;

import static org.junit.Assert.*;

import android.bluetooth.BluetoothGatt;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Looper;
import android.os.SystemClock;
import android.provider.Settings;
import com.mrcdrnzz.dailytracker.watch.WatchService;
import com.mrcdrnzz.dailytracker.watch.core.HeartRateMeasurement;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.Shadows;
import org.robolectric.annotation.Config;
import org.robolectric.annotation.LooperMode;
import org.robolectric.shadows.ShadowSystemClock;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 26, manifest = Config.NONE)
@LooperMode(LooperMode.Mode.PAUSED)
public class WorkoutHeartRecorderTest {
    private static final String DB = "marc_watch_workout_v1.db";
    private static final long WALL = 1_790_300_000_000L;
    private Context context;
    private WorkoutCommandStore store;

    private static final class Worker implements Executor {
        final ArrayDeque<Runnable> tasks = new ArrayDeque<>();
        public void execute(Runnable task) { tasks.addLast(task); }
        void next() { assertFalse("No queued work", tasks.isEmpty()); tasks.removeFirst().run(); }
        void finish() {
            int limit = 1000;
            while (!tasks.isEmpty()) { assertTrue("Busy retry loop", --limit > 0); next(); }
        }
    }

    @Before public void setUp() {
        context = RuntimeEnvironment.getApplication();
        context.deleteDatabase(DB);
        Settings.Global.putInt(context.getContentResolver(), Settings.Global.BOOT_COUNT, 7);
        store = new WorkoutCommandStore(context);
    }

    @After public void tearDown() { store.close(); context.deleteDatabase(DB); }

    private JSONObject seed(String handover, String session) throws Exception {
        JSONObject active = new JSONObject().put("id", session).put("splitId", "split-1")
                .put("startedAt", "2026-09-25T10:00:00.000Z").put("pausedMs", 0)
                .put("entries", new JSONArray().put(new JSONObject().put("id", "e-1")
                        .put("exerciseId", "chest-press").put("name", "Chest press").put("done", false).put("skipped", false)
                        .put("sets", new JSONArray().put(new JSONObject().put("id", "set-1").put("status", "draft").put("kg", 60).put("reps", 8)))));
        JSONObject inputs = new JSONObject().put("version", 1).put("sessionId", session)
                .put("capturedAt", "2026-09-25T10:01:00.000Z").put("heartSource", "ble")
                .put("heartSamples", new JSONArray().put(new JSONObject().put("tSec", 30).put("bpm", 120)
                        .put("contact", true).put("receivedAtEpochMs", WALL).put("receivedAtElapsedMs", 1000)))
                .put("restPolicy", new JSONObject().put("autoRest", true).put("restDefaultSec", 90)
                        .put("rest", new JSONObject().put("mode", "time").put("heartTargetPct", 0.6).put("minSec", 30)));
        return new JSONObject().put("handoverId", handover).put("installationId", "watch-1")
                .put("snapshot", active.toString()).put("inputs", inputs.toString());
    }

    private int count(String table) {
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT count(*) FROM " + table, null)) {
            assertTrue(c.moveToFirst()); return c.getInt(0);
        }
    }

    private static WorkoutHeartRecorder.Sample sample(String source, long seq, long epoch, long elapsed, int bpm) {
        return new WorkoutHeartRecorder.Sample(source, seq, epoch, elapsed, bpm, true);
    }
    private static HeartRateMeasurement hr(int bpm) { return HeartRateMeasurement.parse(new byte[]{6, (byte) bpm}); }

    private JSONObject read(WorkoutHeartRecorder recorder, Worker worker) {
        AtomicReference<JSONObject> reply = new AtomicReference<>();
        recorder.ownership("read", null, null, reply::set, () -> fail("Ownership read failed"));
        while (reply.get() == null) worker.next();
        return reply.get();
    }

    private WorkoutHeartRecorder recorder(Worker worker) {
        WorkoutHeartRecorder recorder = new WorkoutHeartRecorder(context, worker);
        worker.finish();
        return recorder;
    }

    @Test public void phoneWorkoutAndLegacySeedNeverStartRecording() throws Exception {
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        assertNull(recorder.targetAtReceipt());
        recorder.record(null, "ble-1", 1, hr(128), WALL, 1000);
        assertTrue(worker.tasks.isEmpty());
        JSONObject seed = seed("h-1", "s-1");
        store.seed("s-1", "watch-1", seed.getString("snapshot"));
        assertEquals("blocked", read(recorder, worker).getString("owner"));
        assertNull(recorder.targetAtReceipt());
        assertFalse(store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-1", 1, WALL, 1000, 128)), 0));
        assertEquals(0, count("heart_samples"));
        assertEquals(0, count("heart_capture"));
    }

    private WatchService service(WorkoutHeartRecorder recorder) throws Exception {
        // No plugin, listener, or live device is attached. Exercise the real receive/parse path.
        WatchService service = new WatchService();
        Field recorderField = WatchService.class.getDeclaredField("heartRecorder");
        recorderField.setAccessible(true); recorderField.set(service, recorder);
        Field sourceField = WatchService.class.getDeclaredField("heartSourceId");
        sourceField.setAccessible(true); sourceField.set(service, "ble-test");
        return service;
    }

    private void receive(WatchService service, byte[] packet) throws Exception {
        Method receive = WatchService.class.getDeclaredMethod("receive", BluetoothGatt.class, UUID.class, byte[].class);
        receive.setAccessible(true); receive.invoke(service, null, WatchService.HR, packet);
    }

    @Test public void realServiceRecordsWithoutWebviewAndUsesCallbackTimeAcrossReopen() throws Exception {
        JSONObject original = seed("h-1", "s-1");
        store.handover(original);
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        WatchService service = service(recorder);
        long before = SystemClock.elapsedRealtime();
        receive(service, new byte[]{6, (byte) 128});
        ShadowSystemClock.advanceBy(Duration.ofSeconds(20));
        Shadows.shadowOf(Looper.getMainLooper()).idle();
        assertEquals(1, service.session.samples);
        worker.finish();
        store.close(); store = new WorkoutCommandStore(context);
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT source,source_id,boot_id,clock_scope,sequence,received_at_elapsed_ms,bpm FROM heart_samples", null)) {
            assertTrue(c.moveToFirst());
            assertEquals("ble", c.getString(0)); assertEquals("ble-test", c.getString(1));
            assertEquals("boot-7", c.getString(2)); assertEquals("boot", c.getString(3));
            assertEquals(1, c.getLong(4)); assertEquals(before, c.getLong(5)); assertEquals(128, c.getInt(6));
            assertFalse(c.moveToNext());
        }
        assertEquals(original.getString("snapshot"), store.readOwnership().getString("snapshot"));
        assertEquals(original.getString("inputs"), store.readOwnership().getJSONObject("seed").getString("inputs"));
        assertEquals(0, count("receipts"));
        // A new native service/worker recovers ownership without a WebView and starts another stream.
        Worker restarted = new Worker();
        WorkoutHeartRecorder recovered = recorder(restarted);
        assertNotNull(recovered.targetAtReceipt());
        recovered.record(recovered.targetAtReceipt(), "ble-new", 1, hr(132), WALL, before + 21000);
        restarted.finish();
        assertEquals(2, count("heart_samples"));
    }

    @Test public void packetReceivedBeforeHandoverCannotBeAdoptedAfterMainThreadDelay() throws Exception {
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        WatchService service = service(recorder);
        receive(service, new byte[]{6, (byte) 128});
        AtomicReference<JSONObject> result = new AtomicReference<>();
        recorder.ownership("handover", seed("h-1", "s-1"), null, result::set, () -> fail("Handover failed"));
        worker.finish();
        assertEquals("native", result.get().getString("owner"));
        assertNotNull(recorder.targetAtReceipt());
        Shadows.shadowOf(Looper.getMainLooper()).idle();
        worker.finish();
        assertEquals(1, service.session.samples); // Normal BLE still sees it.
        assertEquals(0, count("heart_samples"));
        receive(service, new byte[]{6, (byte) 129});
        Shadows.shadowOf(Looper.getMainLooper()).idle(); worker.finish();
        assertEquals(1, count("heart_samples"));
    }

    @Test public void provenanceKeepsClockJumpsSourcesAndBootsDistinctAndReplayIsIdempotent() throws Exception {
        store.handover(seed("h-1", "s-1"));
        WorkoutHeartRecorder.Sample first = sample("ble-1", 1, WALL, 1000, 128);
        WorkoutHeartRecorder.Sample rollback = sample("ble-1", 2, WALL - 60000, 2000, 130);
        assertTrue(store.appendHeart("h-1", "boot-7", "boot", List.of(first, rollback), 0));
        store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-2", 1, WALL, 1000, 140)), 0);
        store.appendHeart("h-1", "boot-8", "boot", List.of(first), 0);
        store.close(); store = new WorkoutCommandStore(context);
        store.appendHeart("h-1", "boot-7", "boot", List.of(first, rollback), 0);
        assertEquals(4, count("heart_samples"));
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT received_at_epoch_ms,received_at_elapsed_ms FROM heart_samples WHERE sequence=2", null)) {
            assertTrue(c.moveToFirst()); assertEquals(WALL - 60000, c.getLong(0)); assertEquals(2000, c.getLong(1));
        }
        try {
            store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-1", 3, WALL, 3000, 128),
                    sample("ble-1", 1, WALL, 1000, 99)), 3);
            fail("Conflicting sample reuse must roll back the entire batch");
        } catch (IllegalStateException expected) { /* No silent replacement. */ }
        assertEquals(4, count("heart_samples"));
        assertEquals(0, store.heartCapture("h-1").getLong("droppedSamples"));
    }

    @Test public void unknownBootUsesExplicitProcessScopeRatherThanWallTimeGuess() {
        assertEquals(new WorkoutHeartRecorder.ClockIdentity("boot-7", "boot"), WorkoutHeartRecorder.clockIdentity(() -> 7));
        assertNotEquals(WorkoutHeartRecorder.clockIdentity(() -> 7), WorkoutHeartRecorder.clockIdentity(() -> 8));
        WorkoutHeartRecorder.ClockIdentity absent = WorkoutHeartRecorder.clockIdentity(() -> -1);
        WorkoutHeartRecorder.ClockIdentity denied = WorkoutHeartRecorder.clockIdentity(() -> { throw new SecurityException(); });
        assertEquals("process", absent.scope()); assertEquals(absent, denied);
        assertNotEquals(absent, WorkoutHeartRecorder.clockIdentity(() -> 7));
    }

    @Test public void journalFailureRollsBackBatchAndCountersThenRetryWorks() throws Exception {
        store.handover(seed("h-1", "s-1"));
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("CREATE TRIGGER fail_sample BEFORE INSERT ON heart_samples WHEN NEW.sequence=2 BEGIN SELECT RAISE(ABORT,'disk failure'); END");
        List<WorkoutHeartRecorder.Sample> batch = List.of(sample("ble-1", 1, WALL, 1000, 120), sample("ble-1", 2, WALL + 1000, 2000, 121));
        try { store.appendHeart("h-1", "boot-7", "boot", batch, 2); fail("Write must fail"); }
        catch (android.database.SQLException expected) { /* all or nothing */ }
        assertEquals(0, count("heart_samples")); assertEquals(0, store.heartCapture("h-1").getLong("droppedSamples"));
        db.execSQL("DROP TRIGGER fail_sample");
        store.appendHeart("h-1", "boot-7", "boot", batch, 2);
        assertEquals(2, store.heartCapture("h-1").getInt("retainedSamples"));
        assertEquals(2, store.heartCapture("h-1").getLong("droppedSamples"));
        assertEquals("native", store.readOwnership().getString("owner"));
    }

    @Test public void queueIsBoundedAndOwnershipRequestsRunBetweenBatches() throws Exception {
        store.handover(seed("h-1", "s-1"));
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        for (int i = 1; i <= WorkoutHeartRecorder.MAX_PENDING + 10; i++)
            recorder.record(recorder.targetAtReceipt(), "ble-1", i, hr(128), WALL + i, i);
        assertEquals(1, worker.tasks.size());
        JSONObject reply = read(recorder, worker); // First small batch, then ownership, before the tail.
        JSONObject capture = reply.getJSONObject("heartCapture");
        assertEquals(WorkoutHeartRecorder.BATCH_SIZE, capture.getInt("retainedSamples"));
        assertEquals(WorkoutHeartRecorder.MAX_PENDING - WorkoutHeartRecorder.BATCH_SIZE, capture.getInt("pendingSamples"));
        assertEquals(10, capture.getLong("droppedSamples"));
        assertEquals("unverified", capture.getString("coverage"));
        worker.finish();
        assertEquals(WorkoutHeartRecorder.MAX_PENDING, count("heart_samples"));
        assertEquals(10, store.heartCapture("h-1").getLong("droppedSamples"));
    }

    @Test public void failedWritesRetainTailAndDoNotFailOwnershipReadOrSpin() throws Exception {
        store.handover(seed("h-1", "s-1"));
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        store.getWritableDatabase().execSQL("CREATE TRIGGER fail_sample BEFORE INSERT ON heart_samples BEGIN SELECT RAISE(ABORT,'disk failure'); END");
        recorder.record(recorder.targetAtReceipt(), "ble-1", 1, hr(128), WALL, 1000);
        worker.finish();
        assertEquals(0, count("heart_samples"));
        JSONObject capture = read(recorder, worker).getJSONObject("heartCapture");
        assertTrue(capture.getBoolean("writeFailed")); assertEquals(1, capture.getInt("pendingSamples"));
        worker.finish(); // One retry, then waits for another packet/read rather than spinning.
        store.getWritableDatabase().execSQL("DROP TRIGGER fail_sample");
        recorder.record(recorder.targetAtReceipt(), "ble-1", 2, hr(129), WALL + 1000, 2000);
        worker.finish();
        capture = read(recorder, worker).getJSONObject("heartCapture");
        assertFalse(capture.getBoolean("writeFailed")); assertEquals(0, capture.getInt("pendingSamples"));
        assertEquals(2, capture.getInt("retainedSamples")); assertEquals(0, capture.getLong("droppedSamples"));
    }

    @Test public void missingOptionalCaptureMetadataCannotHideKnownNativeOwner() throws Exception {
        store.handover(seed("h-1", "s-1"));
        store.getWritableDatabase().execSQL("DELETE FROM heart_capture WHERE handover_id='h-1'");
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        JSONObject reply = read(recorder, worker);
        assertEquals("native", reply.getString("owner"));
        assertEquals("h-1", reply.getJSONObject("seed").getString("handoverId"));
        assertFalse(reply.getJSONObject("heartCapture").getBoolean("available"));
        assertTrue(reply.getJSONObject("heartCapture").getBoolean("writeFailed"));
    }

    @Test public void oldTicketCannotRetargetToANewWorkoutOrRecordAfterFinish() throws Exception {
        store.handover(seed("h-1", "s-1"));
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        WorkoutHeartRecorder.Target old = recorder.targetAtReceipt();
        store.getWritableDatabase().execSQL("UPDATE sessions SET status='finished' WHERE session_id='s-1'");
        recorder.record(old, "ble-1", 1, hr(128), WALL, 1000); worker.finish();
        assertEquals(0, count("heart_samples"));
        // Fixture for a future release, not a production release API.
        store.getWritableDatabase().execSQL("UPDATE workout_handovers SET status='cancelled' WHERE handover_id='h-1'");
        store.handover(seed("h-2", "s-2"));
        read(recorder, worker);
        recorder.record(old, "ble-1", 2, hr(128), WALL, 2000);
        recorder.record(recorder.targetAtReceipt(), "ble-2", 1, hr(130), WALL, 3000);
        worker.finish();
        assertEquals(0, store.heartCapture("h-1").getInt("retainedSamples"));
        assertEquals(1, store.heartCapture("h-2").getInt("retainedSamples"));
        assertEquals(1, count("heart_samples"));
    }

    @Test public void contactAndZeroAreEvidenceNotInventedValidReadingsAndMalformedPacketsAreIgnored() throws Exception {
        store.handover(seed("h-1", "s-1"));
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        WatchService service = service(recorder);
        receive(service, new byte[]{4, 0}); // Contact supported but absent; zero must not become a live BPM.
        receive(service, new byte[]{0, 100}); // Contact unknown, distinct from true.
        receive(service, new byte[]{1}); // Truncated packet.
        Shadows.shadowOf(Looper.getMainLooper()).idle(); worker.finish();
        assertEquals(1, service.session.samples);
        assertEquals(2, count("heart_samples"));
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT bpm,contact FROM heart_samples ORDER BY sequence", null)) {
            assertTrue(c.moveToFirst()); assertEquals(0, c.getInt(0)); assertEquals(0, c.getInt(1));
            assertTrue(c.moveToNext()); assertEquals(100, c.getInt(0)); assertTrue(c.isNull(1));
        }
    }

    @Test public void journalCapacityKeepsExistingEvidenceAndCountsOverflow() throws Exception {
        store.handover(seed("h-1", "s-1"));
        int max = WorkoutCommandStore.MAX_HEART_SAMPLES;
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("INSERT INTO heart_samples WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<" + (max - 1)
                + ") SELECT 'h-1','ble','ble-1','boot-7','boot',n," + WALL + ",n,128,1 FROM seq");
        db.execSQL("UPDATE heart_capture SET retained_count=? WHERE handover_id='h-1'", new Object[]{max - 1});
        store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-1", max, WALL, max, 128),
                sample("ble-1", max + 1, WALL, max + 1, 128)), 0);
        store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-1", 1, WALL, 1, 128)), 0);
        assertEquals(max, count("heart_samples"));
        JSONObject capture = store.heartCapture("h-1");
        assertTrue(capture.getBoolean("capacityReached")); assertEquals(1, capture.getLong("droppedSamples"));
        assertEquals(0, count("receipts"));
    }

    @Test public void captureRecordFailureRollsBackHandoverAndNormalAppOwnerRemainsWeb() throws Exception {
        store.getWritableDatabase().execSQL("CREATE TRIGGER fail_capture BEFORE INSERT ON heart_capture BEGIN SELECT RAISE(ABORT,'disk failure'); END");
        try { store.handover(seed("h-1", "s-1")); fail("Must roll back"); }
        catch (android.database.SQLException expected) { /* no partial owner */ }
        assertEquals("web", store.readOwnership().getString("owner"));
        assertEquals(0, count("sessions")); assertEquals(0, count("workout_handovers"));
        store.getWritableDatabase().execSQL("DROP TRIGGER fail_capture");
        assertEquals("native", store.handover(seed("h-1", "s-1")).getString("owner"));
    }

    @Test public void versionFiveUpgradePreservesOwnerAndDoesNotRelabelJsSamples() throws Exception {
        JSONObject original = seed("h-1", "s-1");
        store.handover(original);
        JSONObject before = store.readOwnership();
        store.getWritableDatabase().execSQL("DROP TABLE heart_samples");
        store.getWritableDatabase().execSQL("DROP TABLE heart_capture");
        store.getWritableDatabase().setVersion(5);
        store.close(); store = new WorkoutCommandStore(context);
        assertEquals(6, store.getReadableDatabase().getVersion());
        assertEquals(before.toString(), store.readOwnership().toString());
        assertEquals(1, count("heart_capture")); assertEquals(0, count("heart_samples"));
        assertEquals("unverified", store.heartCapture("h-1").getString("coverage"));
        assertTrue(store.appendHeart("h-1", "boot-7", "boot", List.of(sample("ble-1", 1, WALL, 1000, 128)), 0));
        assertEquals(original.getString("inputs"), store.readOwnership().getJSONObject("seed").getString("inputs"));
    }

    @Test public void failedOptionalJournalUpgradeStillReturnsCommittedOwnerWithoutWriting() throws Exception {
        store.handover(seed("h-1", "s-1"));
        JSONObject before = store.readOwnership();
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("DROP TABLE heart_samples"); db.execSQL("DROP TABLE heart_capture");
        db.setVersion(5);
        db.execSQL("CREATE TABLE heart_capture (incompatible_column TEXT)"); // Force the optional upgrade to fail.
        store.close();
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        assertNull(recorder.targetAtReceipt());
        JSONObject recovered = read(recorder, worker);
        assertEquals("native", recovered.getString("owner"));
        assertEquals(before.getJSONObject("seed").toString(), recovered.getJSONObject("seed").toString());
        assertEquals(before.getString("snapshot"), recovered.getString("snapshot"));
        assertFalse(recovered.getJSONObject("heartCapture").getBoolean("available"));
        assertNull(recorder.targetAtReceipt()); // No recording through a failed journal upgrade.
        for (String action : new String[]{"handover", "settle"}) {
            AtomicReference<Boolean> rejected = new AtomicReference<>(false);
            recorder.ownership(action, seed("h-1", "s-1"), "h-1",
                    result -> fail("Read-only recovery cannot acknowledge " + action), () -> rejected.set(true));
            worker.finish();
            assertTrue(rejected.get());
        }
        try (SQLiteDatabase unchanged = SQLiteDatabase.openDatabase(context.getDatabasePath(DB).getPath(), null, SQLiteDatabase.OPEN_READONLY)) {
            assertEquals(5, unchanged.getVersion());
            try (Cursor c = unchanged.rawQuery("PRAGMA table_info(heart_capture)", null)) {
                assertTrue(c.moveToFirst()); assertEquals("incompatible_column", c.getString(1)); assertFalse(c.moveToNext());
            }
        }
    }

    @Test public void failedOptionalNativeBootstrapDoesNotStopBleOrStartAnOwner() throws Exception {
        store.getWritableDatabase().setVersion(99); // Simulate an unreadable/incompatible optional database.
        store.close();
        Worker worker = new Worker();
        WorkoutHeartRecorder recorder = recorder(worker);
        assertNull(recorder.targetAtReceipt());
        WatchService service = service(recorder);
        receive(service, new byte[]{6, (byte) 128});
        Shadows.shadowOf(Looper.getMainLooper()).idle(); worker.finish();
        assertEquals(1, service.session.samples); assertEquals(128, service.session.lastBpm);
        assertTrue(worker.tasks.isEmpty());
    }
}
