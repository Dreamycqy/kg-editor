import React from 'react'
import { Avatar, Tooltip } from 'antd'

class UserIcon extends React.Component {
  render() {
    return (
      <Tooltip title={this.props.username}>
        <span style={{ margin: 4 }}>
          <Avatar size={this.props.size} style={{ cursor: 'pointer', backgroundColor: '#73e6e1' }}>{this.props.username.substr(0, 1).toUpperCase()}</Avatar>
        </span>
      </Tooltip>
    )
  }
}
export default UserIcon
