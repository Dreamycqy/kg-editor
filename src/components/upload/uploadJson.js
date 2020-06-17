import React from 'react'
import { Icon, message, Upload, Table, Tabs } from 'antd'

const { Dragger } = Upload
const { TabPane } = Tabs
let source = []

class UploadJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      fileList: [],
    }
  }

  handleFileList = async (list) => {
    source = []
    list.forEach((a) => {
      this.handleJsonObj(a.originFileObj)
    })
  }

  handleJsonObj = (obj) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const data = JSON.parse(result)
        source = [...source, ...data]
        this.setState({ dataSource: source })
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    fileReader.readAsText(obj, 'utf-8')
  }

  render() {
    const {
      dataSource, fileList,
    } = this.state
    const columns = []
    if (dataSource.length > 0) {
      for (const i in dataSource[0]) { // eslint-disable-line
        columns.push({
          title: i,
          dataIndex: i,
        })
      }
    }
    const that = this
    const props = {
      name: 'file',
      action: '',
      fileList,
      headers: {
        authorization: 'authorization-text',
      },
      // beforeUpload: file => that.onImportExcel(file),
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
          message.success(`${info.file.name} 上传成功`)
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
        <Table
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    )
  }
}
export default UploadJson
