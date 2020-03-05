import React from 'react'
import { Modal, Spin, Button, Form, Input, DatePicker, Select, message } from 'antd'
import moment from 'moment'
import { makeOptionSimple } from '@/utils/common'
import userList from '@/utils/mock/userList'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      name: '',
      originNode: '',
      desc: '',
      endTime: moment().subtract(-3, 'days'),
      members: [],
    }
  }

  getData = () => {
    this.setState({ loading: true })
    const {
      name, originNode, desc, endTime, members,
    } = this.props.params
    const memList = []
    members.forEach((e) => { memList.push(e.email) })
    this.setState({
      name,
      originNode,
      desc,
      endTime: moment(endTime),
      members: memList,
    })
    this.setState({ loading: false })
  }

  openModal = async () => {
    await this.setState({ visible: true })
    if (this.props.params) {
      this.getData()
    }
  }

  checkName = (str) => {
    let result = {
      status: 'success',
      help: null,
    }
    if (this.props.type === 'new') {
      if (['任务1', '任务2', '任务3', '任务4', '任务5'].indexOf(str) >= 0) {
        result = {
          status: 'error',
          help: '任务名不能与现有任务重复',
        }
      }
    }
    return result
  }

  handleSave = () => {
    this.setState({ visible: false })
    message.success(this.props.type === 'edit' ? '编辑任务成功' : '新建任务成功')
  }

  render() {
    const {
      visible, loading, name, originNode, desc, endTime, members,
    } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        {
          this.props.type === 'edit'
            ? <a href="javascript:;" disabled={this.props.disabled} onClick={() => this.openModal()}>修改需求</a>
            : (
              <Button
                type="primary" disabled={this.props.disabled}
                onClick={() => this.openModal()}
              >
                新建任务
              </Button>
            )
        }
        <Modal
          title="任务配置"
          visible={visible}
          onOk={() => this.handleSave()}
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button type="" onClick={() => this.setState({ visible: false })}>取消</Button>,
            <Button type="danger" onClick={() => {}}>删除</Button>,
            <Button type="primary" onClick={() => this.handleSave()}>保存</Button>,
          ]}
          width="820px"
        >
          <Spin spinning={loading}>
            <div>
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="任务名称"
                  validateStatus={this.checkName(name).status}
                  help={this.checkName(name).help}
                >
                  <Input
                    value={name}
                    disabled={this.props.type === 'edit'}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </FormItem>
                <FormItem
                  label="Class起始节点"
                  {...formItemLayout}
                >
                  <Input
                    value={originNode}
                    disabled={this.props.type === 'edit'}
                    onChange={e => this.setState({ originNode: e.target.value })}
                  />
                </FormItem>
                <FormItem
                  label="负责人员"
                  {...formItemLayout}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择参与成员"
                    value={members}
                    onChange={value => this.setState({ members: value })}
                  >
                    {makeOptionSimple(userList)}
                  </Select>
                </FormItem>
                <FormItem
                  label="截止时间"
                  {...formItemLayout}
                >
                  <DatePicker
                    showTime
                    value={endTime}
                    onChange={value => this.setState({ endTime: value })}
                  />
                </FormItem>
                <FormItem
                  label="任务描述"
                  {...formItemLayout}
                >
                  <TextArea
                    rows={4}
                    value={desc}
                    onChange={e => this.setState({ desc: e.target.value })}
                  />
                </FormItem>
              </Form>
            </div>
          </Spin>
        </Modal>
      </div>
    )
  }
}
export default Config
