import React from 'react'
import { Empty } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/simpleTree'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

let newList = []

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

  handleClassChartBuild = (selectNode) => {
    const data = []
    const links = []
    newList = []
    this.getNewList(selectNode)
    newList.forEach((e) => {
      const item = {
        name: `${e.title}(概念)`,
        draggable: true,
        category: 0,
      }
      data.push(item)
      e.target.forEach((i) => {
        links.push({
          source: `${e.title}(概念)`,
          target: `${_.find(newList, { key: i }).title}(概念)`,
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
          source: target.title, target: `${_.find(this.props.classData, { key: e }).title}(概念)`,
        })
      })
    }
    return {
      data: [..._.uniqBy(data, 'name'), {
        name: target ? target.title : '',
        draggable: true,
      }],
      links: [..._.uniqBy(data, 'name'), ...addition],
    }
  }

  editNode = (target, method) => {
    this.props.changeData({
      node: target,
      method,
    }, 'indis')
  }

  editNodeInfo = (value, key, type) => {
    const { treeData, classData } = this.props
    const target = treeData.find(item => item.key === key)
    if (type === 'Annotations') {
      target.title = value[0]
    } else if (type === 'Types') {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classData, { title: e }).key)
      })
      target.types = array
    } else if (type === 'Relationships') {
      target.relationships = value
    } else {
      const array = []
      value.forEach((e) => {
        array.push(_.find(classData, { title: e }).key)
      })
      target.sameAs = value
    }
    this.props.changeData({
      node: target,
      method: 'edit',
    }, 'indis')
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
            editNode={this.editNode}
            classData={this.listToTree(classData || [])}
            nodeTask={classData[0].nodeTask}
            projectName={this.props.projectName}
            taskName={this.props.taskName}
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
                options={classData ? classData.map((e) => { return e.title }) : []}
                editNode={this.editNodeInfo}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTableDb
                title="Relationships" value="Value"
                placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                options={propertyData && propertyObj
                  ? [...propertyData, ...propertyObj].map((e) => { return e }) : []}
                editNode={this.editNodeInfo}
                selectKey={currentNode ? currentNode.key : ''}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <FlexTable
                title="Same As" data={currentNode ? currentNode.sameAs : []}
                placeholder="请输入实体"
                options={treeData ? treeData.map((e) => { return e.title }) : []}
              />
            </div>
          </div>
          {/* <div>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>指标</div>
            <Empty style={{ marginTop: 10 }} />
          </div> */}
        </div>
        <div style={{ height: '100%', minWidth: 450, borderLeft: '1px solid #e8e8e8', paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: 400, border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(treeData || [], selectNode)} />
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
