import React from 'react'
import Background from '@/assets/banner2.jpg'
import Logo from '@/assets/homeLogo.png'

class ClusterBroker extends React.Component {
  render() {
    return (
      <div style={{ background: `url("${Background}") repeat`, height: '100%' }}>
        <div style={{ height: 100, width: 550, margin: '0 auto', paddingTop: 100 }}>
          <div style={{ float: 'left' }}>
            <img src={Logo} alt="logo" width="84px" height="84px" />
          </div>
          <div style={{ float: 'left', fontSize: 42, marginTop: 16, color: 'white' }}>
            OKES 本体知识编辑系统
          </div>
        </div>
        <div style={{ height: 400, width: 1000, margin: '0 auto', marginTop: 160, backgroundColor: 'white', borderRadius: 10 }}>
        </div>
      </div>
    )
  }
}
export default ClusterBroker
