import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import GroupList from '../components/groups/list'
import GroupSearch from '../components/groups/search'
import GroupModal from '../components/groups/modal'

function Groups ({ location, dispatch, groups }) {
  const { loading, list, pagination, currentItem, modalVisible, modalType, isMotion } = groups
  const { field, keyword } = location.query

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `groups/${modalType}`,
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'groups/hideModal'
      })
    }
  }

  const listProps = {
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
        type: 'groups/delete',
        payload: id
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'groups/showModal',
        payload: {
          modalType: 'update',
          currentItem: item
        }
      })
    }
  }

  const searchProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      let query = {}
      fieldsValue.keyword.length ? dispatch({
        type: 'groups/query',
        query: {
          [fieldsValue.field]: fieldsValue.keyword,
          page: 1
        }
      }) : dispatch({
        type: 'groups/query',
        query: {
          page: 1
        }
      })
    },
    onAdd () {
      dispatch({
        type: 'groups/showModal',
        payload: {
          modalType: 'create'
        }
      })
    },
    switchIsMotion () {
      dispatch({type: 'groups/switchIsMotion'})
    }
  }

  const GroupModalGen = () =>
    <GroupModal {...modalProps} />

  return (
    <div className='content-inner'>
      <GroupSearch {...searchProps} />
      <GroupList {...listProps} />
      <GroupModalGen />
    </div>
  )
}

Groups.propTypes = {
  groups: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({groups}) => ({groups}))(Groups)
