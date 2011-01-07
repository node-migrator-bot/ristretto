(function() {
  var Ristretto, coffee, constants, fs, path;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  coffee = require('coffee-script');
  path = require('path');
  constants = require('constants');
  Ristretto = (function() {
    Ristretto.extensions = {
      '.js': function(fileName) {
        return fs.readFileSync(fileName, 'utf8');
      },
      '.coffee': function(fileName) {
        return coffee.compile(fs.readFileSync(fileName, 'utf8'));
      }
    };
    function Ristretto(options) {
      var _ref, _ref2, _ref3;
      if (options == null) {
        options = {};
      }
      this.main = (_ref = options.main) != null ? _ref : ((function() {
        throw new Error('No entry point specified');
      })());
      this.libraries = (_ref2 = options.libraries) != null ? _ref2 : {};
      this.raw = (_ref3 = options.raw) != null ? _ref3 : [];
      this.modules = {};
      this.add(path.join(process.cwd(), this.main), "./main");
    }
    Ristretto.prototype.load = function(fileName) {
      return Ristretto.extensions[path.extname(fileName)](fileName);
    };
    Ristretto.prototype.resolve = function(req, dir) {
      var failure, reqPath;
      failure = function() {
        throw new Error("Unknown module `" + req + "`");
      };
      reqPath = (function() {
        var _ref;
        switch (req.charAt(0)) {
          case '/':
            return req;
          case '.':
            return path.normalize(path.join(dir, req));
          default:
            return (_ref = this.libraries[req]) != null ? _ref : failure();
        }
      }).call(this);
      if ((path.existsSync(reqPath)) && (fs.statSync(reqPath)).isDirectory()) {
        try {
          return this.resolve(path.join(reqPath, 'index'), reqPath);
        } catch (e) {
          return failure();
        }
      } else {
        if (path.existsSync(reqPath)) {
          return reqPath;
        }
        if (path.existsSync(reqPath + '.js')) {
          return reqPath + '.js';
        }
        if (path.existsSync(reqPath + '.coffee')) {
          return reqPath + '.coffee';
        }
        return failure();
      }
    };
    Ristretto.prototype.add = function(fileName, moduleName) {
      var module, parent;
      if (fileName in this.modules) {
        return this.modules[fileName];
      }
      module = this.modules[fileName] = {
        hash: moduleName + ' [' + (Object.keys(this.modules)).length + ']',
        children: [],
        parents: [],
        rank: 0
      };
      module.body = this.load(fileName).replace(/require\(('|")(.*?)\1\)/g, __bind(function(_, _, req) {
        var dep;
        dep = this.add(this.resolve(req, path.dirname(fileName)), req);
        dep.children.push(module);
        module.parents.push(dep);
        return "require('" + dep.hash + "')";
      }, this));
      if (module.parents.length) {
        module.rank = 1 + Math.max.apply({}, (function() {
          var _i, _len, _ref, _results;
          _ref = module.parents;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            parent = _ref[_i];
            _results.push(parent.rank);
          }
          return _results;
        })());
      }
      return module;
    };
    Ristretto.prototype.bundle = function() {
      var fileName, module;
      return [
        ((function() {
          var _i, _len, _ref, _results;
          _ref = this.raw;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            fileName = _ref[_i];
            _results.push(this.load(fileName));
          }
          return _results;
        }).call(this)).join(';\n'), ";var _ristretto={\n  modules:{},\n  require:function(id){return _ristretto.modules[id].exports}\n};", ((function() {
          var _i, _len, _ref, _results;
          _ref = ((function() {
            var _ref, _results;
            _ref = this.modules;
            _results = [];
            for (fileName in _ref) {
              module = _ref[fileName];
              _results.push(module);
            }
            return _results;
          }).call(this)).sort(function(a, b) {
            return a.rank - b.rank;
          });
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            module = _ref[_i];
            _results.push("//" + module.hash + "\n;(function(require, module, exports){\n" + module.body + "\n})(_ristretto.require, _ristretto.modules[\"" + module.hash + "\"] = {exports:{}}, _ristretto.modules[\"" + module.hash + "\"].exports);");
          }
          return _results;
        }).call(this)).join('\n')
      ].join('\n');
    };
    return Ristretto;
  })();
  exports.bundle = function(options) {
    var ast, output, parser, uglify, _ref;
    output = (new Ristretto(options)).bundle();
    if (options.minify != null) {
      _ref = require('uglify'), uglify = _ref.uglify, parser = _ref.parser;
      ast = parser.parse(output);
      ast = uglify.ast_mangle(ast);
      ast = uglify.ast_squeeze(ast);
      output = uglify.gen_code(ast);
    }
    if (options.copyright != null) {
      output = "/*\n" + options.copyright + "\n*/\n" + output;
    }
    if (options.target != null) {
      return fs.writeFileSync(options.target, output);
    } else {
      return output;
    }
  };
}).call(this);
