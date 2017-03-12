import {login, userInfo, logout} from '../services/app'
import {parse} from 'qs'
import {message} from 'antd'

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: false,
    user: {
      id: 0,
      name: '',
      token: null
    },
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: localStorage.getItem('antdAdminSiderFold') === 'true',
    darkTheme: localStorage.getItem('antdAdminDarkTheme') !== 'false',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem('navOpenKeys') || '[]')
  },
  subscriptions: {
    setup ({dispatch}) {
      dispatch({type: 'queryUser'})
      window.onresize = function () {
        dispatch({type: 'changeNavbar'})
      }
    }
  },
  effects: {
    *login ({
      payload
    }, {call, put}) {
      yield put({type: 'showLoginButtonLoading'})
      try {
        const data = yield call(login, parse(payload))
        
        if(data.statusCode){
          yield put({type: 'hideLoading'})
          return yield put({
            type: 'loginFail'
          })
        }
        
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: data.user.name,
              id: data.user.id
            }
          }})
        localStorage.setItem('token', data.token)
      } catch (error) {
        message.error('登录失败')
        yield put({
          type: 'loginFail'
        })
      }
    },
    *queryUser ({
      payload
    }, {call, put}) {
      yield put({type: 'showLoading'})
      
      try {
        const data = yield call(userInfo)
        if(data.statusCode){
          yield put({type: 'hideLoading'})
          return yield put({
            type: 'loginFail'
          })
        }
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: data.name,
              id: data.id
            }
          }
        })
      } catch (error) {
        yield put({type: 'hideLoading'})
        yield put({
          type: 'loginFail'
        })
      }
    },
    *logout ({
      payload
    }, {put}) {
      localStorage.setItem('token', '')
      try {
        yield put({
          type: 'logoutSuccess'
        })
      } catch (error) {
        debugger
        let a = 1
      }
      
    },
    *switchSider ({
      payload
    }, {put}) {
      yield put({
        type: 'handleSwitchSider'
      })
    },
    *changeTheme ({
      payload
    }, {put}) {
      yield put({
        type: 'handleChangeTheme'
      })
    },
    *changeNavbar ({
      payload
    }, {put}) {
      if (document.body.clientWidth < 769) {
        yield put({type: 'showNavbar'})
      } else {
        yield put({type: 'hideNavbar'})
      }
    },
    *switchMenuPopver ({
      payload
    }, {put}) {
      yield put({
        type: 'handleSwitchMenuPopver'
      })
    }
  },
  reducers: {
    loginSuccess (state, action) {
      return {
        ...state,
        ...action.payload,
        login: true,
        loginButtonLoading: false
      }
    },
    logoutSuccess (state) {
      return {
        ...state,
        user: {},
        login: false,
        loading: false
      }
    },
    loginFail (state) {
      return {
        ...state,
        login: false,
        loginButtonLoading: false
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true
      }
    },
    showLoading (state) {
      return {
        ...state,
        loading: true
      }
    },
    hideLoading (state) {
      return {
        ...state,
        loading: false
      }
    },
    handleSwitchSider (state) {
      localStorage.setItem('antdAdminSiderFold', !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold
      }
    },
    handleChangeTheme (state) {
      localStorage.setItem('antdAdminDarkTheme', !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible
      }
    },
    handleNavOpenKeys (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
