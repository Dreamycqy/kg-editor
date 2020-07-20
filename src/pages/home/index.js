import React from 'react'
import { Button, notification, AutoComplete, Input } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
// import _ from 'lodash'
import Background from '@/assets/banner2.jpg'
import Logo from '@/assets/homeLogo.png'

let localCounter = 0
const args = {
  message: '最新公告',
  description: '这里是最新内容公告，展示平台最近更新和其他用户提示，如有疑问请咨询xxxx',
  duration: 20,
}
const { Option } = AutoComplete

@connect()
class ClusterBroker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      data: [],
    }
  }

  componentDidMount = () => {
    notification.config({
      placement: 'topRight',
      top: 70,
    })
    notification.destroy(args)
    notification.open(args)
  }

  componentWillUnmount = () => {
    notification.destroy(args)
  }

  search = async (filter) => {
    this.setState({ data: [
      `${filter} result1`, `${filter} result2`, `${filter} result3`,
    ] })
    // const { filter } = this.state
    // const data = await searchTopic({
    //   topicFilter: filter,
    //   searchBtn: 'false',
    // })
    // if (data) {
    //   this.setState({ data: data.bizTopics })
    // }
  }

  handleJump = (value) => {
    const { dispatch } = this.props
    const { filter } = this.state
    dispatch(routerRedux.push({
      pathname: '/searchPage',
      query: { filter: value || filter },
    }))
  }

  handleHighlight = (str, filter) => {
    let lightStr = []
    const word = new RegExp(filter, 'ig')
    const arr = str.split(word)
    lightStr = [<span key={localCounter++}>{arr[0]}</span>]
    for (let i = 1; i < arr.length; i++) {
      const keyword = str.match(word)[i - 1]
      lightStr.push(<span key={localCounter++} style={{ color: 'red' }}>{keyword}</span>)
      lightStr.push(<span key={localCounter++}>{arr[i]}</span>)
    }
    return lightStr
  }

  handleInputChange = (value) => {
    this.setState({ filter: value }, () => setTimeout(() => this.search(value), 1000))
  }

  renderOption = (data) => {
    const children = []
    const { filter } = this.state
    data.forEach(item => children.push(
      <Option key={item} value={item}>
        {this.handleHighlight(item, filter)}
      </Option>,
    ))
    return children
  }

  render() {
    const {
      data,
    } = this.state
    return (
      <div style={{ textAlign: 'center', background: `url("${Background}") repeat`, height: '100%' }}>
        <div style={{ display: 'inline-block', marginTop: '10%', marginLeft: -30 }}>
          <div style={{ float: 'left' }}>
            <img src={Logo} alt="logo" width="84px" height="84px" />
          </div>
          <div style={{ float: 'left', fontSize: 42, marginTop: 16, color: 'white' }}>
            OKES 本体知识编辑系统
          </div>
        </div>
        <br />
        <br />
        <div style={{ display: 'inline-block' }}>
          <AutoComplete
            size="large"
            style={{
              width: 500, float: 'left',
            }}
            dataSource={this.renderOption(data)}
            onChange={value => this.handleInputChange(value)}
            onSelect={value => this.setState({ filter: value })}
            backfill
            placeholder="请输入要搜索的图谱，概念或实体名"
            optionLabelProp="value"
            defaultActiveFirstOption={false}
          >
            <Input
              onPressEnter={e => this.handleJump(e.target.value)}
              style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
            />
          </AutoComplete>
          <Button style={{ float: 'left', borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }} size="large" type="primary" onClick={() => this.handleJump()}>搜索</Button>
        </div>
      </div>
    )
  }
}
export default ClusterBroker
