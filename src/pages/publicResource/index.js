import React from 'react'
import { Tabs } from 'antd'
import Properties from './properties'

const { TabPane } = Tabs

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <Tabs style={{ height: '100%' }}>
        <TabPane style={{ minHeight: '100vh' }} tab="属性" key="properties">
          <Properties />
        </TabPane>
        <TabPane tab="实体" key="individuals">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    )
  }
}
export default PublicResource
