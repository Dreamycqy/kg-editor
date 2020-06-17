import React from 'react'
import { Icon, message, Upload, Table } from 'antd'
import * as XLSX from 'xlsx'

const { Dragger } = Upload
let source = []

class UploadExcel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      fileList: [],
    }
  }

  onImportExcel = (files) => {
    const fileReader = new FileReader() // eslint-disable-line
    fileReader.onload = (event) => {
      try {
        const { result } = event.target
        const workbook = XLSX.read(result, { type: 'binary' })
        let data = []
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) { // eslint-disable-line
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          }
        }
        source = [...source, ...data]
        message.success('上传成功！')
      } catch (e) {
        message.error('文件类型不正确！')
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files)
  }

  handleFileList = (list) => {
    source = []
    list.forEach((a) => {
      this.onImportExcel(a.originFileObj)
    })
    this.setState({ dataSource: source })
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
        that.setState({ fileList: list }, () => that.handleFileList(list))
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
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
            支持大小不超过5MB，后缀名为xls或xlsx的Excel文件，支持多个文件
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
export default UploadExcel
