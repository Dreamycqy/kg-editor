import React from 'react'
import { Table, Input, Divider } from 'antd'
import _ from 'lodash'
import { connect } from 'dva'
import ShowProcess from '@/components/items/process'
import { getUrlParams } from '@/utils/common'
import { getUserList } from '@/services/edukg'
import Check from './check'

const { Search } = Input
const roleType = [
  { name: '游客', value: 'visitor' },
  { name: '用户', value: 'member' },
  { name: '管理员', value: 'admin' },
]

@connect()
class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originSource: [],
      dataSource: [],
      loading: false,
    }
  }

  componentWillMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    const data = await getUserList({ email: 'autumnchenqy@aliyun.com' })
    if (data.data) {
      await this.setState({
        originSource: data.data,
        dataSource: data.data,
      })
      await this.props.dispatch({
        type: 'global/updateState',
        payload: {
          userList: data.data,
        },
      })
    }
    this.setState({ loading: false })
    if (getUrlParams().email) {
      this.search(getUrlParams().email)
    }
  }

  search = (value) => {
    const { originSource } = this.state
    const reg = new RegExp(value, 'gi')
    const dataSource = []
    originSource.map((record) => {
      const match1 = record.userName.match(reg)
      const match2 = record.email.match(reg)
      const match3 = record.role.match(reg)
      if (!match1 && !match2 && !match3) {
        return null
      }
      return dataSource.push(record)
    })
    this.setState({
      dataSource,
    })
  }

  handleProcess = (email) => {
    const result = []
    // _.filter(userList, { email })[0].tasks.forEach((e) => {
    //   if (taskConfig[e].status !== 'success') {
    //     result.push(taskConfig[e])
    //   }
    // })
    return result
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: '姓名',
      dataIndex: 'userName',
    }, {
      title: '邮箱',
      dataIndex: 'email',
    }, {
      title: '角色',
      dataIndex: 'role',
      render: (text, record) => {
        return <span>{_.find(roleType, { value: record.role }).name}</span>
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <ShowProcess data={this.handleProcess(record.email)} />
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => {}}>权限管理</a>
          </span>
        )
      },
    }]
    return (
      <div>
        <div style={{ marginBottom: 10, height: 32 }}>
          <Search
            defaultValue={getUrlParams().email}
            placeholder="请输入想搜索的成员姓名，邮箱或角色"
            onSearch={value => this.search(value)}
            style={{ marginBottom: 10, width: 360 }}
          />
          <div style={{ float: 'right', marginRight: 20 }}>
            <Check />
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
        />
      </div>
    )
  }
}
export default Members
