Ristretto
=========

A simple dependency management and javascript concatenation library.

Install
-------

    npm install ristretto

Usage
-----

Ristretto `exports` only one method, namely `bundle`. Its options are passed as
an object with the following keys.

All keys but `main` are optional

 * `main`       : the main file to compile, all dependencies will be resolved and
                  bundled in the right order after being wrapped in a fake
                  CommonJS environment.
 * `target`     : javascript output file, if undefined, the function call returns
                  the output.
 * `raw`        : additionnal files to include without any wrapping/processing.
                  This can be useful to include libraries such as web frameworks
                  which are not CommonJS compatible. Those files are added in
                  order.
 * `minify`     : if set to `true`, will run the concatenated output through 
                  [uglify](https://github.com/mishoo/UglifyJS)
 * `libraries`  : a module-filename mapping for absolute requires, e.g. `util` 
                  which does not make sense in a browser context.
 * `copyright`  : a comment to be added to the top of the output file.

Example
-------

    ristretto = require 'ristretto'
    ristretto.bundle
      target    : 'target.js'
      main      : 'app.coffee'
      raw       : ['globals.js', 'jquery.min.js', 'etc.js']
      minify    : true
      libraries :
        util : 'libraries/util.js'
        foo  : process.ENV['HOME']+'/.node_libraries/foo'
      copyright : """
        ©2011 Your Name-Here
      """

License
-------
Copyright 2011 by Adrien Friggeri. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.