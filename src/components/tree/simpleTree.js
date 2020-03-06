import React from 'react'
import { Tree, Modal, Input, Icon, message, Upload, Table, Cascader } from 'antd'
import * as XLSX from 'xlsx'
import options from '@/utils/mock/publicIndisOption'

const { Search } = Input
const { TreeNode } = Tree
const { Dragger } = Upload

class SimpleTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: this.props.data,
      showTreeData: this.props.data,
      createName: '',
      visible: false,
      selectKey: [],
      dataSource: [],
      fileList: [],
      filterValue: [],
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

  onImportExcel = (files) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const workbook = XLSX.read(result, { type: 'binary' })
        let data = []
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) { // eslint-disable-line
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          }
        }
        this.setState({ dataSource: [...this.state.dataSource, ...data] })
        message.success('上传成功！')
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files)
  }

  handleFileList = (list) => {
    this.setState({ dataSource: [] })
    list.forEach((a) => {
      this.onImportExcel(a.originFileObj)
    })
  }

  handleFilter = (value) => {
    this.setState({ filterValue: value })
    if (value[value.length - 1] === '医用防护标准') {
      this.setState({ showTreeData: this.state.treeData.slice(0, 5) })
    } else if (value[value.length - 1] === '症状') {
      this.setState({ showTreeData: this.state.treeData.slice(5, 10) })
    } else {
      this.setState({ showTreeData: [] })
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
    const {
      showTreeData, visible, createName, selectKey, visibleExcel, dataSource, fileList, filterValue,
    } = this.state
    const columns = []
    if (dataSource.length > 0) {
      for (const i in dataSource[0]) { // eslint-disable-line
        columns.push({
          title: i,
          dataIndex: i,
        })
      }
    }
    const that = this
    const props = {
      name: 'file',
      action: '',
      fileList,
      headers: {
        authorization: 'authorization-text',
      },
      // beforeUpload: file => that.onImportExcel(file),
      multiple: true,
      onChange(info) {
        const list = [...info.fileList].map((file) => {
          if (file.response) {
            file.url = file.response.url
          }
          return file
        })
        that.setState({ fileList: list }, () => that.handleFileList(list))
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }
    return (
      <div>
        <div style={{ display: this.props.showFilter ? 'block' : 'none' }}>
          <Cascader
            options={options}
            changeOnSelect
            value={filterValue}
            style={{ width: 280, marginBottom: 10 }}
            placeholder="            按Classes筛选"
            onChange={value => this.handleFilter(value)}
          />
        </div>
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
        <Modal
          title="新增实体"
          visible={visibleExcel}
          onOk={() => {
            this.setState({ visibleExcel: false, fileList: [], dataSource: [] })
            message.success('上传成功')
          }}
          width="1000px"
          onCancel={() => this.setState({ visibleExcel: false })}
        >
          <div>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖入文件以开始上传</p>
              <p className="ant-upload-hint">
                支持大小不超过5MB，后缀名为xls或xlsx的Excel文件，支持多个文件
              </p>
            </Dragger>
            <Table
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        </Modal>
      </div>
    )
  }
}
export default SimpleTree
