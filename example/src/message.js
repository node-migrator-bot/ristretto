var bang = require('./bang').bang;

if (typeof WORLD == 'undefined'){
  var world = 'inside world';
} else {
  var world = WORLD();
}
exports.message = "hello "+world+" "+bang;