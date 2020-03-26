import React from 'react'
import { Tabs, Empty } from 'antd'
import { getUrlParams } from '@/utils/common'
import ClassEditor from './classEditor'
import IndividualEditor from './individualEditor'
import PropertyEditor from './propertyEditor'
import History from './history'

const { TabPane } = Tabs

class MainEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: 'classes',
      projectName: getUrlParams().projectName || '',
      taskName: getUrlParams().taskName || '',
    }
  }

  render() {
    const { activeKey, taskName, projectName } = this.state
    let result
    switch (activeKey) {
      case 'classes':
        result = <ClassEditor projectName={projectName} taskName={taskName} />
        break
      case 'properties':
        result = <PropertyEditor projectName={projectName} taskName={taskName} />
        break
      case 'individuals':
        result = <IndividualEditor projectName={projectName} taskName={taskName} />
        break
      case 'comment':
        result = <Empty style={{ marginTop: 100 }} />
        break
      case 'history':
        result = <History />
        break
      default:
        result = null
        break
    }
    return (
      <div style={{ height: '100%' }}>
        <Tabs activeKey={activeKey} onChange={key => this.setState({ activeKey: key })}>
          <TabPane style={{ height: 0 }} tab="类" key="classes" />
          <TabPane style={{ height: 0 }} tab="属性" key="properties" />
          <TabPane style={{ height: 0 }} tab="实体" key="individuals" />
          <TabPane style={{ height: 0 }} tab="讨论" key="comment" />
          <TabPane style={{ height: 0 }} tab="历史" key="history" />
        </Tabs>
        {result}
      </div>
    )
  }
}
export default MainEditor
