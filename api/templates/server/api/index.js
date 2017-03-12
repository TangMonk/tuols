'use strict'
const glob = require('glob')
exports.register = function(server, options, next) {
  glob(`${__dirname}/**/*.js`, {ignore: `${__dirname}/**/index.js`}, (err, files) => {
    files.forEach(file => require(file)(server))
    next()
  })
}


exports.register.attributes = {
  name: 'api'
}
