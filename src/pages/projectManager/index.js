import React from 'react'
import { Table, Input, Divider, Icon } from 'antd'
import User from '@/components/items/userName'
import taskConfig from '@/utils/mock/taskConfig'
// import ShowProcess from '@/components/items/processTask'
import Config from './config'

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
  }

  handleStatus = (str) => {
    switch (str) {
      case 'success':
        return <span style={{ color: 'green' }}><Icon type="check-circle" />&nbsp;已完成</span>
      case 'going':
        return <span style={{ color: '#1296db' }}><Icon type="clock-circle" />&nbsp;进行中</span>
      default:
        return null
    }
  }

  search = (value) => {
    const { originSource } = this.state
    const reg = new RegExp(value, 'gi')
    const dataSource = []
    originSource.map((record) => {
      let userGroup = ''
      record.members.forEach((e) => {
        userGroup += e.name
        userGroup += e.email
      })
      const match1 = record.name.match(reg)
      const match2 = record.desc.match(reg)
      const match3 = userGroup.match(reg)
      if (!match1 && !match2 && !match3) {
        return null
      }
      return dataSource.push(record)
    })
    this.setState({
      dataSource,
    })
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: '项目名称',
      dataIndex: 'name',
    }, {
      title: '截止时间',
      dataIndex: 'endTime',
    }, {
      title: '项目描述',
      dataIndex: 'desc',
    }, {
      title: '项目状态',
      dataIndex: 'desc',
      render: (text, record) => {
        return (
          this.handleStatus(record.status)
        )
      },
    }, {
      title: '成员',
      render: (text, record) => {
        const result = []
        record.members.forEach((e) => {
          result.push(<User user={e} />)
        })
        return (
          <span>
            {result}
          </span>
        )
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {/* <ShowProcess data={[record]} />
            <Divider type="vertical" /> */}
            <Config disabled={record.status === 'success'} type="edit" params={taskConfig[record.name]} />
          </span>
        )
      },
    }]
    return (
      <div>
        <div style={{ marginBottom: 10, height: 32 }}>
          <Search
            placeholder="请输入想搜索的项目名，项目描述，成员姓名或邮箱"
            onSearch={value => this.search(value)}
            style={{ width: 400, float: 'left' }}
          />
          <div style={{ float: 'right', marginRight: 20 }}>
            <Config type="new" />
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
