import React from 'react'
import { Layout, ConfigProvider, Menu, Dropdown, Icon, Avatar, Badge } from 'antd'
import _ from 'lodash'
import { connect } from 'dva'
import router from 'umi/router'
import Link from 'umi/link'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en_GB from 'antd/lib/locale-provider/en_GB'
import menuList from '@/constants/menuList'
import { getUserList } from '@/services/edukg'
import { logout, fetchUserInfo } from '@/services/global'
import moment from 'moment'

const {
  Header, Footer, Content,
} = Layout

function mapStateToProps(state) {
  const { locale, userInfo } = state.global
  return {
    locale, userInfo,
  }
}
@connect(mapStateToProps)
class MainLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[1],
    }
  }

  componentWillMount = async () => {
    if (moment(window.localStorage.expire) < moment()) {
      this.logout()
    }
    const data = await fetchUserInfo({ email: window.localStorage.email })
    if (data === 200) {
      this.handleUserList(window.localStorage.email)
    } else {
      this.logout()
    }
  }

  componentWillReceiveProps = () => {
    const key = window.location.pathname.split('/')[1]
    this.setState({
      key,
    })
  }

  handleUserList = async (email) => {
    const data = await getUserList({ email })
    if (data.data) {
      const { userName, role, projectList, taskList } = _.find(data.data, { email })
      await this.props.dispatch({
        type: 'global/updateState',
        payload: {
          userList: data.data,
          userInfo: {
            email,
            userName,
            role,
            projectList,
            taskList,
          },
        },
      })
    }
  }

  handleSelect = (key) => {
    this.setState({ key })
    router.push(`/${key}`)
  }

  handleLocaleChange = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        locale: this.props.locale === 'cn' ? 'en' : 'cn',
      },
    })
  }

  makeMenu = () => {
    const result = []
    for (const i in menuList) { // eslint-disable-line
      result.push(<Menu.Item key={i}>{menuList[i][this.props.locale]}</Menu.Item>)
      // if ((i !== 'manager' && i !== 'members') || email === 'admin@aliyun.com') {
      //   result.push(<Menu.Item key={i}>{menuList[i][this.props.locale]}</Menu.Item>)
      // }
    }
    return result
  }

  logout = async () => {
    window.localStorage.clear()
    await logout({ email: this.props.userInfo.email })
    window.location.href = '/login'
  }

  render() {
    const { userName } = this.props.userInfo
    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={() => this.logout()}
          >
            退出
          </a>
        </Menu.Item>
      </Menu>
    )
    // const { pathname } = window.location
    // if ((pathname === '/members' || pathname === '/manager') && email !== 'admin@aliyun.com') {
    //   router.push('/')
    // }
    return (
      <Layout style={{ height: '100%' }}>
        <ConfigProvider locale={this.props.locale === 'cn' ? zh_CN : en_GB}>
          <Header
            style={{
              height: 60,
              backgroundColor: '#001529',
              borderBottom: '1px solid #e8e8e8',
              position: 'fixed',
              top: 0,
              zIndex: 999,
              width: '100%',
              color: 'white',
            }}
          >
            <div
              style={{
                width: 220,
                height: 31,
                marginLeft: 30,
                float: 'left',
                fontSize: 28,
                fontWeight: 700,
                lineHeight: '60px',
              }}
            >
              <Link to="" style={{ color: 'white' }}>KG-EDITOR</Link>
            </div>
            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={[this.state.key]}
              style={{ lineHeight: '58px', position: 'absolute', right: 200 }}
              onClick={e => this.handleSelect(e.key)}
            >
              {this.makeMenu()}
            </Menu>
            <div style={{ float: 'right' }}>
              <Badge count={0}>
                <a href="#" style={{ color: 'white' }} onClick={() => {}}>
                  <Icon style={{ fontSize: 24 }} type="mail" />
                </a>
              </Badge>
            </div>
            <Dropdown overlay={menu}>
              <div style={{ float: 'right', lineHeight: '56px' }}>
                <Avatar>{userName ? userName.substr(0, 1).toUpperCase() : ''}</Avatar>
                <span style={{ marginLeft: 8 }}>{userName || ''}</span>
                <Icon type="down" style={{ marginRight: 10 }} />
              </div>
            </Dropdown>
          </Header>
          <Content style={{ backgroundColor: '#fff', minHeight: 800, marginTop: 60, padding: 10 }}>
            {/* {
              (pathname !== '/members' && pathname !== '/manager') || email === 'admin@aliyun.com'
                ? this.props.children : null
            } */}
            { this.props.children }
          </Content>
          <Footer
            style={{ textAlign: 'center', height: 80 }}
          >
            <div>Copyright© 2018 KEG，Tsinghua University</div>
            <div>地址：清华大学东主楼</div>
          </Footer>
        </ConfigProvider>
      </Layout>
    )
  }
}

export default MainLayout
