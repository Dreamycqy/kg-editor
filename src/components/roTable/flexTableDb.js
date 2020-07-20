import React from 'react'
import { Table } from 'antd'
import uuid from 'uuid'
import _ from 'lodash'

export default class FlexTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false,
    }
  }

  componentDidMount = () => {
    if (this.props.data) {
      this.pushConfig(this.props.data)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data && !_.isEqual(nextProps, this.props)) {
      this.pushConfig(nextProps.data)
    }
  }

  getPopupContainer = (node) => {
    return node.parentNode
  }

  getMyData = () => {
    const { dataSource } = this.state
    const result = []
    dataSource.forEach((e) => {
      if (e.key.length > 0) {
        result.push({ key: e.key, value: e.value })
      }
    })
    this.props.editNode(result, this.props.selectKey, this.props.title)
  }

  pushConfig = (data) => {
    const dataSource = []
    data.forEach((e) => {
      if (!_.find(this.props.options, { key: e.key })) {
        return
      }
      const item = {
        key: e.key,
        value: e.value,
        itemKey: uuid(),
      }
      dataSource.push(item)
    })
    if (!this.props.limited) {
      dataSource.push({
        key: '',
        value: '',
        itemKey: uuid(),
      })
    }
    this.setState({ dataSource })
  }

  handleNewData = (dataSource) => {
    this.setState({ dataSource })
  }

  handleAddRow = () => {
    if (this.props.limited) {
      return
    }
    const { dataSource } = this.state
    const newData = {
      key: '',
      value: '',
      itemKey: uuid(),
    }
    this.setState({
      dataSource: [...dataSource, newData],
    })
  }

  handleDeleteRow = async (itemKey) => {
    const dataSource = [...this.state.dataSource]
    await this.setState({ dataSource: dataSource.filter(item => item.itemKey !== itemKey) })
    this.getMyData()
  }

  handleTableChange = (value, itemKey, text) => {
    const { dataSource } = this.state
    const target = dataSource.find(item => item.itemKey === itemKey)
    if (target) {
      target[text] = value
    }
    this.setState({ dataSource })
  }

  handleBlur = async (value, itemKey) => {
    const { dataSource } = this.state
    if (value.length > 0) {
      if (dataSource[dataSource.length - 1].key !== '' && !this.props.limited) {
        // message.success(`添加了${this.props.title}`)
        this.handleAddRow()
      } else {
        // message.success(`编辑了${this.props.title}`)
      }
    } else if (dataSource.length > 1) {
      // message.success(`删除了${this.props.title}`)
      await this.handleDeleteRow(itemKey)
      if (dataSource[dataSource.length - 2].key !== '') {
        this.handleAddRow()
      }
    }
    this.getMyData()
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: this.props.title,
      width: 150,
      render: (text, record) => (
        <span>{_.find(this.props.options, { key: record.key }) ? _.find(this.props.options, { key: record.key }).title : ''}</span>
      ),
    }, {
      title: this.props.value,
      dataIndex: 'value',
    }]
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered={false}
          size="small"
          rowKey="itemKey"
          loading={loading}
          locale={{
            emptyText: '暂无配置',
          }}
          style={{ backgroundColor: '', border: 'none' }}
        />
      </div>
    )
  }
}
