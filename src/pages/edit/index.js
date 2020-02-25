import React from 'react'
import { Tabs } from 'antd'

class EditPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'doc',
    }
  }

  render() {
    const { type } = this.state
    return (
      <div>
        {type}
      </div>
    )
  }
}
export default EditPage
