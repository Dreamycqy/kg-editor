import React from 'react'
import TaskCard from './components/taskCard'

class MainLayout extends React.Component {
  selectTask = (e) => {
    this.props.selectTask(e)
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
        {this.renderCard(taskList)}
      </div>
    )
  }
}
export default MainLayout
