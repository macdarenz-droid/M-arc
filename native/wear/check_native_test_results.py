#!/usr/bin/env python3
"""Fail CI unless both native suites actually ran and every case passed."""
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

REQUIRED = tuple('com.mrcdrnzz.dailytracker.wear.' + name for name in (
    'WorkoutCommandStoreTest', 'WorkoutHeartRecorderTest'))


def check_reports(directory):
    seen = {}
    for path in sorted(Path(directory).glob('TEST-*.xml')):
        root = ET.parse(path).getroot()
        for suite in root.iter('testsuite'):
            name = suite.get('name')
            if name not in REQUIRED:
                continue
            if name in seen:
                raise ValueError(f'Duplicate native suite: {name}')
            counts = {}
            for key in ('tests', 'failures', 'errors', 'skipped'):
                value = suite.get(key, '')
                if not value.isascii() or not value.isdecimal():
                    raise ValueError(f'{name}: invalid or missing {key} count')
                counts[key] = int(value)
            if counts['tests'] <= 0 or sum(counts[k] for k in ('failures', 'errors', 'skipped')) != 0:
                raise ValueError(f'{name}: expected tests>0 and failures+errors+skipped==0; found {counts}')
            cases = suite.findall('testcase')
            if len(cases) != counts['tests'] or any(c.get('classname') != name for c in cases):
                raise ValueError(f'{name}: test cases do not match reported class/count')
            if any(c.find(tag) is not None for c in cases for tag in ('failure', 'error', 'skipped')):
                raise ValueError(f'{name}: non-passing test case despite suite counters')
            seen[name] = counts['tests']
    missing = set(REQUIRED) - seen.keys()
    if missing:
        raise ValueError('Missing native suite reports: ' + ', '.join(sorted(missing)))
    return seen


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: check_native_test_results.py <test-results/testDebugUnitTest>')
    try:
        results = check_reports(sys.argv[1])
    except (OSError, ET.ParseError, ValueError) as error:
        raise SystemExit('::error::' + str(error))
    for name in REQUIRED:
        print(f'{name.rsplit(".", 1)[-1]}: {results[name]} passed (0 failures, 0 errors, 0 skipped)')
