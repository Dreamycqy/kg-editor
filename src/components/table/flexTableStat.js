import React from 'react'
import { Table, Popconfirm, Icon, Select, InputNumber, Button } from 'antd'
import uuid from 'uuid'
import _ from 'lodash'
import { makeOption } from '@/utils/common'

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
      result.push(`${e.key}=${e.value}`)
    })
    return result
  }

  pushConfig = (option) => {
    const dataSource = []
    option.forEach((e) => {
      if (e === '') {
        return
      }
      const arr = e.split('=')
      const item = {
        key: arr[0],
        value: Number(arr[1]),
        itemKey: uuid(),
      }
      dataSource.push(item)
    })
    this.setState({ dataSource })
  }

  handleNewData = (dataSource) => {
    this.setState({ dataSource })
  }

  handleAddRow = () => {
    if (this.state.dataSource.length === 5) {
      return
    }
    const { dataSource } = this.state
    const newData = {
      key: '',
      value: 0,
      itemKey: uuid(),
    }
    this.setState({
      dataSource: [...dataSource, newData],
    })
  }

  handleDeleteRow = (itemKey) => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.itemKey !== itemKey) })
  }

  handleTableChange = (value, itemKey, text) => {
    const { dataSource } = this.state
    const target = dataSource.find(item => item.itemKey === itemKey)
    if (target) {
      target[text] = value
    }
    this.setState({ dataSource })
  }

  checkAvaliable = (key) => {
    const { dataSource } = this.state
    if (dataSource.find(item => item.key === key)) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: '类型',
      key: 'key',
      width: 150,
      render: (text, record) => (
        <Select
          value={record.key}
          onChange={value => this.handleTableChange(value, record.itemKey, 'key')}
        >
          {makeOption([
            { name: '概念数量', value: 'class', disabled: this.checkAvaliable('class') },
            { name: '对象属性数量', value: 'propertyObj', disabled: this.checkAvaliable('propertyObj') },
            { name: '数据属性数量', value: 'propertyData', disabled: this.checkAvaliable('propertyData') },
            { name: '实体数量', value: 'individual', disabled: this.checkAvaliable('individual') },
            { name: '三元组数量', value: 'triple', disabled: this.checkAvaliable('triple') },
          ])}
        </Select>
      ),
    }, {
      title: '数值',
      key: 'value',
      width: 300,
      render: (text, record) => (
        <InputNumber
          value={record.value}
          style={{ width: 260 }}
          min={0}
          onChange={value => this.handleTableChange(value, record.itemKey, 'value')}
        />
      ),
    }, {
      title: '操作',
      width: 40,
      render: (text, record) => {
        return (
          <Popconfirm
            title="确定要删除吗？"
            placement="topRight"
            getPopupContainer={this.getPopupContainer}
            onConfirm={() => this.handleDeleteRow(record.itemKey)}
          >
            <a style={{ color: '#888', fontSize: 20 }} href="javascript:;">
              <Icon type="close-circle" theme="filled" />
            </a>
          </Popconfirm>
        )
      },
    }]
    return (
      <div>
        <Button
          size="small" type="primary"
          shape="circle" icon="plus"
          style={{ position: 'absolute', left: 540 }}
          disabled={dataSource.length === 5}
          onClick={() => this.handleAddRow()}
        />
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
