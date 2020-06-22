import React from 'react'
import { Table, Input, Divider, Switch } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import User from '@/components/items/userName'
import _ from 'lodash'
// import taskConfig from '@/utils/mock/taskConfig'
// import ShowProcess from '@/components/items/processTask'
import { getProjectList } from '@/services/edukg'
import Config from './config'

const { Search } = Input
function mapStateToProps(state) {
  const { locale, userInfo } = state.global
  return {
    locale, userInfo,
  }
}
@connect(mapStateToProps)
class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originSource: [],
      dataSource: [],
      loading: false,
      onlyMine: true,
    }
  }

  componentWillMount = () => {
    this.getData()
  }

  getData = async () => {
    this.setState({ loading: true })
    const data = await getProjectList({})
    if (data.data) {
      this.setState({ dataSource: data.data, originSource: data.data })
    }
    this.setState({ loading: false })
  }

  search = (value) => {
    const { originSource } = this.state
    const reg = new RegExp(value, 'gi')
    const dataSource = []
    originSource.map((record) => {
      let userGroup = ''
      record.members.forEach((e) => {
        userGroup += e.userName
        userGroup += e.email
      })
      const match1 = record.desc.match(reg)
      const match2 = record.projectName.match(reg)
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

  goTask = (projectName) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/taskManager',
      query: {
        projectName,
      },
    }))
  }

  showOnlyMine = (dataSource) => {
    return dataSource.filter((e) => {
      return _.find(e.members, { email: this.props.userInfo.email })
    })
  }

  render() {
    const { dataSource, loading, onlyMine } = this.state
    const columns = [{
      title: '项目名称',
      dataIndex: 'projectName',
    }, {
      title: '项目描述',
      dataIndex: 'desc',
    }, {
      title: '成员',
      render: (text, record) => {
        const result = []
        record.members.forEach((e) => {
          result.push(<User key={e.email} user={e} />)
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
            <a href="#" onClick={e => e.preventDefault()}>查看</a>
            {_.find(record.members, { email: this.props.userInfo.email })
              ? (
                <span>
                  <Divider type="vertical" />
                  <a href="#" onClick={() => this.goTask(record.projectName)}>任务</a>
                  <Divider type="vertical" />
                  <Config
                    type="edit" params={record}
                    update={this.getData}
                  />
                </span>
              ) : (
                <span>
                  <Divider type="vertical" />
                  <a href="#">申请参与</a>
                </span>
              )
            }
          </span>
        )
      },
    }]
    return (
      <div>
        <div style={{ marginBottom: 10, height: 32, lineHeight: '30px' }}>
          <Search
            placeholder="请输入想搜索的项目名，项目描述，成员姓名或邮箱"
            onSearch={value => this.search(value)}
            style={{ width: 400, float: 'left' }}
          />
          <Switch
            checked={onlyMine}
            style={{ marginLeft: 20 }}
            onChange={checked => this.setState({ onlyMine: checked })}
          />
          <span style={{ marginLeft: 8 }}>仅显示我参与的项目</span>
          <div style={{ float: 'right', marginRight: 20 }}>
            <Config type="new" dataSource={dataSource} update={this.getData} />
          </div>
        </div>
        <Table
          dataSource={onlyMine === true ? this.showOnlyMine(dataSource) : dataSource}
          columns={columns}
          loading={loading}
          rowKey={record => record.projectid}
          locale={{
            emptyText: '暂无您参与的图谱',
          }}
        />
      </div>
    )
  }
}
export default Members
