import React from 'react'
import { Modal, Table, Button, Select, message, Divider } from 'antd'
import { makeOption } from '@/utils/common'

const roleType = [
  { name: '游客', value: 'visitor' },
  { name: '用户', value: 'member' },
  { name: '管理员', value: 'admin' },
]

class Check extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      dataSource: [{
        userName: '张三',
        email: 'zhangsan@a.com',
        role: 'visitor',
      }, {
        userName: '李四',
        email: 'lisi@a.com',
        role: 'visitor',
      }],
    }
  }

  getData = () => {
    this.setState({ loading: true })
    this.setState({ loading: false })
  }

  openModal = async () => {
    await this.setState({ visible: true })
    if (this.props.params) {
      this.getData()
    }
  }

  handleSave = (email, type) => {
    this.setState({ visible: false })
    message.success(type === 'pass' ? '已通过' : '已拒绝')
  }

  handleTableChange = (value, email, text) => {
    const { dataSource } = this.state
    const target = dataSource.find(item => item.email === email)
    if (target) {
      target[text] = value
    }
    this.setState({ dataSource })
  }

  render() {
    const {
      visible, loading, dataSource,
    } = this.state
    const columns = [{
      title: '昵称',
      dataIndex: 'userName',
    }, {
      title: '邮箱',
      dataIndex: 'email',
    }, {
      title: '角色',
      dataIndex: 'role',
      render: (text, record) => {
        return (
          <Select
            onChange={value => this.handleTableChange(value, record.email, 'role')}
            value={record.role} style={{ width: 150 }}
          >
            {makeOption(roleType)}
          </Select>
        )
      },
    }, {
      title: '审批',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:;" onClick={() => this.handleSave(record.email, 'pass')}>通过</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.handleSave(record.email, 'refuse')}>拒绝</a>
          </span>
        )
      },
    }]
    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          type="primary" disabled={this.props.disabled}
          onClick={() => this.openModal()}
        >
          新成员审核
        </Button>
        <Modal
          title="审核申请"
          visible={visible}
          onOk={() => this.handleSave()}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
          width="820px"
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={loading}
          />
        </Modal>
      </div>
    )
  }
}
export default Check
