import React from 'react'
import { Layout, ConfigProvider, Menu, Dropdown, Icon, Avatar } from 'antd'
import { connect } from 'dva'
import router from 'umi/router'
import Link from 'umi/link'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en_GB from 'antd/lib/locale-provider/en_GB'
import menuList from '@/constants/menuList'

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
      key: window.location.pathname.split('/')[1] || 'home',
    }
  }

  handleSelect = (key) => {
    this.setState({ key })
    router.push(`/${key === 'home' ? '' : key}`)
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
    const { email } = this.props.userInfo
    for (const i in menuList) { // eslint-disable-line
      if ((i !== 'manager' && i !== 'members') || email === 'admin@aliyun.com') {
        result.push(<Menu.Item key={i}>{menuList[i][this.props.locale]}</Menu.Item>)
      }
    }
    return result
  }

  render() {
    const { email } = this.props.userInfo
    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={() => {}}
            href="/login"
          >
            退出
          </a>
        </Menu.Item>
      </Menu>
    )
    const { pathname } = window.location
    if ((pathname === '/members' || pathname === '/manager') && email !== 'admin@aliyun.com') {
      router.push('/')
    }
    return (
      <Layout style={{ height: '100%' }}>
        <ConfigProvider locale={this.props.locale === 'cn' ? zh_CN : en_GB}>
          <Header
            style={{
              height: 60,
              backgroundColor: '#fff',
              borderBottom: '1px solid #e8e8e8',
              position: 'fixed',
              top: 0,
              zIndex: 999,
              width: '100%',
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
              <Link to="">KG-EDITOR</Link>
            </div>
            <Menu
              mode="horizontal"
              selectedKeys={[this.state.key]}
              style={{ lineHeight: '58px', position: 'absolute', right: 200 }}
              onClick={e => this.handleSelect(e.key)}
            >
              {this.makeMenu()}
            </Menu>
            <Dropdown overlay={menu}>
              <div style={{ float: 'right', lineHeight: '56px' }}>
                <Avatar>{email ? email.substr(0, 1).toUpperCase() : ''}</Avatar>
                <span style={{ marginLeft: 8 }}>{email ? email.split('@')[0] : ''}</span>
                <Icon type="down" />
              </div>
            </Dropdown>
          </Header>
          <Content style={{ backgroundColor: '#fff', minHeight: 800, marginTop: 60, padding: 10 }}>
            {
              (pathname !== '/members' && pathname !== '/manager') || email === 'admin@aliyun.com'
                ? this.props.children : null
            }
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
