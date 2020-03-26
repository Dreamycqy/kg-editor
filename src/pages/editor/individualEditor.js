import React from 'react'
import { Empty } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/simpleTree'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'
import classD from '@/utils/mock/new/class'
import property from '@/utils/mock/new/props'
import individual from '@/utils/mock/new/indis'

let newList = []

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
      treeData: individual,
    }
  }

  componentWillMount = () => {
    if (this.state.selectNode === '') {
      this.setState({ selectNode: individual[0].key })
    }
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  getNewList = (key) => {
    if (key !== undefined) {
      classD.forEach((e) => {
        if (e.key === key) {
          newList.push(e)
          e.target.forEach((i) => {
            this.getNewList(i)
          })
        }
      })
    }
  }

  handleClassChartBuild = (selectNode) => {
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
      data.push(item)
      e.target.forEach((i) => {
        links.push({
          source: e.title,
          target: _.find(newList, { key: i }).title,
        })
      })
      if (e.target.length === 0) {
        links.push({
          source: e.title,
          target: '',
        })
      }
    })
    return {
      data: _.uniqBy(data, 'key'),
      links,
    }
  }

  rebuildChartData = (treeData, selectNode) => {
    let data = []
    let links = []
    const addition = []
    const target = _.find(treeData, { key: selectNode })
    if (target) {
      target.types.forEach((e) => {
        const temp = this.handleClassChartBuild(e)
        data = [...data, ...temp.data]
        links = [...links, ...temp.links]
        addition.push({
          source: target.title, target: _.find(classD, { key: e }).title,
        })
      })
    }
    return {
      data: [..._.uniqBy(data, 'name'), {
        name: target.title,
      }],
      links: [..._.uniqBy(data, 'name'), ...addition],
    }
  }

  editNodeInfo = (value, key, type) => {
    const { treeData } = this.state
    const target = treeData.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Types') {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classD, { title: e }).key)
      })
      target.types = array
    } else if (type === 'Relationships') {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classD, { title: e }).key)
      })
      target.relationships = value
    } else {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classD, { title: e }).key)
      })
      target.sameAs = value
    }
    this.setState({ treeData })
  }

  render() {
    const {
      selectNode, treeData,
    } = this.state
    const currentNode = _.find(treeData, { key: selectNode })
    const typesArray = []
    if (currentNode) {
      currentNode.types.forEach((e) => {
        typesArray.push(_.find(classD, { key: e }).title)
      })
    }
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree showFilter iconType="tag" iconColor="#1296db" data={treeData} selectNode={this.selectNode} />
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
                title="Types"
                data={currentNode ? typesArray : []}
                placeholder="请输入类名"
                selectKey={currentNode ? currentNode.key : ''}
                options={classD.map((e) => { return e.title })}
                editNode={this.editNodeInfo}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={[...property.data, ...property.obj].map((e) => { return e.title })}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Same As" data={currentNode ? currentNode.sameAs : []}
                placeholder="请输入实体"
                options={treeData.map((e) => { return e.title })}
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
            <Chart graph={this.rebuildChartData(treeData, selectNode)} />
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
