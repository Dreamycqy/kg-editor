import React from 'react'
import Tree from '@/components/tree/tree'

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
          <Tree selectNode={this.selectNode} />
        </div>
        <div style={{ flexGrow: 1, padding: '0 20px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 24, fontWeight: 600 }}>
            Property: {selectNode}
          </div>
          <div style={{ border: '1px solid #e8e8e8', height: 300 }}>chart</div>
        </div>
        <div style={{ height: '100%', width: 300, borderLeft: '1px solid #e8e8e8' }}>
          comment
        </div>
      </div>
    )
  }
}
export default PublicResource
