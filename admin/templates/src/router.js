import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

export default function ({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, {component: require('./routes/dashboard')})
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard'))
            }, 'dashboard')
          }
        },
        {
          path: 'rule',
          name: 'rule',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/rule/index'))
            }, 'rule')
          }
        }
        , {
          path: 'users',
          name: 'users',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'))
              cb(null, require('./routes/users'))
            }, 'users')
          }
        }, {
          path: 'groups',
          name: 'groups',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/groups'))
              cb(null, require('./routes/groups'))
            }, 'groups')
          }
        }, {
          path: 'rebate/histories',
          name: 'rebate/histories',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rebate/histories'))
              cb(null, require('./routes/rebate/histories'))
            }, 'histories')
          }
        }, {
          path: 'rebate/levelHistories',
          name: 'rebate/levelHistories',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/rebate/levelHistories'))
              cb(null, require('./routes/rebate/levelHistories'))
            }, 'levelHistories')
          }
        }, {
          path: 'ui/ico',
          name: 'ui/ico',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/ui/ico'))
            }, 'ui-ico')
          }
        }, {
          path: 'ui/search',
          name: 'ui/search',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/ui/search'))
            }, 'ui-search')
          }
        }, {
          path: '*',
          name: 'error',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error'))
            }, 'error')
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}
