var arrayify = require('arrayify-slice');
var Writable = require('readable-stream').Writable;
var util = require('util');
var inherits = util.inherits;
inherits(Stack, Writable);

module.exports = Stack;

function Stack(streams) {
    if (!Array.isArray(streams)) {
        streams = arrayify(arguments);
    }

    if (!(this instanceof Stack)) {
        return new Stack(streams);
    }
    Writable.call(this, { objectMode: true });

    var dest = streams.pop();
    this._streams = [dest];
    dest.once('finish', this.emit.bind(this, 'done'));

    this.once('finish', function () {
        if (this._streams[0]) {
            this._streams[0].end();
        }
    });

    this.length = 1;

    streams.forEach(this.push.bind(this));
}

Stack.prototype.push = function(stream) {
    stream.pipe(this._streams[0]);
    this._streams.unshift(stream);

    var self = this;
    var errcb = function (err) {
        err.stream = this;
        self.emit('error', err);
    };
    stream.on('error', errcb);
    stream.once('_popped', function () {
        this.removeListener('error', errcb);
    });

    this.length++;
    return this.length;
};

Stack.prototype._write = function(buf, enc, cb) {
    this._streams[0]._write(buf, enc, cb);
};

Stack.prototype.pop = function() {
    if (this.length === 1) {
        return;
    }
    this.length--;
    var target = this._streams.pop();
    target.unpipe(this._streams[0]);
    target.emit('_popped');
    return target;
};

