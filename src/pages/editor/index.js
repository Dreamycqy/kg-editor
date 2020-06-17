import React from 'react'
import { Tabs, Empty, Spin } from 'antd'
import { getUrlParams } from '@/utils/common'
import {
  getProjectClassesTree, getProjectPropertiesTree, getProjectIndividualsTree,
  editClasses, editProperties, editIndividuals,
} from '@/services/edukg'
import ClassEditor from './classEditor'
import IndividualEditor from './individualEditor'
import PropertyEditor from './propertyEditor'
import History from './history'
import TotalEditor from './totalEditor'

const { TabPane } = Tabs

class MainEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: 'classes',
      projectName: getUrlParams().projectName || '',
      taskName: getUrlParams().taskName || '',
      classData: [],
      propertyObj: [],
      propertyData: [],
      treeData: [],
      loading: true,
    }
  }

  componentWillMount = () => {
    this.getClass()
    this.getPdata()
    this.getPobj()
    this.getIndis()
  }

  getClass = async () => {
    this.setState({ loading: true })
    const data = await getProjectClassesTree({
      projectName: this.state.projectName,
    })
    if (data) {
      this.setState({ classData: data.data })
    }
    this.setState({ loading: false })
  }

  getPobj = async () => {
    this.setState({ loading: true })
    const data = await getProjectPropertiesTree({
      projectName: this.state.projectName,
      type: 'object',
    })
    if (data) {
      this.setState({ propertyObj: data.data })
    }
    this.setState({ loading: false })
  }

  getPdata = async () => {
    this.setState({ loading: true })
    const data = await getProjectPropertiesTree({
      projectName: this.state.projectName,
      type: 'data',
    })
    if (data) {
      this.setState({ propertyData: data.data })
    }
    this.setState({ loading: false })
  }

  getIndis = async () => {
    this.setState({ loading: true })
    const data = await getProjectIndividualsTree({
      projectName: this.state.projectName,
    })
    if (data) {
      this.setState({ treeData: data.data.filter((e) => { return !!e.key }) })
    }
    this.setState({ loading: false })
  }

  setClass = async (newTree) => {
    this.setState({ loading: true })
    const data = await editClasses({
      projectName: this.state.projectName,
      node: JSON.stringify(newTree),
    })
    if (data === 200) {
      this.getClass()
    }
  }

  setPobj = async (newTree) => {
    this.setState({ loading: true })
    const data = await editProperties({
      projectName: this.state.projectName,
      node: JSON.stringify(newTree),
      type: 'object',
    })
    if (data === 200) {
      this.getPobj()
    }
  }

  setPdata = async (newTree) => {
    this.setState({ loading: true })
    const data = await editProperties({
      projectName: this.state.projectName,
      node: JSON.stringify(newTree),
      type: 'data',
    })
    if (data === 200) {
      this.getPdata()
    }
  }

  setIndis = async (newTree) => {
    this.setState({ loading: true })
    const data = await editIndividuals({
      projectName: this.state.projectName,
      node: JSON.stringify(newTree.node),
      method: newTree.method,
    })
    if (data) {
      this.getIndis()
    }
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
    const {
      activeKey, taskName, projectName, loading,
      classData, treeData, propertyData, propertyObj,
    } = this.state
    let result
    switch (activeKey) {
      case 'classes':
        result = (
          <ClassEditor
            projectName={projectName} taskName={taskName}
            classData={classData} propertyData={propertyData}
            changeData={this.changeData} propertyObj={propertyObj}
          />
        )
        break
      case 'properties':
        result = (
          <PropertyEditor
            projectName={projectName} taskName={taskName}
            classData={classData} propertyData={propertyData}
            changeData={this.changeData} propertyObj={propertyObj}
            treeData={treeData}
          />
        )
        break
      case 'individuals':
        result = (
          <IndividualEditor
            projectName={projectName} taskName={taskName}
            treeData={treeData}
            classData={classData} propertyData={propertyData}
            changeData={this.changeData} propertyObj={propertyObj}
          />
        )
        break
      case 'total':
        result = (
          <TotalEditor
            projectName={projectName} taskName={taskName}
            treeData={treeData}
            classData={classData} propertyData={propertyData}
            changeData={this.changeData} propertyObj={propertyObj}
          />
        )
        break
      case 'comment':
        result = <Empty style={{ marginTop: 100 }} />
        break
      case 'history':
        result = <History />
        break
      default:
        result = null
        break
    }
    return (
      <div style={{ height: '100%' }}>
        <Tabs
          activeKey={activeKey}
          tabBarExtraContent={<span>{projectName} -&gt; {taskName}</span>}
          onChange={key => this.setState({ activeKey: key })}
        >
          <TabPane style={{ height: 0 }} tab="类" key="classes" />
          <TabPane style={{ height: 0 }} tab="属性" key="properties" />
          <TabPane style={{ height: 0 }} tab="实体" key="individuals" />
          <TabPane style={{ height: 0 }} tab="综合编辑" key="total" />
          <TabPane style={{ height: 0 }} tab="讨论" key="comment" />
          <TabPane style={{ height: 0 }} tab="历史" key="history" />
        </Tabs>
        <Spin spinning={loading}>
          {result}
        </Spin>
      </div>
    )
  }
}
export default MainEditor
