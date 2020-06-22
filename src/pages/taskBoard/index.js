import React from 'react'
import { Spin, Empty } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import Link from 'umi/link'
import { getUserList, getProjectList } from '@/services/edukg'
import LeftNav from './leftNav'
import RightContent from './rightContent'

function mapStateToProps(state) {
  const { userInfo, userList } = state.global
  return {
    userInfo, userList,
  }
}
@connect(mapStateToProps)
class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTask: {},
      newTaskList: [],
      totalProjectList: [],
      loading: true,
    }
  }

  componentWillMount = () => {
    const { userInfo } = this.props
    this.getData()
    if (userInfo.email && userInfo.email.length > 0) {
      this.handleUserList(userInfo.email)
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    const { userInfo } = nextProps
    if (userInfo.email && userInfo.email.length > 0) {
      const newTaskList = []
      let taskItem = {}
      let target = {}
      if (this.state.totalProjectList.length === 0) {
        await this.getData()
      }
      if (this.state.totalProjectList.length) {
        userInfo.taskList.forEach((e) => {
          this.state.totalProjectList.forEach((item) => {
            const temp = _.find(item.taskList, { taskName: e.taskName })
            if (temp) {
              taskItem = temp
              target = item
            }
          })
          newTaskList.push({
            ...taskItem,
            projectName: target.projectName,
          })
        })
      }
      this.setState({
        newTaskList,
        selectedTask: newTaskList[0],
      })
    }
    this.setState({ loading: false })
  }

  getData = async () => {
    const data = await getProjectList({})
    if (data.data) {
      this.setState({ totalProjectList: data.data })
    }
  }

  handleUserList = async (email) => {
    const data = await getUserList({ email })
    if (data.data) {
      const { userName, role, projectList, taskList } = _.find(data.data, { email })
      await this.props.dispatch({
        type: 'global/updateState',
        payload: {
          userList: data.data,
          userInfo: {
            email,
            userName,
            role,
            projectList,
            taskList,
          },
        },
      })
    }
  }

  selectTask = (e) => {
    this.setState({ selectedTask: e })
  }

  render() {
    const { selectedTask, newTaskList, loading } = this.state
    return (
      <div style={{ overflow: 'hidden', height: '100%' }}>
        {
          newTaskList.length
            ? (
              <div style={{ height: '100%' }}>
                <div style={{ float: 'left', width: 360, borderRight: '1px solid #e8e8e8', height: '100%', overflowY: 'scroll' }}>
                  <RightContent selectTask={this.selectTask} taskList={newTaskList} />
                </div>
                <div style={{ height: '100%', paddingLeft: 360 }}>
                  <LeftNav data={selectedTask} />
                </div>
              </div>
            ) : (
              <div style={{ height: 900, backgroundColor: '#ffffffcc', paddingTop: 250 }}>
                <Spin size="large" spinning={loading}>
                  <Empty
                    description={(
                      <span>当前暂无你的图谱项目任务，<Link to="/projectManager?create=true">快去管理面板创建一个吧！</Link></span>
                    )}
                  />
                </Spin>
              </div>
            )
        }
      </div>
    )
  }
}
export default MainLayout
