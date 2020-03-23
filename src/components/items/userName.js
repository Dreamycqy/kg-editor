import React from 'react'
import { Tooltip } from 'antd'

class UserIcon extends React.Component {
  render() {
    return (
      <Tooltip title={this.props.user.email}>
        <span style={{ margin: 4 }}>
          {this.props.user.userName}
        </span>
      </Tooltip>
    )
  }
}
export default UserIcon
