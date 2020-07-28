import React from 'react'
import { Modal, Icon, Upload, Select, Steps, Button, Switch, Input, message, Tabs } from 'antd'
import * as XLSX from 'xlsx'
import _ from 'lodash'
import { makeOptionNormal } from '@/utils/common'
import SplitProps from './splitProps'
import RemakeClass from './compare/remakeClass'
import RemakeProps from './compare/remakeProps'
import RemakeIndis from './compare/remakeIndis'
import ShowUpload from './showUpload'

const { Option } = Select
const { Step } = Steps
const { Dragger } = Upload
const { TabPane } = Tabs
const reg1 = new RegExp('title', 'gi')
const reg2 = new RegExp('name', 'gi')

class UploadIndis extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fileType: 'json',
      fileList: [],
      dataSource: [],
      mainName: '',
      nameOption: [],
      isClass: true,
      mainClass: '',
      current: 0,
      newObjPropList: [],
      newDataPropList: [],
      classList: [],
      objPropList: [],
      dataPropList: [],
      indisList: [],
      tabKey: '1',
    }
  }

  handleFileList = async (list) => {
    await this.setState({ dataSource: [] })
    if (list.length > 0) {
      list.forEach((a) => {
        if (this.state.fileType === 'excel') {
          this.handleExcelObj(a.originFileObj, a.name)
        } else {
          this.handleJsonObj(a.originFileObj, a.name)
        }
      })
    } else {
      this.setState({
        mainName: '',
        mainClass: '',
        nameOption: [],
      })
    }
  }

  handleJsonObj = (obj, name) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const { nameOption } = this.state
        const dataSource = JSON.parse(result)
        for (const i in dataSource[0]) {
          if ((i.match(reg1) && typeof dataSource[0][i] === 'string')
          || (i.match(reg2) && typeof dataSource[0][i] === 'string')) {
            if (nameOption.indexOf(i) < 0) {
              nameOption.push(i)
            }
          }
        }
        this.setState({ dataSource, nameOption, mainName: nameOption[0], mainClass: name.split('.')[0] })
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    fileReader.readAsText(obj, 'utf-8')
  }

  handleExcelObj = (files, name) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const { nameOption } = this.state
        const workbook = XLSX.read(result, { type: 'binary' })
        let dataSource = []
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) { // eslint-disable-line
            dataSource = dataSource.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          }
        }
        for (const i in dataSource[0]) {
          if ((i.match(reg1) && typeof dataSource[0][i] === 'string')
          || (i.match(reg2) && typeof dataSource[0][i] === 'string')) {
            if (nameOption.indexOf(i) < 0) {
              nameOption.push(i)
            }
          }
        }
        this.setState({ dataSource, nameOption, mainName: nameOption[0], mainClass: name.split('.')[0] })
        message.success('上传成功！')
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files)
  }

  next = (state) => {
    if (state === 1) {
      const { selectMap, resultData } = this.splitProps.getMyData()
      const newObjPropList = []
      const newDataPropList = []
      selectMap.forEach((e) => {
        if (e.type === 'dataProp') {
          newDataPropList.push(_.find(resultData, { title: e.title }))
        } else {
          newObjPropList.push(_.find(resultData, { title: e.title }))
        }
      })
      this.setState({ newObjPropList, newDataPropList })
    } else if (state === 2) {
      this.setState({ classList: this.remakeClass.getMyData() })
    } else if (state === 3) {
      if (!this.remakePropsData) {
        this.setState({ tabKey: '2' })
        return
      }
      this.setState({
        objPropList: this.remakePropsObj.getMyData(),
        dataPropList: this.remakePropsData.getMyData(),
      })
    } else if (state === 4) {
      this.setState({ indisList: this.remakeIndis.getMyData() })
    } else if (state === 5) {
      this.handleUpload.MyData()
    }
    const current = this.state.current + 1
    this.setState({ current })
  }

  prev = () => {
    const current = this.state.current - 1
    this.setState({ current })
  }

  render() {
    const {
      visible, fileType, dataSource, fileList, current,
      mainClass, mainName, isClass, nameOption, newDataPropList, newObjPropList,
      classList, objPropList, dataPropList, indisList, tabKey,
    } = this.state
    const that = this
    const props = {
      name: 'file',
      fileList,
      multiple: false,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.fileList.length > 1) {
          message.error('一次仅允许上传一个文件！')
          return
        }
        const list = [...info.fileList].map((file) => {
          if (file.response) {
            file.url = file.response.url
          }
          return file
        })
        that.setState({ fileList: list })
        if (info.file.status !== 'uploading') {
          that.handleFileList(list)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 已上传`)
        } else if (info.file.status === 'error') {
          // message.error(`${info.file.name} 上传失败`)
        }
      },
    }
    return (
      <div style={{ display: 'inline-block' }}>
        <a
          href="javascript:;" style={{ marginLeft: 10, fontSize: 20 }}
          onClick={() => this.setState({ visible: true })}
        >
          <Icon type="upload" />
        </a>
        <Modal
          title="导入实体列表"
          visible={visible}
          width="1400px"
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >

          <div style={{ margin: 10 }}>
            选择文件类型：&nbsp;
            <Select
              style={{ width: 150 }}
              value={fileType}
              onChange={(value) => {
                this.setState({
                  fileType: value,
                  dataSource: [],
                  fileList: [],
                  mainName: '',
                  mainClass: '',
                  nameOption: [],
                })
              }}
            >
              <Option key="excel" value="excel">Excel</Option>
              <Option key="json" value="json">Json</Option>
            </Select>
          </div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖入文件以开始上传</p>
            <p className="ant-upload-hint">
              支持大小不超过200KB的Json文件，目前仅支持单个文件
            </p>
          </Dragger>
          <Steps style={{ marginTop: 30, padding: 20, borderTop: '1px solid #e8e8e8' }} current={current}>
            <Step title="选择首要配置" key="1" />
            <Step title="选择属性类型" key="2" />
            <Step title="处理重复概念" key="4" />
            <Step title="处理重复属性" key="4" />
            <Step title="处理重复实体" key="5" />
            <Step title="检查上传内容" key="6" />
          </Steps>
          <div>
            <div style={{ display: current === 0 ? 'block' : 'none' }}>
              <div style={{ margin: 60 }}>
                <div style={{ marginBottom: 20 }}>
                  选择实体名称参数名：&nbsp;
                  <Select
                    value={mainName}
                    style={{ marginRight: 20, width: 200 }}
                    onChange={value => this.setState({ mainName: value })}
                  >
                    {makeOptionNormal(nameOption)}
                  </Select>
                  <div style={{ margin: '4px 0 10px 0', fontSize: 10, color: '#888' }}>
                    实体名称参数名默认选取实体列表对象中，属性名包含[title]、[name]等字符且属性为字符串的属性
                  </div>
                </div>
                是否生成核心概念：&nbsp;
                <Switch
                  checked={isClass}
                  style={{ marginRight: 20 }}
                  onChange={checked => this.setState({ isClass: checked })}
                />
                <div style={{ display: isClass ? 'inline-block' : 'none' }}>
                  核心概念命名：&nbsp;
                  <Input
                    value={mainClass}
                    style={{ width: 200 }}
                    onChange={e => this.setState({ mainClass: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: current === 1 ? 'block' : 'none', width: 800, margin: '0 auto' }}>
              <SplitProps
                dataSource={dataSource}
                mainName={mainName}
                ref={t => this.splitProps = t}
              />
            </div>
            <div style={{ display: current === 2 ? 'block' : 'none' }}>
              <RemakeClass
                mainClass={mainClass}
                nodeTask={this.props.nodeTask}
                projectName={this.props.projectName}
                taskName={this.props.taskName}
                ref={t => this.remakeClass = t}
              />
            </div>
            <div style={{ display: current === 3 ? 'block' : 'none' }}>
              <Tabs activeKey={tabKey} onChange={key => this.setState({ tabKey: key })}>
                <TabPane tab="对象属性ObjectProperty" key="1">
                  <RemakeProps
                    nodeTask={this.props.nodeTask}
                    projectName={this.props.projectName}
                    taskName={this.props.taskName}
                    classList={classList}
                    activeKey="object"
                    addTreeList={newObjPropList}
                    ref={t => this.remakePropsObj = t}
                  />
                </TabPane>
                <TabPane tab="数据属性DataProperty" key="2">
                  <RemakeProps
                    nodeTask={this.props.nodeTask}
                    projectName={this.props.projectName}
                    taskName={this.props.taskName}
                    classList={classList}
                    activeKey="data"
                    addTreeList={newDataPropList}
                    ref={t => this.remakePropsData = t}
                  />
                </TabPane>
              </Tabs>
            </div>
            <div style={{ display: current === 4 ? 'block' : 'none' }}>
              <RemakeIndis
                classList={classList}
                mainName={mainName}
                mainClass={mainClass}
                nodeTask={this.props.nodeTask}
                projectName={this.props.projectName}
                taskName={this.props.taskName}
                dataSource={dataSource}
                objPropList={objPropList}
                dataPropList={dataPropList}
                ref={t => this.remakeIndis = t}
              />
            </div>
            <div style={{ display: current === 5 ? 'block' : 'none' }}>
              <ShowUpload
                nodeTask={this.props.nodeTask}
                projectName={this.props.projectName}
                taskName={this.props.taskName}
                classList={classList}
                objPropList={objPropList}
                dataPropList={dataPropList}
                indisList={indisList}
              />
            </div>
          </div>
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            {current > 0 && (
            <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
            )}
            {current < 5 && (
            <Button type="primary" disabled={dataSource.length === 0} style={{ marginRight: 8 }} onClick={() => this.next(current)}>
              下一步
            </Button>
            )}
            {current === 5 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              完成上传
            </Button>
            )}
          </div>
        </Modal>
      </div>
    )
  }
}
export default UploadIndis
