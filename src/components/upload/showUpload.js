import React from 'react'
import { Tabs, Button, message, Modal } from 'antd'
import _ from 'lodash'
import { connect } from 'dva'
import uuid from 'uuid'
import { getProjectClassesTree, getProjectPropertiesTree, getProjectIndividualsTree, editClasses, editProperties, editIndividuals } from '@/services/edukg'
import ClassContent from '@/pages/editor/classEditor'
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
      indis: [],
      property: [],
    }
  }

  componentWillMount = () => {
    this.getClass()
    if (this.props.createProject !== true) {
      this.getPdata()
      this.getIndis()
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.handleData(nextProps)
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

  uploadData = async () => {
    const { classD, indis } = this.state
    const newClass = this.state.classData
    const firstClass = classD.filter((e) => { return e.target.length === 0 })
    console.log(firstClass)
    newClass.forEach((e) => {
      e.target = [firstClass[0].key]
    })
    const nodeClass = this.handleDiff(this.state.classData, classD)
    const nodeProp = this.handleDiff(this.state.propertyData, [])
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
    await editClasses({
      projectName,
      node: JSON.stringify(nodeClass),
    })
    await editProperties({
      projectName,
      node: JSON.stringify(nodeProp),
      type: 'data',
    })
    const data3 = await editIndividuals({
      projectName,
      node: nodeIndis,
      method: 'add',
    })
    if (data3.data) {
      message.success('实体列表上传成功')
      if (this.props.createProject === true) {
        this.props.close()
      } else {
        window.location.href = `/editor?projectName=${projectName}&taskName=${taskName}`
      }
    }
  }

  handleData = (props) => {
    classData = []
    propertyData = this.state.property
    individualData = []
    const { dataSource, mainName, isClass, nodeTask } = props
    for (const listName in dataSource) { // eslint-disable-line
      const key = uuid()
      if (isClass === true && !_.find(classData, { title: listName })) {
        classData.push({
          key,
          nodeTask: nodeTask || [],
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
        } else {
          key = _.find(propertyData, { title: i }).key
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

  setClass = async (newTree) => {
    this.setState({ classData: newTree })
  }

  setPdata = async (newTree) => {
    this.setState({ propertyData: newTree })
  }

  changeData = (newTree, type) => {
    switch (type) {
      case 'class':
        this.setClass(newTree)
        break
      case 'obj':
        this.setPobj(newTree)
        break
      case 'data':
        this.setPdata(newTree)
        break
      case 'indis':
        this.setIndis(newTree)
        break
      default:
        break
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
              classData={this.state.classData} propertyData={propertyData}
              changeData={this.changeData} propertyObj={[]}
            />
          </TabPane>
          <TabPane tab="属性" key="properties">
            <PropertiesContent
              projectName={projectName} taskName={taskName}
              propertyObj={[]} propertyData={this.state.propertyData}
              changeData={this.changeData}
              classData={this.state.classData}
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
