fs        = require 'fs'
coffee    = require 'coffee-script'
path      = require 'path'
constants = require 'constants'

class Ristretto
  class @UnknownModule extends Error
    constructor: (@req, @fileName) ->
      @message = "Cannot find module `#{@req}` required in file `#{path.basename(@fileName)}`"
    
  @extensions  :
    '.js'      : (fileName) -> fs.readFileSync fileName, 'utf8'
    '.coffee'  : (fileName) -> coffee.compile(fs.readFileSync fileName, 'utf8')
  
  constructor  : (options={}) ->
    @main      = options.main      ? (throw new Error 'No entry point specified')
    @libraries = options.libraries ? {}
    @raw       = options.raw       ? []
    @modules   = {}

    @add path.join(process.cwd(), @main), "./main"
  
  load         : (fileName) -> 
    Ristretto.extensions[path.extname fileName] fileName
  
  resolve      : (req, dir) ->
    failure = -> (throw new Error('foo'))
    
    reqPath = switch req.charAt 0
      when '/' then req
      when '.' then path.normalize(path.join dir, req)
      else @libraries[req] ? failure()

    if (path.existsSync reqPath) and (fs.statSync reqPath).isDirectory()
      try @resolve(path.join(reqPath, 'index'), reqPath) catch e then failure()
    else
      return reqPath           if path.existsSync reqPath
      return reqPath+'.js'     if path.existsSync reqPath+'.js'
      return reqPath+'.coffee' if path.existsSync reqPath+'.coffee' 
      failure()
  
  add          : (fileName, moduleName) ->
    return @modules[fileName] if fileName of @modules
    
    module = @modules[fileName] = 
      hash     : moduleName+' ['+(Object.keys @modules).length+']'
      children : []
      parents  : []
      rank     : 0
    
    module.body = @load(fileName).replace /require\(('|")(.*?)\1\)/g, (_, _, req, pos, contents) =>
      depName = try @resolve(req, path.dirname(fileName)) catch e then throw new Ristretto.UnknownModule req, fileName
      
      dep = @add(@resolve(req, path.dirname(fileName)), req)
      dep.children.push module
      module.parents.push dep
      "require('#{dep.hash}')"
    module.rank = 1 + Math.max.apply({}, (parent.rank for parent in module.parents)) if module.parents.length
    
    return module
    
  bundle       : ->
    [
      (@load fileName for fileName in @raw).join(';\n'),
      """
        ;var _ristretto={
          modules:{},
          require:function(id){return _ristretto.modules[id].exports}
        };
      """,
      ("""
        //#{module.hash}
        ;(function(require, module, exports){
        #{module.body}
        })(_ristretto.require, _ristretto.modules["#{module.hash}"] = {exports:{}}, _ristretto.modules["#{module.hash}"].exports);
      """ for module in (module for fileName, module of @modules).sort((a,b) -> a.rank - b.rank)).join('\n')
    ].join('\n')

exports.bundle = (options) -> 
  output = (new Ristretto options).bundle()
    
  if options.minify?
    {uglify, parser} = require 'uglify-js'
    ast = parser.parse output
    ast = uglify.ast_mangle ast
    ast = uglify.ast_squeeze ast
    output = uglify.gen_code ast
  
  if options.copyright?
    output = """
    /*
    #{options.copyright}
    */
    #{output}
    """
  if options.target? then fs.writeFileSync options.target, output
  else return output