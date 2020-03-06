import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Form, Icon, Input } from 'antd'
import styles from './index.less'

const FormItem = Form.Item

@connect()
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      const { username, password } = values
      console.log(username, password)
      this.props.dispatch({
        type: 'global/updateState',
        payload: {
          userInfo: {
            email: username,
          },
        },
      })
      this.props.dispatch(routerRedux.push({
        pathname: '/',
        query: {},
      }))
    })
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
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入邮箱账号(包括后缀)!' }],
              })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入邮箱账号(包括后缀)" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入邮箱密码!' }],
              })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入邮箱密码" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" htmlType="submit" className={styles['login-form-button']}>
                登录
              </Button>
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
