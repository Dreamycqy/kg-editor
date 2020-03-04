import React from 'react'
import TaskCard from './components/taskCard'

class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      taskList: [{
        title: '任务：标注工作1',
        id: 1,
        createTime: '2020-02-25',
        endTime: '2020-02-27',
        desc: '对这个项目的一些说明，aaabbbcccddd1234567890完毕。',
        member: ['admin', 'chenqiuyang'],
      }, {
        title: '任务：标注工作4',
        id: 1,
        createTime: '2020-02-25',
        endTime: '2020-03-03',
        desc: '对这个项目的一些说明，aaabbbcccddd1234567890完毕。',
        member: ['admin', 'chenqiuyang', 'lisi'],
      }, {
        title: '任务：标注工作5',
        id: 1,
        createTime: '2020-02-25',
        endTime: '2020-03-05',
        desc: '对这个项目的一些说明，aaabbbcccddd1234567890完毕。',
        member: ['admin', 'chenqiuyang'],
      }, {
        title: '任务：标注工作8',
        id: 1,
        createTime: '2020-02-25',
        endTime: '2020-03-20',
        desc: '对这个项目的一些说明，aaabbbcccddd1234567890完毕。',
        member: ['admin', 'chenqiuyang'],
      }],
    }
  }

  renderCard = (list) => {
    const result = []
    list.forEach((e) => {
      result.push(<TaskCard info={e}></TaskCard>) // eslint-disable-line
    })
    return result
  }

  render() {
    const { taskList } = this.state
    return (
      <div style={{ overflow: 'hidden', height: '100%', overflowY: 'scroll' }}>
        {this.renderCard(taskList)}
      </div>
    )
  }
}
export default MainLayout
