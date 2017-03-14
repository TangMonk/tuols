'use strict'
const uuidV4 = require('uuid/v4')
const fs = require('fs')
const Path = require('path')

exports.register = function(server, options, next) {
  server.route({
    method: 'POST',
    path: '/upload',
    config: {
      tags: ['api'],
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },

    },
    handler: upload
  })

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
        listing: true
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'file'
}

function upload(request, reply) {
  const data = request.payload
  if (data.file) {
    const ext = Path.extname(data.file.hapi.filename)
    const filename = uuidV4()
    const path = `${__dirname}/../public/uploads/${filename}${ext}`
    const file = fs.createWriteStream(path)

    file.on('error', (err) => {
      reply(err)
    })

    data.file.pipe(file)

    data.file.on('end', (err) => {
      if (err) return reply(err)

      reply({ url: `/uploads/${filename}${ext}` })
    })
  }
}
