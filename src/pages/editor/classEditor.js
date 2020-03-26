import React from 'react'
import { Empty } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/tree'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

let dataList = []
let newList = []

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
          target: _.find(newList, { key: i }).title,
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

  editNode = (newTree) => {
    dataList = []
    this.generateList(newTree, '')
    this.props.changeData(dataList, 'class')
  }

  editNodeInfo = (value, key, type) => {
    const { classData } = this.props
    const target = classData.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Parents') {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classData, { title: e }).key)
      })
      target.target = array
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
          currentParent.push(parent.title)
        }
      })
    }
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', minWidth: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree
            iconType="smile" iconColor="#1296db"
            data={this.listToTree(classData)} selectNode={this.selectNode}
            editNode={this.editNode}
          />
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            Class: {currentNode ? currentNode.title : ''}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Annotations" limited
                data={[currentNode ? currentNode.title : '']}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Parents" data={currentParent}
                placeholder="请输入类名"
                options={classData.map((e) => { return e.title })}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={[...propertyData, ...propertyObj].map((e) => { return e.title })}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>指标</div>
            {/* <Empty style={{ marginTop: 10 }} /> */}
          </div>
        </div>
        <div style={{ height: '100%', minWidth: 450, borderLeft: '1px solid #e8e8e8', paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: 400, border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode)} />
          </div>
          <div style={{ minHeight: 350 }}>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>最近更改</div>
            {historyData[0]
              ? <HistoryList data={[historyData[0]]} type="lastone" />
              : <Empty />
            }
          </div>
        </div>
      </div>
    )
  }
}
export default PublicResource
