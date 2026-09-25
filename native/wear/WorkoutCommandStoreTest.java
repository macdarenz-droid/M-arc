package com.mrcdrnzz.dailytracker.wear;

import static org.junit.Assert.*;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 26, manifest = Config.NONE)
public class WorkoutCommandStoreTest {
    private static final String DB = "marc_watch_workout_v1.db";
    private static final DateTimeFormatter UTC = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withZone(ZoneOffset.UTC);
    private Context context;
    private WorkoutCommandStore store;
    private String startedAt, actionAt;

    @Before public void setUp() throws Exception {
        context = RuntimeEnvironment.getApplication();
        context.deleteDatabase(DB);
        store = new WorkoutCommandStore(context);
        startedAt = UTC.format(Instant.now().minusSeconds(120));
        actionAt = UTC.format(Instant.now().minusSeconds(10));
        store.seed("s-1", "watch-1", snapshot(false));
    }

    @After public void tearDown() {
        if (store != null) store.close();
        context.deleteDatabase(DB);
    }

    private String snapshot(boolean reordered) throws Exception {
        JSONObject target = new JSONObject().put("id", "set-1").put("status", "draft").put("kg", 60).put("reps", 8);
        JSONObject first = new JSONObject().put("id", "e-1").put("sets", new JSONArray().put(target));
        JSONObject second = new JSONObject().put("id", "e-2").put("sets", new JSONArray().put(new JSONObject()
                .put("id", "set-2").put("status", "draft").put("kg", 30).put("reps", 8)));
        JSONArray entries = reordered ? new JSONArray().put(second).put(first) : new JSONArray().put(first).put(second);
        return new JSONObject().put("id", "s-1").put("startedAt", startedAt).put("entries", entries).toString();
    }

    private String command(String commandId, String installationId, String entryId, String setId,
                           int expectedRevision, String time) throws Exception {
        return new JSONObject().put("v", 1).put("kind", "complete_set")
                .put("installationId", installationId).put("sessionId", "s-1")
                .put("commandId", commandId).put("entryId", entryId).put("setId", setId)
                .put("expectedSetRevision", expectedRevision).put("actionAt", time).toString();
    }

    private JSONObject saved() throws Exception {
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT snapshot FROM sessions WHERE session_id='s-1'", null)) {
            assertTrue(c.moveToFirst());
            return new JSONObject(c.getString(0));
        }
    }

    private int revision(String setId) {
        try (Cursor c = store.getReadableDatabase().rawQuery("SELECT revision FROM set_revisions WHERE set_id=?", new String[]{setId})) {
            assertTrue(c.moveToFirst());
            return c.getInt(0);
        }
    }

    private int pendingCount(String commandId) {
        try (Cursor c = store.getReadableDatabase().rawQuery(
                "SELECT count(*) FROM pending_effects WHERE command_id=?", new String[]{commandId})) {
            assertTrue(c.moveToFirst()); return c.getInt(0);
        }
    }

    private JSONObject pendingContext(String commandId, String effect) throws Exception {
        try (Cursor c = store.getReadableDatabase().rawQuery(
                "SELECT context FROM pending_effects WHERE session_id='s-1' AND command_id=? AND effect=?",
                new String[]{commandId, effect})) {
            assertTrue(c.moveToFirst());
            return new JSONObject(c.getString(0));
        }
    }

    private JSONObject set(JSONObject snapshot, String entryId, String setId) throws Exception {
        JSONArray entries = snapshot.getJSONArray("entries");
        for (int i = 0; i < entries.length(); i++) {
            JSONObject entry = entries.getJSONObject(i);
            if (!entryId.equals(entry.getString("id"))) continue;
            JSONArray sets = entry.getJSONArray("sets");
            for (int j = 0; j < sets.length(); j++) {
                JSONObject candidate = sets.getJSONObject(j);
                if (setId.equals(candidate.getString("id"))) return candidate;
            }
        }
        throw new AssertionError("set missing");
    }

    @Test public void commitReopenReplayAndFingerprintConflict() throws Exception {
        String raw = command("c-1", "watch-1", "e-1", "set-1", 0, actionAt);
        WorkoutCommandStore.Result applied = store.completeSet(raw);
        assertEquals("applied", applied.status);
        assertEquals(1, new JSONObject(applied.receipt).getInt("setRevision"));
        assertEquals(1, new JSONObject(applied.receipt).getInt("sessionRevision"));
        assertEquals("unverified", new JSONObject(applied.receipt).getString("clockConfidence"));
        assertEquals("not_implemented", new JSONObject(applied.receipt).getString("sideEffectsStatus"));
        assertEquals(actionAt, new JSONObject(applied.receipt).getString("actionAt"));
        assertNotEquals(actionAt, new JSONObject(applied.receipt).getString("receivedAt"));
        assertEquals(actionAt, set(saved(), "e-1", "set-1").getString("at"));
        assertEquals("unverified", set(saved(), "e-1", "set-1").getString("actionClockConfidence"));
        assertEquals("committed", set(saved(), "e-1", "set-1").getString("status"));
        assertFalse(set(saved(), "e-2", "set-2").has("at"));
        assertEquals(1, revision("set-1"));
        assertEquals(0, revision("set-2"));
        assertEquals(3, pendingCount("c-1"));
        try (Cursor c = store.getReadableDatabase().rawQuery(
                "SELECT effect,set_id,action_at,status FROM pending_effects WHERE command_id='c-1' ORDER BY effect", null)) {
            for (String effect : new String[]{"fidelity", "heart", "rest"}) {
                assertTrue(c.moveToNext());
                assertEquals(effect, c.getString(0));
                assertEquals("set-1", c.getString(1));
                assertEquals(actionAt, c.getString(2));
                assertEquals("pending", c.getString(3));
            }
            assertFalse(c.moveToNext());
        }
        store.close();
        store = new WorkoutCommandStore(context);
        WorkoutCommandStore.Result replay = store.completeSet(raw);
        assertEquals("replay", replay.status);
        assertEquals(applied.receipt, replay.receipt);
        assertEquals(3, pendingCount("c-1"));
        assertEquals("command_id_conflict", store.completeSet(command("c-1", "watch-1", "e-2", "set-2", 0, actionAt)).status);
        assertEquals("wrong_installation", store.completeSet(command("c-1", "other", "e-1", "set-1", 0, actionAt)).status);
        assertEquals("target_changed", store.completeSet(command("c-2", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        assertEquals(1, revision("set-1"));
    }

    @Test public void missingRevisionReturnsInvalidInsteadOfThrowing() throws Exception {
        JSONObject without = new JSONObject(command("c-missing", "watch-1", "e-1", "set-1", 0, actionAt));
        without.remove("expectedSetRevision");
        assertEquals("invalid", store.completeSet(without.toString()).status);
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
    }

    @Test public void acceptedFutureActionClampsStoredSetToReceiptTime() throws Exception {
        String future = UTC.format(Instant.now().plusSeconds(20));
        String raw = command("c-future", "watch-1", "e-1", "set-1", 0, future);
        WorkoutCommandStore.Result result = store.completeSet(raw);
        assertEquals("applied", result.status);
        JSONObject receipt = new JSONObject(result.receipt);
        assertEquals(future, receipt.getString("actionAt"));
        assertTrue(Instant.parse(future).isAfter(Instant.parse(receipt.getString("receivedAt"))));
        assertEquals(receipt.getString("receivedAt"), set(saved(), "e-1", "set-1").getString("at"));
        assertEquals("unverified", set(saved(), "e-1", "set-1").getString("actionClockConfidence"));
        assertEquals("not_implemented", receipt.getString("sideEffectsStatus"));
        store.getWritableDatabase().execSQL("UPDATE sessions SET status='finished' WHERE session_id='s-1'");
        store.close(); store = new WorkoutCommandStore(context);
        WorkoutCommandStore.Result replay = store.completeSet(raw);
        assertEquals("replay", replay.status);
        assertEquals(result.receipt, replay.receipt);
        assertEquals(receipt.getString("receivedAt"), set(saved(), "e-1", "set-1").getString("at"));
    }

    @Test public void pendingEffectsKeepPreCommitTimingAndSetInputsAcrossReopen() throws Exception {
        JSONObject before = saved();
        JSONObject second = set(before, "e-2", "set-2");
        second.put("effort", "max").put("kind", "warmup");
        store.getWritableDatabase().execSQL("UPDATE sessions SET snapshot=? WHERE session_id='s-1'", new Object[]{before.toString()});
        String firstAt = UTC.format(Instant.now().minusSeconds(40));
        String secondAt = UTC.format(Instant.now().minusSeconds(5));
        assertEquals("applied", store.completeSet(command("c-first", "watch-1", "e-1", "set-1", 0, firstAt)).status);
        JSONObject first = pendingContext("c-first", "fidelity");
        assertTrue(first.isNull("lastCommittedAt"));
        assertEquals(0, first.getInt("recentCommittedCount"));
        assertEquals("applied", store.completeSet(command("c-second", "watch-1", "e-2", "set-2", 0, secondAt)).status);
        JSONObject effectInputs = pendingContext("c-second", "rest");
        assertEquals(1, effectInputs.getInt("version"));
        assertEquals("e-2", effectInputs.getString("entryId"));
        assertEquals(firstAt, effectInputs.getString("lastCommittedAt"));
        assertEquals(secondAt, effectInputs.getString("effectiveAt"));
        assertTrue(effectInputs.getBoolean("timingInputsValid"));
        assertEquals(0, effectInputs.getInt("recentCommittedCount"));
        assertEquals("warmup", effectInputs.getString("setKind"));
        assertEquals("max", effectInputs.getString("setEffort"));
        assertEquals("autoRest", effectInputs.getJSONArray("missingInputs").getString(0));
        assertEquals(effectInputs.toString(), pendingContext("c-second", "heart").toString());
        store.close(); store = new WorkoutCommandStore(context);
        assertEquals(effectInputs.toString(), pendingContext("c-second", "rest").toString());
        assertEquals("replay", store.completeSet(command("c-second", "watch-1", "e-2", "set-2", 0, secondAt)).status);
        assertEquals(effectInputs.toString(), pendingContext("c-second", "rest").toString());
    }

    @Test public void corruptPriorTimeIsFlaggedForReviewWithoutInventingTiming() throws Exception {
        JSONObject before = saved();
        set(before, "e-1", "set-1").put("at", "not-a-time");
        store.getWritableDatabase().execSQL("UPDATE sessions SET snapshot=? WHERE session_id='s-1'", new Object[]{before.toString()});
        assertEquals("applied", store.completeSet(command("c-second", "watch-1", "e-2", "set-2", 0, actionAt)).status);
        JSONObject context = pendingContext("c-second", "fidelity");
        assertFalse(context.getBoolean("timingInputsValid"));
        assertTrue(context.isNull("lastCommittedAt"));
    }

    @Test public void nearbyPriorCommitIsCountedWithoutCountingNewSet() throws Exception {
        String firstAt = UTC.format(Instant.now().minusSeconds(12));
        String secondAt = UTC.format(Instant.now().minusSeconds(4));
        assertEquals("applied", store.completeSet(command("c-first", "watch-1", "e-1", "set-1", 0, firstAt)).status);
        assertEquals("applied", store.completeSet(command("c-second", "watch-1", "e-2", "set-2", 0, secondAt)).status);
        JSONObject context = pendingContext("c-second", "fidelity");
        assertEquals(firstAt, context.getString("lastCommittedAt"));
        assertEquals(1, context.getInt("recentCommittedCount"));
    }

    @Test public void identifiedRejectionSurvivesReopenAndCannotLaterApply() throws Exception {
        String early = UTC.format(Instant.parse(startedAt).minusSeconds(60));
        String raw = command("c-early", "watch-1", "e-1", "set-1", 0, early);
        WorkoutCommandStore.Result rejected = store.completeSet(raw);
        assertEquals("time_needs_review", rejected.status);
        assertEquals(0, pendingCount("c-early"));
        JSONObject result = new JSONObject(rejected.receipt);
        assertEquals(early, result.getString("actionAt"));
        assertEquals("unverified", result.getString("clockConfidence"));
        assertTrue(result.has("receivedAt"));
        JSONObject correctedStart = saved().put("startedAt", UTC.format(Instant.parse(startedAt).minusSeconds(120)));
        store.getWritableDatabase().execSQL("UPDATE sessions SET snapshot=? WHERE session_id='s-1'", new Object[]{correctedStart.toString()});
        store.close(); store = new WorkoutCommandStore(context);
        WorkoutCommandStore.Result replay = store.completeSet(raw);
        assertEquals("replay_rejected", replay.status);
        assertEquals(rejected.receipt, replay.receipt);
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
        assertEquals(0, revision("set-1"));
        assertEquals(0, pendingCount("c-1"));
        assertEquals("command_id_conflict", store.completeSet(command("c-early", "watch-1", "e-2", "set-2", 0, early)).status);
    }

    @Test public void sharedJavaAndJsFixturesAgree() throws Exception {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream("watch-command-fixtures.json")) {
            assertNotNull("shared fixtures must be packaged into test resources", stream);
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            for (int read; (read = stream.read(buffer)) != -1;) output.write(buffer, 0, read);
            JSONArray fixtures = new JSONArray(new String(output.toByteArray(), StandardCharsets.UTF_8));
            for (int i = 0; i < fixtures.length(); i++) {
                JSONObject fixture = fixtures.getJSONObject(i);
                store.close(); context.deleteDatabase(DB); store = new WorkoutCommandStore(context);
                startedAt = "2026-09-23T18:59:00.000Z";
                JSONObject initial = new JSONObject(snapshot(false));
                if (fixture.optBoolean("paused")) initial.put("pausedAt", Instant.parse("2026-09-23T19:00:00.000Z").toEpochMilli());
                if (fixture.optBoolean("committed") || fixture.optBoolean("incomplete")) {
                    JSONObject set = set(initial, "e-1", "set-1");
                    if (fixture.optBoolean("committed")) {
                        set.put("status", "committed").put("at", "2026-09-23T19:00:00.000Z");
                    } else { set.remove("kg"); set.remove("reps"); }
                }
                if (!fixture.optBoolean("noSession")) store.seed("s-1", "watch-1", initial.toString());
                if (fixture.optBoolean("closed")) store.getWritableDatabase().execSQL("UPDATE sessions SET status='finished' WHERE session_id='s-1'");
                if (fixture.optInt("revision") > 0)
                    store.getWritableDatabase().execSQL("UPDATE set_revisions SET revision=? WHERE set_id='set-1'", new Object[]{fixture.getInt("revision")});
                JSONObject command = new JSONObject(command("c-fixture", "watch-1", "e-1", "set-1", 0, "2026-09-23T19:00:00.000Z"));
                JSONObject patch = fixture.optJSONObject("patch");
                if (patch != null) for (java.util.Iterator<String> keys = patch.keys(); keys.hasNext();) {
                    String key = keys.next(); command.put(key, patch.get(key));
                }
                JSONArray remove = fixture.optJSONArray("remove");
                if (remove != null) for (int j = 0; j < remove.length(); j++) command.remove(remove.getString(j));
                String raw = command.toString() + fixture.optString("suffix", "");
                JSONObject mutation = fixture.optJSONObject("mutation");
                if (mutation != null) {
                    String from = mutation.getString("from");
                    assertTrue(fixture.getString("name"), raw.contains(from));
                    raw = raw.replace(from, mutation.getString("to"));
                }
                if (fixture.optBoolean("repaired")) {
                    String oldRaw = command("c-fixture", "watch-1", "e-1", "set-1", 0, "2026-09-23T19:00:00.000Z");
                    assertEquals("applied", store.completeSet(oldRaw).status);
                    store.getWritableDatabase().execSQL("UPDATE sessions SET status='finished' WHERE session_id='s-1'");
                    store.seed("s-2", "watch-2", initial.put("id", "s-2").toString());
                    if ("new_replay".equals(fixture.optString("repairedMode")))
                        assertEquals("applied", store.completeSet(raw).status);
                }
                String status = store.completeSet(raw).status;
                assertEquals(fixture.getString("name"), fixture.getString("expected"), "applied".equals(status) ? "accepted" : status);
                if (fixture.optBoolean("repaired")) {
                    try (Cursor current = store.getReadableDatabase().rawQuery(
                            "SELECT snapshot,revision FROM sessions WHERE session_id='s-2'", null)) {
                        assertTrue(current.moveToFirst());
                        boolean newApplied = "new_replay".equals(fixture.optString("repairedMode"));
                        assertEquals(newApplied, set(new JSONObject(current.getString(0)), "e-1", "set-1").has("at"));
                        assertEquals(newApplied ? 1 : 0, current.getInt(1));
                    }
                    assertEquals("new_replay".equals(fixture.optString("repairedMode")) ? 6 : 3,
                            pendingCount("c-fixture"));
                }
            }
        }
    }

    @Test public void reorderKeepsTargetAndRemovedEntryCannotRetarget() throws Exception {
        store.close(); context.deleteDatabase(DB); store = new WorkoutCommandStore(context);
        store.seed("s-1", "watch-1", snapshot(true));
        assertEquals("target_changed", store.completeSet(command("c-wrong", "watch-1", "e-2", "set-1", 0, actionAt)).status);
        assertEquals("target_changed", store.completeSet(command("c-removed", "watch-1", "replaced", "set-1", 0, actionAt)).status);
        assertEquals("applied", store.completeSet(command("c-good", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        assertFalse(set(saved(), "e-2", "set-2").has("at"));
        assertEquals(actionAt, set(saved(), "e-1", "set-1").getString("at"));
    }

    @Test public void invalidTimesAndClosedSessionCannotCommit() throws Exception {
        assertEquals("invalid", store.completeSet(command("c-bad", "watch-1", "e-1", "set-1", 0, "2026-02-30T10:00:00.000Z")).status);
        assertEquals("time_needs_review", store.completeSet(command("c-early", "watch-1", "e-1", "set-1", 0,
                UTC.format(Instant.parse(startedAt).minusSeconds(60)))).status);
        assertEquals("time_needs_review", store.completeSet(command("c-late", "watch-1", "e-1", "set-1", 0,
                UTC.format(Instant.now().plusSeconds(120)))).status);
        store.getWritableDatabase().execSQL("UPDATE sessions SET status='finished' WHERE session_id='s-1'");
        assertEquals("conflict", store.completeSet(command("c-closed", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
    }

    @Test public void pausedRejectionReplaysAsRejectionAfterReopen() throws Exception {
        store.getWritableDatabase().execSQL("UPDATE sessions SET status='paused' WHERE session_id='s-1'");
        String raw = command("c-paused", "watch-1", "e-1", "set-1", 0, actionAt);
        WorkoutCommandStore.Result rejected = store.completeSet(raw);
        assertEquals("paused", rejected.status);
        assertEquals(0, pendingCount("c-paused"));
        store.close(); store = new WorkoutCommandStore(context);
        store.getWritableDatabase().execSQL("UPDATE sessions SET status='active' WHERE session_id='s-1'");
        WorkoutCommandStore.Result replay = store.completeSet(raw);
        assertEquals("replay_rejected", replay.status);
        assertEquals("paused", new JSONObject(replay.receipt).getString("status"));
        assertEquals(rejected.receipt, replay.receipt);
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
    }

    @Test public void failedReceiptInsertRollsBackSetAndCanRetry() throws Exception {
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("CREATE TRIGGER fail_receipt BEFORE INSERT ON receipts BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
        String raw = command("c-1", "watch-1", "e-1", "set-1", 0, actionAt);
        try { store.completeSet(raw); fail("Receipt insert should fail"); }
        catch (android.database.SQLException expected) { /* transaction must have rolled back */ }
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
        assertEquals(0, revision("set-1"));
        try (Cursor c = db.rawQuery("SELECT count(*) FROM receipts", null)) { assertTrue(c.moveToFirst()); assertEquals(0, c.getInt(0)); }
        db.execSQL("DROP TRIGGER fail_receipt");
        assertEquals("applied", store.completeSet(raw).status);
        assertEquals(3, pendingCount("c-1"));
    }

    @Test public void failedPendingEffectInsertRollsBackReceiptAndSet() throws Exception {
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("CREATE TRIGGER fail_effect BEFORE INSERT ON pending_effects WHEN NEW.effect='heart' BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
        String raw = command("c-effect", "watch-1", "e-1", "set-1", 0, actionAt);
        try { store.completeSet(raw); fail("Pending effect insert should fail"); }
        catch (android.database.SQLException expected) { /* one transaction */ }
        assertFalse(set(saved(), "e-1", "set-1").has("at"));
        assertEquals(0, revision("set-1"));
        assertEquals(0, pendingCount("c-effect"));
        try (Cursor c = db.rawQuery("SELECT count(*) FROM receipts", null)) {
            assertTrue(c.moveToFirst()); assertEquals(0, c.getInt(0));
        }
        db.execSQL("DROP TRIGGER fail_effect");
        assertEquals("applied", store.completeSet(raw).status);
        assertEquals(3, pendingCount("c-effect"));
    }

    @Test public void versionTwoUpgradeBackfillsAppliedEffectsOnly() throws Exception {
        store.close(); context.deleteDatabase(DB);
        SQLiteDatabase old = context.openOrCreateDatabase(DB, Context.MODE_PRIVATE, null);
        old.execSQL(WorkoutCommandStore.CREATE_SESSIONS);
        old.execSQL(WorkoutCommandStore.CREATE_RECEIPTS);
        old.execSQL(WorkoutCommandStore.ONE_ACTIVE_SESSION);
        old.execSQL(WorkoutCommandStore.CREATE_SET_REVISIONS);
        old.execSQL("INSERT INTO sessions(session_id,installation_id,revision,status,snapshot) VALUES(?,?,?,?,?)",
                new Object[]{"s-1", "watch-1", 1, "active", snapshot(false)});
        old.execSQL("INSERT INTO set_revisions(session_id,entry_id,set_id,revision) VALUES('s-1','e-1','set-1',1)");
        JSONObject applied = new JSONObject().put("status", "applied").put("setId", "set-1").put("actionAt", actionAt);
        old.execSQL("INSERT INTO receipts(session_id,command_id,fingerprint,result) VALUES(?,?,?,?)",
                new Object[]{"s-1", "c-applied", "fingerprint", applied.toString()});
        old.execSQL("INSERT INTO receipts(session_id,command_id,fingerprint,result) VALUES(?,?,?,?)",
                new Object[]{"s-1", "c-rejected", "fingerprint", new JSONObject().put("status", "paused").toString()});
        old.setVersion(2); old.close();
        store = new WorkoutCommandStore(context);
        assertEquals(3, pendingCount("c-applied"));
        assertEquals(0, pendingCount("c-rejected"));
        assertEquals(1, revision("set-1"));
        try (Cursor c = store.getReadableDatabase().rawQuery(
                "SELECT context FROM pending_effects WHERE command_id='c-applied'", null)) {
            assertTrue(c.moveToFirst()); assertTrue(c.isNull(0));
        }
    }

    @Test public void versionThreeUpgradeKeepsPendingRowsUnresolved() throws Exception {
        store.close(); context.deleteDatabase(DB);
        SQLiteDatabase old = context.openOrCreateDatabase(DB, Context.MODE_PRIVATE, null);
        old.execSQL(WorkoutCommandStore.CREATE_SESSIONS);
        old.execSQL(WorkoutCommandStore.CREATE_RECEIPTS);
        old.execSQL(WorkoutCommandStore.ONE_ACTIVE_SESSION);
        old.execSQL(WorkoutCommandStore.CREATE_SET_REVISIONS);
        old.execSQL(WorkoutCommandStore.CREATE_PENDING_EFFECTS.replace(", context TEXT", ""));
        old.execSQL("INSERT INTO sessions(session_id,installation_id,revision,status,snapshot) VALUES(?,?,?,?,?)",
                new Object[]{"s-1", "watch-1", 1, "active", snapshot(false)});
        old.execSQL("INSERT INTO receipts(session_id,command_id,fingerprint,result) VALUES(?,?,?,?)",
                new Object[]{"s-1", "c-old", "fingerprint", new JSONObject().put("status", "applied").toString()});
        old.execSQL("INSERT INTO pending_effects(session_id,command_id,effect,set_id,action_at,status) VALUES(?,?,?,?,?,?)",
                new Object[]{"s-1", "c-old", "rest", "set-1", actionAt, "pending"});
        old.setVersion(3); old.close();
        store = new WorkoutCommandStore(context);
        assertEquals(1, pendingCount("c-old"));
        try (Cursor c = store.getReadableDatabase().rawQuery(
                "SELECT context,status FROM pending_effects WHERE command_id='c-old'", null)) {
            assertTrue(c.moveToFirst()); assertTrue(c.isNull(0)); assertEquals("pending", c.getString(1));
        }
    }

    private JSONObject handoverSeed() throws Exception {
        JSONObject active = new JSONObject(snapshot(false)).put("splitId", "split-1").put("pausedMs", 0);
        JSONArray entries = active.getJSONArray("entries");
        for (int i = 0; i < entries.length(); i++) entries.getJSONObject(i)
                .put("exerciseId", "exercise-" + i).put("name", "Exercise " + i).put("done", false).put("skipped", false);
        return new JSONObject().put("handoverId", "h-1").put("installationId", "watch-1")
                .put("snapshot", active.toString()).put("inputs", new JSONObject().put("version", 1)
                        .put("sessionId", "s-1").put("capturedAt", actionAt)
                        .put("restPolicy", new JSONObject().put("autoRest", true).put("restDefaultSec", 90)
                                .put("rest", new JSONObject().put("mode", "time").put("heartTargetPct", 0.6).put("minSec", 30)))
                        .put("heartSource", "ble").put("heartSamples", new JSONArray().put(new JSONObject()
                                .put("tSec", 20).put("bpm", 128).put("contact", true)
                                .put("receivedAtEpochMs", Instant.parse(startedAt).toEpochMilli() + 20000)
                                .put("receivedAtElapsedMs", 90000))).toString());
    }

    private void emptyStore() {
        store.close(); context.deleteDatabase(DB); store = new WorkoutCommandStore(context);
    }

    @Test public void handoverAndSeedCommitTogetherAndReplayDoesNotResetWorkout() throws Exception {
        emptyStore();
        JSONObject seed = handoverSeed();
        assertEquals("web", store.readOwnership().getString("owner"));
        assertEquals("native", store.handover(seed).getString("owner"));
        assertEquals("applied", store.completeSet(command("c-handover", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        store.close(); store = new WorkoutCommandStore(context);
        JSONObject replay = store.handover(seed);
        assertEquals(seed.getString("inputs"), replay.getJSONObject("seed").getString("inputs"));
        assertEquals(seed.getString("snapshot"), replay.getJSONObject("seed").getString("snapshot"));
        assertEquals("committed", set(new JSONObject(replay.getString("snapshot")), "e-1", "set-1").getString("status"));
        assertEquals("native", store.settleHandover("h-1").getString("owner"));
        assertEquals(1, revision("set-1"));
        try { store.handover(new JSONObject(seed.toString()).put("inputs", seed.getString("inputs") + " ")); fail("Changed inputs must conflict"); }
        catch (IllegalStateException expected) { /* identical handover token cannot change its source */ }
    }

    @Test public void failedOwnerInsertRollsBackSeedAndSetIdentities() throws Exception {
        emptyStore();
        SQLiteDatabase db = store.getWritableDatabase();
        db.execSQL("CREATE TRIGGER fail_owner BEFORE INSERT ON workout_handovers BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
        try { store.handover(handoverSeed()); fail("Owner insert should fail"); }
        catch (android.database.SQLException expected) { /* no orphaned native seed */ }
        assertEquals("web", store.readOwnership().getString("owner"));
        for (String table : new String[]{"sessions", "set_revisions", "workout_handovers", "heart_capture", "heart_samples"}) {
            try (Cursor c = db.rawQuery("SELECT count(*) FROM " + table, null)) { assertTrue(c.moveToFirst()); assertEquals(0, c.getInt(0)); }
        }
        db.execSQL("DROP TRIGGER fail_owner");
        assertEquals("native", store.handover(handoverSeed()).getString("owner"));
    }

    @Test public void cancellationSurvivesReopenAndPreventsLateSeed() throws Exception {
        emptyStore();
        assertEquals("h-1", store.settleHandover("h-1").getString("cancelledHandoverId"));
        store.close(); store = new WorkoutCommandStore(context);
        try { store.handover(handoverSeed()); fail("Late cancelled handover must fail"); }
        catch (IllegalStateException expected) { /* no delayed second writer */ }
        assertEquals("web", store.readOwnership().getString("owner"));
        assertEquals("h-1", store.settleHandover("h-1").getString("cancelledHandoverId"));
        assertEquals("native", store.handover(handoverSeed().put("handoverId", "h-2")).getString("owner"));
    }

    @Test public void conflictingSessionOrMalformedSeedCannotCreateOwner() throws Exception {
        assertEquals("blocked", store.readOwnership().getString("owner")); // old unowned primitive seed
        try { store.handover(handoverSeed()); fail("Existing workout requires review"); }
        catch (IllegalStateException expected) { /* preserve it */ }
        emptyStore();
        JSONObject seed = handoverSeed();
        seed.put("snapshot", seed.getString("snapshot").replace("set-2", "set-1"));
        try { store.handover(seed); fail("Duplicate identities must fail"); }
        catch (IllegalArgumentException expected) { /* seed and marker both roll back */ }
        assertEquals("web", store.readOwnership().getString("owner"));
        seed = handoverSeed();
        seed.put("inputs", new JSONObject(seed.getString("inputs")).put("sessionId", "another").toString());
        try { store.handover(seed); fail("Input session must match"); }
        catch (IllegalArgumentException expected) { /* no context retargeting */ }
        assertEquals("web", store.readOwnership().getString("owner"));
    }

    @Test public void versionFourUpgradeKeepsUnownedRowsAndPendingContext() throws Exception {
        assertEquals("applied", store.completeSet(command("c-v4", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        String before = pendingContext("c-v4", "rest").toString();
        store.getWritableDatabase().execSQL("DROP TABLE heart_samples");
        store.getWritableDatabase().execSQL("DROP TABLE heart_capture");
        store.getWritableDatabase().execSQL("DROP TABLE workout_handovers");
        store.getWritableDatabase().setVersion(4);
        store.close(); store = new WorkoutCommandStore(context);
        assertEquals("blocked", store.readOwnership().getString("owner"));
        assertEquals(before, pendingContext("c-v4", "rest").toString());
        assertEquals(3, pendingCount("c-v4"));
        assertEquals(6, store.getReadableDatabase().getVersion());
    }

    @Test public void malformedHandoverContextCannotAcquireOwnership() throws Exception {
        emptyStore();
        for (String bad : new String[]{"version", "rest", "heart"}) {
            JSONObject seed = handoverSeed(), inputs = new JSONObject(seed.getString("inputs"));
            if ("version".equals(bad)) inputs.put("version", 1.5);
            if ("rest".equals(bad)) inputs.getJSONObject("restPolicy").put("restDefaultSec", "90");
            if ("heart".equals(bad)) inputs.getJSONArray("heartSamples").getJSONObject(0).put("receivedAtEpochMs", "unknown");
            seed.put("inputs", inputs.toString());
            try { store.handover(seed); fail("Malformed " + bad + " must fail"); }
            catch (IllegalArgumentException expected) { /* no partial seed */ }
            assertEquals("web", store.readOwnership().getString("owner"));
        }
    }
}
