import React from 'react'
import { Table, Input, Popconfirm, Icon, message, Select } from 'antd'
import uuid from 'uuid'
import _ from 'lodash'
import { makeOptionTable } from '@/utils/common'

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
        result.push(e.key)
      }
    })
    this.props.editNode(result, this.props.selectKey, this.props.title)
  }

  pushConfig = (data) => {
    const dataSource = []
    data.forEach((e) => {
      const item = {
        key: e,
        itemKey: uuid(),
      }
      dataSource.push(item)
    })
    if (!this.props.limited) {
      dataSource.push({
        key: '',
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
      value: this.props.type === 'sla' ? [] : '',
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

  handleTableChange = async (value, itemKey, text) => {
    const { dataSource } = this.state
    if (_.find(dataSource, { key: value })) {
      message.error('内容不能重复！')
      return
    }
    const target = dataSource.find(item => item.itemKey === itemKey)
    if (target) {
      target[text] = value
    }
    await this.setState({ dataSource })
  }

  handleBlur = (value, itemKey) => {
    const { dataSource } = this.state
    if (value.length > 0) {
      if (dataSource[dataSource.length - 1].key !== '' && !this.props.limited) {
        message.success(`添加了${this.props.title}`)
        this.handleAddRow()
      } else {
        // message.success(`编辑了${this.props.title}`)
      }
    } else if (dataSource.length > 1) {
      message.success(`删除了${this.props.title}`)
      this.handleDeleteRow(itemKey)
    }
    this.getMyData()
  }

  render() {
    const { dataSource, loading } = this.state
    const min = this.props.title === 'Parents' ? 2 : 1
    const columns = [{
      title: this.props.title,
      key: 'key',
      render: (text, record) => (
        this.props.title === 'Annotations'
          ? (
            <Input
              value={record.key}
              key="input"
              disabled={this.props.onlyShow}
              onChange={e => this.handleTableChange(e.target.value, record.itemKey, 'key')}
              onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
              style={{ width: '100%', fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            />
          )
          : (
            <Select
              value={record.key}
              key="select"
              disabled={this.props.onlyShow}
              style={{ width: '100%', fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
              onChange={(value) => {
                this.handleTableChange(value, record.itemKey, 'key')
                this.handleBlur(value, record.itemKey)
              }}
              showSearch
              optionFilterProp="children"
            >
              {makeOptionTable(this.props.options)}
            </Select>
          )
      ),
    }, {
      title: '操作',
      width: 40,
      render: (text, record) => {
        return (
          dataSource.length > min
          && dataSource[dataSource.length - 1].itemKey !== record.itemKey
          && !this.props.onlyShow
            ? (
              <Popconfirm
                title="确定要删除吗？"
                placement="topRight"
                getPopupContainer={this.getPopupContainer}
                onConfirm={() => this.handleDeleteRow(record.itemKey)}
              >
                <a style={{ color: '#888', fontSize: 20 }} href="javascript:;" disabled={this.props.disabled}>
                  <Icon type="close-circle" theme="filled" />
                </a>
              </Popconfirm>
            ) : null
        )
      },
    }]
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered={false}
          size="small"
          rowKey={record => record.itemKey}
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
