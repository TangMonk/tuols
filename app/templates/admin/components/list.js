import React, {PropTypes} from 'react'
import {Table, Dropdown, Button, Menu, Icon, Modal} from 'antd'
import styles from './list.less'
import classnames from 'classnames'
import TableBodyWrapper from '../common/TableBodyWrapper'
import moment from 'moment'

const confirm = Modal.confirm

function list ({ loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, location }) {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        }
      })
    }
  }

  const columns = [
  <%_ attributes.forEach(attribute => { _%>
    {
      title: '<%= attribute[0] %>',
      dataIndex: '<%= attribute[0] %>',
      key: '<%= attribute[0] %>',
      width: 100
    },
  <%_ }) _%>
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (text, record) => {
        return moment(text).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title: '更新时间',
      dataIndex: 'createdAt',
      key: 'updatedAt',
      width: 100,
      render: (text, record) => {
        return moment(text).format('YYYY-MM-DD HH:mm')
      }
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<Dropdown overlay={<Menu onClick={(e) => handleMenuClick(record, e)}>
          <Menu.Item key='1'>编辑</Menu.Item>
          <Menu.Item key='2'>删除</Menu.Item>
        </Menu>}>
          <Button style={{ border: 'none' }}>
            <Icon style={{ marginRight: 2 }} type='bars' />
            <Icon type='down' />
          </Button>
        </Dropdown>)
      }
    }
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: pagination.current
  }

  const getBodyWrapper = body => isMotion ? <TableBodyWrapper {...getBodyWrapperProps} body={body} /> : body

  return (
    <div>
      <Table
        className={classnames({[styles.table]: true, [styles.motion]: isMotion})}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        pagination={pagination}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

list.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object
}

export default list
