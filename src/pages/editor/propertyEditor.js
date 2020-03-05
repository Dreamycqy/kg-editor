import React from 'react'
import { Tabs, Empty } from 'antd'
import Tree from '@/components/tree/tree'
import taskData from '@/utils/mock/task2'

const { TabPane } = Tabs

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
    }
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  render() {
    const {
      selectNode,
    } = this.state
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tabs style={{ height: '100%' }}>
            <TabPane tab="Object Properties" key="classes">
              <Tree iconType="import" iconColor="#1296db" data={taskData.objProperty} selectNode={this.selectNode} />
            </TabPane>
            <TabPane tab="Data Properties" key="properties">
              <Tree iconType="import" iconColor="#1afa29" data={taskData.dataProperty} selectNode={this.selectNode} />
            </TabPane>
          </Tabs>
        </div>
        <div style={{ flexGrow: 1, padding: '0 20px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            Property: {selectNode}
          </div>
          <div style={{ border: '1px solid #e8e8e8', height: 300 }}>chart</div>
        </div>
        <div style={{ height: '100%', width: 300, borderLeft: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 20, paddingLeft: 20 }}>Comment</div>
          <Empty style={{ marginTop: 20 }} />
        </div>
      </div>
    )
  }
}
export default PublicResource
