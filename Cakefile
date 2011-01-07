fs     = require 'fs'
coffee = require 'coffee-script'

task 'build', 'build ristretto', (options) ->
  fs.writeFileSync 'lib/ristretto.js', coffee.compile(fs.readFileSync('src/ristretto.coffee', 'utf8'))