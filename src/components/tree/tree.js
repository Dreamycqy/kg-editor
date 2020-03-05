import React from 'react'
import { Tree, Modal, Input } from 'antd'
import { Menu, Item, MenuProvider } from 'react-contexify'
import uuid from 'uuid'
import 'react-contexify/dist/ReactContexify.min.css'

const { TreeNode } = Tree

class NormalTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [{
        title: 'Medical',
        key: 'Medical1',
        children: [
          {
            title: '临床分型',
            key: 'dhuhef',
            children: [{
              title: '临床分型危重型',
              key: 'dhuhefdwug',
            }, {
              title: '临床分型重型',
              key: 'dhuhefd7wg7d',
            }, {
              title: '临床分型普通型',
              key: 'dhuhefsuus',
            }],
          },
          {
            title: '治疗方法',
            key: 'dhuhduehuef',
            children: [{
              title: '一般治疗',
              key: 'dhuhexuhsuxfdwug',
            }, {
              title: '中医治疗',
              key: 'dhuxushhefd7wg7d',
            }, {
              title: '药物治疗',
              key: 'dhuxxshuhefsuus',
            }],
          },
          {
            title: '高发人群',
            key: 'dhuhdrenqunuef',
          },
        ],
      }],
      createName: '',
      selectKey: '',
    }
  }

  componentWillMount = () => {
    this.props.selectNode(this.state.treeData[0].title)
  }

  onSelect = (keys, event) => {
    this.props.selectNode(event.node.props.title.props.text)
    this.setState({ selectKey: event.node.props.eventKey })
  }

  onDrop = (info) => {
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
    const data = [...this.state.treeData]

    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
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
  }

  onDragEnter = (info) => {
    console.log(info)
  }

  nodeMove = () => {}

  showCreateModal = (e) => {
    console.log(e)
    this.setState({ selectKey: e, visible: true, createName: '' })
  }

  nodeCreate = () => {
    const { treeData, selectKey } = this.state
    this.addNode(selectKey, treeData)
    this.setState({
      treeData,
      visible: false,
    })
  }

  addNode = (key, data) => data.map((item) => { // eslint-disable-line
    if (item.key === key) {
      if (item.children) {
        item
          .children
          .push({
            title: this.state.createName,
            key: key + uuid(),
          })
      } else {
        item.children = []
        item
          .children
          .push({
            title: this.state.createName,
            key: key + uuid(),
          })
      }
      return
    }
    if (item.children) {
      this.addNode(key, item.children)
    }
  })

  nodeDelete = (key) => {
    const { treeData } = this.state
    this.deleteNode(key, treeData)
    this.setState({
      treeData,
    })
  }

  deleteNode = (key, data) => data.map((item, index) => { // eslint-disable-line
    if (item.key === key) {
      data.splice(index, 1)
    } else if (item.children) {
      this.deleteNode(key, item.children)
    }
  })

  myAwesomeMenu = () => (
    <Menu id="menuid">
      <Item onClick={item => this.showCreateModal(item.props.ref.attributes ? item.props.ref.attributes.datakey.value : this.state.selectKey)}> {/* eslint-disable-line */}
        Create
      </Item>
      <Item onClick={item => this.nodeDelete(item.props.ref.attributes ? item.props.ref.attributes.datakey.value : this.state.selectKey)}> {/* eslint-disable-line */}
        Delete
      </Item>
      <Item onClick={item => this.nodeMove(item.props.ref.attributes)}>Move</Item>
    </Menu>
  )

  renderTreeNodes = (data) => {
    const result = []
    data.forEach((item) => {
      const title = (<MenuProvider id="menuid" text={item.title} datakey={item.key}><span>{item.title}</span></MenuProvider>)
      if (item.children) {
        result.push(
          <TreeNode
            title={title} key={item.key}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>,
        )
      } else {
        result.push(<TreeNode title={title} key={item.key} />)
      }
    })
    return result
  }

  render() {
    const {
      treeData, createName, visible,
    } = this.state
    return (
      <div>
        <Tree
          draggable
          blockNode
          autoExpandParent
          onDragEnter={this.onDragEnter}
          defaultExpandedKeys={this.state.expandedKeys}
          onDrop={this.onDrop}
          onSelect={this.onSelect}
          // defaultExpandAll
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        {this.myAwesomeMenu()}
        <Modal
          title="工作进度"
          visible={visible}
          onOk={() => this.nodeCreate()}
          onCancel={() => this.setState({ visible: false })}
        >
          <Input
            value={createName}
            onChange={e => this.setState({ createName: e.target.value })}
          />
        </Modal>
      </div>
    )
  }
}
export default NormalTree
