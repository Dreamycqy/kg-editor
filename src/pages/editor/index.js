import React from 'react'
import { Tabs, Empty } from 'antd'
import ClassEditor from './classEditor'
import IndividualEditor from './individualEditor'
import PropertyEditor from './propertyEditor'
import History from './history'

const { TabPane } = Tabs

class MainEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <Tabs style={{ height: '100%' }}>
        <TabPane tab="类" key="classes">
          <ClassEditor />
        </TabPane>
        <TabPane style={{ minHeight: '100vh' }} tab="属性" key="properties">
          <PropertyEditor />
        </TabPane>
        <TabPane tab="实体" key="individuals">
          <IndividualEditor />
        </TabPane>
        <TabPane tab="讨论" key="comment">
          <Empty style={{ marginTop: 100 }} />
        </TabPane>
        <TabPane tab="历史" key="history">
          <History />
        </TabPane>
      </Tabs>
    )
  }
}
export default MainEditor
