import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import TaskCard from './components/taskCard'

class MainLayout extends React.Component {
  selectTask = (e) => {
    this.props.selectTask(e)
  }

  handleList = (list) => {
    const list1 = []
    const list2 = []
    list.forEach((e) => {
      if (moment(e.endTime) < moment()) {
        list1.push(e)
      } else {
        list2.push(e)
      }
    })
    return _.orderBy(list2, 'endTime', 'asc').concat(_.orderBy(list1, 'endTime', 'asc'))
  }

  renderCard = (list) => {
    const result = []
    list.forEach((e) => {
      result.push(
        <div onClick={() => this.selectTask(e)}><TaskCard info={e}></TaskCard></div>) // eslint-disable-line
    })
    return result
  }

  render() {
    const { taskList } = this.props
    return (
      <div style={{ overflow: 'hidden', height: '100%', overflowY: 'scroll', paddingBottom: 40 }}>
        {this.renderCard(this.handleList(taskList))}
      </div>
    )
  }
}
export default MainLayout
