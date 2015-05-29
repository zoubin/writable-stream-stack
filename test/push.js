var test = require('tape');
var Readable = require('stream').Readable;
var stack = require('..');
var concat = require('concat-stream');
var thr = require('through2');

test('push', function(t) {
    t.plan(1);
    var rs = Readable();
    var trs = stack(concat(function (body) {
        t.equal(
            body.toString('utf8').replace(/\s+/g, ''),
            'HELLOWORLD'
        )
    }));
    trs.push(thr(function (buf, enc, next) {
        next(null, Buffer(buf.toString('utf8').toUpperCase()));
    }));
    rs.pipe(trs);
    rs.push(Buffer('hello'));
    rs.push(Buffer('world'));
    rs.push(null);
});

