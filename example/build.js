/*
©2011 Your Name-Here
*/
function WORLD(){return"outside world"}var _ristretto={modules:{},require:function(a){return _ristretto.modules[a].exports}};(function(a,b,c){c.debug=console.debug,c.log=console.log,c.puts=console.log,c.error=console.error})(_ristretto.require,_ristretto.modules["util [3]"]={exports:{}},_ristretto.modules["util [3]"].exports),function(a,b,c){(function(){var b;b=a("util [3]"),b.puts("got `!`"),c.bang="!"}).call(this)}(_ristretto.require,_ristretto.modules["./bang [2]"]={exports:{}},_ristretto.modules["./bang [2]"].exports),function(a,b,c){var d=a("./bang [2]").bang;if(typeof WORLD=="undefined")var e="inside world";else var e=WORLD();c.message="hello "+e+" "+d}(_ristretto.require,_ristretto.modules["./message [1]"]={exports:{}},_ristretto.modules["./message [1]"].exports),function(a,b,c){(function(){var b,c;b=a("./message [1]").message,c=a("util [3]"),c.puts(b)}).call(this)}(_ristretto.require,_ristretto.modules["./main [0]"]={exports:{}},_ristretto.modules["./main [0]"].exports)