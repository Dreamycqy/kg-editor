import React from 'react'
import { Table, Input } from 'antd'
import _ from 'lodash'
import ShowProcess from '@/components/items/process'
import userList from '@/utils/mock/userList'
import taskConfig from '@/utils/mock/taskConfig'

const { Search } = Input

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
    const data = [{
      name: '陈秋阳',
      email: 'autumnchenqy@aliyun.com',
      group: '组1',
    }, {
      name: '张三',
      email: 'user3@aliyun.com',
      group: '组1',
    }, {
      name: '李四',
      email: 'user4@aliyun.com',
      group: '组2',
    }, {
      name: '王五',
      email: 'user5@aliyun.com',
      group: '组2',
    }, {
      name: '赵六',
      email: 'user6@aliyun.com',
      group: '组3',
    }]
    await this.setState({
      originSource: data,
      dataSource: data,
    })
    this.setState({ loading: false })
  }

  search = (value) => {
    const { originSource } = this.state
    const reg = new RegExp(value, 'gi')
    const dataSource = []
    originSource.map((record) => {
      const match1 = record.name.match(reg)
      const match2 = record.email.match(reg)
      const match3 = record.group.match(reg)
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
    _.filter(userList, { email })[0].tasks.forEach((e) => {
      if (taskConfig[e].status !== 'success') {
        result.push(taskConfig[e])
      }
    })
    return result
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '邮箱',
      dataIndex: 'email',
    }, {
      title: '分组',
      dataIndex: 'group',
    }, {
      title: '工作进度',
      render: (text, record) => {
        return <ShowProcess data={this.handleProcess(record.email)} />
      },
    }]
    return (
      <div>
        <Search
          placeholder="请输入想搜索的成员姓名，邮箱或负责项目"
          onSearch={value => this.search(value)}
          style={{ marginBottom: 10, width: 360 }}
        />
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
