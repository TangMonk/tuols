const models = require('../models')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const moment = require('moment')
const bcrypt = require('bcrypt')
const config = require('../../config')

// admin, 123 =>
const login = async (request, reply) => {
  let user = await models.admins.findOne({where: {phone: request.payload.phone}})
  if(!user) {
    return reply({message: '用户不存在'}).code(400)
  }
  bcrypt.compare(request.payload.password, user.password_hash, (error, res) => {
    if(error) { return reply({message: '密码错误'}).code(400) }
    if(res === false) { return reply({message: '密码错误'}).code(400) }
    let token = jwt.sign({
      userId: user.id,
      expire: moment().add(30, 'days').format('YYYY-MM-DD HH:mm')
    }, config.get('/secret'))

    reply({token: token, user: user})
  })
}

const create = async (request, reply) => {
  let user = await models.admins.findOne({where: {phone: request.payload.phone}})
  if(user) {
    return reply({message: '用户已经存在'}).code(400)
  }
  let salt = bcrypt.genSaltSync()
  let password_hash = bcrypt.hashSync(request.payload.password, salt)
  user = await models.admins.create({phone: request.payload.phone, password_hash: password_hash})

  let token = jwt.sign({
    userId: user.id,
    expire: moment().add(30, 'days').format('YYYY-MM-DD HH:mm')
  }, config.get('/secret'))

  reply({token: token, user: user})
}

function token(request, reply) {
  reply(request.auth.credentials)
}

module.exports = (server) => {
  server.route({
    method: 'POST',
    path: '/admin/login',
    config: {
      tags: ['api', 'admin'],
      validate: {
        payload: {
          phone: Joi.string().required(),
          password: Joi.string().required(),
        }
      }
    },
    handler: login
  })

  server.route({
    method: 'GET',
    path: '/admin/token',
    config: {
      tags: ['api', 'admin'],
      auth: 'admin'
    },
    handler: token
  })

  server.route({
    method: 'POST',
    path: '/admin',
    config: {
      tags: ['api', 'admin'],
      validate: {
        payload: {
          phone: Joi.string().required(),
          password: Joi.string().required(),
        }
      }
    },
    handler: create
  })
}
