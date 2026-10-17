// R1 on the compiled page with the framework model: a phone that starts a rest after each set and keeps it after it ends
NOLOG = true;
PH = Phone(); openApp(); advance(5000);
print('R1 open: sc', PAGE.sc, 'reach', reach());
PH.rest = false; deliver(PH.snap(null), 1); advance(1000);
print('R1 no rest: sc', PAGE.sc, 'reach', reach());
PH.rest = true; tap('onComplete'); advance(3000);
print('R1 after Complete, rest from the phone: sc', PAGE.sc, 'rc', PAGE.rc, 'reach', reach(), 'applied', PH.applied);
advance(120000); deliver(PH.snap(null).replace('"left":90000', '"left":0'), 1); advance(1000);
print('R1 rest over (phone keeps it, left 0): sc', PAGE.sc, 'rc', PAGE.rc, 'reach', reach());
PH.on = false; advance(40000);
print('R1 phone gone: sc', PAGE.sc, 'off', PAGE.off, 'reach', reach());
tap('onSkip'); advance(3000);
print('R1 offline Skip: sc', PAGE.sc, 'na', PAGE.na, 'reach', reach());
