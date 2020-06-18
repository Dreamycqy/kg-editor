import React from 'react'
import { Tabs } from 'antd'
import _ from 'lodash'
import ClassContent from './classContent'
import PropertiesContent from './propertiesContent'
import IndividualsContent from './individualsContent'

const { TabPane } = Tabs
let classData = []
let propertyData = []
let individualData = []
let temp = []

class ShowUploadJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classData: [],
      propertyData: [],
      individualData: [],
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.dataSource, {})) {
      this.handleData(nextProps)
    }
  }

  handleData = (props) => {
    classData = []
    propertyData = []
    individualData = []
    const { dataSource, mainName, isClass, nodeTask } = props
    for (const listName in dataSource) { // eslint-disable-line
      if (isClass === true) {
        classData.push({
          key: listName,
          nodeTask,
          relationships: [],
          source: listName,
          target: [],
          title: listName,
        })
      }
      dataSource[listName].forEach((item) => { // eslint-disable-line
        this.checkProperty(item, '', mainName)
        const params = {
          key: item[mainName],
          sameAs: [],
          title: item[mainName],
          types: isClass ? [listName] : [],
        }
        temp = []
        for (const i in item) { // eslint-disable-line
          if (i !== mainName) {
            this.pushRelationShip(i, item[i])
          }
        }
        params.relationships = temp
        individualData.push(params)
      })
    }
    this.setState({ classData, propertyData, individualData })
  }

  checkProperty = (item, target, mainName) => {
    for (const i in item) { // eslint-disable-line
      if (i !== mainName) {
        if (!_.find(propertyData, { key: i, target })) {
          propertyData.push({
            domain: [],
            key: i,
            range: [],
            source: i,
            target,
            title: i,
          })
        }
        if (typeof item[i] === 'object' && !item[i].length) {
          this.checkProperty(item[i], i, mainName)
        }
      }
    }
  }

  pushRelationShip = (name, value) => {
    if (typeof value === 'object' && !value.length) {
      for (const item in value) { // eslint-disable-line
        this.pushRelationShip(item, value[item])
      }
    } else {
      if (_.find(temp, { key: name })) {
        return
      }
      if (typeof value === 'object' && value.length) {
        value.forEach((e) => {
          temp.push({
            key: name,
            value: e,
          })
        })
      } else {
        temp.push({
          key: name,
          value,
        })
      }
    }
  }

  render() {
    const { projectName, taskName } = this.props
    return (
      <Tabs>
        <TabPane tab="概念" key="classes">
          <ClassContent
            projectName={projectName} taskName={taskName}
            classData={this.state.classData}
          />
        </TabPane>
        <TabPane tab="属性" key="properties">
          <PropertiesContent
            projectName={projectName} taskName={taskName}
            propertyObj={[]} propertyData={this.state.propertyData}
          />
        </TabPane>
        <TabPane tab="实体" key="individuals">
          <IndividualsContent
            projectName={projectName} taskName={taskName}
            treeData={this.state.individualData}
            classData={this.state.classData} propertyData={this.state.propertyData}
            propertyObj={[]}
          />
        </TabPane>
      </Tabs>
    )
  }
}
export default ShowUploadJson
