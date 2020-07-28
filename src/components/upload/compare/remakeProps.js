import React from 'react'
import { Tree, Col, Row, Icon, Button } from 'antd'
import _ from 'lodash'
import uuid from 'uuid'
import { getProjectPropertiesTree } from '@/services/edukg'
import FlexTable from '@/components/table/flexTable'

const { TreeNode } = Tree
const typeArray = [
  { title: 'string', key: 'string' }, { title: 'int', key: 'int' }, { title: 'float', key: 'float' },
]

class RemakeProps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originTree: [],
      newTree: [],
      currentNode: {},
      selectNode: {},
      checkList: [],
      expandedKeys: [],
    }
  }

  componentWillMount = async () => {
    if (this.props.activeKey === 'object') {
      await this.getPobj()
    } else {
      await this.getPdata()
    }
    this.handleProps(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    this.handleProps(nextProps)
  }

  onSelectNew = (keys) => {
    if (keys.length === 0) {
      return
    }
    const { newTree, originTree } = this.state
    this.setState({
      currentNode: _.find(newTree, { key: keys[0] }),
      selectNode: _.find(originTree, { key: keys[0] }),
    })
  }

  onSelect = (keys) => {
    if (keys.length === 0) {
      return
    }
    const { originTree } = this.state
    this.setState({ selectNode: _.find(originTree, { key: keys[0] }) })
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    })
  }

  getMyData = () => {
    const result = []
    const { newTree, originTree, checkList } = this.state
    this.props.addTreeList.forEach((e) => {
      const target = _.find(newTree, { title: e.title })
      let item = {}
      if (target) {
        const tag = _.find(checkList, { key: target.key })
        const oriTarget = _.find(originTree, { title: e.title })
        item = oriTarget
        if (tag.method === 'replace') {
          item = target
        } else if (tag.method === 'mix') {
          item.domain = _.uniq(target.domain.concat(oriTarget.domain))
          item.range = _.uniq(target.range.concat(oriTarget.range))
        }
      } else {
        const key = uuid()
        item = {
          domain: [],
          key,
          range: [],
          source: key,
          target: '',
          title: e.title,
        }
      }
      result.push(item)
    })
    return result
  }

  getPobj = async () => {
    const data = await getProjectPropertiesTree({
      projectName: this.props.projectName,
      type: 'object',
    })
    this.setState({
      originTree: data.data,
      expandedKeys: data.data.map((item) => { return item.key }),
    })
  }

  getPdata = async () => {
    const data = await getProjectPropertiesTree({
      projectName: this.props.projectName,
      type: 'data',
    })
    if (data) {
      this.setState({
        originTree: data.data,
        expandedKeys: data.data.map((item) => { return item.key }),
      })
    }
  }

  handleProps = (props) => {
    const { originTree } = this.state
    const newTree = []
    props.addTreeList.forEach((e) => {
      const targetNode = _.find(originTree, { title: e.title })
      if (targetNode) {
        newTree.push({
          domain: [],
          key: targetNode.key,
          range: [],
          source: targetNode.key,
          target: '',
          title: e.title,
        })
      }
    })
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
    const { originTree, newTree, currentNode, selectNode, expandedKeys, checkList } = this.state
    const { classList, activeKey } = this.props
    let selectNodeKey = ''
    let currentNodeKey = ''
    if (currentNode.title) {
      currentNodeKey = currentNode.key
    }
    if (selectNode.title) {
      selectNodeKey = selectNode.key
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
            <div style={{ float: 'left', margin: '0 auto', minWidth: 400 }}>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Annotations" limited
                  data={[currentNode.title]}
                  selectKey={currentNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Domain" data={currentNode.domain}
                  placeholder="请输入类名"
                  options={classList}
                  selectKey={currentNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Range" data={currentNode.range}
                  placeholder={activeKey === 'object' ? '请输入类名' : '请输入数据'}
                  options={activeKey === 'object' ? classList : typeArray}
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
                {this.renderTreeNodes(this.listToTree(originTree))}
              </Tree>
            </div>
            <div style={{ float: 'left', margin: '0 auto', minWidth: 400 }}>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Annotations" limited
                  data={[selectNode.title]}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Domain" data={selectNode.domain}
                  placeholder="请输入类名"
                  options={classList}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Range" data={selectNode.range}
                  placeholder={activeKey === 'object' ? '请输入类名' : '请输入数据'}
                  options={activeKey === 'object' ? classList : typeArray}
                  selectKey={selectNodeKey}
                  onlyShow
                />
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ height: 60, textAlign: 'center', marginTop: 30, display: newTree.length > 0 ? 'block' : 'none' }}>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('ignore')}>忽略</Button>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('replace')}>替换</Button>
          <Button style={{ marginRight: 20 }} onClick={() => this.remake('mix')}>融合</Button>
          <Button type="primary" onClick={() => this.mixAll()}>全部融合</Button>
        </div>
      </div>
    )
  }
}
export default RemakeProps
