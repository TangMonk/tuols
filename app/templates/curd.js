const models = require('../models')
const Joi = require('joi')

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/<%= name %>',
    config: {
      tags: ['api', '<%= name %>'],
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
    path: '/<%= name %>/{id}',
    config: {
      tags: ['api', '<%= name %>'],
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
    path: '/<%= name %>',
    config: {
      tags: ['api', '<%= name %>'],
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
    path: '/<%= name %>/{id}',
    config: {
      tags: ['api', '<%= name %>'],
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
    path: '/<%= name %>/{id}',
    config: {
      tags: ['api', '<%= name %>'],
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

  const data = await models.<%= name %>.findAll(query_payload)
  const total = await models.<%= name %>.count()
  reply({data, page: {total, current: request.query.page, pageSize: request.query.pageSize}})
}

async function get(request, reply) {
  const data = await models.<%= name %>.findById(request.params.id)
  reply(data)
}

async function create(request, reply){
  const data = await models.<%= name %>.create(request.payload)
  reply(data)
}

async function Delete(request, reply){
  const data = await models.<%= name %>.destroy({where: {id: request.params.id}})
  reply(data)
}

async function update(request, reply){
  const data = await models.<%= name %>.update(request.payload, {where: {id: request.params.id}, returning: true})
  reply(data)
}
