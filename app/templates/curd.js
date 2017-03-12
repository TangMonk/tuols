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
          limit: Joi.string().optional(),
          offset: Joi.string().optional(),
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
  if(request.query.limit){
    query_payload.limit = JSON.parse(request.query.limit)
  }
  if(request.query.offset){
    query_payload.offset = JSON.parse(request.query.offset)
  }
  if(request.query.include){
    query_payload.include = JSON.parse(request.query.include)
  }

  const data = await models.<%= name %>.findAll(query_payload)
  reply(data)
}

async function get(request, reply){
  const data = await models.<%= name %>.findById(request.params.id)
  reply(data)
}

async function create(request, reply){
  const data = await models.<%= name %>.create(request.payload)
  reply(data)
}

async function Delete(request, reply){
  const data = await models.<%= name %>.destroy({where: {id: request.params.id}})
  reply({message: 'success'})
}

async function update(request, reply){
  const data = await models.<%= name %>.update(request.payload, {where: {id: request.params.id}, returning: true})
  reply(data[1][0])
}
