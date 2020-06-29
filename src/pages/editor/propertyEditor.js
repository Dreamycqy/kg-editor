import React from 'react'
import { Tabs, Empty } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/tree'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'

const typeArray = [
  { title: 'string', key: 'string' }, { title: 'int', key: 'int' }, { title: 'float', key: 'float' },
]
const { TabPane } = Tabs
let dataListObj = []
let dataListData = []
let newListObj = []
let newListData = []

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

  generateListObj = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title, source, target, domain, range } = node
      dataListObj.push({
        key,
        title,
        source: source || key,
        target: target || parent,
        domain: domain || [],
        range: range || [],
      })
      if (node.children) {
        this.generateListObj(node.children, key)
      }
    }
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

  getNewList = (key) => {
    const { propertyData, propertyObj } = this.props
    if (this.state.activeKey === 'obj') {
      if (key !== undefined) {
        propertyObj.forEach((e) => {
          if (e.key === key) {
            newListObj.push(e)
            this.getNewList(e.target)
          }
        })
      }
    } else if (key !== undefined) {
      propertyData.forEach((e) => {
        if (e.key === key) {
          newListData.push(e)
          this.getNewList(e.target)
        }
      })
    }
  }

  selectNodeObj = (selectNodeObj) => {
    this.setState({ selectNodeObj })
  }

  selectNodeData = (selectNodeData) => {
    this.setState({ selectNodeData })
  }

  rebuildChartData = (selectNode, type) => {
    const data = []
    const links = []
    if (type === 'obj') {
      newListObj = []
      this.getNewList(selectNode)
      newListObj.forEach((e) => {
        const item = {
          name: e.title,
          draggable: true,
          category: 0,
        }
        if (e.key === selectNode) {
          delete item.category
        }
        data.push(item)
        links.push({
          source: e.title,
          target: e.target,
        })
      })
    } else {
      newListData = []
      this.getNewList(selectNode)
      newListData.forEach((e) => {
        const item = {
          name: e.title,
          draggable: true,
          category: 0,
        }
        if (e.key === selectNode) {
          delete item.category
        }
        data.push(item)
        links.push({
          source: e.title,
          target: e.target,
        })
      })
    }
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

  editNodeObj = (newTree, isdrag, dragArr) => {
    dataListObj = []
    this.generateListObj(newTree, '')
    if (isdrag) {
      dataListObj.forEach((e) => {
        if (e.key === dragArr[0]) {
          e.target = [dragArr[1]]
        }
      })
    }
    this.props.changeData(dataListObj, 'obj')
  }

  editNodeData = (newTree, isdrag, dragArr) => {
    dataListData = []
    this.generateListData(newTree, '')
    if (isdrag) {
      dataListData.forEach((e) => {
        if (e.key === dragArr[0]) {
          e.target = dragArr[1]
        }
      })
    }
    this.props.changeData(dataListData, 'data')
  }

  editNodeInfo = (value, key, type) => {
    if (this.state.activeKey === 'obj') {
      this.editNodeInfoObj(value, key, type)
    } else {
      this.editNodeInfoData(value, key, type)
    }
  }

  editNodeInfoObj = (value, key, type) => {
    const { propertyObj } = this.props
    const target = propertyObj.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Domain') {
      target.domain = value
    } else {
      target.range = value
    }
    this.props.changeData(propertyObj, 'obj')
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
        result = <Tree iconType="import" iconColor="#1296db" data={this.listToTree(propertyObj)} selectNode={this.selectNodeObj} editNode={this.editNodeObj} />
        break
      case 'data':
        result = <Tree iconType="import" iconColor="#1afa29" data={this.listToTree(propertyData)} selectNode={this.selectNodeData} editNode={this.editNodeData} />
        break
      default:
        result = null
        break
    }
    const selectNode = activeKey === 'obj' ? selectNodeObj : selectNodeData
    const currentNode = activeKey === 'obj' ? currentNodeObj : currentNodeData
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tabs activeKey={activeKey} onChange={key => this.setState({ activeKey: key })}>
            <TabPane style={{ height: 0 }} tab="Object Properties" key="obj" />
            <TabPane style={{ height: 0 }} tab="Data Properties" key="data" />
          </Tabs>
          <div style={{ overflowY: 'scroll', height: 800 }}>
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
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Domain" data={currentNode ? currentNode.domain : []}
                placeholder="请输入类名"
                options={classData.map((e) => { return e })}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Range" data={currentNode ? currentNode.range : []}
                placeholder={activeKey === 'obj' ? '请输入类名' : '请输入数据'}
                options={activeKey === 'obj' ? classData.map((e) => { return e }) : typeArray}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
          </div>
          <div>
            {/* <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>指标</div> */}
            <div style={{ height: 320 }}>
              {/* <Chart1 /> */}
            </div>
          </div>
        </div>
        <div style={{ height: '100%', minWidth: 450, borderLeft: '1px solid #e8e8e8', paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: 400, border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode, activeKey)} />
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
