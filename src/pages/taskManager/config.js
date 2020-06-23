import React from 'react'
import { Modal, Spin, Button, Form, Input, DatePicker, Select, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { connect } from 'dva'
import FlexTable from '@/components/table/flexTableStat'
import { makeOptionSimple, makeOption, makeOptionTree } from '@/utils/common'
import { createTaskInfo, editTaskInfo, getProjectClassesTree, editClasses } from '@/services/edukg'

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
      taskName: '',
      startNode: '',
      desc: '',
      endTime: moment().subtract(-3, 'days'),
      members: [this.props.userInfo.email],
      urgency: 'high',
      type: [],
      classTree: [],
      expectation: [],
    }
  }

  getData = async () => {
    this.setState({ loading: true })
    const {
      taskName, startNode, desc, endTime, members, urgency, type, expectation,
    } = this.props.params
    const memList = []
    members.forEach((e) => { memList.push(e.email) })
    const target = _.find(this.state.classTree, { key: startNode })
    this.setState({
      taskName,
      startNode: target ? target.title : '',
      desc,
      endTime: moment(endTime),
      members: memList,
      urgency,
      type,
      expectation,
    })
    this.setState({ loading: false })
  }

  openModal = async () => {
    await this.setState({ visible: true, members: [this.props.userInfo.email] })
    const newData = await getProjectClassesTree({
      projectName: this.props.projectName,
    })
    if (newData) {
      await this.setState({ classTree: newData.data })
    }
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
          help: '任务名不能与现有任务重复',
        }
      }
    }
    return result
  }

  handleSave = async () => {
    const {
      taskName, desc, startNode, members, urgency, endTime, type, classTree,
    } = this.state
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
      ? await editTaskInfo({
        projectName: this.props.projectName,
        taskName,
        desc,
        startNode: _.find(classTree, { title: startNode }).key,
        members: JSON.stringify(memList),
        urgency,
        createTime: this.props.params.createTime,
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        type: JSON.stringify(type),
        expectation: JSON.stringify(this.tableConfig.getMyData()),
      })
      : await createTaskInfo({
        projectName: this.props.projectName,
        taskName,
        desc,
        startNode: _.find(classTree, { title: startNode }).key,
        members: JSON.stringify(memList),
        urgency,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        type: JSON.stringify(type),
        expectation: JSON.stringify(this.tableConfig.getMyData()),
      })
    if (data === 200) {
      message.success(this.props.type === 'edit' ? '编辑任务成功' : '新建任务成功')
      this.setState({ visible: false })
      if (this.props.type !== 'edit') {
        _.find(classTree,
          { key: _.find(classTree, { title: startNode }).key }).nodeTask.push(taskName)
        editClasses({
          projectName: this.props.projectName,
          node: JSON.stringify(classTree),
        })
      }
      this.props.update()
    } else {
      message.error('保存发生错误')
    }
  }

  handleMembers = (value) => {
    const members = value
    if (members.indexOf(this.props.userInfo.email) < 0) {
      members.unshift(this.props.userInfo.email)
    }
    this.setState({ members })
  }

  render() {
    const {
      visible, loading, taskName, startNode, desc, endTime, members,
      type, urgency, classTree, expectation,
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
                  validateStatus={this.checkName(taskName).status}
                  help={this.checkName(taskName).help}
                >
                  <Input
                    value={taskName}
                    disabled={this.props.type === 'edit'}
                    onChange={e => this.setState({ taskName: e.target.value })}
                  />
                </FormItem>
                <FormItem
                  label="概念树起始节点"
                  {...formItemLayout}
                >
                  <Select
                    placeholder="请选择起始节点"
                    showSearch
                    value={startNode}
                    onChange={value => this.setState({ startNode: value })}
                  >
                    {makeOptionTree(classTree)}
                  </Select>
                </FormItem>
                <FormItem
                  label="负责人员"
                  {...formItemLayout}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择参与成员"
                    value={members}
                    onChange={value => this.handleMembers(value)}
                  >
                    {makeOptionSimple(this.props.members || [])}
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
                  label="紧迫等级"
                  {...formItemLayout}
                >
                  <Select
                    placeholder="请选择任务紧迫等级"
                    value={urgency}
                    onChange={value => this.setState({ urgency: value })}
                  >
                    {makeOption([{
                      name: '高', value: 'high',
                    }, {
                      name: '中', value: 'middle',
                    }, {
                      name: '低', value: 'low',
                    }])}
                  </Select>
                </FormItem>
                <FormItem
                  label="任务涵盖"
                  {...formItemLayout}
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择任务涵盖领域"
                    value={type}
                    onChange={value => this.setState({ type: value })}
                  >
                    {makeOption([{
                      name: '概念编辑', value: 'class',
                    }, {
                      name: '属性编辑', value: 'property',
                    }, {
                      name: '实体编辑', value: 'individual',
                    }])}
                  </Select>
                </FormItem>
                <FormItem
                  label="预期指标"
                  {...formItemLayout}
                >
                  <FlexTable data={expectation} ref={e => this.tableConfig = e} />
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
