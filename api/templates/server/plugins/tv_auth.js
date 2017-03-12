const basic = require('hapi-auth-basic')

const validate = function (request, username, password, callback) {

  if (!username !== 'admin' && password !== 'w2ySlotkFTY4ThnItyCH65Q') {
    return callback(null, false)
  }else{
    return callback(null, true, {login: true})
  }
}

const register = function register (server, options, next) {
  server.register(basic)

  server.auth.strategy('tv_auth', 'basic', { validateFunc: validate })

  next()
}

register.attributes = {
  name: 'tv_auth',
}

module.exports = register
