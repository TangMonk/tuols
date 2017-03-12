import { create, remove, update, query } from '../services/<%= name %>s'
import { parse } from 'qs'

export default {

  namespace: '<%= name %>s',

  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/<%= name %>s') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },

  effects: {
    *query ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      try {
        const data = yield call(query, parse(payload))
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data,
              pagination: data.page
            }
          })
        }
      } catch(error){
        console.error(error)
        yield put({ type: 'hideLoading' })
      }
    },
    *'delete' ({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' })
      try {
        yield call(remove, payload)
        const state = yield select(state => state.<%= name %>s);
        const list = state.list.filter( o => o.id != payload )
        yield put({
          type: 'updateState',
          payload: {
            list: list,
            pagination: {
              ...state.pagination,
              total: state.pagination.total - 1
            }
          }
        })
        yield put({ type: 'hideLoading' })
      }catch(error){
        console.error(error)
        yield put({ type: 'hideLoading' })
      }
    },
    *create ({ payload }, { call, put, select }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      try {
        const state = yield select(state => state.<%= name %>s);
        const data = yield call(create, payload)
        yield put({
          type: 'updateState',
          payload: {
            list: [data, ...state.list],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
              current: 1
            }
          }
        })
        yield put({ type: 'hideLoading' })
      }catch(error){
        console.error(error)
        yield put({ type: 'hideLoading' })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      const id = yield select(({ <%= name %>s }) => <%= name %>s.currentItem.id)
      const newUser = { body: payload, id }
      try {
        const data = yield call(update, newUser)
        const state = yield select(state => state.<%= name %>s);
        const index = state.list.findIndex( o => o.id === id )
        state.list[index] = data[1][0]
        yield put({
          type: 'updateState',
          payload: {
            list: state.list
          }
        })
        yield put({ type: 'hideLoading' })
      }catch(error){
        console.error(error)
        yield put({ type: 'hideLoading' })
      }
    },
    *switchIsMotion ({
      payload
    }, {put}) {
      yield put({
        type: 'handleSwitchIsMotion'
      })
    }
  },

  reducers: {
    hideLoading (state) {
      return { ...state, loading: false }
    },
    showLoading (state) {
      return { ...state, loading: true }
    },
    querySuccess (state, action) {
      const {list, pagination} = action.payload
      return { ...state,
        list,
        loading: false,
        pagination: {
          ...state.pagination,
          ...pagination
        }}
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    handleSwitchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    updateState(state, action){
      return { ...state, ...action.payload }
    }
  }

}
