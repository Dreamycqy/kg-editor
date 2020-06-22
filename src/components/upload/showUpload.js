import React from 'react'
import { Tabs, Button, message, Modal } from 'antd'
import _ from 'lodash'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import uuid from 'uuid'
import { getProjectClassesTree, getProjectPropertiesTree, getProjectIndividualsTree, editClasses, editProperties, editIndividuals } from '@/services/edukg'
import ClassContent from './classContent'
import PropertiesContent from './propertiesContent'
import IndividualsContent from './individualsContent'

const { TabPane } = Tabs
const { confirm } = Modal
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
    if (!this.props.createProject) {
      this.getClass()
      this.getPdata()
      this.getIndis()
    }
  }

  getClass = async () => {
    const data = await getProjectClassesTree({
      projectName: this.props.projectName,
    })
    if (data) {
      this.setState({ classD: data.data })
    }
  }

  getPdata = async () => {
    const data = await getProjectPropertiesTree({
      projectName: this.props.projectName,
      type: 'data',
    })
    if (data) {
      this.setState({ property: data.data })
    }
  }

  getIndis = async () => {
    const data = await getProjectIndividualsTree({
      projectName: this.props.projectName,
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
    const newClass = this.state.classData
    const firstClass = classD.filter((e) => { return e.target.length === 0 })
    newClass.forEach((e) => {
      e.target = [firstClass[0].key]
    })
    const nodeClass = this.handleDiff(this.state.classData, classD)
    const nodeProp = this.handleDiff(this.state.propertyData, property)
    const nodeIndis = this.handleDiff(this.state.individualData, indis)
    if ((nodeClass.repeat.length + nodeProp.repeat.length + nodeIndis.repeat.length) > 0) {
      const that = this
      confirm({
        title: '存在部分',
        content: 'Some descriptions',
        onOk() {
          that.upload(nodeClass.node, nodeProp.node, nodeIndis.node)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    } else {
      this.upload(nodeClass.node, nodeProp.node, nodeIndis.node)
    }
  }

  handleDiff = (data, origin) => {
    return {
      node: _.uniqBy([...data, ...origin], 'title'),
      repeat: _.filter([...data, ...origin], (value, index, iteratee) => {
        return _.includes(iteratee, value, index + 1)
      }),
    }
  }

  upload = async (nodeClass, nodeProp, nodeIndis) => {
    const { projectName, taskName } = this.props
    const data1 = await editClasses({
      projectName,
      node: JSON.stringify(nodeClass),
    })
    const data2 = await editProperties({
      projectName,
      node: JSON.stringify(nodeProp),
      type: 'data',
    })
    const data3 = await editIndividuals({
      projectName,
      node: JSON.stringify(nodeIndis),
      method: 'add',
    })
    if (data1 === 200 && data3.data && data2 === 200) {
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
      const key = uuid()
      if (isClass === true && !_.find(classData, { title: listName })) {
        classData.push({
          key,
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
          key: uuid(),
          sameAs: [],
          title: item[mainName],
          types: isClass ? [key] : [],
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
        const key = uuid()
        if (!_.find(propertyData, { title: i, target })) {
          propertyData.push({
            domain: [],
            key,
            range: [],
            source: i,
            target,
            title: i,
          })
        }
        if (typeof item[i] === 'object' && !item[i].length) {
          this.checkProperty(item[i], key, mainName)
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
      if (_.find(temp, { title: name })) {
        return
      }
      const target = _.find(propertyData, { title: name })
      if (!target) {
        return
      }
      if (typeof value === 'object' && value.length) {
        value.forEach((e) => {
          temp.push({
            key: target.key,
            value: e,
          })
        })
      } else {
        temp.push({
          key: target.key,
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
