import React from 'react'
import { Tabs } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/tree'
import FlexTable from '@/components/table/flexTable'

const { TabPane } = Tabs
let dataListData = []
const typeArray = [
  { title: 'string', key: 'string' }, { title: 'int', key: 'int' }, { title: 'float', key: 'float' },
]

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNodeObj: '',
      selectNodeData: '',
      activeKey: 'obj',
    }
  }

  componentWillMount = () => {
  }

  generateListData = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title, source, domain, range } = node
      dataListData.push({
        key,
        title,
        source: source || key,
        target: parent,
        domain: domain || [],
        range: range || [],
      })
      if (node.children) {
        this.generateListData(node.children, key)
      }
    }
  }

  selectNodeObj = (selectNodeObj) => {
    this.setState({ selectNodeObj })
  }

  selectNodeData = (selectNodeData) => {
    this.setState({ selectNodeData })
  }

  editNodeData = (newTree, isdrag, dragArr) => {
    dataListData = []
    this.generateListData(newTree, '')
    if (isdrag === 'drag') {
      dataListData.forEach((e) => {
        if (e.key === dragArr[0]) {
          e.target = dragArr[1]
        }
      })
    }
    this.props.changeData(dataListData, 'data')
  }

  editNodeInfoData = (value, key, type) => {
    const { propertyData } = this.props
    const target = propertyData.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Domain') {
      target.domain = value
    } else {
      target.range = value
    }
    this.props.changeData(propertyData, 'data')
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
      if (result[item.target]) {
        if (!result[item.target].children) {
          result[item.target].children = []
        }
        if (!_.find(result[item.target].children, { key: item.key })) {
          result[item.target].children.push(item)
        }
      }
    })
    const map = []
    startKey.forEach((e) => {
      map.push(result[e])
    })
    return map
  }

  render() {
    const {
      selectNodeObj, selectNodeData, activeKey,
    } = this.state
    const { propertyData, propertyObj, classData } = this.props
    let result
    const currentNodeObj = _.find(propertyObj, { key: selectNodeObj })
    const currentNodeData = _.find(propertyData, { key: selectNodeData })
    switch (activeKey) {
      case 'obj':
        result = (
          <Tree
            iconType="import" iconColor="#1296db"
            data={this.listToTree(propertyObj)} selectNode={this.selectNodeObj}
            // onlyShow
          />
        )
        break
      case 'data':
        result = (
          <Tree
            iconType="import" iconColor="#1afa29"
            data={this.listToTree(propertyData)} selectNode={this.selectNodeData}
            editNode={this.editNodeData}
            // onlyShow
          />
        )
        break
      default:
        result = null
        break
    }
    const currentNode = activeKey === 'obj' ? currentNodeObj : currentNodeData
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tabs activeKey={activeKey} onChange={key => this.setState({ activeKey: key })}>
            <TabPane style={{ height: 0 }} tab="Object Properties" key="obj" />
            <TabPane style={{ height: 0 }} tab="Data Properties" key="data" />
          </Tabs>
          <div style={{ height: '100%' }}>
            {result}
          </div>
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            属性: {currentNode ? currentNode.title : ''}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Annotations" limited
                data={currentNode ? [currentNode.title] : []}
                selectKey={currentNode ? currentNode.key : ''}
                editNode={this.editNodeInfoData}
                // onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Domain" data={currentNode ? currentNode.domain : []}
                placeholder="请输入类名"
                options={classData.map((e) => { return e })}
                selectKey={currentNode ? currentNode.key : ''}
                editNode={this.editNodeInfoData}
                // onlyShow
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Range" data={currentNode ? currentNode.range : []}
                placeholder={activeKey === 'obj' ? '请输入类名' : '请输入数据'}
                options={activeKey === 'obj' ? classData.map((e) => { return e }) : typeArray}
                selectKey={currentNode ? currentNode.key : ''}
                editNode={this.editNodeInfoData}
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
