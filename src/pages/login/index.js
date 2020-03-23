import React from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Form, Icon, Input, message } from 'antd'
import { login, register } from '@/services/global'
import { getUserList } from '@/services/edukg'
import styles from './index.less'

const FormItem = Form.Item

@connect()
class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'login',
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不同!')
    } else {
      callback()
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const data = this.state.type === 'login' ? await login({
          email: values.email,
          password: values.password,
        }) : await register({
          email: values.email,
          userName: values.userName,
          password: values.password,
        })
        if (this.state.type === 'login') {
          this.handleUserInfo(data, values.email)
        } else {
          const newData = await login({
            email: values.email,
            password: values.password,
          })
          this.handleUserInfo(newData, values.email)
        }
      }
    })
  }

  handleUserInfo = async (data, email) => {
    if (data === 200) {
      await this.handleUserList(email)
      window.localStorage.setItem('email', email)
      this.props.dispatch(routerRedux.push({
        pathname: '/kgEditor/board',
        query: {
        },
      }))
    } else if (data === 500) {
      message.error('该邮箱已注册！')
    } else {
      message.error('登录失败，请检查邮箱和密码！')
    }
  }

  handleUserList = async (email) => {
    const data = await getUserList({ email })
    if (data.data) {
      const { userName, role } = _.find(data.data, { email })
      await this.props.dispatch({
        type: 'global/updateState',
        payload: {
          userList: data,
          userInfo: {
            email,
            userName,
            role,
          },
        },
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={styles.loginContent}>
        <div className={styles.loginBox}>
          {/* <div> */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 20, color: '#24b0e6' }}>
            <div>欢迎登陆知识本体编辑系统</div>
          </div>
          <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: '请输入邮箱账号!' }],
              })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入邮箱账号" />)}
            </FormItem>
            {
              this.state.type === 'register'
                ? (
                  <FormItem>
                    {getFieldDecorator('userName', {
                      rules: [{ required: true, message: '请输入用户昵称!' }],
                    })(<Input prefix={<Icon style={{ fontSize: 13 }} />} placeholder="请输入用户昵称" />)}
                  </FormItem>
                ) : null
            }
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />)}
            </FormItem>
            {
              this.state.type === 'register'
                ? (
                  <FormItem>
                    {getFieldDecorator('confirm', {
                      rules: [{ required: true, message: '请输入密码!' }, {
                        validator: this.compareToFirstPassword,
                      }],
                    })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请重复确认密码" />)}
                  </FormItem>
                ) : null
            }
            <FormItem>
              <Button type="primary" size="large" htmlType="submit" className={styles['login-form-button']}>
                {this.state.type === 'login' ? '登录' : '注册'}
              </Button>
              <a
                style={{
                  textAlign: 'center', fontSize: 13,
                }}
                onClick={() => this.setState({ type: this.state.type === 'register' ? 'login' : 'register' })}
              >
                {this.state.type === 'login' ? '没有账号？点击注册' : '已有账号？返回登录'}
              </a>
              <span style={{
                color: '#a5a1a1', display: 'block', textAlign: 'center', fontSize: 13,
              }}
              >有问题请联系陈秋阳: autumnchenqy@aliyun.com
              </span>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

export default connect()(Form.create()(WrappedNormalLoginForm))
