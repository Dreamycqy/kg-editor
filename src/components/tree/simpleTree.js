import React from 'react'
import { Tree, Modal, Input, Icon, message } from 'antd'

const { Search } = Input
const { TreeNode } = Tree

class SimpleTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: this.props.data,
      showTreeData: this.props.data,
      createName: '',
      visible: false,
      selectKey: [],
    }
  }

  componentWillMount = () => {
    if (this.state.treeData[0]) {
      this.props.selectNode(this.state.treeData[0].title)
    }
  }

  onSelect = (keys, event) => {
    this.props.selectNode(event.node.props.title)
    this.setState({ selectKey: keys })
  }

  onChange = (e) => {
    const { value } = e.target
    const { treeData } = this.state
    const showTreeData = treeData.filter((item) => {
      return item.title.indexOf(value) > -1
    })
    this.setState({
      showTreeData,
    })
  }

  showCreateModal = () => {
    this.setState({ visible: true, createName: '' })
  }

  showDeleteModal = (key) => {
    if (key.length < 1) {
      message.error('未选择节点')
      return
    }
    const that = this
    Modal.confirm({
      title: '你确定要删除改节点吗',
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
    const { treeData, createName } = this.state
    if (treeData.filter((item) => {
      return item.title === createName
    }).length > 0) {
      message.error('实体名不能重复')
      return
    }
    this.setState({ treeData: [...treeData, { title: createName, key: createName }] })
    this.setState({ visible: false })
    message.success('添加成功')
  }

  nodeDelete = (key) => {
    const { treeData } = this.state
    const array = treeData.filter((e) => {
      let result = true
      key.forEach((item) => {
        if (item === e.key) {
          result = false
        }
      })
      return result
    })
    this.setState({ treeData: array, showTreeData: array })
    message.success('删除成功')
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode
          title={item.title} key={item.key}
          icon={<Icon style={{ color: this.props.iconColor }} type={this.props.iconType} />}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return (
      <TreeNode
        {...item}
        icon={<Icon style={{ color: this.props.iconColor }} type={this.props.iconType} />}
      />
    )
  })

  render() {
    const { showTreeData, visible, createName, selectKey } = this.state
    return (
      <div>
        <div>
          <Search style={{ marginBottom: 8, width: 200 }} placeholder="Search" onChange={this.onChange} />
          <span>
            <a
              href="javascript:;" style={{ marginLeft: 10, fontSize: 20 }}
              onClick={() => this.showCreateModal()}
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
          onSelect={this.onSelect}
          multiple
          selectKey={selectKey}
          showIcon
        >
          {this.renderTreeNodes(showTreeData)}
        </Tree>
        <Modal
          title="新增实体"
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
export default SimpleTree
