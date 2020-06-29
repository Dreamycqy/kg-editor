import React from 'react'
import _ from 'lodash'
import Tree from '@/components/tree/simpleTree'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
    }
  }

  componentWillMount = () => {
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  listToTree = (list) => {
    const result = {}
    const startKey = []
    list.forEach((item) => {
      if (!result[item.key]) {
        result[item.key] = {
          key: item.key,
          label: item.title,
          value: item.key,
        }
      }
    })
    list.forEach((item) => {
      delete item.children
    })
    list.forEach((item) => {
      if (item.target.length === 0) {
        startKey.push({
          key: item.key,
          label: item.title,
          value: item.key,
        })
      }
      item.target.forEach((key) => {
        if (!result[key].children) {
          result[key].children = []
        }
        if (!_.find(result[key].children, { key: item.key })) {
          result[key].children.push({
            key: item.key,
            label: item.title,
            value: item.key,
          })
        }
      })
    })
    const map = []
    startKey.forEach((e) => {
      map.push(result[e.key])
    })
    return map
  }

  render() {
    const { selectNode } = this.state
    const { treeData, classData, propertyData, propertyObj } = this.props
    const currentNode = _.find(treeData || [], { key: selectNode })
    const typesArray = []
    if (currentNode) {
      currentNode.types.forEach((e) => {
        typesArray.push(_.find(classData, { key: e }).title)
      })
    }
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree
            showFilter
            iconType="tag" iconColor="#1296db"
            data={treeData} selectNode={this.selectNode}
            classData={this.listToTree(classData || [])}
            nodeTask={classData[0].nodeTask}
            onlyShow
          />
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            实体: {currentNode ? currentNode.title : ''}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Annotations" limited
                data={[currentNode ? currentNode.title : '']}
                selectKey={currentNode ? currentNode.key : ''}
                onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Types"
                data={currentNode ? typesArray : []}
                placeholder="请输入类名"
                selectKey={currentNode ? currentNode.key : ''}
                options={classData ? classData.map((e) => { return e }) : []}
                onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={propertyData && propertyObj
                  ? [...propertyData, ...propertyObj].map((e) => { return e }) : []}
                selectKey={currentNode ? currentNode.key : ''}
                onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Same As" data={currentNode ? currentNode.sameAs : []}
                placeholder="请输入实体"
                options={treeData ? treeData.map((e) => { return e }) : []}
                onlyShow
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PublicResource
