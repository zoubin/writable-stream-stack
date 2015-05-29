var fs = require('fs');
var vfs = require('vinyl-fs');
var path = require('path');
var Stack = require('..');
var source = require('vinyl-source-stream');

var DEST = path.join(__dirname, 'files');
var dest = createDestStream('b.js', DEST)

fs.createReadStream(path.join(__dirname, 'files/a.js'))
    .pipe(dest);

dest.on('done', function () {
    fs.createReadStream(path.join(DEST, 'b.js'))
        .pipe(process.stdout);
});

function createDestStream(filename, dir) {
    return Stack(
        source(filename),
        vfs.dest(dir)
    );
}
