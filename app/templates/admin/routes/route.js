import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import <%= name[0].toUpperCase() + name.slice(1) %>List from '../components/<%= name %>/list'
import <%= name[0].toUpperCase() + name.slice(1) %>Search from '../components/<%= name %>/search'
import <%= name[0].toUpperCase() + name.slice(1) %>Modal from '../components/<%= name %>/modal'

function <%= name[0].toUpperCase() + name.slice(1) %> ({ location, dispatch, <%= name %> }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, isMotion } = <%= name %>
  const { field, keyword } = location.query

  const <%= name %>ModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `<%= name %>/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: '<%= name %>/hideModal'
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
        type: '<%= name %>/delete',
        payload: id
      })
    },
    onEditItem (item) {
      dispatch({
        type: '<%= name %>/showModal',
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
        pathname: '/<%= name %>',
        query: {
          where: JSON.stringify({[fieldsValue.field]: {$like: `%${fieldsValue.keyword}%`}})
        }
      })) : dispatch(routerRedux.push({
        pathname: '/<%= name %>'
      }))
    },
    onAdd () {
      dispatch({
        type: '<%= name %>/showModal',
        payload: {
          modalType: 'create'
        }
      })
    },
    switchIsMotion () {
      dispatch({type: '<%= name %>/switchIsMotion'})
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

<%= name[0].toUpperCase() + name.slice(1) %>.propTypes = {
  <%= name %>: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({<%= name %>}) => ({<%= name %>}))(<%= name[0].toUpperCase() + name.slice(1) %>)
