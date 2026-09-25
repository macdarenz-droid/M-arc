"""Exercise the exact DDL embedded in WorkoutCommandStore against SQLite."""
import re
import sqlite3
import tempfile
import unittest
from pathlib import Path


SOURCE = Path(__file__).with_name("WorkoutCommandStore.java").read_text()


def schema(connection):
    connection.execute("PRAGMA foreign_keys=ON")
    for name in ("CREATE_SESSIONS", "CREATE_RECEIPTS", "ONE_ACTIVE_SESSION", "CREATE_SET_REVISIONS", "CREATE_HANDOVERS", "ONE_NATIVE_OWNER", "CREATE_HEART_CAPTURE", "CREATE_HEART_SAMPLES"):
        match = re.search(rf'static final String {name} = "([^"\\]*)";', SOURCE)
        assert match, f"missing executable {name} DDL"
        connection.execute(match.group(1))


class WorkoutStoreTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.path = str(Path(self.folder.name) / "workout.db")
        self.db = sqlite3.connect(self.path)
        schema(self.db)
        self.db.execute("INSERT INTO sessions VALUES (?,?,?,?,?)", ("s-1", "watch-1", 0, "active", '{"id":"s-1"}'))
        self.db.execute("INSERT INTO set_revisions VALUES (?,?,?,?)", ("s-1", "e-1", "set-1", 0))
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.folder.cleanup()

    def test_one_active_session_and_existing_ids(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO sessions VALUES (?,?,?,?,?)", ("s-2", "watch-2", 0, "active", "{}"))
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO receipts VALUES (?,?,?,?)", ("unknown", "c", "fp", "{}"))
        self.db.rollback()

    def test_crash_before_commit_rolls_back_snapshot_and_receipt(self):
        try:
            self.db.execute("BEGIN")
            self.db.execute("UPDATE sessions SET snapshot=?, revision=1 WHERE session_id='s-1'", ('{"id":"s-1","set":"done"}',))
            self.db.execute("UPDATE set_revisions SET revision=1 WHERE session_id='s-1' AND set_id='set-1'")
            self.db.execute("INSERT INTO receipts VALUES (?,?,?,?)", ("s-1", "c-1", "fp", '{"status":"applied"}'))
            raise RuntimeError("simulated crash before transaction commit")
        except RuntimeError:
            self.db.rollback()
        self.assertEqual(self.db.execute("SELECT revision,snapshot FROM sessions").fetchone(), (0, '{"id":"s-1"}'))
        self.assertEqual(self.db.execute("SELECT count(*) FROM receipts").fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT revision FROM set_revisions").fetchone()[0], 0)

    def test_committed_receipt_survives_reopen_and_command_id_cannot_duplicate(self):
        self.db.execute("BEGIN")
        self.db.execute("UPDATE sessions SET snapshot=?, revision=1 WHERE session_id='s-1'", ('{"id":"s-1","set":"done"}',))
        self.db.execute("UPDATE set_revisions SET revision=1 WHERE session_id='s-1' AND set_id='set-1'")
        self.db.execute("INSERT INTO receipts VALUES (?,?,?,?)", ("s-1", "c-1", "fp", '{"status":"applied"}'))
        self.db.commit()
        self.db.close()
        self.db = sqlite3.connect(self.path)
        self.assertEqual(self.db.execute("SELECT result FROM receipts WHERE session_id=? AND command_id=?", ("s-1", "c-1")).fetchone()[0], '{"status":"applied"}')
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO receipts VALUES (?,?,?,?)", ("s-1", "c-1", "changed", "{}"))
        self.db.rollback()
        self.assertEqual(self.db.execute("SELECT revision FROM sessions").fetchone()[0], 1)
        self.assertEqual(self.db.execute("SELECT revision FROM set_revisions").fetchone()[0], 1)

    def test_unrelated_set_keeps_its_revision_and_closed_session_keeps_receipt(self):
        self.db.execute("INSERT INTO set_revisions VALUES (?,?,?,?)", ("s-1", "e-1", "set-2", 0))
        self.db.execute("UPDATE set_revisions SET revision=1 WHERE session_id='s-1' AND set_id='set-1'")
        self.db.execute("UPDATE sessions SET status='finished' WHERE session_id='s-1'")
        self.db.execute("INSERT INTO receipts VALUES (?,?,?,?)", ("s-1", "c-1", "fp", '{"status":"applied"}'))
        self.db.commit()
        self.assertEqual(self.db.execute("SELECT revision FROM set_revisions WHERE set_id='set-2'").fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT result FROM receipts WHERE command_id='c-1'").fetchone()[0], '{"status":"applied"}')

    def test_native_owner_requires_a_seed_and_is_unique_even_after_finish(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-bad", "native", "missing", "watch-1", "{}", "{}"))
        self.db.rollback()
        self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-1", "native", "s-1", "watch-1", "{}", "{}"))
        self.db.execute("UPDATE sessions SET status='finished' WHERE session_id='s-1'")
        self.db.execute("INSERT INTO sessions VALUES (?,?,?,?,?)", ("s-2", "watch-2", 0, "active", "{}"))
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-2", "native", "s-2", "watch-2", "{}", "{}"))
        self.db.rollback()

    def test_cancellation_id_cannot_be_inserted_again_as_native(self):
        self.db.execute("INSERT INTO workout_handovers(handover_id,status) VALUES ('h-1','cancelled')")
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-1", "native", "s-1", "watch-1", "{}", "{}"))
        self.db.rollback()

    def test_heart_identity_is_scoped_to_handover_source_and_boot(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO heart_capture(handover_id) VALUES ('missing')")
        self.db.rollback()
        self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-1", "native", "s-1", "watch-1", "{}", "{}"))
        self.db.execute("INSERT INTO heart_capture(handover_id) VALUES ('h-1')")
        sample = ("h-1", "ble", "ble-1", "boot-7", "boot", 1, 100000, 1000, 128, 1)
        self.db.execute("INSERT INTO heart_samples VALUES (?,?,?,?,?,?,?,?,?,?)", sample)
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO heart_samples VALUES (?,?,?,?,?,?,?,?,?,?)", sample)
        self.db.rollback()
        self.db.execute("INSERT INTO heart_samples VALUES (?,?,?,?,?,?,?,?,?,?)", (*sample[:2], "ble-2", *sample[3:]))
        self.db.execute("INSERT INTO heart_samples VALUES (?,?,?,?,?,?,?,?,?,?)", (*sample[:3], "boot-8", *sample[4:]))
        self.db.commit()
        self.db.close()
        self.db = sqlite3.connect(self.path)
        self.assertEqual(self.db.execute("SELECT count(*) FROM heart_samples").fetchone()[0], 3)

    def test_capture_counters_and_sample_insert_roll_back_together(self):
        self.db.execute("INSERT INTO workout_handovers VALUES (?,?,?,?,?,?)", ("h-1", "native", "s-1", "watch-1", "{}", "{}"))
        self.db.execute("INSERT INTO heart_capture(handover_id) VALUES ('h-1')")
        self.db.commit()
        self.db.execute("BEGIN")
        self.db.execute("INSERT INTO heart_samples VALUES ('h-1','ble','ble-1','boot-7','boot',1,100000,1000,0,0)")
        self.db.execute("UPDATE heart_capture SET retained_count=1,dropped_count=2 WHERE handover_id='h-1'")
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("UPDATE heart_capture SET retained_count=14401 WHERE handover_id='h-1'")
        self.db.rollback()
        self.assertEqual(self.db.execute("SELECT count(*) FROM heart_samples").fetchone()[0], 0)
        self.assertEqual(self.db.execute("SELECT retained_count,dropped_count FROM heart_capture").fetchone(), (0, 0))


if __name__ == "__main__":
    unittest.main()
