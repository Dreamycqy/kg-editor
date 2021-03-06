import React from 'react'
import _ from 'lodash'
import Tree from '@/components/tree/classTree'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/roTable/flexTable'
import FlexTableDb from '@/components/roTable/flexTableDb'

let dataList = []
let newList = []
let newChildList = []

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
    }
  }

  generateList = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title, source, target, relationships, nodeTask } = node
      if (!_.find(dataList, { key })) {
        dataList.push({
          key,
          title,
          source: source || key,
          target: target || [parent],
          relationships: relationships || [],
          nodeTask: nodeTask || [],
        })
      }
      if (node.children) {
        this.generateList(node.children, key)
      }
    }
  }

  getNewList = (key) => {
    if (key !== undefined) {
      this.props.classData.forEach((e) => {
        if (e.key === key) {
          newList.push(e)
          e.target.forEach((i) => {
            this.getNewList(i)
          })
        }
      })
    }
  }

  getChildList = (key) => {
    if (key !== undefined && key !== '') {
      this.props.classData.forEach((e) => {
        if (e.key === key) {
          newChildList.push(e)
          if (e.children) {
            e.children.forEach((i) => {
              this.getChildList(i.key)
            })
          }
        }
      })
    }
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  rebuildChartData = (selectNode) => {
    const data = []
    const links = []
    newList = []
    this.getNewList(selectNode)
    newList.forEach((e) => {
      const item = {
        name: e.title,
        draggable: true,
        category: 0,
      }
      if (e.key === selectNode) {
        delete item.category
      }
      data.push(item)
      e.target.forEach((i) => {
        links.push({
          source: e.title,
          target: _.find(newList, { key: i }) ? _.find(newList, { key: i }).title : '',
        })
      })
    })
    return {
      data: _.uniqBy(data, 'name'),
      links,
    }
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
        if (result[key] && !result[key].children) {
          result[key].children = []
        }
        if (result[key] && !_.find(result[key].children, { key: item.key })) {
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

  removeCurrentChildrens = (selectNode) => {
    this.getChildList(selectNode)
    const remove = newChildList
    newChildList = []
    return this.props.classData.filter((e) => { return !_.find(remove, { key: e.key }) })
  }

  editNode = (newTree, isdrag, dragArr) => {
    dataList = []
    this.generateList(newTree, '')
    if (isdrag) {
      dataList.forEach((e) => {
        if (e.key === dragArr[0]) {
          e.target = [dragArr[1]]
        }
      })
    }
    this.props.changeData(dataList, 'class')
  }

  editNodeInfo = (value, key, type) => {
    const { classData } = this.props
    const target = classData.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Parents') {
      target.target = value
    } else {
      target.relationships = value
    }
    this.props.changeData(classData, 'class')
  }

  render() {
    const { selectNode } = this.state
    const { classData, propertyData, propertyObj } = this.props
    const currentNode = _.find(classData, { key: selectNode })
    const currentParent = []
    if (currentNode) {
      currentNode.target.forEach((e) => {
        const parent = _.find(classData, { key: e })
        if (parent) {
          currentParent.push(parent.key)
        }
      })
    }
    const currentNodeKey = currentNode ? currentNode.key : ''
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ minWidth: 300, borderRight: '1px solid #e8e8e8', overflowY: 'scroll', height: 800 }}>
          <Tree
            iconType="smile" iconColor="#1296db"
            oriData={classData}
            data={this.listToTree(classData)} selectNode={this.selectNode}
            editNode={this.editNode} treeType="class"
            selectKey={currentNodeKey} onlyShow
          />
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: '100%', border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode)} />
          </div>
        </div>
        <div style={{ minWidth: 450, borderLeft: '1px solid #e8e8e8', paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            概念: {currentNode ? currentNode.title : ''}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Annotations" limited
                data={[currentNode ? currentNode.title : '']}
                editNode={this.editNodeInfo}
                selectKey={currentNodeKey}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Parents" data={currentParent}
                placeholder="请输入类名"
                options={this.removeCurrentChildrens(selectNode).map((e) => {
                  return e
                })}
                editNode={this.editNodeInfo}
                selectKey={currentNodeKey}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={propertyData && propertyObj
                  ? [...propertyData, ...propertyObj] : []}
                editNode={this.editNodeInfo}
                selectKey={currentNodeKey}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PublicResource
