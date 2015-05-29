# writable-stream-stack
Make a node stream pipeline. New transforms can be pushed to apply before the data reaches the dest stream

## Usage

```javascript
var Stack = require('writable-stream-stack');
```

### ws = Stack(dest)
### ws = Stack(tr1, tr2,..., dest)
### ws = Stack([tr1, tr2,..., dest])
`ws` is a `Writable` stream, and each chunk written in will reach the writable `dest`, before handled by the transform pipeline `tr1, tr2,...`

### ws.on('done', cb)
`ws` fires `done` after `dest` has finished.

### ws.push(tr)
Add transform `tr` to the very beginning of the pipeline.

### ws.pop()
Delete the first transform from the pipeline.

## Example

```javascript
var fs = require('fs');
var vfs = require('vinyl-fs');
var path = require('path');
var Stack = require('writable-stream-stack');
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
```

a.js:

```javascript
module.exports = function () {
    console.log('a');
};
```

output:

```
module.exports = function () {
    console.log('a');
};
```
