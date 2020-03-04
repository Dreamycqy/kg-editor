import React from 'react'
import { Table, Input, Divider } from 'antd'
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
    this.setState({ loading: true })
    const data = [{
      name: '任务1',
      desc: '这是任务1',
      group: ['陈秋阳', '张三', '李四'],
    }, {
      name: '任务2',
      desc: '这是任务2',
      group: ['陈秋阳', '张三', '李四'],
    }, {
      name: '任务3',
      desc: '这是任务3',
      group: ['陈秋阳', '王五', '赵六'],
    }, {
      name: '任务4',
      desc: '这是任务4',
      group: ['陈秋阳', '王五', '赵六'],
    }, {
      name: '任务5',
      desc: '这是任务5，多加一句说明',
      group: ['陈秋阳', '张三', '赵六'],
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
      const match2 = record.desc.match(reg)
      const match3 = record.group.join(',').match(reg)
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
      title: '任务名称',
      dataIndex: 'name',
    }, {
      title: '任务描述',
      dataIndex: 'desc',
    }, {
      title: '成员',
      render: (text, record) => {
        return (
          <span>
            {record.group.join(', ')}
          </span>
        )
      },
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:;">查看进度</a>
            <Divider type="vertical" />
            <Config type="edit" name={record.name} />
          </span>
        )
      },
    }]
    return (
      <div>
        <div style={{ marginBottom: 10, height: 32 }}>
          <Search
            placeholder="请输入想搜索的任务名，任务描述或成员姓名"
            onSearch={value => this.search(value)}
            style={{ width: 360, float: 'left' }}
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
