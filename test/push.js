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

test('stack order', function(t) {
    t.plan(4);
    var rs = Readable({ objectMode: true });
    var order = 0;
    var trs = stack(
        thr(function (buf, enc, next) {
            t.equal(++order, 2);
            next(null, buf);
        }),
        thr(function (buf, enc, next) {
            t.equal(++order, 3);
            next(null, buf);
        }),
        concat(function (body) {
            t.equal(
                body.toString('utf8'),
                'HELLO'
            )
        })
    );
    trs.push(thr(function (buf, enc, next) {
        t.equal(++order, 1);
        next(null, Buffer(buf.toString('utf8').toUpperCase()));
    }));
    rs.pipe(trs);
    rs.push('hello');
    rs.push(null);
});

