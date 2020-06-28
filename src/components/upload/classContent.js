import React from 'react'
import _ from 'lodash'
import Tree from '@/components/tree/classTree'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

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

  listToTree = (list) => {
    const result = {}
    const startKey = []
    list.forEach((item) => {
      if (!result[item.key]) {
        result[item.key] = item
      }
    })
    list.forEach((item) => {
      delete item.children
    })
    list.forEach((item) => {
      if (item.target.length === 0) {
        startKey.push(item.key)
      }
      item.target.forEach((key) => {
        if (!result[key].children) {
          result[key].children = []
        }
        if (!_.find(result[key].children, { key: item.key })) {
          result[key].children.push(item)
        }
      })
    })
    const map = []
    startKey.forEach((e) => {
      map.push(result[e])
    })
    return map
  }

  render() {
    const { selectNode } = this.state
    const { classData } = this.props
    const currentNode = _.find(classData, { key: selectNode })
    const currentParent = []
    if (currentNode) {
      currentNode.target.forEach((e) => {
        const parent = _.find(classData, { key: e })
        if (parent) {
          currentParent.push(parent.title)
        }
      })
    }
    const currentNodeKey = currentNode ? currentNode.key : ''
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', minWidth: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree
            iconType="smile" iconColor="#1296db"
            data={this.listToTree(classData)} selectNode={this.selectNode}
            // onlyShow
            treeType="class"
          />
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            概念: {currentNode ? currentNode.title : ''}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Annotations" limited
                data={[currentNode ? currentNode.title : '']}
                selectKey={currentNodeKey}
                // onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Parents" data={currentParent}
                placeholder="请输入类名"
                options={[]}
                selectKey={currentNodeKey}
                // onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={[]}
                selectKey={currentNodeKey}
                // onlyShow
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PublicResource
