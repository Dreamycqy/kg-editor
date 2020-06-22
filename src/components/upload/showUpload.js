import React from 'react'
import { Tabs, Button, message } from 'antd'
import _ from 'lodash'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { getProjectClassesTree, getProjectPropertiesTree, getProjectIndividualsTree, editClasses, editProperties, editIndividuals } from '@/services/edukg'
import ClassContent from './classContent'
import PropertiesContent from './propertiesContent'
import IndividualsContent from './individualsContent'

const { TabPane } = Tabs
let classData = []
let propertyData = []
let individualData = []
let temp = []

@connect()
class ShowUploadJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classData: [],
      propertyData: [],
      individualData: [],
      classD: [],
      property: [],
      indis: [],
    }
  }

  componentWillMount = () => {
    this.getClass()
    this.getPdata()
    this.getIndis()
  }

  getClass = async () => {
    const data = await getProjectClassesTree({
      projectName: this.state.projectName,
    })
    if (data) {
      this.setState({ classD: data.data })
    }
  }

  getPdata = async () => {
    const data = await getProjectPropertiesTree({
      projectName: this.state.projectName,
      type: 'data',
    })
    if (data) {
      this.setState({ property: data.data })
    }
  }

  getIndis = async () => {
    const data = await getProjectIndividualsTree({
      projectName: this.state.projectName,
    })
    if (data) {
      this.setState({ indis: data.data.filter((e) => { return !!e.key }) })
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.dataSource, {})) {
      this.handleData(nextProps)
    }
  }

  uploadData = async () => {
    const { classD, property, indis } = this.state
    const { projectName, taskName } = this.props
    const data1 = await editClasses({
      projectName: this.props.projectName,
      node: JSON.stringify(_.uniqBy([...this.state.classData, ...classD], 'key')),
    })
    const data2 = await editProperties({
      projectName: this.props.projectName,
      node: JSON.stringify(_.uniqBy([...this.state.propertyData, ...property], 'key')),
      type: 'data',
    })
    const data3 = await editIndividuals({
      projectName: this.props.projectName,
      node: JSON.stringify(_.uniqBy([...this.state.individualData, ...indis], 'key')),
      method: 'indis',
    })
    if (data1 === 200 && data3 === 200 && data2 === 200) {
      message.success('实体列表上传成功')
      this.props.dispatch(routerRedux.push({
        pathname: '/editor',
        query: {
          taskName,
          projectName,
        },
      }))
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
      <div>
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
        <div style={{ margin: 20, textAlign: 'center' }}>
          <Button type="primary" onClick={() => this.uploadData()}>上传</Button>
          <Button style={{ marginLeft: 20 }} onClick={() => this.props.close()}>取消</Button>
        </div>
      </div>
    )
  }
}
export default ShowUploadJson
