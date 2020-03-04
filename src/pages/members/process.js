import React from 'react'
import { Modal, Spin } from 'antd'

class Process extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      data: [],
    }
  }

  getData = () => {
    this.setState({ loading: true })
    this.setState({ loading: false })
  }

  openModal = async () => {
    await this.setState({ visible: true })
    this.getData()
  }

  renderList = (data) => {
    return <div>{data}</div>
  }

  render() {
    const {
      visible, loading, data,
    } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        <a href="javascript:;" onClick={() => this.openModal()}>工作进度</a>
        <Modal
          title="工作进度"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          width="820px"
          footer={null}
        >
          <Spin spinning={loading}>
            <div>
              {this.renderList(data)}
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}
export default Process
