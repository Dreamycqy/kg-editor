import React from 'react'
import { Button, AutoComplete, Input, Icon, List, Divider } from 'antd'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
import { getUrlParams } from '@/utils/common'

let localCounter = 0
const { Option } = AutoComplete

@connect()
class ClusterBroker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: getUrlParams().filter || '',
      loading: false,
      data: [],
      options: [],
    }
  }

  componentWillMount = () => {
    this.search()
  }

  searchSelect = async (filter) => {
    this.setState({ options: [
      `${filter} result1`, `${filter} result2`, `${filter} result3`,
    ] })
  }

  search = async () => {
    this.setState({ loading: true })
    await setTimeout({}, 2000)
    this.setState({
      data: [{
        title: '搜索内容图谱项目1',
        context: '搜索内容图谱项目1',
        type: 'project',
        projectName: '搜索内容图谱项目1',
        projectId: '1',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '搜索内容概念',
        context: '搜索内容概念',
        type: 'class',
        projectName: '图谱项目1',
        projectId: '1',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '搜索内容对象属性',
        context: '搜索内容对象属性',
        type: 'objectProps',
        projectName: '图谱项目1',
        projectId: '1',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '搜索内容数据属性',
        context: '搜索内容数据属性',
        type: 'dataProps',
        projectName: '图谱项目1',
        projectId: '1',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '搜索内容实体',
        context: '搜索内容实体',
        type: 'indis',
        projectName: '图谱项目1',
        projectId: '1',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '新的实体',
        context: '这段要想清楚，搜索内容，到底是一种怎么样的存在。 现在，解决搜索内容的问题，是非常非常重要的。 所以， 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 搜索内容的发生，到底需要如何做到，不搜索内容的发生，又会如何产生。 ',
        props: '属性1',
        type: 'desc',
        projectName: '图谱项目2',
        projectId: '2',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '新的实体',
        context: '其他的一大段说明',
        props: '属性-搜索内容',
        type: 'desc',
        projectName: '图谱项目2',
        projectId: '2',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '搜索内容',
        context: '另一个搜索内容',
        props: '同义词',
        type: 'relationship',
        projectName: '图谱项目2',
        projectId: '2',
        lastEditTime: '2020/07/16 12:00:00',
      }, {
        title: '另一个搜索内容',
        context: '搜索内容',
        props: '同义词',
        type: 'relationship',
        projectName: '图谱项目2',
        projectId: '2',
        lastEditTime: '2020/07/16 12:00:00',
      }],
    })
    this.setState({ loading: false })
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
    this.setState({ filter: value }, () => setTimeout(() => this.searchSelect(value), 1000))
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

  renderTag = (type) => {
    switch (type) {
      case 'project':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: 'grey', border: 'grey', borderRadius: 4, width: 100 }}>图谱项目</span>
      case 'class':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: 'red', border: 'red', borderRadius: 4, width: 100 }}>概念</span>
      case 'objectProps':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: '#24b0e6', border: '#24b0e6', borderRadius: 4, width: 100 }}>属性-对象</span>
      case 'dataProps':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: '#28d100', border: '#28d100', borderRadius: 4, width: 100 }}>属性-数据</span>
      case 'indis':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: 'orange', border: 'orange', borderRadius: 4, width: 100 }}>实体</span>
      case 'relationship':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: 'violet', border: 'violet', borderRadius: 4, width: 100 }}>三元组-关系</span>
      case 'desc':
        return <span style={{ color: 'white', padding: '6px 0', display: 'inline-block', fontSize: 12, textAlign: 'center', backgroundColor: 'pink', border: 'pink', borderRadius: 4, width: 100 }}>三元组-描述</span>
      // no default
    }
  }

  render() {
    const {
      data, filter, loading, options,
    } = this.state
    return (
      <div>
        <div style={{ height: 48, borderBottom: '1px solid #e8e8e8' }}>
          <AutoComplete
            size="large"
            style={{
              width: 444, float: 'left',
            }}
            dataSource={this.renderOption(options)}
            value={filter}
            onChange={value => this.handleInputChange(value, 'search')}
            onSelect={value => this.setState({ filter: value })}
            backfill
            placeholder="请输入要搜索的内容"
            optionLabelProp="value"
            defaultActiveFirstOption={false}
          >
            <Input
              onPressEnter={e => this.search('result', e.target.value)}
              style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
            />
          </AutoComplete>
          <Button style={{ float: 'left', borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }} type="primary" size="large" onClick={() => this.search('result')}>搜索</Button>
          <Button
            style={{
              float: 'right', backgroundColor: '#28d100', borderColor: '#28d100',
            }}
            type="primary"
          >
            搜索配置
          </Button>
        </div>
        <div style={{ minHeight: 500 }}>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data}
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              // onShowSizeChange: (page, pageSize) =>
              // { this.setState({ current: page, pageSize }) },
              // onChange: page => this.setState({ current: page }),
            }}
            renderItem={(item) => {
              return (
                <List.Item
                  extra={(
                    <img
                      width={272}
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  )}
                  actions={[
                    <span style={{ marginLeft: 120 }}>
                      <a href="javascript:;" onClick={() => {}}>
                        <Icon type="star" />
                        &nbsp;&nbsp;收藏
                      </a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={() => {}}>
                        <Icon type="read" />
                        &nbsp;&nbsp;查看条目
                      </a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={() => {}}>
                        <Icon type="project" />
                        &nbsp;&nbsp;查看图谱
                      </a>
                    </span>,
                  ]}
                >
                  <List.Item.Meta
                    title={(
                      <a
                        href="javascript:;"
                        target="_blank"
                        onClick={() => {}}
                      >
                        {item.title}
                      </a>
                    )}
                    avatar={this.renderTag(item.type)}
                    description={(
                      <div>
                        <Icon
                          type="clock-circle"
                          style={{ marginRight: 8 }}
                        />
                        最后编辑时间：{item.lastEditTime}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Icon type="global" style={{ marginRight: 8 }} />
                        所属图谱：{item.projectName}
                      </div>
                    )}
                  />
                  <p style={{ marginLeft: 120 }}>
                    <span style={{ marginRight: 16, display: item.props ? 'inline-block' : 'none', padding: '2px 6px', border: '1px solid #24b0e6', borderRadius: 4 }}>
                      <span style={{ color: '#24b0e6' }}>属性 - </span>
                      <span style={{ color: 'red' }}>{item.props}</span>
                    </span>
                    {this.handleHighlight(item.context, '搜索内容')}
                  </p>
                </List.Item>
              )
            }}
          />
        </div>
      </div>
    )
  }
}
export default ClusterBroker
