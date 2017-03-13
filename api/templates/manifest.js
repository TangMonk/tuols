'use strict'

const Confidence = require('confidence')
const Config = require('./config')
const heredoc = require('heredoc')

const default_criteria = {
  env: process.env.NODE_ENV
}


const manifest = {
  $meta: 'This file defines the plot device.',
  server: {
    connections: {
      routes: {
        security: true,
        files: {
          relativeTo: Path.join(__dirname, 'public')
        }
      }
    }
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web'],
  }],
  registrations: [
    {
      plugin: 'vision'
    },
    {
      plugin: {
        register: 'visionary',
        options: {
          engines: { jade: 'jade' },
          path: './server/web'
        }
      }
    },
    {
      plugin: 'inert'
    },
    {
      plugin: {
        register: 'good',
        options: {
          reporters: {
            consoleReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{response: '*', log: '*', request: '*'}]
            },
            {
              module: 'good-console',
              args: [{format: 'YYYY-MM-DD HH:ss', utc: false}]
            }, 'stdout'],
            errorReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{error: '*'}]
            },{
              module: 'good-console',
              args: [{format: 'YYYY-MM-DD HH:ss', utc: false}]
            }, 'stderr']
          },
        }
      }
    },
    {
      plugin: './server/plugins/auth'
    },
    {
      plugin: './server/plugins/tv_auth'
    },
    {
      plugin: './server/plugins/admin'
    },
    {
      plugin: {
        register: 'hapi-cors',
        options: {
          origins: ['*'],
          allowCredentials: 'true',
          exposeHeaders: ['content-type', 'content-length'],
          maxAge: 600,
          methods: ['POST, GET, OPTIONS','DELETE','PUT'],
          headers: ['Accept', 'Content-Type', 'Authorization','token']
        }
      }
    },
    {
      development: {
        plugin: {
          register: 'tv',
          options: {
            host: Config.get('/host'),
            address: Config.get('/host')
          }
        }
      },
      production: {
        plugin: {
          register: 'tv',
          options: {
            host: Config.get('/host'),
            address: Config.get('/host'),
            authenticateEndpoint: 'tv_auth'
          }
        }
      },
      $filter: 'env'
    },
    {
      plugin: './server/web/index'
    },
    {
      plugin: {
        register: './server/api/index',
      },
      options: {
        routes: {
          prefix: '/api'
        }
      }
    },
    {
      plugin: {
        register: 'hapi-swagger',
        options: {
          info: {
            title: '开发文档',
            description: heredoc.strip(() => { /*
              ## 参数说明

              登陆使用token字段传递, 可在header, cookie, query url 中传递

              ## 请求日志

              [实时查看请求日志](/debug/console)
            */})
          },
          tags: [
            {
              name: 'user',
              description: '用户操作'
            },
          ],
          basePath: '/api',
          pathPrefixSize: 2,
          documentationPath: '/doc',
          securityDefinitions: {
            'jwt': {
              'type': 'apiKey',
              'name': 'token',
              'in': 'header',
              'description': 'token'
            }
          },
          security: [{ 'jwt': [] }],
        }
      }
    },
  ]
}


const store = new Confidence.Store(manifest)

exports.get = function (key, criteria = default_criteria) {

  return store.get(key, criteria)
}


exports.meta = function (key, criteria = default_criteria) {

  return store.meta(key, criteria)
}
