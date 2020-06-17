import React from 'react'
import { Modal, Table, Button } from 'antd'
import _ from 'lodash'
import Tree from '@/components/tree/classTree'
import Chart from '@/components/charts/newGrapeChart'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

let dataList = []
let newList = []
const treeData = []
const typesArray = []

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
      visibleClass: false,
      visibleIndis: false,
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
    const { selectNode, visibleClass, visibleIndis } = this.state
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
    const dataSourceB = [
      { key: '名称', value: '语文' },
      { key: '关联实体', value: '文言文' },
      { key: '关联实体', value: '现代文' },
      { key: '关联实体', value: '散文' },
    ]
    const dataSourceA = [
      { key: '名称', value: '宋词' },
      { key: '关联实体', value: '辛弃疾' },
      { key: '关联实体', value: '苏轼' },
      { key: '关联实体', value: '李清照' },
    ]
    const columns = [{
      title: 'key',
      dataIndex: 'key',
      width: 120,
      align: 'right',
    }, {
      title: 'none',
      width: 10,
    }, {
      title: 'value',
      dataIndex: 'value',
      align: 'left',
    }]
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', minWidth: 450, paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: 600, border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode)} />
          </div>
        </div>
        <div style={{ flexGrow: 1, padding: '0 10px', minWidth: 300 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            节点详情
            <Button style={{ marginLeft: 260 }} type="primary" onClick={() => this.setState({ visibleClass: true })}>新增概念</Button>
            <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.setState({ visibleIndis: true })}>新增实体</Button>
          </div>
          <Table
            dataSource={currentNode ? currentNode.title === '宋词' ? dataSourceA : dataSourceB : []}
            columns={columns}
            size="small"
            showHeader={false}
            pagination={false}
            rowKey={record => record.key + record.value}
          />
        </div>
        <div style={{ height: '100%', minWidth: 300, paddingLeft: 10, borderLeft: '1px solid #e8e8e8' }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>树结构</div>
          <Tree
            iconType="smile" iconColor="#1296db"
            data={this.listToTree(classData)} selectNode={this.selectNode}
            editNode={this.editNode} treeType="class"
          />
        </div>
        <Modal
          visible={visibleClass}
          title="添加概念"
          onCancel={() => this.setState({ visibleClass: false })}
        >
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            当前概念节点: {currentNode ? currentNode.title : ''}
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
        </Modal>
        <Modal
          title="添加实体"
          visible={visibleIndis}
          onCancel={() => this.setState({ visibleIndis: false })}
        >
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            当前概念节点: {currentNode ? currentNode.title : ''}
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
                  ? [...propertyData, ...propertyObj].map((e) => { return e.title }) : []}
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
        </Modal>
      </div>
    )
  }
}
export default PublicResource
