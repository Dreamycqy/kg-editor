import React from 'react'
import { Tree, Modal, Input, Icon, message, Cascader, Select } from 'antd'
import _ from 'lodash'
import UploadExcel from '@/components/upload/uploadExcel'
import UploadJson from '@/components/upload/uploadJson'

const { Search } = Input
const { TreeNode } = Tree
const { Option } = Select

class SimpleTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: this.props.data,
      showTreeData: this.props.data,
      createName: '',
      visible: false,
      selectKey: [],
      filterValue: [],
      fileType: 'json',
    }
  }

  componentWillMount = () => {
    if (this.state.treeData[0]) {
      this.props.selectNode(this.state.treeData[0].key)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.data, this.props.data)) {
      this.setState({ treeData: nextProps.data })
      if (nextProps.data[0]) {
        this.props.selectNode(nextProps.data[0].key)
      }
    }
  }

  onSelect = (keys, event) => {
    this.props.selectNode(event.node.props.eventKey)
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

  handleFilter = (value) => {
    this.setState({ filterValue: value })
    const { treeData } = this.state
    if (value.length === 1) {
      this.setState({ showTreeData: treeData })
    } else {
      const showTreeData = treeData.filter((e) => {
        return e.types.indexOf(value[value.length - 1]) > -1
      })
      this.setState({ showTreeData })
    }
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
      content: '该实体节点将被删除',
      onOk() {
        that.nodeDelete(key[0])
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
    this.props.editNode([{
      title: createName, key: createName, types: [], relationships: [], sameAs: [],
    }], 'add')
    this.setState({ visible: false })
  }

  nodeDelete = (key) => {
    const { treeData } = this.state
    const target = _.find(treeData, { key })
    const array = treeData.filter((e) => {
      return e.key !== key
    })
    this.setState({ treeData: array, showTreeData: array })
    this.props.editNode(target, 'delete')
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

  close = () => {
    this.setState({ visibleExcel: false })
  }

  render() {
    const {
      showTreeData, visible, createName, selectKey, visibleExcel, filterValue, fileType,
    } = this.state
    return (
      <div>
        <div style={{ display: this.props.showFilter ? 'block' : 'none' }}>
          <Cascader
            options={this.props.classData}
            changeOnSelect
            value={filterValue}
            style={{ width: 280, marginBottom: 10 }}
            placeholder="            按Classes筛选"
            onChange={value => this.handleFilter(value)}
          />
        </div>
        <div>
          <Search style={{ marginBottom: 8, width: 200 }} placeholder="Search" onChange={this.onChange} />
          <span style={{ display: this.props.onlyShow ? 'none' : 'inline-block' }}>
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
            <a
              href="javascript:;" style={{ marginLeft: 10, fontSize: 20 }}
              onClick={() => this.setState({ visibleExcel: true })}
            >
              <Icon type="upload" />
            </a>
          </span>
        </div>
        <Tree
          onSelect={this.onSelect}
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
        <Modal
          title="导入实体列表"
          visible={visibleExcel}
          width="1000px"
          onCancel={() => this.close()}
          footer={null}
        >

          <div style={{ margin: 10 }}>
            选择文件类型：&nbsp;
            <Select
              style={{ width: 150 }}
              value={fileType}
              onChange={value => this.setState({ fileType: value })}
            >
              <Option key="excel" value="excel">Excel</Option>
              <Option key="json" value="json">Json</Option>
            </Select>
          </div>
          {
            fileType === 'excel'
              ? (
                <UploadExcel
                  nodeTask={this.props.nodeTask}
                  projectName={this.props.projectName}
                  taskName={this.props.taskName}
                  close={this.close}
                />
              )
              : (
                <UploadJson
                  nodeTask={this.props.nodeTask}
                  projectName={this.props.projectName}
                  taskName={this.props.taskName}
                  close={this.close}
                />
              )
          }
        </Modal>
      </div>
    )
  }
}
export default SimpleTree
