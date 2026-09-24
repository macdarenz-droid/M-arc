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
import org.json.JSONTokener;

/** Inactive Gate B storage primitive. Call only on a background worker; no watch acknowledgement is wired. */
final class WorkoutCommandStore extends SQLiteOpenHelper {
    static final String CREATE_SESSIONS = "CREATE TABLE sessions (session_id TEXT PRIMARY KEY NOT NULL, installation_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision >= 0), status TEXT NOT NULL CHECK(status IN ('active','paused','finished','discarded')), snapshot TEXT NOT NULL)";
    static final String CREATE_RECEIPTS = "CREATE TABLE receipts (session_id TEXT NOT NULL, command_id TEXT NOT NULL, fingerprint TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(session_id, command_id), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    static final String ONE_ACTIVE_SESSION = "CREATE UNIQUE INDEX one_active_session ON sessions((1)) WHERE status IN ('active','paused')";
    static final String CREATE_SET_REVISIONS = "CREATE TABLE set_revisions (session_id TEXT NOT NULL, entry_id TEXT NOT NULL, set_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision >= 0), PRIMARY KEY(session_id, set_id), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    static final String CREATE_PENDING_EFFECTS = "CREATE TABLE pending_effects (session_id TEXT NOT NULL, command_id TEXT NOT NULL, effect TEXT NOT NULL CHECK(effect IN ('fidelity','rest','heart')), set_id TEXT NOT NULL, action_at TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','resolved')), context TEXT, PRIMARY KEY(session_id, command_id, effect), FOREIGN KEY(session_id, command_id) REFERENCES receipts(session_id, command_id) ON DELETE RESTRICT)";
    static final String CREATE_HANDOVERS = "CREATE TABLE workout_handovers (handover_id TEXT PRIMARY KEY NOT NULL, status TEXT NOT NULL CHECK(status IN ('native','cancelled')), session_id TEXT UNIQUE, installation_id TEXT, original_snapshot TEXT, inputs TEXT, CHECK(status='cancelled' OR (session_id IS NOT NULL AND installation_id IS NOT NULL AND original_snapshot IS NOT NULL AND inputs IS NOT NULL)), FOREIGN KEY(session_id) REFERENCES sessions(session_id) ON DELETE RESTRICT)";
    static final String ONE_NATIVE_OWNER = "CREATE UNIQUE INDEX one_native_owner ON workout_handovers((1)) WHERE status='native'";
    private static final DateTimeFormatter UTC = DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withResolverStyle(ResolverStyle.STRICT).withZone(ZoneOffset.UTC);

    WorkoutCommandStore(Context context) { super(context, "marc_watch_workout_v1.db", null, 5); }

    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_SESSIONS);
        db.execSQL(CREATE_RECEIPTS);
        db.execSQL(ONE_ACTIVE_SESSION);
        db.execSQL(CREATE_SET_REVISIONS);
        db.execSQL(CREATE_PENDING_EFFECTS);
        db.execSQL(CREATE_HANDOVERS);
        db.execSQL(ONE_NATIVE_OWNER);
    }

    @Override public void onConfigure(SQLiteDatabase db) {
        super.onConfigure(db);
        db.setForeignKeyConstraintsEnabled(true);
    }

    @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (newVersion != 5 || oldVersion < 1 || oldVersion > 4)
            throw new IllegalStateException("Workout database migration required");
        if (oldVersion == 1) {
            db.execSQL(CREATE_SET_REVISIONS);
            try (Cursor rows = db.rawQuery("SELECT session_id,snapshot FROM sessions", null)) {
                while (rows.moveToNext()) {
                    JSONObject snapshot = new JSONObject(rows.getString(1));
                    insertSetRevisions(db, rows.getString(0), snapshot);
                }
            } catch (Exception e) { throw new IllegalStateException("Could not migrate watch set identities", e); }
        }
        if (oldVersion < 3) {
            db.execSQL(CREATE_PENDING_EFFECTS);
            try (Cursor rows = db.rawQuery("SELECT session_id,command_id,result FROM receipts", null)) {
                while (rows.moveToNext()) {
                    JSONObject receipt = new JSONObject(rows.getString(2));
                    if ("applied".equals(receipt.optString("status")))
                        insertPendingEffects(db, rows.getString(0), rows.getString(1),
                                receipt.getString("setId"), receipt.getString("actionAt"), null);
                }
            } catch (Exception e) { throw new IllegalStateException("Could not migrate watch pending effects", e); }
        } else if (oldVersion == 3) db.execSQL("ALTER TABLE pending_effects ADD COLUMN context TEXT");
        // Never infer ownership of old, unconnected seed rows during migration.
        db.execSQL(CREATE_HANDOVERS);
        db.execSQL(ONE_NATIVE_OWNER);
    }

    private static boolean id(String value) { return value != null && value.matches("[A-Za-z0-9][A-Za-z0-9_-]{0,79}"); }

    /** JSONTokener permits JavaScript-invalid extensions; validate JSON grammar before decoding it. */
    private static final class StrictJson {
        private final String source;
        private int position;
        StrictJson(String source) { this.source = source; }
        boolean valid() {
            try { whitespace(); value(0); whitespace(); return position == source.length(); }
            catch (IllegalArgumentException e) { return false; }
        }
        private void fail() { throw new IllegalArgumentException("Invalid JSON"); }
        private void whitespace() {
            while (position < source.length() && " \t\r\n".indexOf(source.charAt(position)) >= 0) position++;
        }
        private boolean consume(char c) {
            if (position < source.length() && source.charAt(position) == c) { position++; return true; }
            return false;
        }
        private void expect(char c) { if (!consume(c)) fail(); }
        private void literal(String token) {
            if (!source.startsWith(token, position)) fail();
            position += token.length();
        }
        private void string() {
            expect('"');
            while (position < source.length()) {
                char c = source.charAt(position++);
                if (c == '"') return;
                if (c < 0x20) fail();
                if (c == '\\') {
                    if (position == source.length()) fail();
                    char escaped = source.charAt(position++);
                    if (escaped == 'u') {
                        for (int i = 0; i < 4; i++) {
                            if (position == source.length() || "0123456789abcdefABCDEF".indexOf(source.charAt(position++)) < 0) fail();
                        }
                    } else if ("\"\\/bfnrt".indexOf(escaped) < 0) fail();
                }
            }
            fail();
        }
        private void number() {
            consume('-');
            if (!consume('0')) {
                if (position == source.length() || source.charAt(position) < '1' || source.charAt(position) > '9') fail();
                do { position++; } while (position < source.length() && source.charAt(position) >= '0' && source.charAt(position) <= '9');
            }
            if (consume('.')) {
                int start = position;
                while (position < source.length() && source.charAt(position) >= '0' && source.charAt(position) <= '9') position++;
                if (start == position) fail();
            }
            if (consume('e') || consume('E')) {
                if (!consume('+')) consume('-');
                int start = position;
                while (position < source.length() && source.charAt(position) >= '0' && source.charAt(position) <= '9') position++;
                if (start == position) fail();
            }
        }
        private void value(int depth) {
            if (depth > 32 || position == source.length()) fail();
            char c = source.charAt(position);
            if (c == '{') {
                position++; whitespace();
                if (consume('}')) return;
                do { whitespace(); string(); whitespace(); expect(':'); whitespace(); value(depth + 1); whitespace();
                    if (consume('}')) return;
                    expect(','); whitespace();
                } while (true);
            } else if (c == '[') {
                position++; whitespace();
                if (consume(']')) return;
                do { whitespace(); value(depth + 1); whitespace();
                    if (consume(']')) return;
                    expect(','); whitespace();
                } while (true);
            } else if (c == '"') string();
            else if (c == 't') literal("true");
            else if (c == 'f') literal("false");
            else if (c == 'n') literal("null");
            else number();
        }
    }

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

    private static double numberIn(JSONObject object, String key, double low, double high) throws Exception {
        Object value = object.get(key);
        if (!(value instanceof Number)) throw new IllegalArgumentException("Invalid " + key);
        double n = ((Number) value).doubleValue();
        if (!Double.isFinite(n) || n < low || n > high) throw new IllegalArgumentException("Invalid " + key);
        return n;
    }

    private static void insertSetRevisions(SQLiteDatabase db, String sessionId, JSONObject snapshot) throws Exception {
        Set<String> identities = new HashSet<>();
        identities.add(sessionId);
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

    private static void insertPendingEffects(SQLiteDatabase db, String sessionId, String commandId,
                                             String setId, String actionAt, String context) {
        for (String effect : new String[]{"fidelity", "rest", "heart"}) {
            ContentValues pending = new ContentValues();
            pending.put("session_id", sessionId);
            pending.put("command_id", commandId);
            pending.put("effect", effect);
            pending.put("set_id", setId);
            pending.put("action_at", actionAt);
            pending.put("status", "pending");
            pending.put("context", context);
            db.insertOrThrow("pending_effects", null, pending);
        }
    }

    /** Immutable inputs available from the committed native snapshot; phone policy and sensor samples are still absent. */
    private static JSONObject pendingContext(JSONObject before, JSONObject set, String entryId,
                                             String effectiveAt, String receivedAt) throws Exception {
        long at = timestamp(effectiveAt).toEpochMilli();
        long last = Long.MIN_VALUE;
        int recent = 0;
        boolean valid = true;
        JSONArray entries = before.getJSONArray("entries");
        for (int i = 0; i < entries.length(); i++) {
            JSONArray sets = entries.getJSONObject(i).getJSONArray("sets");
            for (int j = 0; j < sets.length(); j++) {
                JSONObject prior = sets.getJSONObject(j);
                if (!prior.has("at") || prior.isNull("at")) continue;
                try {
                    long time = timestamp(prior.getString("at")).toEpochMilli();
                    if (time <= at) {
                        last = Math.max(last, time);
                        if (at - time <= 15_000) recent++;
                    }
                } catch (Exception invalid) { valid = false; }
            }
        }
        JSONObject context = new JSONObject().put("version", 1).put("entryId", entryId)
                .put("effectiveAt", effectiveAt).put("receivedAt", receivedAt)
                .put("sessionStartedAt", before.getString("startedAt"))
                .put("timingInputsValid", valid)
                .put("lastCommittedAt", last == Long.MIN_VALUE ? JSONObject.NULL : UTC.format(Instant.ofEpochMilli(last)))
                .put("recentCommittedCount", recent)
                .put("setKind", set.has("kind") ? set.get("kind") : JSONObject.NULL)
                .put("setEffort", set.has("effort") ? set.get("effort") : JSONObject.NULL)
                .put("missingInputs", new JSONArray().put("autoRest").put("restDefaultSec")
                        .put("liveBpm").put("heartSamples"));
        return context;
    }

    /** Explicit handover only. A second seed cannot replace a running or terminal workout. */
    void seed(String sessionId, String installationId, String snapshot) throws Exception {
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            insertSeed(db, sessionId, installationId, snapshot);
            db.setTransactionSuccessful();
        } finally { db.endTransaction(); }
    }

    private static void insertSeed(SQLiteDatabase db, String sessionId, String installationId, String snapshot) throws Exception {
        if (!id(sessionId) || !id(installationId) || snapshot.getBytes(StandardCharsets.UTF_8).length > 1_048_576)
            throw new IllegalArgumentException("Invalid session handover");
        JSONObject parsed = new JSONObject(snapshot);
        if (!sessionId.equals(parsed.getString("id"))) throw new IllegalArgumentException("Session identity changed");
        timestamp(parsed.getString("startedAt"));
        ContentValues values = new ContentValues();
        values.put("session_id", sessionId);
        values.put("installation_id", installationId);
        values.put("revision", 0);
        values.put("status", parsed.has("pausedAt") && !parsed.isNull("pausedAt") ? "paused" : "active");
        values.put("snapshot", snapshot);
        db.insertOrThrow("sessions", null, values);
        insertSetRevisions(db, sessionId, parsed);
    }

    /** Same transaction as the seed. The original inputs remain recoverable after later mutations. */
    JSONObject handover(JSONObject seed) throws Exception {
        String token = field(seed, "handoverId"), installation = field(seed, "installationId");
        String snapshot = field(seed, "snapshot"), inputs = field(seed, "inputs");
        if (!id(token) || !id(installation) || snapshot.getBytes(StandardCharsets.UTF_8).length > 1_048_576
                || inputs.getBytes(StandardCharsets.UTF_8).length > 1_048_576
                || !new StrictJson(snapshot).valid() || !new StrictJson(inputs).valid())
            throw new IllegalArgumentException("Invalid handover envelope");
        JSONObject active = new JSONObject(snapshot), context = new JSONObject(inputs);
        String sessionId = field(active, "id");
        field(active, "splitId");
        numberIn(active, "pausedMs", 0, Double.MAX_VALUE);
        if (active.has("pausedAt") && !active.isNull("pausedAt")) numberIn(active, "pausedAt", 0, 8.64e15);
        JSONArray entries = active.getJSONArray("entries");
        for (int i = 0; i < entries.length(); i++) {
            JSONObject entry = entries.getJSONObject(i);
            field(entry, "exerciseId"); field(entry, "name");
            if (!(entry.get("done") instanceof Boolean) || !(entry.get("skipped") instanceof Boolean))
                throw new IllegalArgumentException("Invalid entry status");
        }
        if (numberIn(context, "version", 1, 1) != 1 || !sessionId.equals(field(context, "sessionId")))
            throw new IllegalArgumentException("Invalid handover inputs");
        timestamp(field(context, "capturedAt"));
        JSONObject policy = context.getJSONObject("restPolicy"), rest = policy.getJSONObject("rest");
        JSONArray heart = context.getJSONArray("heartSamples");
        if (!(policy.get("autoRest") instanceof Boolean) || !"ble".equals(context.opt("heartSource"))
                || !("time".equals(rest.opt("mode")) || "heart".equals(rest.opt("mode"))) || heart.length() > 14400)
            throw new IllegalArgumentException("Invalid policy or heart inputs");
        numberIn(policy, "restDefaultSec", 15, 600);
        numberIn(rest, "heartTargetPct", 0, 1); numberIn(rest, "minSec", 0, 600);
        for (int i = 0; i < heart.length(); i++) {
            JSONObject sample = heart.getJSONObject(i);
            numberIn(sample, "tSec", 0, Double.MAX_VALUE); numberIn(sample, "bpm", 1, 300);
            numberIn(sample, "receivedAtEpochMs", 1, 8.64e15); numberIn(sample, "receivedAtElapsedMs", 0, Double.MAX_VALUE);
            Object contact = sample.get("contact");
            if (contact != JSONObject.NULL && !(contact instanceof Boolean)) throw new IllegalArgumentException("Invalid contact");
        }
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            try (Cursor c = db.rawQuery("SELECT status,installation_id,original_snapshot,inputs FROM workout_handovers WHERE handover_id=?", new String[]{token})) {
                if (c.moveToFirst()) {
                    if (!"native".equals(c.getString(0)) || !installation.equals(c.getString(1))
                            || !snapshot.equals(c.getString(2)) || !inputs.equals(c.getString(3)))
                        throw new IllegalStateException("Handover cancelled or changed");
                    return readOwnership(db);
                }
            }
            if (!"web".equals(readOwnership(db).getString("owner")))
                throw new IllegalStateException("Workout already has an owner");
            insertSeed(db, sessionId, installation, snapshot);
            ContentValues row = new ContentValues();
            row.put("handover_id", token); row.put("status", "native");
            row.put("session_id", sessionId); row.put("installation_id", installation);
            row.put("original_snapshot", snapshot); row.put("inputs", inputs);
            db.insertOrThrow("workout_handovers", null, row);
            JSONObject result = readOwnership(db);
            db.setTransactionSuccessful();
            return result;
        } finally { db.endTransaction(); }
    }

    JSONObject readOwnership() throws Exception {
        SQLiteDatabase db = getReadableDatabase();
        db.beginTransactionNonExclusive();
        try { return readOwnership(db); } finally { db.endTransaction(); }
    }

    private static JSONObject readOwnership(SQLiteDatabase db) throws Exception {
        try (Cursor c = db.rawQuery("SELECT h.handover_id,h.installation_id,h.original_snapshot,h.inputs,s.snapshot FROM workout_handovers h JOIN sessions s ON s.session_id=h.session_id WHERE h.status='native'", null)) {
            if (c.moveToFirst()) return new JSONObject().put("owner", "native")
                    .put("seed", new JSONObject().put("handoverId", c.getString(0))
                            .put("installationId", c.getString(1)).put("snapshot", c.getString(2)).put("inputs", c.getString(3)))
                    .put("snapshot", c.getString(4));
        }
        try (Cursor c = db.rawQuery("SELECT 1 FROM sessions WHERE status IN ('active','paused') LIMIT 1", null)) {
            if (c.moveToFirst()) return new JSONObject().put("owner", "blocked");
        }
        return new JSONObject().put("owner", "web");
    }

    /** Cancelling before a delayed handover arrives leaves a durable tombstone for its ID. */
    JSONObject settleHandover(String token) throws Exception {
        if (!id(token)) throw new IllegalArgumentException("Invalid handover ID");
        SQLiteDatabase db = getWritableDatabase();
        db.beginTransactionNonExclusive();
        try {
            JSONObject owner = readOwnership(db);
            if (!"web".equals(owner.getString("owner"))) return owner;
            ContentValues cancelled = new ContentValues();
            cancelled.put("handover_id", token); cancelled.put("status", "cancelled");
            db.insertWithOnConflict("workout_handovers", null, cancelled, SQLiteDatabase.CONFLICT_IGNORE);
            // INSERT OR IGNORE must not mask a storage failure or an unexpected native row.
            try (Cursor c = db.rawQuery("SELECT status FROM workout_handovers WHERE handover_id=?", new String[]{token})) {
                if (!c.moveToFirst() || !"cancelled".equals(c.getString(0)))
                    throw new IllegalStateException("Cancellation not durable");
            }
            db.setTransactionSuccessful();
            return owner.put("cancelledHandoverId", token);
        } finally { db.endTransaction(); }
    }

    /** Terminal results for identified commands survive reconnects, including review/conflict decisions. */
    private static Result reject(SQLiteDatabase db, String sessionId, String commandId,
                                 String fingerprint, String actionAt, String status) throws Exception {
        String resultJson = new JSONObject().put("status", status).put("commandId", commandId)
                .put("sessionId", sessionId).put("actionAt", actionAt)
                .put("receivedAt", UTC.format(Instant.now())).put("clockConfidence", "unverified").toString();
        ContentValues receipt = new ContentValues();
        receipt.put("session_id", sessionId);
        receipt.put("command_id", commandId);
        receipt.put("fingerprint", fingerprint);
        receipt.put("result", resultJson);
        db.insertOrThrow("receipts", null, receipt);
        db.setTransactionSuccessful();
        return new Result(status, resultJson);
    }

    /** A draft set and its receipt commit together. No transport invokes this class yet. */
    Result completeSet(String raw) throws Exception {
        if (raw == null || raw.getBytes(StandardCharsets.UTF_8).length > 1024)
            return new Result("invalid", null);
        if (!new StrictJson(raw).valid()) return new Result("invalid", null);
        JSONObject command;
        try {
            JSONTokener parser = new JSONTokener(raw);
            Object parsed = parser.nextValue();
            if (!(parsed instanceof JSONObject) || parser.nextClean() != '\0') return new Result("invalid", null);
            command = (JSONObject) parsed;
        }
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
        Object expected = command.opt("expectedSetRevision");
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
            String sessionStatus;
            try (Cursor c = db.rawQuery("SELECT installation_id,revision,status,snapshot FROM sessions WHERE session_id=?",
                    new String[]{sessionId})) {
                if (!c.moveToFirst()) {
                    // The selected installation is checked before a stale session ID, as in the JS planner.
                    try (Cursor current = db.rawQuery("SELECT installation_id FROM sessions WHERE status IN ('active','paused') LIMIT 1", null)) {
                        if (current.moveToFirst() && !installationId.equals(current.getString(0)))
                            return new Result("wrong_installation", null);
                    }
                    return new Result("wrong_session", null);
                }
                if (!installationId.equals(c.getString(0))) return new Result("wrong_installation", null);
                sessionRevision = c.getInt(1);
                sessionStatus = c.getString(2);
                snapshotRaw = c.getString(3);
                // A retry of a committed command remains valid after the session closes.
            }
            try (Cursor c = db.rawQuery("SELECT fingerprint,result FROM receipts WHERE session_id=? AND command_id=?",
                    new String[]{sessionId, commandId})) {
                if (c.moveToFirst()) {
                    if (!fingerprint.equals(c.getString(0))) return new Result("command_id_conflict", null);
                    String receipt = c.getString(1);
                    return new Result("applied".equals(new JSONObject(receipt).optString("status")) ? "replay" : "replay_rejected", receipt);
                }
            }
            JSONObject snapshot = new JSONObject(snapshotRaw);
            if ("paused".equals(sessionStatus))
                return reject(db, sessionId, commandId, fingerprint, actionAt, "paused");
            if (!"active".equals(sessionStatus))
                return reject(db, sessionId, commandId, fingerprint, actionAt, "conflict");
            long actionMs = actionTime.toEpochMilli(), startedMs = timestamp(snapshot.getString("startedAt")).toEpochMilli();
            if (actionMs < startedMs - 5000 || actionMs > System.currentTimeMillis() + 30000)
                return reject(db, sessionId, commandId, fingerprint, actionAt, "time_needs_review");
            int setRevision;
            try (Cursor c = db.rawQuery("SELECT revision FROM set_revisions WHERE session_id=? AND entry_id=? AND set_id=?",
                    new String[]{sessionId, entryId, setId})) {
                if (!c.moveToFirst()) return reject(db, sessionId, commandId, fingerprint, actionAt, "target_changed");
                setRevision = c.getInt(0);
            }
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
                    || "skipped".equals(target.optString("status")))
                return reject(db, sessionId, commandId, fingerprint, actionAt, "target_changed");
            if (setRevision != expectedRevision) return reject(db, sessionId, commandId, fingerprint, actionAt, "revision_conflict");
            Object kg = target.opt("kg"), reps = target.opt("reps"), duration = target.opt("durationSec");
            boolean weighted = kg instanceof Number && Double.isFinite(((Number) kg).doubleValue())
                    && ((Number) kg).doubleValue() >= 0 && reps instanceof Number
                    && ((Number) reps).doubleValue() > 0 && ((Number) reps).doubleValue() == Math.rint(((Number) reps).doubleValue());
            boolean timed = duration instanceof Number && Double.isFinite(((Number) duration).doubleValue())
                    && ((Number) duration).doubleValue() > 0;
            if (!weighted && !timed) return reject(db, sessionId, commandId, fingerprint, actionAt, "incomplete_draft");
            Instant receivedTime = Instant.now();
            String receivedAt = UTC.format(receivedTime);
            String effectiveAt = UTC.format(actionTime.isAfter(receivedTime) ? receivedTime : actionTime);
            // Capture before mutating target, so the new set cannot count as its own prior commit.
            String effectContext = pendingContext(snapshot, target, entryId, effectiveAt, receivedAt).toString();
            target.put("at", effectiveAt);
            target.put("actionClockConfidence", "unverified");
            target.put("status", "committed");
            JSONObject receiptResult = new JSONObject().put("status", "applied").put("commandId", commandId)
                    .put("sessionId", sessionId).put("entryId", entryId).put("setId", setId)
                    .put("setRevision", setRevision + 1).put("sessionRevision", sessionRevision + 1)
                    .put("actionAt", actionAt).put("receivedAt", receivedAt)
                    .put("clockConfidence", "unverified")
                    .put("sideEffectsStatus", "not_implemented");
            String resultJson = receiptResult.toString();
            ContentValues session = new ContentValues();
            session.put("revision", sessionRevision + 1);
            session.put("snapshot", snapshot.toString());
            int updated = db.update("sessions", session,
                    "session_id=? AND installation_id=? AND status='active' AND revision=?",
                    new String[]{sessionId, installationId, Integer.toString(sessionRevision)});
            if (updated != 1) return reject(db, sessionId, commandId, fingerprint, actionAt, "conflict");
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
            insertPendingEffects(db, sessionId, commandId, setId, actionAt, effectContext);
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
