var test = require('tape');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var stack = require('..');
var thr = require('through2');

test('Event done', function(t) {
    t.plan(1);
    var rs = Readable({ objectMode: true });
    var ws = Writable();
    var buffer = [];
    ws._write = function (buf, enc, next) {
        setTimeout(function() {
            buffer.push(buf);
            next();
        }, 10);
    };
    var dest = stack(ws);
    dest.push(thr.obj(function (buf, enc, next) {
        setTimeout(function() {
            next(null, Buffer(buf.toUpperCase()));
        }, 10);
    }));
    rs.pipe(dest);
    rs.push('hello');
    rs.push('world');
    rs.push(null);
    dest.on('done', function () {
        t.equal(
            Buffer.concat(buffer).toString('utf8').replace(/\s+/g, ''),
            'HELLOWORLD'
        )
    });
});


