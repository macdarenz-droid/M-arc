"""Exercise the report gate with real JUnit XML files, including falsely green output."""
from pathlib import Path
import subprocess
import tempfile
import unittest

CHECK = Path(__file__).with_name('check_native_test_results.py')
CLASSES = ('WorkoutCommandStoreTest', 'WorkoutHeartRecorderTest')
PREFIX = 'com.mrcdrnzz.dailytracker.wear.'

class NativeTestReports(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in CLASSES:
            self.report(name)

    def report(self, name, tests='1', failures='0', errors='0', skipped='0', body=None):
        if body is None:
            body = f'<testcase classname="{PREFIX}{name}" name="aRealTest" />'
        (self.root / f'TEST-{name}.xml').write_text(
            f'<testsuite name="{PREFIX}{name}" tests="{tests}" failures="{failures}" errors="{errors}" skipped="{skipped}">{body}</testsuite>')

    def run_gate(self):
        return subprocess.run(['python3', str(CHECK), str(self.root)], capture_output=True, text=True)

    def test_both_classes_with_actual_passing_cases_are_required(self):
        result = self.run_gate()
        self.assertEqual(0, result.returncode, result.stderr)
        for name in CLASSES:
            self.assertIn(name + ': 1 passed', result.stdout)

    def test_missing_and_empty_reports_fail(self):
        for path in self.root.glob('*.xml'):
            path.unlink()
            self.assertNotEqual(0, self.run_gate().returncode)

    def test_each_zero_failed_errored_or_skipped_suite_fails(self):
        for name in CLASSES:
            for attr in ('tests', 'failures', 'errors', 'skipped'):
                with self.subTest(name=name, attr=attr):
                    self.report(name, **{attr: '0' if attr == 'tests' else '1'})
                    self.assertNotEqual(0, self.run_gate().returncode)
                    self.report(name)

    def test_case_level_failures_cannot_hide_behind_green_counters(self):
        for tag in ('failure', 'error', 'skipped'):
            with self.subTest(tag=tag):
                self.report(CLASSES[0], body=f'<testcase classname="{PREFIX}{CLASSES[0]}" name="bad"><{tag} /></testcase>')
                self.assertNotEqual(0, self.run_gate().returncode)

    def test_no_cases_wrong_class_or_counter_mismatch_fails(self):
        for body in ('', '<testcase classname="OtherTest" name="other" />'):
            self.report(CLASSES[0], body=body)
            self.assertNotEqual(0, self.run_gate().returncode)
        self.report(CLASSES[0], tests='2')
        self.assertNotEqual(0, self.run_gate().returncode)

    def test_malformed_negative_or_duplicate_reports_fail(self):
        self.report(CLASSES[0], failures='-1')
        self.assertNotEqual(0, self.run_gate().returncode)
        self.report(CLASSES[0], tests='nan')
        self.assertNotEqual(0, self.run_gate().returncode)
        self.report(CLASSES[0])
        other = self.root / 'TEST-duplicate.xml'
        other.write_text((self.root / f'TEST-{CLASSES[0]}.xml').read_text())
        self.assertNotEqual(0, self.run_gate().returncode)
        other.write_text('<malformed')
        self.assertNotEqual(0, self.run_gate().returncode)

if __name__ == '__main__':
    unittest.main()
