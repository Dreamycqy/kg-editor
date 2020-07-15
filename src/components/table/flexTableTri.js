import React from 'react'
import { Table, Input, Popconfirm, Icon, Select } from 'antd'
import uuid from 'uuid'
import _ from 'lodash'
import { makeOptionTable, makeOption, makeOptionNew } from '@/utils/common'

const { TextArea } = Input

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
        result.push({ key: e.key, value: e.value, type: e.type })
      }
    })
    this.props.editNode(result, this.props.selectKey, this.props.title)
  }

  pushConfig = (data) => {
    const dataSource = []
    data.forEach((e) => {
      let type = 'desc'
      if (_.find(this.props.optionData, { key: e.key })) {
        type = 'desc'
      } else if (_.find(this.props.optionObj, { key: e.key })) {
        type = 'relation'
      }
      const item = {
        key: e.key,
        value: e.value,
        type: e.type || type,
        itemKey: uuid(),
      }
      dataSource.push(item)
    })
    if (!this.props.limited) {
      dataSource.push({
        key: '',
        value: '',
        type: 'desc',
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
    if (!value) {
      return
    }
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
      title: '数据类型',
      width: 80,
      render: (text, record) => (
        <Select
          value={record.type}
          disabled={this.props.onlyShow}
          style={{ width: '100%', fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
          onChange={(value) => {
            this.handleTableChange(value, record.itemKey, 'type')
            this.handleTableChange('', record.itemKey, 'value')
          }}
        >
          {makeOption([{ name: '描述', value: 'desc' },
            { name: '关系', value: 'relation' }])}
        </Select>
      ),
    }, {
      title: this.props.title,
      width: 120,
      render: (text, record) => {
        const optionList = record.type === 'desc' ? this.props.optionData : this.props.optionObj
        return (
          <Select
            value={record.key}
            disabled={this.props.onlyShow}
            style={{ width: 120, fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            onChange={(value) => {
              this.handleTableChange(value, record.itemKey, 'key')
            }}
            showSearch
            optionFilterProp="children"
            dropdownMatchSelectWidth={false}
          >
            {makeOptionTable(optionList)}
          </Select>
        )
      },
    }, {
      title: this.props.value,
      render: (text, record) => (record.type === 'desc'
        ? (
          <TextArea
            disabled={this.props.onlyShow}
            value={record.value} placeholder="请输入内容"
            autosize style={{ fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            onChange={e => this.handleTableChange(e.target.value, record.itemKey, 'value', this.checkType())}
            onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
          />
        )
        : (
          <Select
            value={record.value}
            disabled={this.props.onlyShow} placeholder="请输入内容"
            style={{ width: '100%', fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            onChange={value => this.handleTableChange(value, record.itemKey, 'value')}
            onBlur={value => this.handleBlur(value, record.itemKey)}
            showSearch
          >
            {makeOptionNew(this.props.indisList)}
          </Select>
        )),
    }, {
      title: '操作',
      width: 40,
      render: (text, record) => {
        return (
          dataSource.length > 1
          && dataSource[dataSource.length - 1].itemKey !== record.itemKey
          && !this.props.onlyShow
            ? (
              <Popconfirm
                title="确定要删除吗？"
                placement="topRight"
                getPopupContainer={this.getPopupContainer}
                onConfirm={() => this.handleDeleteRow(record.itemKey)}
              >
                <a style={{ color: '#888', fontSize: 20 }} href="javascript:;" disabled={this.props.disabled || record.need === true}>
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
