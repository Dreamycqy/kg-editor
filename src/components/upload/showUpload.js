import React from 'react'
import { Tabs, message } from 'antd'
import { connect } from 'dva'
import { editClasses, editProperties, editIndividuals } from '@/services/edukg'
import ClassContent from '@/pages/editor/classEditor'
import PropertiesContent from '@/pages/editor/propertyEditor'
import IndividualsContent from '@/pages/editor/individualEditor'

const { TabPane } = Tabs

@connect()
class ShowUploadJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classData: [],
      propertyData: [],
      propertyObj: [],
      individualData: [],
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      classData: nextProps.classList,
      propertyData: nextProps.dataPropList,
      propertyObj: nextProps.objPropList,
      individualData: nextProps.indisList,
    })
  }

  uploadData = async () => {
    const { classData, propertyObj, propertyData, individualData } = this.state
    this.upload(classData, propertyObj, propertyData, individualData)
  }

  upload = async (nodeClass, nodePropObj, nodePropData, nodeIndis) => {
    const { projectName, taskName } = this.props
    await editClasses({
      projectName,
      node: JSON.stringify(nodeClass),
    })
    await editProperties({
      projectName,
      node: JSON.stringify(nodePropData),
      type: 'data',
    })
    await editProperties({
      projectName,
      node: JSON.stringify(nodePropObj),
      type: 'object',
    })
    const data3 = await editIndividuals({
      projectName,
      node: JSON.stringify(nodeIndis),
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

  setClass = async (newTree) => {
    this.setState({ classData: newTree })
  }

  setPobj = async (newTree) => {
    this.setState({ propertyObj: newTree })
  }

  setPdata = async (newTree) => {
    this.setState({ propertyData: newTree })
  }

  setIndis = async (newTree) => {
    this.setState({ individualData: newTree })
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
    const { classData, propertyData, propertyObj, individualData } = this.state
    if (individualData.length === 0) {
      return null
    }
    console.log(individualData)
    return (
      <div>
        <Tabs>
          <TabPane tab="概念" key="classes">
            <ClassContent
              projectName={projectName} taskName={taskName}
              classData={classData} propertyData={propertyData}
              changeData={this.changeData} propertyObj={propertyObj}
              onlyShow
            />
          </TabPane>
          <TabPane tab="属性" key="properties">
            <PropertiesContent
              projectName={projectName} taskName={taskName}
              propertyObj={propertyObj} propertyData={propertyData}
              changeData={this.changeData}
              classData={classData}
              onlyShow
            />
          </TabPane>
          <TabPane tab="实体" key="individuals">
            <IndividualsContent
              projectName={projectName} taskName={taskName}
              treeData={individualData}
              classData={classData} propertyData={propertyData}
              propertyObj={propertyObj}
              onlyShow
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default ShowUploadJson
