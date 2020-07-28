import React from 'react'
import { Tree, Col, Row, Icon, Button } from 'antd'
import _ from 'lodash'
import uuid from 'uuid'
import { getProjectIndividualsTree } from '@/services/edukg'
import FlexTable from '@/components/table/flexTable'
import FlexTableDb from '@/components/table/flexTableTri'

const { TreeNode } = Tree
let temp = []

class RemakeClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originTree: [],
      newTree: [],
      currentNode: {},
      selectNode: {},
      checkList: [],
      setNewTree: [],
    }
  }

  componentWillMount = async () => {
    await this.getIndis()
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

  getMyData = () => {
    const result = []
    const { newTree, originTree, checkList, setNewTree } = this.state
    setNewTree.forEach((e) => {
      const target = _.find(newTree, { title: e.title })
      let item = e
      if (target) {
        const tag = _.find(checkList, { key: target.key })
        const oriTarget = _.find(originTree, { title: e.title })
        item = oriTarget
        if (tag.method === 'replace') {
          item = target
        } else if (tag.method === 'mix') {
          item.sameAs = _.uniq(target.sameAs.concat(oriTarget.sameAs))
          item.types = _.uniq(target.types.concat(oriTarget.types))
          const relationships = oriTarget.relationships
          // item.relationships.forEach((rItem) => {
          //   for (const r2Item of relationships) {
          //     if (!_.isEqual(rItem, r2Item)) {
          //       relationships.push(r2Item)
          //     }
          //   }
          // })
          item.relationships = relationships
        }
      }
      delete item.others
      result.push(item)
    })
    return result
  }

  getIndis = async () => {
    const data = await getProjectIndividualsTree({
      projectName: this.props.projectName,
    })
    if (data) {
      this.setState({
        originTree: data.data.filter((e) => { return !!e.key }),
      })
    }
  }

  handleProps = (props) => {
    const { originTree } = this.state
    const { dataSource, mainName, isClass, classList, mainClass, objPropList, dataPropList } = props
    const newTree = []
    const tmp = JSON.stringify(originTree)
    const setNewTree = JSON.parse(tmp)
    const classKey = _.find(classList, { title: mainClass })
    dataSource.forEach((e) => {
      const targetNode = _.find(originTree, { title: e[mainName] })
      if (targetNode) {
        const item = {
          key: targetNode.key,
          sameAs: [],
          title: e[mainName],
          types: isClass ? [classKey] : [],
          others: e,
        }
        newTree.push(item)
      } else {
        setNewTree.push({
          key: uuid(),
          sameAs: [],
          title: e[mainName],
          types: isClass ? [classKey] : [],
          others: e,
        })
      }
    })
    for (const e of newTree) {
      temp = []
      this.handleRelationships(e.others, setNewTree, mainName, objPropList, dataPropList)
      e.relationships = temp
    }
    for (const e of setNewTree) {
      temp = []
      this.handleRelationships(e.others, setNewTree, mainName, objPropList, dataPropList)
      e.relationships = temp
    }
    this.setState({
      newTree,
      selectNode: newTree[0] || {},
      currentNode: newTree[0] || {},
      checkList: newTree,
      setNewTree,
    })
  }

  handleRelationships = (item, setNewTree, mainName, objPropList, dataPropList, type) => {
    for (const prop in item) { // eslint-disable-line
      if (prop === mainName) {
        return
      }
      const targetObj = _.find(objPropList, { title: prop })
      const targetData = _.find(dataPropList, { title: prop })
      if (!type) { // 是否有type
        if (targetObj && targetObj !== undefined) { // 第一层无type, 关系
          if (typeof item[prop] === 'object' && !item[prop].length) { // 判断是否为对象
            this.handleRelationships(item[prop], setNewTree, mainName, objPropList, dataPropList, 'object')
          } else if (typeof item[prop] === 'object' && item[prop].length) { // 判断是否为数组
            for (const itemItem of item[prop]) {
              temp.push({
                key: targetObj.key,
                type: 'relation',
                value: _.find(setNewTree, { title: itemItem }).key,
              })
            }
          } else { // 剩余为描述
            temp.push({
              key: targetObj.key,
              type: 'relation',
              value: _.find(setNewTree, { title: item[prop] }).key,
            })
          }
        } else if (targetData) { // 第一层无type, 描述
          if (typeof item[prop] === 'object' && !item[prop].length) { // 判断是否为对象
            this.handleRelationships(item[prop], setNewTree, mainName, objPropList, dataPropList, 'data')
          } else if (typeof item[prop] === 'object' && item[prop].length) { // 判断是否为数组
            for (const itemItem of item[prop]) {
              temp.push({
                key: targetData.key,
                type: 'relation',
                value: itemItem,
              })
            }
          } else {
            temp.push({
              key: targetData.key,
              type: 'relation',
              value: item[prop],
            })
          }
        }
      } else if (type === 'object') { // 子层有type, 关系
        if (typeof item[prop] === 'object' && !item[prop].length) { // 判断是否为对象
          this.handleRelationships(item[prop], setNewTree, mainName, objPropList, dataPropList, 'object')
        } else if (typeof item[prop] === 'object' && item[prop].length) { // 判断是否为数组
          for (const itemItem of item[prop]) {
            temp.push({
              key: targetObj.key,
              type: 'relation',
              value: _.find(setNewTree, { title: itemItem }).key,
            })
          }
        } else {
          temp.push({
            key: targetObj.key,
            type: 'relation',
            value: _.find(setNewTree, { title: item[prop] }).key,
          })
        }
      } else if (type === 'data') { // 子层有type, 描述
        if (typeof item[prop] === 'object' && !item[prop].length) { // 判断是否为对象
          this.handleRelationships(item[prop], setNewTree, mainName, objPropList, dataPropList, 'data')
        } else if (typeof item[prop] === 'object' && item[prop].length) { // 判断是否为数组
          for (const itemItem of item[prop]) {
            temp.push({
              key: targetData.key,
              type: 'relation',
              value: itemItem,
            })
          }
        } else {
          temp.push({
            key: targetData.key,
            type: 'relation',
            value: item[prop],
          })
        }
      }
    }
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
    const { originTree, setNewTree, newTree, currentNode, selectNode, checkList } = this.state
    const { objPropList, dataPropList, classList } = this.props
    let selectNodeKey = ''
    let currentNodeKey = ''
    if (currentNode.title) {
      currentNodeKey = currentNode.key
    }
    if (selectNode.title) {
      selectNodeKey = selectNode.key
    }
    const typesArray = []
    if (currentNode.types) {
      currentNode.types.forEach((e) => {
        typesArray.push(_.find(classList, { key: e }) ? e : '')
      })
    }
    const typesArrayS = []
    if (selectNode.types) {
      selectNode.types.forEach((e) => {
        typesArrayS.push(_.find(classList, { key: e }) ? e : '')
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
                  data={[currentNode.title]}
                  onlyShow
                  selectKey={currentNodeKey}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Types"
                  data={currentNode ? typesArray : []}
                  placeholder="请输入概念类名"
                  selectKey={currentNodeKey}
                  options={classList || []}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTableDb
                  title="Relationships" value="Value"
                  placeholder="请输入属性" data={currentNode.relationships || []}
                  optionData={dataPropList || []}
                  optionObj={objPropList || []}
                  indisList={setNewTree}
                  onlyShow
                  selectKey={currentNodeKey}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Same as" data={currentNode.sameAs || []}
                  placeholder="请输入实体"
                  onlyShow
                  options={setNewTree || []}
                  selectKey={currentNodeKey}
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
                onExpand={this.onExpand}
              >
                {this.renderTreeNodes(originTree)}
              </Tree>
            </div>
            <div style={{ float: 'left', margin: '0 auto' }}>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Annotations" limited
                  data={[selectNode.title]}
                  onlyShow
                  selectKey={selectNodeKey}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Types"
                  data={selectNode ? typesArrayS : []}
                  placeholder="请输入概念类名"
                  selectKey={selectNodeKey}
                  options={classList || []}
                  onlyShow
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTableDb
                  title="Relationships" value="Value"
                  placeholder="请输入属性" data={selectNode.relationships || []}
                  optionData={dataPropList || []}
                  optionObj={objPropList || []}
                  indisList={setNewTree}
                  onlyShow
                  selectKey={selectNodeKey}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <FlexTable
                  title="Same as" data={selectNode.sameAs || []}
                  placeholder="请输入实体"
                  onlyShow
                  options={setNewTree || []}
                  selectKey={selectNodeKey}
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
