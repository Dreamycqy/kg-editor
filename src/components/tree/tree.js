import React from 'react'
import { Tree, Modal, Input, Icon, message, Select } from 'antd'
import { Menu, Item, MenuProvider } from 'react-contexify'
import uuid from 'uuid'
import _ from 'lodash'
import 'react-contexify/dist/ReactContexify.min.css'

const { TreeNode } = Tree
const { Search } = Input
let dataList = []

class NormalTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: this.props.data,
      createList: [],
      selectKey: '',
      searchValue: '',
      autoExpandParent: true,
    }
  }

  componentWillMount = () => {
    if (this.state.treeData[0] && this.props.selectKey === '') {
      this.props.selectNode(this.state.treeData[0].key)
    }
    this.generateList(this.state.treeData)
    this.setState({ expandedKeys: dataList.map((item) => { return item.key }) })
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.data, this.state.treeData)) {
      this.setState({ treeData: nextProps.data })
      if (nextProps.data[0] && !_.find(nextProps.oriData, { key: nextProps.selectKey })) {
        this.props.selectNode(nextProps.data[0].key)
      }
      dataList = []
      this.generateList(nextProps.data)
      this.setState({ expandedKeys: dataList.map((item) => { return item.key }) })
    }
  }

  onSelect = (keys, event) => {
    this.props.selectNode(event.node.props.title.props.datakey)
    this.setState({ selectKey: event.node.props.eventKey })
  }

  onDrop = (info) => {
    const dropName = info.node.props
    const dragName = info.dragNode.props.title.props.text
    let quit = false
    if (info.dropToGap === false) {
      if (dropName.children) {
        for (const i of dropName.children) {
          if (i.props.title.props.text === dragName) {
            message.error(`当前节点下已有节点 ${dragName}！`)
            quit = true
            return
          }
        }
      }
    } else {
      for (const i of this.state.treeData) {
        if (i.title === dragName) {
          message.error(`最外层已有节点 ${dragName}！`)
          quit = true
          return
        }
      }
    }
    if (quit === true) {
      return
    }
    const dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr)
        }
        if (item.children) {
          return loop(item.children, key, callback)
        }
      })
    }
    let dragObj
    const data = [...this.state.treeData]
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (info.dropToGap === false) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        item.children.push(dragObj)
      })
    } else if (
      (info.node.props.children || []).length > 0
      && info.node.props.expanded
      && dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        item.children.unshift(dragObj)
      })
    } else {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }

    this.setState({
      treeData: data,
    })
    if (info.dropToGap === false) {
      this.props.editNode(data, 'drag', [dragKey, dropKey])
    } else {
      this.props.editNode(data)
    }
  }

  onDragEnter = () => {
    // console.log(info)
  }

  onChange = (e) => {
    const { value } = e.target
    const expandedKeys = []
    dataList.forEach((item) => {
      if (item.title.indexOf(value) > -1) {
        expandedKeys.push(this.getParentKey(item.key, this.state.treeData))
      }
    })
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    })
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  getParentKey = (key, tree) => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }

  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title } = node
      dataList.push({ key, title })
      if (node.children) {
        this.generateList(node.children)
      }
    }
  }

  nodeMove = () => {}

  showCreateModal = (e) => {
    let key = e
    if (typeof e !== 'string') {
      if (e.tagName === 'DIV') {
        key = e.childNodes[0].getAttribute('dataKey')
      } else {
        key = e.getAttribute('dataKey')
      }
    }
    if (this.props.treeType === 'class') {
      if (!key || key === '') {
        message.error('请选择节点')
        return
      }
    }
    this.setState({ selectKey: key, visible: true, createList: [] })
  }

  showDeleteModal = (e) => {
    let key = e
    if (typeof e !== 'string') {
      if (e.tagName === 'DIV') {
        key = e.childNodes[0].getAttribute('dataKey')
      } else {
        key = e.getAttribute('dataKey')
      }
    }
    if (!key || key === '') {
      message.error('请选择节点')
      return
    }
    const that = this
    Modal.confirm({
      title: '你确定要删除该节点吗',
      content: '该节点及其子节点将被删除',
      onOk() {
        that.nodeDelete(key)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  nodeCreate = () => {
    const { treeData, selectKey, createList } = this.state
    createList.forEach((i) => {
      const newKey = uuid()
      if (selectKey === '') {
        treeData.push({
          title: i,
          key: newKey,
        })
      } else {
        this.addNode(selectKey, treeData, newKey, i)
      }
    })
    this.setState({
      treeData,
      visible: false,
    })
    this.props.editNode(treeData)
  }

  addNode = (key, data, newKey, createName) => data.map((item) => {// eslint-disable-line
    if (item.key === key) {
      if (!item.children) {
        item.children = []
      }
      if (!_.find(item.children, { title: createName })) {
        item.children.push({
          title: createName,
          key: newKey,
        })
      } else {
        message.error(`已存在属性名"${createName}"`)
      }
      return
    }
    if (item.children && item.children.length > 0) {
      this.addNode(key, item.children, newKey, createName)
    }
  })

  nodeDelete = (key) => {
    const { treeData } = this.state
    this.deleteNode(key, treeData)
    this.setState({
      treeData,
    })
    this.props.editNode(treeData)
  }

  deleteNode = (key, data) => data.map((item, index) => { // eslint-disable-line
    if (item.key === key) {
      data.splice(index, 1)
    } else if (item.children) {
      this.deleteNode(key, item.children)
    }
  })

  myAwesomeMenu = () => (
    <Menu id="menu_id">
      <Item onClick={item => this.showCreateModal(item.event.toElement)}> {/* eslint-disable-line */}
        Create
      </Item>
      <Item onClick={item => this.showDeleteModal(item.event.toElement)}> {/* eslint-disable-line */}
        Delete
      </Item>
      {/* <Item onClick={item => this.nodeMove(item.props.ref.attributes)}>Move</Item> */}
    </Menu>
  )

  renderTreeNodes = (data) => {
    const { searchValue } = this.state
    const result = []
    data.forEach((item) => {
      if (item.title) {
        const index = item.title.indexOf(searchValue)
        const beforeStr = item.title.substr(0, index)
        const afterStr = item.title.substr(index + searchValue.length)
        const titleText = index > -1
          ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          )
        const title = (
          <MenuProvider id="menu_id" text={item.title} datakey={item.key}>
            <Icon
              style={{ color: this.props.iconColor, marginRight: 6 }} type={this.props.iconType}
            />
            {titleText}
          </MenuProvider>
        )
        if (item.children) {
          result.push(
            <TreeNode
              title={title} key={item.key}
            >
              {this.renderTreeNodes(item.children)}
            </TreeNode>,
          )
        } else {
          result.push(<TreeNode
            title={title} key={item.key}
          />)
        }
      }
    })
    return result
  }

  render() {
    const {
      treeData, createList, visible, selectKey, autoExpandParent, expandedKeys,
    } = this.state
    return (
      <div style={{ height: '100%' }}>
        <div>
          <Search style={{ marginBottom: 8, width: 200 }} placeholder="Search" onChange={this.onChange} />
          <span style={{ display: this.props.onlyShow ? 'none' : 'inline-block' }}>
            <a
              href="javascript:;" style={{ marginLeft: 10, fontSize: 20 }}
              onClick={() => this.showCreateModal(selectKey)}
            >
              <Icon type="plus-circle" />
            </a>
            <a
              href="javascript:;" style={{ marginLeft: 10, fontSize: 20 }}
              onClick={() => this.showDeleteModal(selectKey)}
            >
              <Icon type="close-circle" />
            </a>
          </span>
        </div>
        <Tree
          draggable
          blockNode
          autoExpandParent
          onDragEnter={this.onDragEnter}
          defaultExpandedKeys={this.state.expandedKeys}
          onDrop={this.onDrop}
          onSelect={this.onSelect}
          selectedKeys={[selectKey]}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          autoExpandParent={autoExpandParent}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        {this.props.onlyShow ? null : this.myAwesomeMenu(dataList)}
        <Modal
          title="新增属性(可添加多个)"
          visible={visible}
          onOk={() => this.nodeCreate()}
          onCancel={() => this.setState({ visible: false })}
        >
          <Select
            value={createList}
            mode="tags"
            onChange={value => this.setState({ createList: value })}
            style={{ width: '100%' }}
          />
        </Modal>
      </div>
    )
  }
}
export default NormalTree
