import React from 'react'
import { Modal, Spin, Button } from 'antd'

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
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

  render() {
    const {
      visible, loading,
    } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        {
          this.props.type === 'edit'
            ? <a href="javascript:;" onClick={() => this.openModal()}>修改需求</a>
            : (
              <Button
                type="primary" onClick={() => this.openModal()}
              >
                新建任务
              </Button>
            )
        }
        <Modal
          title="推荐调优"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          width="820px"
          footer={null}
        >
          <Spin spinning={loading}>
            <div>
              xxx
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}
export default Config
