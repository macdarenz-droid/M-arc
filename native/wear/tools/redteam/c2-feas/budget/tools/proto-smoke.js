PH = Phone();
openApp(); advance(5000);
print('s2', PAGE.s2, '| clk', PAGE.clk, '| ex', PAGE.ex, '| lab', PAGE.lab, '| tgt', PAGE.tgt, '| e1 e2 e3', PAGE.e1, PAGE.e2, PAGE.e3, '| cb', PAGE.cb);
tap('onIdeal'); print('after Ideal e2', PAGE.e2);
tap('onComplete'); advance(3000);
print('after complete s2', PAGE.s2, 's3', PAGE.s3, 'rest', PAGE.rest, 'nx', PAGE.nx, 'st', PAGE.st, 'applied', PH.applied);
print('ESC', J(ESC));
