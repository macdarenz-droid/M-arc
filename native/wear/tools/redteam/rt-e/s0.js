PH = Phone();
openApp(); advance(5000);
print('l1', PAGE.l1, '| l2', PAGE.l2, '| st', PAGE.st, '| can', PAGE.can, '| p1', PAGE.p1);
tap('onComplete'); advance(3000);
print('after complete st', PAGE.st, 'applied', PH.applied, 'l1', PAGE.l1);
tap('onAdd'); advance(3000); print('after +30 st', PAGE.st, 'applied', PH.applied);
advance(40000);
print('log', ST.log.join(' | '));
print('ESC', J(ESC), 'bad', J(ST.bad), 'maxIn', ST.maxIn, 'overlap', ST.overlap, 'sent', SENT.length, 'keep', J(KEEP));
