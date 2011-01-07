function WORLD(){
  return 'outside world';
}
;var _ristretto={
  modules:{},
  require:function(id){return _ristretto.modules[id].exports}
};
//util [3]
;(function(require, module, exports){
exports.debug   = console.debug
exports.log     = console.log
exports.puts    = console.log
exports.error   = console.error
})(_ristretto.require, _ristretto.modules["util [3]"] = {exports:{}}, _ristretto.modules["util [3]"].exports);
//./bang [2]
;(function(require, module, exports){
(function() {
  var util;
  util = require('util [3]');
  util.puts('got `!`');
  exports.bang = '!';
}).call(this);

})(_ristretto.require, _ristretto.modules["./bang [2]"] = {exports:{}}, _ristretto.modules["./bang [2]"].exports);
//./message [1]
;(function(require, module, exports){
var bang = require('./bang [2]').bang;

if (typeof WORLD == 'undefined'){
  var world = 'inside world';
} else {
  var world = WORLD();
}
exports.message = "hello "+world+" "+bang;
})(_ristretto.require, _ristretto.modules["./message [1]"] = {exports:{}}, _ristretto.modules["./message [1]"].exports);
//./main [0]
;(function(require, module, exports){
(function() {
  var message, util;
  message = require('./message [1]').message;
  util = require('util [3]');
  util.puts(message);
}).call(this);

})(_ristretto.require, _ristretto.modules["./main [0]"] = {exports:{}}, _ristretto.modules["./main [0]"].exports);