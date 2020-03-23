import React from 'react'
import _ from 'lodash'
import { Modal, Spin, Button, Form, Input, Select, message } from 'antd'
import { connect } from 'dva'
import { makeOptionSimple } from '@/utils/common'
import { createProject, editProjectInfo } from '@/services/edukg'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}
function mapStateToProps(state) {
  const { locale, userInfo, userList } = state.global
  return {
    locale, userInfo, userList,
  }
}
@connect(mapStateToProps)
class Config extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loading: false,
      projectName: '',
      startNode: '',
      desc: '',
      members: [],
    }
  }

  getData = () => {
    this.setState({ loading: true })
    const {
      projectName, startNode, desc, members,
    } = this.props.params
    const memList = []
    members.forEach((e) => { memList.push(e.email) })
    this.setState({
      projectName,
      startNode,
      desc,
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
      if (_.find(this.props.dataSource, { projectName: str })) {
        result = {
          status: 'error',
          help: '项目名不能与现有项目重复',
        }
      }
    }
    return result
  }

  handleSave = async () => {
    const { projectName, desc, startNode, members } = this.state
    const memList = []
    members.forEach((i) => {
      this.props.userList.forEach((e) => {
        if (e.email === i && !_.find(memList, { email: i })) {
          memList.push({
            email: e.email,
            userName: e.userName,
          })
        }
      })
    })
    const data = this.props.type === 'edit'
      ? await editProjectInfo({
        projectid: this.props.params.projectid,
        projectName,
        desc,
        startNode,
        members: JSON.stringify(memList),
      })
      : await createProject({
        projectName,
        desc,
        startNode,
        members: JSON.stringify(memList),
      })
    if (data === 200) {
      message.success(this.props.type === 'edit' ? '编辑项目成功' : '新建项目成功')
      this.setState({ visible: false })
      this.props.update()
    } else {
      message.error('保存发生错误')
    }
  }

  render() {
    const {
      visible, loading, projectName, startNode, desc, members,
    } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        {
          this.props.type === 'edit'
            ? <a href="#" disabled={this.props.disabled} onClick={e => this.openModal(e)}>修改</a>
            : (
              <Button
                type="primary" disabled={this.props.disabled}
                onClick={() => this.openModal()}
              >
                新建项目
              </Button>
            )
        }
        <Modal
          title="项目配置"
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          footer={[
            <Button key="cancel" type="" onClick={() => this.setState({ visible: false })}>取消</Button>,
            <Button key="save" type="primary" onClick={() => this.handleSave()}>保存</Button>,
          ]}
          width="820px"
        >
          <Spin spinning={loading}>
            <div>
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="项目名称"
                  validateStatus={this.checkName(projectName).status}
                  help={this.checkName(projectName).help}
                >
                  <Input
                    value={projectName}
                    disabled={this.props.type === 'edit'}
                    onChange={e => this.setState({ projectName: e.target.value })}
                  />
                </FormItem>
                <FormItem
                  label="概念树起始节点"
                  {...formItemLayout}
                >
                  <Input
                    value={startNode}
                    disabled={this.props.type === 'edit'}
                    onChange={e => this.setState({ startNode: e.target.value })}
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
                    {makeOptionSimple(this.props.userList)}
                  </Select>
                </FormItem>
                {/* <FormItem
                  label="截止时间"
                  {...formItemLayout}
                >
                  <DatePicker
                    showTime
                    value={endTime}
                    onChange={value => this.setState({ endTime: value })}
                  />
                </FormItem> */}
                <FormItem
                  label="项目描述"
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
