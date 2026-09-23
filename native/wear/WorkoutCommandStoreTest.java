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
                store.seed("s-1", "watch-1", initial.toString());
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
                String status = store.completeSet(raw).status;
                assertEquals(fixture.getString("name"), fixture.getString("expected"), "applied".equals(status) ? "accepted" : status);
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
    }
}
