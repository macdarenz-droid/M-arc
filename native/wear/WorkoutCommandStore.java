package com.mrcdrnzz.dailytracker.wear;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import org.json.JSONObject;

/** Inactive Gate B storage primitive. Call only on a background worker; no watch acknowledgement is wired. */
final class WorkoutCommandStore extends SQLiteOpenHelper {
    static final String CREATE_SESSIONS = "CREATE TABLE sessions (session_id TEXT PRIMARY KEY NOT NULL, installation_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision >= 0), status TEXT NOT NULL CHECK(status IN ('active','paused','finished','discarded')), snapshot TEXT NOT NULL)";
    static final String CREATE_RECEIPTS = "CREATE TABLE receipts (session_id TEXT NOT NULL, command_id TEXT NOT NULL, fingerprint TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(session_id, command_id), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    static final String ONE_ACTIVE_SESSION = "CREATE UNIQUE INDEX one_active_session ON sessions((1)) WHERE status IN ('active','paused')";

    WorkoutCommandStore(Context context) { super(context, "marc_watch_workout_v1.db", null, 1); }

    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_SESSIONS);
        db.execSQL(CREATE_RECEIPTS);
        db.execSQL(ONE_ACTIVE_SESSION);
    }

    @Override public void onConfigure(SQLiteDatabase db) {
        super.onConfigure(db);
        db.setForeignKeyConstraintsEnabled(true);
    }

    @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        throw new IllegalStateException("Workout database migration required");
    }

    /** Explicit handover only. A second seed cannot replace a running or terminal workout. */
    void seed(String sessionId, String installationId, String snapshot) throws Exception {
        if (sessionId.isEmpty() || installationId.isEmpty() || !sessionId.equals(new JSONObject(snapshot).getString("id")))
            throw new IllegalArgumentException("Invalid session handover");
        ContentValues values = new ContentValues();
        values.put("session_id", sessionId);
        values.put("installation_id", installationId);
        values.put("revision", 0);
        values.put("status", "active");
        values.put("snapshot", snapshot);
        if (getWritableDatabase().insertOrThrow("sessions", null, values) < 0)
            throw new IllegalStateException("Session handover failed");
    }

    /** All writes and the receipt share one SQLite transaction. A failed write is never an applied result. */
    Result commit(String sessionId, String installationId, String commandId, String fingerprint,
                  int expectedRevision, String nextSnapshot, String resultJson) throws Exception {
        if (sessionId.isEmpty() || installationId.isEmpty() || commandId.isEmpty() || fingerprint.isEmpty()
                || expectedRevision < 0 || !sessionId.equals(new JSONObject(nextSnapshot).getString("id")))
            throw new IllegalArgumentException("Invalid command commit");
        JSONObject result = new JSONObject(resultJson);
        if (!"applied".equals(result.getString("status")) || !sessionId.equals(result.getString("sessionId"))
                || !commandId.equals(result.getString("commandId"))
                || result.getInt("sessionRevision") != expectedRevision + 1)
            throw new IllegalArgumentException("Invalid command result");
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            try (Cursor c = db.rawQuery("SELECT installation_id FROM sessions WHERE session_id=?",
                    new String[]{sessionId})) {
                if (!c.moveToFirst()) return new Result("wrong_session", null);
                if (!installationId.equals(c.getString(0))) return new Result("wrong_installation", null);
            }
            try (Cursor c = db.rawQuery("SELECT fingerprint,result FROM receipts WHERE session_id=? AND command_id=?",
                    new String[]{sessionId, commandId})) {
                if (c.moveToFirst()) return fingerprint.equals(c.getString(0))
                        ? new Result("replay", c.getString(1)) : new Result("command_id_conflict", null);
            }
            ContentValues session = new ContentValues();
            session.put("revision", expectedRevision + 1);
            session.put("snapshot", nextSnapshot);
            int updated = db.update("sessions", session,
                    "session_id=? AND installation_id=? AND status='active' AND revision=?",
                    new String[]{sessionId, installationId, Integer.toString(expectedRevision)});
            if (updated != 1) return new Result("conflict", null);
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
