// storage stops answering after start-up; user keeps tapping
PH = Phone();
openApp(); advance(5000);
var k = ST.n; ST.mode = function (op, key, n) { return n > k ? 'hang' : 'ok'; };
tap('onComplete');
for (var i = 0; i < 30; i++) { advance(2000); tap('onAdd'); }
advance(60000);
print('storage calls issued while another was unanswered:', ST.overlap, '| unanswered native calls now:', ST.inflight, '| st', J(PAGE.st), '| can', PAGE.can);
print('first calls after hang:', ST.log.slice(k, k + 6).join(' | '));
print('ESC', J(ESC), 'bad', ST.bad.length);
