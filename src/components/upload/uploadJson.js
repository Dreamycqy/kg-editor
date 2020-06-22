import React from 'react'
import { Icon, message, Upload, Select, Switch } from 'antd'
import { makeOptionNormal } from '@/utils/common'
import ShowUploadData from './showUpload'

const { Dragger } = Upload
const reg1 = new RegExp('title', 'gi')
const reg2 = new RegExp('name', 'gi')

class UploadJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      fileList: [],
      mainName: '',
      nameOption: [],
      isClass: true,
    }
  }

  handleFileList = async (list) => {
    await this.setState({ nameOption: [], dataSource: {} })
    list.forEach((a) => {
      this.handleJsonObj(a.originFileObj, a.name)
    })
  }

  handleJsonObj = (obj, name) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const { nameOption, dataSource } = this.state
        const data = JSON.parse(result)
        for (const i in data[0]) {
          if ((i.match(reg1) && typeof data[0][i] === 'string')
          || (i.match(reg2) && typeof data[0][i] === 'string')) {
            if (nameOption.indexOf(i) < 0) {
              nameOption.push(i)
            }
          }
        }
        dataSource[name] = data
        this.setState({ dataSource, nameOption, mainName: nameOption[0] })
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    fileReader.readAsText(obj, 'utf-8')
  }

  render() {
    const {
      dataSource, fileList, mainName, nameOption, isClass,
    } = this.state
    const that = this
    const props = {
      name: 'file',
      action: '',
      fileList,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
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
          message.error(`${info.file.name} 上传失败`)
        }
      },
    }
    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或拖入文件以开始上传</p>
          <p className="ant-upload-hint">
            支持大小不超过2MB的Json文件，支持多个文件
          </p>
        </Dragger>
        <div style={{ margin: '20px 0 0 0' }}>
          选择实体名称参数名：&nbsp;
          <Select
            value={mainName}
            style={{ marginRight: 20, width: 200 }}
            onChange={value => this.setState({ mainName: value })}
          >
            {makeOptionNormal(nameOption)}
          </Select>
          是否用文件名称生成概念：&nbsp;
          <Switch checked={isClass} onChange={checked => this.setState({ isClass: checked })} />
        </div>
        <div style={{ margin: '4px 0 10px 0', fontSize: 10, color: '#888' }}>
          实体名称参数名默认选取实体列表对象中，属性名包含[title]、[name]等字符且属性为字符串的属性
          <br />
          如果多个文件存在实体名称不一致的情况，请分次上传避免冲突
        </div>
        <ShowUploadData
          dataSource={dataSource}
          mainName={mainName}
          isClass={isClass}
          nodeTask={this.props.nodeTask}
          projectName={this.props.projectName}
          taskName={this.props.taskName}
          goUpload={this.goUpload}
          close={this.props.close}
        />
      </div>
    )
  }
}
export default UploadJson
