var test = require('tape');
var Readable = require('stream').Readable;
var stack = require('..');
var concat = require('concat-stream');
var thr = require('through2');

test('Dest', function(t) {
    t.plan(1);
    var rs = Readable();
    rs.pipe(stack(concat(function (body) {
        t.equal(
            body.toString('utf8').replace(/\s+/g, ''),
            'helloworld'
        )
    })));
    rs.push(Buffer('hello'));
    rs.push(Buffer('world'));
    rs.push(null);
});

test('Dest Object Mode', function(t) {
    t.plan(1);
    var rs = Readable({ objectMode: true });
    var trs = stack(concat(function (body) {
        t.equal(
            body.toString('utf8').replace(/\s+/g, ''),
            'HELLOWORLD'
        )
    }));
    trs.push(thr.obj(function (buf, enc, next) {
        next(null, Buffer(buf.toUpperCase()));
    }));
    rs.pipe(trs);
    rs.push('hello');
    rs.push('world');
    rs.push(null);
});

