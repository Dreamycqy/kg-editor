import React from 'react'
import LeftNav from './leftNav'
import RightContent from './rightContent'

class MainLayout extends React.Component {
  render() {
    return (
      <div style={{ overflow: 'hidden', height: '100%' }}>
        <div style={{ float: 'left', width: 300, borderRight: '1px solid #e8e8e8', height: '100%' }}>
          <LeftNav />
        </div>
        <div>
          <div style={{ marginTop: 10, fontSize: 24 }}>最近打开的项目</div>
          <RightContent />
        </div>
      </div>
    )
  }
}
export default MainLayout
