package com.mrcdrnzz.dailytracker.wear;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.ResolverStyle;
import java.util.HashSet;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Inactive Gate B storage primitive. Call only on a background worker; no watch acknowledgement is wired. */
final class WorkoutCommandStore extends SQLiteOpenHelper {
    static final String CREATE_SESSIONS = "CREATE TABLE sessions (session_id TEXT PRIMARY KEY NOT NULL, installation_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision >= 0), status TEXT NOT NULL CHECK(status IN ('active','paused','finished','discarded')), snapshot TEXT NOT NULL)";
    static final String CREATE_RECEIPTS = "CREATE TABLE receipts (session_id TEXT NOT NULL, command_id TEXT NOT NULL, fingerprint TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(session_id, command_id), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    static final String ONE_ACTIVE_SESSION = "CREATE UNIQUE INDEX one_active_session ON sessions((1)) WHERE status IN ('active','paused')";
    static final String CREATE_SET_REVISIONS = "CREATE TABLE set_revisions (session_id TEXT NOT NULL, entry_id TEXT NOT NULL, set_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision >= 0), PRIMARY KEY(session_id, set_id), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    private static final DateTimeFormatter UTC = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withResolverStyle(ResolverStyle.STRICT).withZone(ZoneOffset.UTC);

    WorkoutCommandStore(Context context) { super(context, "marc_watch_workout_v1.db", null, 2); }

    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_SESSIONS);
        db.execSQL(CREATE_RECEIPTS);
        db.execSQL(ONE_ACTIVE_SESSION);
        db.execSQL(CREATE_SET_REVISIONS);
    }

    @Override public void onConfigure(SQLiteDatabase db) {
        super.onConfigure(db);
        db.setForeignKeyConstraintsEnabled(true);
    }

    @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion != 1 || newVersion != 2) throw new IllegalStateException("Workout database migration required");
        db.execSQL(CREATE_SET_REVISIONS);
        try (Cursor rows = db.rawQuery("SELECT session_id,snapshot FROM sessions", null)) {
            while (rows.moveToNext()) {
                JSONObject snapshot = new JSONObject(rows.getString(1));
                insertSetRevisions(db, rows.getString(0), snapshot);
            }
        } catch (Exception e) { throw new IllegalStateException("Could not migrate watch set identities", e); }
    }

    private static boolean id(String value) { return value != null && value.matches("[A-Za-z0-9][A-Za-z0-9_-]{0,79}"); }

    private static String field(JSONObject object, String key) {
        Object value = object.opt(key);
        if (!(value instanceof String)) throw new IllegalArgumentException("Invalid " + key);
        return (String) value;
    }

    private static Instant timestamp(String value) {
        if (value == null || !value.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z"))
            throw new IllegalArgumentException("Invalid UTC time");
        try {
            Instant instant = Instant.parse(value);
            if (!UTC.format(instant).equals(value)) throw new IllegalArgumentException("Noncanonical UTC time");
            return instant;
        } catch (java.time.format.DateTimeParseException e) { throw new IllegalArgumentException("Invalid UTC time", e); }
    }

    private static void insertSetRevisions(SQLiteDatabase db, String sessionId, JSONObject snapshot) throws Exception {
        Set<String> identities = new HashSet<>();
        JSONArray entries = snapshot.getJSONArray("entries");
        for (int i = 0; i < entries.length(); i++) {
            JSONObject entry = entries.getJSONObject(i);
            String entryId = entry.getString("id");
            if (!id(entryId) || !identities.add(entryId)) throw new IllegalArgumentException("Duplicate entry ID");
            JSONArray sets = entry.getJSONArray("sets");
            for (int j = 0; j < sets.length(); j++) {
                String setId = sets.getJSONObject(j).getString("id");
                if (!id(setId) || !identities.add(setId)) throw new IllegalArgumentException("Duplicate set ID");
                ContentValues value = new ContentValues();
                value.put("session_id", sessionId);
                value.put("entry_id", entryId);
                value.put("set_id", setId);
                value.put("revision", 0);
                db.insertOrThrow("set_revisions", null, value);
            }
        }
    }

    /** Explicit handover only. A second seed cannot replace a running or terminal workout. */
    void seed(String sessionId, String installationId, String snapshot) throws Exception {
        if (!id(sessionId) || !id(installationId) || snapshot.getBytes(StandardCharsets.UTF_8).length > 1_048_576)
            throw new IllegalArgumentException("Invalid session handover");
        JSONObject parsed = new JSONObject(snapshot);
        if (!sessionId.equals(parsed.getString("id"))) throw new IllegalArgumentException("Session identity changed");
        timestamp(parsed.getString("startedAt"));
        ContentValues values = new ContentValues();
        values.put("session_id", sessionId);
        values.put("installation_id", installationId);
        values.put("revision", 0);
        values.put("status", "active");
        values.put("snapshot", snapshot);
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            db.insertOrThrow("sessions", null, values);
            insertSetRevisions(db, sessionId, parsed);
            db.setTransactionSuccessful();
        } finally { db.endTransaction(); }
    }

    /** A draft set and its receipt commit together. No transport invokes this class yet. */
    Result completeSet(String raw) throws Exception {
        if (raw == null || raw.getBytes(StandardCharsets.UTF_8).length > 1024)
            return new Result("invalid", null);
        JSONObject command;
        try { command = new JSONObject(raw); }
        catch (JSONException e) { return new Result("invalid", null); }
        Object version = command.opt("v");
        if (!(version instanceof Number) || ((Number) version).doubleValue() != 1
                || !"complete_set".equals(command.opt("kind")))
            return new Result("invalid", null);
        String sessionId, installationId, commandId, entryId, setId, actionAt;
        Instant actionTime;
        try {
            sessionId = field(command, "sessionId"); installationId = field(command, "installationId");
            commandId = field(command, "commandId"); entryId = field(command, "entryId");
            setId = field(command, "setId"); actionAt = field(command, "actionAt");
            actionTime = timestamp(actionAt);
        } catch (IllegalArgumentException e) { return new Result("invalid", null); }
        Object expected = command.get("expectedSetRevision");
        if (!id(sessionId) || !id(installationId) || !id(commandId) || !id(entryId) || !id(setId)
                || !(expected instanceof Number) || ((Number) expected).doubleValue() < 0
                || ((Number) expected).doubleValue() != Math.rint(((Number) expected).doubleValue())
                || ((Number) expected).doubleValue() > Integer.MAX_VALUE - 1)
            return new Result("invalid", null);
        int expectedRevision = ((Number) expected).intValue();
        String fingerprint = String.join("|", "1", "complete_set", installationId, sessionId,
                commandId, entryId, setId, Integer.toString(expectedRevision), actionAt);
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            String snapshotRaw;
            int sessionRevision;
            try (Cursor c = db.rawQuery("SELECT installation_id,revision,status,snapshot FROM sessions WHERE session_id=?",
                    new String[]{sessionId})) {
                if (!c.moveToFirst()) return new Result("wrong_session", null);
                if (!installationId.equals(c.getString(0))) return new Result("wrong_installation", null);
                sessionRevision = c.getInt(1);
                snapshotRaw = c.getString(3);
                // A retry of a committed command remains valid after the session closes.
            }
            try (Cursor c = db.rawQuery("SELECT fingerprint,result FROM receipts WHERE session_id=? AND command_id=?",
                    new String[]{sessionId, commandId})) {
                if (c.moveToFirst()) return fingerprint.equals(c.getString(0))
                        ? new Result("replay", c.getString(1)) : new Result("command_id_conflict", null);
            }
            JSONObject snapshot = new JSONObject(snapshotRaw);
            long actionMs = actionTime.toEpochMilli(), startedMs = timestamp(snapshot.getString("startedAt")).toEpochMilli();
            if (actionMs < startedMs - 5000 || actionMs > System.currentTimeMillis() + 30000)
                return new Result("time_needs_review", null);
            int setRevision;
            try (Cursor c = db.rawQuery("SELECT revision FROM set_revisions WHERE session_id=? AND entry_id=? AND set_id=?",
                    new String[]{sessionId, entryId, setId})) {
                if (!c.moveToFirst()) return new Result("target_changed", null);
                setRevision = c.getInt(0);
            }
            if (setRevision != expectedRevision) return new Result("revision_conflict", null);
            JSONObject target = null;
            JSONArray entries = snapshot.getJSONArray("entries");
            for (int i = 0; i < entries.length(); i++) {
                JSONObject entry = entries.getJSONObject(i);
                if (!entryId.equals(entry.getString("id"))) continue;
                JSONArray sets = entry.getJSONArray("sets");
                for (int j = 0; j < sets.length(); j++) {
                    JSONObject set = sets.getJSONObject(j);
                    if (setId.equals(set.getString("id"))) { target = set; break; }
                }
                break;
            }
            if (target == null || target.has("at") || "committed".equals(target.optString("status"))
                    || "skipped".equals(target.optString("status"))) return new Result("target_changed", null);
            Object kg = target.opt("kg"), reps = target.opt("reps"), duration = target.opt("durationSec");
            boolean weighted = kg instanceof Number && Double.isFinite(((Number) kg).doubleValue())
                    && ((Number) kg).doubleValue() >= 0 && reps instanceof Number
                    && ((Number) reps).doubleValue() > 0 && ((Number) reps).doubleValue() == Math.rint(((Number) reps).doubleValue());
            boolean timed = duration instanceof Number && Double.isFinite(((Number) duration).doubleValue())
                    && ((Number) duration).doubleValue() > 0;
            if (!weighted && !timed) return new Result("incomplete_draft", null);
            target.put("at", actionAt);
            target.put("status", "committed");
            JSONObject receiptResult = new JSONObject().put("status", "applied").put("commandId", commandId)
                    .put("sessionId", sessionId).put("entryId", entryId).put("setId", setId)
                    .put("setRevision", setRevision + 1).put("sessionRevision", sessionRevision + 1)
                    .put("actionAt", actionAt).put("receivedAt", UTC.format(Instant.now()));
            String resultJson = receiptResult.toString();
            ContentValues session = new ContentValues();
            session.put("revision", sessionRevision + 1);
            session.put("snapshot", snapshot.toString());
            int updated = db.update("sessions", session,
                    "session_id=? AND installation_id=? AND status='active' AND revision=?",
                    new String[]{sessionId, installationId, Integer.toString(sessionRevision)});
            if (updated != 1) return new Result("conflict", null);
            ContentValues revision = new ContentValues();
            revision.put("revision", setRevision + 1);
            if (db.update("set_revisions", revision, "session_id=? AND entry_id=? AND set_id=? AND revision=?",
                    new String[]{sessionId, entryId, setId, Integer.toString(setRevision)}) != 1)
                throw new IllegalStateException("Set revision update failed");
            ContentValues receipt = new ContentValues();
            receipt.put("session_id", sessionId);
            receipt.put("command_id", commandId);
            receipt.put("fingerprint", fingerprint);
            receipt.put("result", resultJson);
            db.insertOrThrow("receipts", null, receipt);
            db.setTransactionSuccessful();
            return new Result("applied", resultJson);
        } finally {
            db.endTransaction();
        }
    }

    static final class Result {
        final String status;
        final String receipt;
        Result(String status, String receipt) { this.status = status; this.receipt = receipt; }
    }
}
