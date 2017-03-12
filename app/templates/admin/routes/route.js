import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import <%= name[0].toUpperCase() + name.slice(1) %>List from '../components/<%= name %>s/list'
import <%= name[0].toUpperCase() + name.slice(1) %>Search from '../components/<%= name %>s/search'
import <%= name[0].toUpperCase() + name.slice(1) %>Modal from '../components/<%= name %>s/modal'

function <%= name[0].toUpperCase() + name.slice(1) %>s ({ location, dispatch, <%= name %>s }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, isMotion } = <%= name %>s
  const { field, keyword } = location.query

  const <%= name %>ModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `<%= name %>s/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: '<%= name %>s/hideModal'
      })
    }
  }

  const <%= name %>ListProps = {
    dataSource: list,
    loading,
    pagination: pagination,
    location,
    isMotion,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname: pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: '<%= name %>s/delete',
        payload: id
      })
    },
    onEditItem (item) {
      dispatch({
        type: '<%= name %>s/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    }
  }

  const <%= name %>SearchProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/<%= name %>s',
        query: {
          where: JSON.stringify({[fieldsValue.field]: {$like: `%${fieldsValue.keyword}%`}})
        }
      })) : dispatch(routerRedux.push({
        pathname: '/<%= name %>s'
      }))
    },
    onAdd () {
      dispatch({
        type: '<%= name %>s/showModal',
        payload: {
          modalType: 'create'
        }
      })
    },
    switchIsMotion () {
      dispatch({type: '<%= name %>s/switchIsMotion'})
    }
  }

  const <%= name[0].toUpperCase() + name.slice(1) %>ModalGen = () =>
    <<%= name[0].toUpperCase() + name.slice(1) %>Modal {...<%= name %>ModalProps} />

  return (
    <div className='content-inner'>
      <<%= name[0].toUpperCase() + name.slice(1) %>Search {...<%= name %>SearchProps} />
      <<%= name[0].toUpperCase() + name.slice(1) %>List {...<%= name %>ListProps} />
      <<%= name[0].toUpperCase() + name.slice(1) %>ModalGen />
    </div>
  )
}

<%= name[0].toUpperCase() + name.slice(1) %>s.propTypes = {
  <%= name %>s: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({<%= name %>s}) => ({<%= name %>s}))(<%= name[0].toUpperCase() + name.slice(1) %>s)
