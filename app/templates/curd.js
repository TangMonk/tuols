const models = require('../../models')
const Joi = require('joi')

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/admin/<%= name %>s',
    config: {
      tags: ['api', '<%= name %>', 'admin'],
      auth: 'admin',
      validate: {
        query: {
          where: Joi.string().optional(),
          order: Joi.string().optional(),
          pageSize: Joi.number().optional().default(20),
          page: Joi.number().optional().default(1),
          include: Joi.string().optional()
        }
      }
    },
    handler: getList
  })

  server.route({
    method: 'GET',
    path: '/admin/<%= name %>s/{id}',
    config: {
      auth: 'admin',
      tags: ['api', '<%= name %>', 'admin'],
      validate: {
        params: {
          id: Joi.string().optional()
        }
      }
    },
    handler: get
  })

  server.route({
    method: 'POST',
    path: '/admin/<%= name %>s',
    config: {
      auth: 'admin',
      tags: ['api', '<%= name %>', 'admin'],
      validate: {
        payload: {
          <%_ attributes.forEach(attribute => { _%>
          <%= `${attribute[0]}: Joi.${attribute[1]}` %>
          <%_})_%>
        }
      }
    },
    handler: create
  })

  server.route({
    method: 'DELETE',
    path: '/admin/<%= name %>s/{id}',
    config: {
      auth: 'admin',
      tags: ['api', '<%= name %>', 'admin'],
      validate: {
        params: {
          id: Joi.number().required()
        }
      }
    },
    handler: Delete
  })

  server.route({
    method: 'PUT',
    path: '/admin/<%= name %>s/{id}',
    config: {
      tags: ['api', '<%= name %>', 'admin'],
      auth: 'admin',
      validate: {
        params: {
          id: Joi.number().integer().required()
        },
        payload: {
          <%_ attributes.forEach(attribute => { _%>
          <%= `${attribute[0]}: Joi.${attribute[1]}` %>
          <%_})_%>
        }
      }
    },
    handler: update
  })
}


async function getList(request, reply){
  const query_payload = {}
  if(request.query.where){
    query_payload.where = JSON.parse(request.query.where)
  }
  if(request.query.order){
    query_payload.order = JSON.parse(request.query.order)
  }
  if(request.query.pageSize){
    query_payload.limit = request.query.pageSize
  }
  if(request.query.page){
    query_payload.offset = request.query.pageSize * (request.query.page - 1)
  }
  if(request.query.include){
    query_payload.include = JSON.parse(request.query.include)
  }

  if(!query_payload.order){
    query_payload.order = [['createdAt', 'DESC']]
  }

  const data = await models.<%= name %>s.findAll(query_payload)
  delete query_payload.limit
  delete query_payload.offset
  const total = await models.<%= name %>s.count(query_payload)
  reply({data, page: {total: , current: request.query.page, pageSize: request.query.pageSize}})
}

async function get(request, reply) {
  const data = await models.<%= name %>s.findById(request.params.id)
  reply(data)
}

async function create(request, reply){
  if(request.payload.password_hash){
    const bcrypt = require('bcrypt')
    const salt = bcrypt.genSaltSync()
    request.payload.password_hash = bcrypt.hashSync(request.payload.password_hash, salt)
  }
  try{
    const data = await models.<%= name %>s.create(request.payload)
    reply(data)
  }catch(error){
    reply(error)
  }
}

async function Delete(request, reply){
  const data = await models.<%= name %>s.destroy({where: {id: request.params.id}})
  reply(data)
}

async function update(request, reply){
  if(request.payload.password_hash){
    const bcrypt = require('bcrypt')
    const salt = bcrypt.genSaltSync()
    request.payload.password_hash = bcrypt.hashSync(request.payload.password_hash, salt)
  }

  try{
    const data = await models.<%= name %>s.update(request.payload, {where: {id: request.params.id}, returning: true})
    reply(data)
  }catch(error){
    reply(error)
  }
}
