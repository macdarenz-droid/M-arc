package com.mrcdrnzz.dailytracker.wear;

import static org.junit.Assert.*;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
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
        assertEquals(actionAt, set(saved(), "e-1", "set-1").getString("at"));
        assertEquals("committed", set(saved(), "e-1", "set-1").getString("status"));
        assertFalse(set(saved(), "e-2", "set-2").has("at"));
        assertEquals(1, revision("set-1"));
        assertEquals(0, revision("set-2"));
        store.close();
        store = new WorkoutCommandStore(context);
        WorkoutCommandStore.Result replay = store.completeSet(raw);
        assertEquals("replay", replay.status);
        assertEquals(applied.receipt, replay.receipt);
        assertEquals("command_id_conflict", store.completeSet(command("c-1", "watch-1", "e-2", "set-2", 0, actionAt)).status);
        assertEquals("wrong_installation", store.completeSet(command("c-1", "other", "e-1", "set-1", 0, actionAt)).status);
        assertEquals("revision_conflict", store.completeSet(command("c-2", "watch-1", "e-1", "set-1", 0, actionAt)).status);
        assertEquals(1, revision("set-1"));
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
    }
}
