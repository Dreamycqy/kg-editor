import React from 'react'
import { Tree, Col, Row, Icon, Button } from 'antd'
import _ from 'lodash'
import uuid from 'uuid'
import { getProjectClassesTree } from '@/services/edukg'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableDb'

const { TreeNode } = Tree

class RemakeClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classTree: [],
      newTree: [],
      currentNode: {},
      selectNode: {},
      checkList: [],
      expandedKeys: [],
    }
  }

  componentWillMount = async () => {
    await this.getClass()
    if (this.props.mainClass.length > 0) {
      this.handleProps(this.props)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.mainClass.length > 0) {
      this.handleProps(nextProps)
    }
  }

  onSelectNew = (keys) => {
    if (keys.length === 0) {
      return
    }
    const { newTree, classTree } = this.state
    this.setState({
      currentNode: _.find(newTree, { key: keys[0] }),
      selectNode: _.find(classTree, { key: keys[0] }),
    })
  }

  onSelect = (keys) => {
    if (keys.length === 0) {
      return
    }
    const { classTree } = this.state
    this.setState({ selectNode: _.find(classTree, { key: keys[0] }) })
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    })
  }

  getMyData = () => {
    let result = []
    const { newTree, classTree, checkList } = this.state
    if (newTree.length > 0) {
      classTree.forEach((e) => {
        const target = _.find(newTree, { key: e.key })
        let item = e
        if (target) {
          if (_.find(checkList, { key: target.key }).method === 'replace') {
            item = target
          } else if (_.find(checkList, { key: target.key }).method === 'mix') {
            item.relationships = e.relationships.concat(target.relationships)
            item.target = _.uniq(e.target.concat(target.target))
          }
        }
        result.push(item)
      })
    } else {
      result = classTree
      const firstClass = classTree.filter((e) => { return e.target.length === 0 })
      const key = uuid()
      result.push({
        key,
        nodeTask: this.props.nodeTask || [],
        relationships: [],
        source: key,
        target: [firstClass[0].key],
        title: this.props.mainClass,
      })
    }
    return result
  }

  getClass = async () => {
    const data = await getProjectClassesTree({
      projectName: this.props.projectName,
    })
    if (data) {
      this.setState({
        classTree: data.data,
        expandedKeys: data.data.map((item) => { return item.key }),
      })
    }
  }

  handleProps = (props) => {
    const { classTree } = this.state
    const newTree = []
    const targetNode = _.find(classTree, { title: props.mainClass })
    if (targetNode) {
      const firstClass = classTree.filter((e) => { return e.target.length === 0 })
      newTree.push({
        key: targetNode.key,
        nodeTask: props.nodeTask || [],
        relationships: [],
        source: targetNode.key,
        target: [firstClass[0].key],
        title: props.mainClass,
      })
    }
    this.setState({
      newTree, selectNode: newTree[0] || {}, currentNode: newTree[0] || {}, checkList: newTree,
    })
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

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.key} {...item} />
  })

  renderTreeNodeNew = (data, checkList) => data.map((item) => {
    return <TreeNode key={item.key} title={(<span><Icon type="check-circle" style={{ color: this.checkColor(item.key, checkList), marginRight: 4 }} />{item.title}</span>)} />
  })

  checkColor = (key, checkList) => {
    const target = _.find(checkList, { key })
    if (target.method) {
      if (target.method === 'replace') {
        return '#2db7f5'
      } else if (target.method === 'mix') {
        return '#87d068'
      }
    } else {
      return '#888'
    }
  }

  remake = (type) => {
    const { currentNode, checkList } = this.state
    _.find(checkList, { key: currentNode.key }).method = type
    this.setState({ checkList })
  }

  mixAll = () => {
    const { checkList } = this.state
    checkList.forEach((e) => {
      e.method = 'mix'
    })
    this.setState({ checkList })
  }

  render() {
    const { classTree, newTree, currentNode, selectNode, expandedKeys, checkList } = this.state
    let selectNodeKey = ''
    let currentNodeKey = ''
    const currentParent = []
    if (currentNode.target) {
      currentNodeKey = currentNode.key
      currentNode.target.forEach((e) => {
        const parent = _.find(classTree, { key: e })
        if (parent) {
          currentParent.push(parent.title)
        }
      })
    }
    const selectParent = []
    if (selectNode.target) {
      selectNodeKey = selectNode.key
      selectNode.target.forEach((e) => {
        const parent = _.find(classTree, { key: e })
        if (parent) {
          selectParent.push(parent.title)
        }
      })
    }
    return (
      <div>
        <Row style={{ marginTop: 20, border: '1px solid #e8e8e8', borderRadius: 8, padding: '10px 0' }}>
          <Col span={12} style={{ overflow: 'hidden', minHeight: 500, borderRight: '1px solid #e8e8e8' }}>
            <div style={{ height: 40, lineHeight: '40px', fontSize: 24, fontWeight: 700, marginLeft: 30 }}>
              重复内容
            </div>
            <div style={{ float: 'left', width: 200, minHeight: 500, borderRight: '1px solid #e8e8e8', marginRight: 20 }}>
              <Tree
                onSelect={this.onSelectNew}
                selectedKeys={[currentNodeKey]}
              >
                {this.renderTreeNodeNew(newTree, checkList)}
              </Tree>
            </div>
            <div style={{ float: 'left', margin: '0 auto' }}>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Annotations" limited
                  data={[currentNode ? currentNode.title : '']}
                  selectKey={currentNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Parents" data={currentParent}
                  placeholder="请输入类名"
                  options={[]}
                  selectKey={currentNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTableDb
                  title="Relationships" value="Value"
                  placeholder="请输入属性" data={currentNode ? currentNode.relationships : []}
                  options={[]}
                  selectKey={currentNodeKey}
                  onlyShow
                />
              </div>
            </div>
          </Col>
          <Col span={12} style={{ overflow: 'hidden', minHeight: 500 }}>
            <div style={{ height: 40, lineHeight: '40px', fontSize: 24, fontWeight: 700, marginLeft: 30 }}>
              初始内容
            </div>
            <div style={{ float: 'left', width: 200, minHeight: 500, borderRight: '1px solid #e8e8e8', marginRight: 20 }}>
              <Tree
                onSelect={this.onSelect}
                selectedKeys={[selectNodeKey]}
                expandedKeys={expandedKeys}
                onExpand={this.onExpand}
              >
                {this.renderTreeNodes(this.listToTree(classTree))}
              </Tree>
            </div>
            <div style={{ float: 'left', margin: '0 auto' }}>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Annotations" limited
                  data={[selectNode ? selectNode.title : '']}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Parents" data={selectParent}
                  placeholder="请输入类名"
                  options={[]}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTableDb
                  title="Relationships" value="Value"
                  placeholder="请输入属性" data={selectNode ? selectNode.relationships : []}
                  options={[]}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ height: 60, textAlign: 'center', marginTop: 30 }}>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('ignore')}>忽略</Button>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('replace')}>替换</Button>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('mix')}>融合</Button>
          <Button type="primary" onClick={() => this.mixAll()}>全部融合</Button>
        </div>
      </div>
    )
  }
}
export default RemakeClass
