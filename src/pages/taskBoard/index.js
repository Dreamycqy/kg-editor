import React from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { getUserList, getProjectList } from '@/services/edukg'
import Pic15002 from '@/assets/15002.jpg'
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
    const { selectedTask, newTaskList } = this.state
    return (
      <div style={{ overflow: 'hidden', height: '100%', backgroundImage: `url(${Pic15002})` }}>
        {
          newTaskList.length
            ? (
              <div>
                <div style={{ float: 'left', width: 360, borderRight: '1px solid #e8e8e8', height: '100%', overflowY: 'scroll' }}>
                  <RightContent selectTask={this.selectTask} taskList={newTaskList} />
                </div>
                <div style={{ height: '100%', paddingLeft: 360 }}>
                  <LeftNav data={selectedTask} />
                </div>
              </div>
            ) : null
        }
      </div>
    )
  }
}
export default MainLayout
