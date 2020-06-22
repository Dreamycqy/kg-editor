import React from 'react'
import { Avatar, Tooltip } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'

@connect()
class UserIcon extends React.Component {
  jump = (email) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/members',
      query: {
        email,
      },
    }))
  }

  render() {
    return (
      <Tooltip title={`${this.props.username.userName}(${this.props.username.email})`}>
        <span style={{ margin: 4 }}>
          <Avatar size={this.props.size} style={{ cursor: 'pointer', backgroundColor: '#73e6e1' }}>
            <a
              href="javascript:;" onClick={() => this.jump(this.props.username.email)}
              style={{ color: 'white' }}
            >
              {this.props.username.userName.substr(0, 1)}
            </a>
          </Avatar>
        </span>
      </Tooltip>
    )
  }
}
export default UserIcon
