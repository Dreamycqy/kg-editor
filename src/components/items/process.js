import React from 'react'
import { Modal, Spin, Progress } from 'antd'

class Process extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
    }
  }

  openModal = async () => {
    await this.setState({ visible: true })
  }

  renderList = (data) => {
    const result = []
    data.forEach((e, index) => {
      result.push(
        <div style={{ padding: '20px 0', borderBottom: index === data.length - 1 ? '' : '1px solid #e8e8e8' }}>
          <div>
            <div style={{ fontSize: 24 }}>{e.name}</div>
            <div>
              <span>截止时间：{e.endTime}</span>
              <span style={{ marginLeft: 20 }}>
                <a href="javascript" onClick={() => this.jump()}>点击查看详情</a>
              </span>
            </div>
          </div>
          <Progress
            percent={Number(((e.process.classes + e.process.properties + e.process.individuals) / 3).toFixed(2))} // eslint-disable-line
            style={{ width: 450, marginBottom: 20 }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              <Progress type="circle" percent={Number(e.process.classes.toFixed(2))} width={80} />
              <div style={{ textAlign: 'center', marginTop: 10 }}>Classes</div>
            </div>
            <div style={{ float: 'left', marginLeft: 80 }}>
              <Progress type="circle" percent={Number(e.process.properties.toFixed(2))} width={80} />
              <div style={{ textAlign: 'center', marginTop: 10 }}>Properties</div>
            </div>
            <div style={{ float: 'left', marginLeft: 80 }}>
              <Progress type="circle" percent={Number(e.process.individuals.toFixed(2))} width={80} />
              <div style={{ textAlign: 'center', marginTop: 10 }}>Individuals</div>
            </div>
          </div>
        </div>,
      )
    })
    return result
  }

  render() {
    const {
      visible, loading,
    } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        <a href="javascript:;" onClick={() => this.openModal()}>工作进度</a>
        <Modal
          title="工作进度"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          width="700px"
          footer={null}
        >
          <Spin spinning={loading}>
            <div style={{ padding: '0 80px' }}>
              {this.renderList(this.props.data)}
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}
export default Process
