import React from 'react'
import { Table, Input, Popconfirm, Icon, message, AutoComplete } from 'antd'
import uuid from 'uuid'
import _ from 'lodash'

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
    const result = this.props.type === 'sla' ? [] : {}
    if (this.props.type === 'sla') {
      dataSource.forEach((e) => {
        result.push({ user: e.key, type: e.value })
      })
    } else {
      dataSource.forEach((e) => {
        result[e.key] = e.value
      })
    }
    return result
  }

  pushConfig = (option) => {
    const dataSource = []
    option.forEach((e) => {
      const item = {
        key: e,
        value: '',
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

  handleBlur = (value, itemKey) => {
    const { dataSource } = this.state
    if (value.length > 0) {
      if (dataSource[dataSource.length - 1].key !== '' && !this.props.limited) {
        message.success(`添加了${this.props.title}`)
        this.handleAddRow()
      } else {
        message.success(`编辑了${this.props.title}`)
      }
    } else if (dataSource.length > 1) {
      message.success(`删除了${this.props.title}`)
      this.handleDeleteRow(itemKey)
    }
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: this.props.title,
      key: 'key',
      width: 150,
      render: (text, record) => (
        <AutoComplete
          dataSource={this.props.options}
          defaultValue={record.key}
          onSelect={value => this.handleTableChange(value, record.itemKey, 'key')}
          filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} // eslint-disable-line
        >
          <TextArea
            placeholder={this.props.placeholder}
            defaultValue={record.key}
            autosize style={{ fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
          />
        </AutoComplete>
      ),
    }, {
      title: this.props.value,
      key: 'key',
      render: (text, record) => (
        <TextArea
          value={record.value} placeholder="请输入内容"
          autosize style={{ fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
          onChange={e => this.handleTableChange(e.target.value, record.itemKey, 'value')}
          onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
        />
      ),
    }, {
      title: '操作',
      width: 40,
      render: (text, record) => {
        return (
          dataSource.length > 1 && dataSource[dataSource.length - 1].itemKey !== record.itemKey
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
