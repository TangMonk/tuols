const secret = require('../../config').get('/secret')
const models = require('../models')
const moment = require('moment')

const register = function register (server, options, next) {

  const validateFunc = async (decoded, request, callback) => {
    let {userId, expire} = decoded
    let user = await models.admins.findOne({where: {id: userId}})
    if(!user){
      return callback('cannot found user', false)
    }

    if(moment(expire, 'YYYY-MM-DD HH:mm').isBefore(moment())){
      return callback('expired token', false)
    }

    return callback(null, true, user)
  }

  server.auth.strategy('admin', 'jwt',
    {
      key: secret,
      validateFunc: validateFunc,
      headerKey: 'token'
    })

  next()
}

register.attributes = {
  name: 'admin',
}

module.exports = register
