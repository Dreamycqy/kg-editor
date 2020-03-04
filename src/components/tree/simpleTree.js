import React from 'react'
import { Tree } from 'antd'

class SimpleTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [{
        title: '实体1',
        key: '实体1',
      }, {
        title: '实体2',
        key: '实体2',
      }, {
        title: '实体3',
        key: '实体3',
      }, {
        title: '实体4',
        key: '实体4',
      }, {
        title: '实体5',
        key: '实体5',
      }, {
        title: '实体6',
        key: '实体6',
      }, {
        title: '实体7',
        key: '实体7',
      }, {
        title: '实体8',
        key: '实体8',
      }, {
        title: '实体9',
        key: '实体9',
      }, {
        title: '实体10',
        key: '实体10',
      }],
    }
  }

  componentWillMount = () => {
    this.props.selectNode(this.state.treeData[0].title)
  }

  onSelect = (keys, event) => {
    console.log(keys, event)
    this.props.selectNode(event.node.props.title)
  }

  render() {
    const { treeData } = this.state
    return (
      <div>
        <Tree
          onSelect={this.onSelect}
          treeData={treeData}
        />
      </div>
    )
  }
}
export default SimpleTree
