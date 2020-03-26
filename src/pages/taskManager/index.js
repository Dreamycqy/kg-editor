import React from 'react'
import { Table, Input, Divider, Icon } from 'antd'
// import moment from 'moment'
import User from '@/components/items/userName'
// import ShowProcess from '@/components/items/processTask'
import { getTaskList } from '@/services/edukg'
import { getUrlParams } from '@/utils/common'
import Config from './config'

const { Search } = Input

class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originSource: [],
      dataSource: [],
      loading: false,
      projectName: getUrlParams().projectName || '',
    }
  }

  componentWillMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    const data = await getTaskList({
      projectName: this.state.projectName,
    })
    if (data) {
      await this.setState({
        originSource: data.data,
        dataSource: data.data,
      })
    }
    this.setState({ loading: false })
  }

  handleStatus = (str) => {
    switch (str) {
      case 'high':
        return <span style={{ color: 'red' }}><Icon type="exclamation-circle" />&nbsp;高</span>
      case 'middle':
        return <span style={{ color: '#1296db' }}><Icon type="minus-circle" />&nbsp;中</span>
      case 'low':
        return <span style={{ color: 'green' }}><Icon type="clock-circle" />&nbsp;低</span>
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
        userGroup += e.taskName
        userGroup += e.email
      })
      const match1 = record.taskName.match(reg)
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
      title: '任务名称',
      dataIndex: 'taskName',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      // render: (text, record) => {
      //   return (
      //     <span>{moment(record).format('YYYY-MM-DD')}</span>
      //   )
      // },
    }, {
      title: '截止时间',
      dataIndex: 'endTime',
      // render: (text, record) => {
      //   return (
      //     <span>{moment(record).format('YYYY-MM-DD')}</span>
      //   )
      // },
    }, {
      title: '任务描述',
      dataIndex: 'desc',
    }, {
      title: '紧迫等级',
      dataIndex: 'urgency',
      render: (text, record) => {
        return (
          this.handleStatus(record.urgency)
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
            {/* <ShowProcess data={[]} /> */}
            <a href="#" onClick={e => e.preventDefault()}>进入任务</a>
            <Divider type="vertical" />
            <a href="#" onClick={e => e.preventDefault()}>查看进度</a>
            <Divider type="vertical" />
            <Config
              type="edit" params={record}
              update={this.getData}
              projectName={this.state.projectName}
            />
          </span>
        )
      },
    }]
    return (
      <div>
        <div style={{ marginBottom: 10, height: 32 }}>
          <Search
            placeholder="请输入想搜索的任务名，任务描述，成员姓名或邮箱"
            onSearch={value => this.search(value)}
            style={{ width: 400, float: 'left' }}
          />
          <div style={{ float: 'right', marginRight: 20 }}>
            <Config type="new" update={this.getData} projectName={this.state.projectName} />
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey={record => record.taskid}
        />
      </div>
    )
  }
}
export default Members
