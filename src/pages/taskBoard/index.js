import React from 'react'
import taskConfig from '@/utils/mock/taskConfig'
import LeftNav from './leftNav'
import RightContent from './rightContent'

class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTask: {},
      taskList: [],
    }
  }

  componentWillMount = () => {
    const array = []
    for (const i in taskConfig) { // eslint-disable-line
      if (taskConfig[i].status !== 'success') {
        array.push(taskConfig[i])
      }
    }
    this.setState({ taskList: array, selectedTask: array[0] })
  }

  selectTask = (e) => {
    this.setState({ selectedTask: e })
  }

  render() {
    const { taskList, selectedTask } = this.state
    return (
      <div style={{ overflow: 'hidden', height: '100%' }}>
        <div style={{ float: 'left', width: 360, borderRight: '1px solid #e8e8e8', height: '100%', overflowY: 'scroll' }}>
          <RightContent selectTask={this.selectTask} taskList={taskList} />
        </div>
        <div style={{ height: '100%', paddingLeft: 360 }}>
          <LeftNav data={selectedTask} />
        </div>
      </div>
    )
  }
}
export default MainLayout
