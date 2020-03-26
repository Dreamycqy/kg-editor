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
    console.log(dataSource)
    const result = []
    dataSource.forEach((e) => {
      if (e.key.length > 0) {
        result.push(e.key)
      }
    })
    this.props.editNode(result, this.props.selectKey, this.props.title)
  }

  pushConfig = (option) => {
    const dataSource = []
    option.forEach((e) => {
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
        message.success(`编辑了${this.props.title}`)
      }
    } else if (dataSource.length > 1) {
      message.success(`删除了${this.props.title}`)
      this.handleDeleteRow(itemKey)
    }
    this.getMyData()
  }

  render() {
    const { dataSource, loading } = this.state
    const columns = [{
      title: this.props.title,
      key: 'key',
      render: (text, record) => (
        this.props.title === 'Annotations'
          ? (
            <Input
              value={record.key}
              onChange={e => this.handleTableChange(e.target.value, record.itemKey, 'key')}
              onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
              style={{ width: '100%', fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
            />
          )
          : (
            <AutoComplete
              dataSource={this.props.options}
              defalutValue={record.key}
              style={{ width: '100%' }}
              onSelect={value => this.handleTableChange(value, record.itemKey, 'key')}
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} // eslint-disable-line
            >
              <TextArea
                placeholder={this.props.placeholder}
                defalutValue={record.key}
                autosize style={{ fontSize: 12, lineHeight: '24px', border: 'none', resize: 'none' }}
                onBlur={e => this.handleBlur(e.target.value, record.itemKey)}
              />
            </AutoComplete>
          )
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
