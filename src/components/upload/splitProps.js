import React from 'react'
import { Tree, Icon, Select } from 'antd'
import _ from 'lodash'
import uuid from 'uuid'

let propertyData = []
const { TreeNode } = Tree
const { Option } = Select

class SplitProps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectMap: [],
      resultData: [],
    }
  }

  componentWillMount = () => {
    if (this.props.dataSource.length > 0) {
      this.handleData(this.props.dataSource)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.dataSource.length > 0) {
      if (!_.isEqual(nextProps.dataSource, this.props.dataSource)) {
        this.handleData(nextProps.dataSource)
      }
    } else {
      this.setState({
        selectMap: [],
        resultData: [],
      })
    }
  }

  getMyData = () => {
    return this.state
  }

  handleData = (dataSource) => {
    propertyData = []
    dataSource.forEach((e) => {
      this.checkProperty(e, '', this.props.mainName)
    })
    this.setState({ resultData: propertyData })
  }

  checkProperty = (item, target, mainName) => {
    for (const i in item) { // eslint-disable-line
      if (i !== mainName) {
        let key = uuid()
        if (!_.find(propertyData, { title: i })) {
          propertyData.push({
            domain: [],
            key,
            range: [],
            source: i,
            target,
            title: i,
          })
          const { selectMap } = this.state
          selectMap.push({ title: i, key, type: 'dataProp' })
          this.setState({ selectMap })
        } else {
          key = _.find(propertyData, { title: i }).key
        }
        if (typeof item[i] === 'object' && !item[i].length) {
          this.checkProperty(item[i], key, mainName)
        }
      }
    }
  }

  listToTree = (list) => {
    const result = {}
    const startKey = []
    list.forEach((item) => {
      if (!result[item.key]) {
        result[item.key] = item
      }
    })
    list.forEach((item) => {
      delete item.children
    })
    list.forEach((item) => {
      if (item.target.length === 0) {
        startKey.push(item.key)
      }
      if (result[item.target]) {
        if (!result[item.target].children) {
          result[item.target].children = []
        }
        if (!_.find(result[item.target].children, { key: item.key })) {
          result[item.target].children.push(item)
        }
      }
    })
    const map = []
    startKey.forEach((e) => {
      map.push(result[e])
    })
    return map
  }

  handleSelect = (e, value) => {
    const { selectMap } = this.state
    _.find(selectMap, { title: e.title }).type = value
    this.setState({ selectMap })
    if (e.children) {
      e.children.forEach((item) => {
        this.handleSelect(item, value)
      })
    }
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.key} {...item} />
  })

  renderTreeSelect = (selectMap, resultData) => {
    const result = []
    const data = this.listToTree(resultData)
    data.forEach((e) => {
      result.push(
        <div style={{ overflow: 'hidden', marginBottom: 10 }}>
          <Tree
            style={{ float: 'left' }}
          >
            {this.renderTreeNodes([e])}
          </Tree>
          <Select
            style={{ float: 'right', width: 180 }}
            value={_.find(selectMap, { title: e.title }).type}
            onChange={(value) => {
              this.handleSelect(e, value)
            }}
          >
            <Option key="objectProp" value="objectProp">
              <Icon type="import" style={{ color: '#1296db' }} />
              对象类型
            </Option>
            <Option key="dataProp" value="dataProp">
              <Icon type="import" style={{ color: '#1afa29' }} />
              数据类型
            </Option>
          </Select>
        </div>,
      )
    })
    return result
  }

  render() {
    const { selectMap, resultData } = this.state
    return (
      <div>
        {this.renderTreeSelect(selectMap, resultData)}
      </div>
    )
  }
}
export default SplitProps
