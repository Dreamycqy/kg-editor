import React from 'react'
import { Empty } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/simpleTree'
import taskData from '@/utils/mock/task2'
import treeData from '@/utils/mock/publicIndis'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

const dataList = []
const dataListo = []
const dataListd = []
let newList = []

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
    }
  }

  componentWillMount = () => {
    this.generateList(taskData.class)
    this.generateListo(taskData.objProperty)
    this.generateListd(taskData.dataProperty)
  }

  generateListo = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title } = node
      dataListo.push({
        key,
        title,
        source: title,
        target: parent,
      })
      if (node.children) {
        this.generateListo(node.children, title)
      }
    }
  }

  generateListd = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title } = node
      dataListd.push({
        key,
        title,
        source: title,
        target: parent,
      })
      if (node.children) {
        this.generateListd(node.children, title)
      }
    }
  }

  generateList = (data, parent) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title } = node
      dataList.push({
        key,
        title,
        source: title,
        target: parent,
      })
      if (node.children) {
        this.generateList(node.children, title)
      }
    }
  }

  getNewList = (title) => {
    if (title !== undefined) {
      dataList.forEach((e) => {
        if (e.title === title) {
          newList.push(e)
          this.getNewList(e.target)
        }
      })
    }
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  rebuildChartData = (selectNode) => {
    const data = [{
      name: selectNode,
      draggable: true,
    }]
    const target = selectNode.split('')[2] < 6 ? '医用防护标准' : '症状'
    const links = [{
      source: selectNode,
      target,
    }]
    newList = []
    this.getNewList(target)
    console.log(newList)
    newList.forEach((e) => {
      const item = {
        name: e.title,
        draggable: true,
        category: 0,
      }
      data.push(item)
      links.push({
        source: e.source,
        target: e.target,
      })
    })
    return {
      data: _.uniqBy(data, 'name'),
      links,
    }
  }

  render() {
    const {
      selectNode,
    } = this.state
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree showFilter iconType="tag" iconColor="#1296db" data={treeData} selectNode={this.selectNode} />
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            Class: {selectNode}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <FlexTable title="Annotations" limited data={[selectNode]} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Types" data={selectNode.split('')[2] < 6 ? ['医用防护标准'] : ['症状']}
                placeholder="请输入类名"
                options={dataList.map((e) => { return e.title })}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={[]}
                options={[...dataListd, ...dataListo].map((e) => { return e.title })}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Same As" data={[]}
                placeholder="请输入实体"
                options={treeData.map((e) => { return e.title })}
              />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>讨论</div>
            <Empty style={{ marginTop: 10 }} />
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
