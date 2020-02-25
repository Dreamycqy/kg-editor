import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon } from 'antd'
import UserIcon from '@/components/items/usericon'

@connect()
class MainLayout extends React.Component {
  checkTime = (time) => {
    const remain = moment().to(moment(time), true)
    let color = '#000000a6'
    let colorTitle = '#4EEE94'
    const colorBg = 'white'
    if (remain.split(' ')[0] <= 3) {
      color = 'red'
      colorTitle = '#ffa89e'
    } else if (remain.split(' ')[0] <= 7) {
      colorTitle = '#FAFAD2'
    }
    return {
      colorTitle,
      colorBg,
      dom: <span style={{ color }}>剩余时间：{remain}</span>,
    }
  }

  jumpEditor = () => {
    window.open('https://webprotege.stanford.edu/#projects/418a5a50-2fd2-4012-ace9-f1d4eccfc299/edit/History?selection=NamedIndividual(%3Chttp://webprotege.stanford.edu/R8uTpK4pZOPRHL2cGRejMeL%3E)')
    // console.log('!')
    // this.props.dispatch(routerRedux.push({
    //   pathname: '/editor',
    //   query: {
    //   },
    // }))
  }

  render() {
    const e = this.props.info
    const time = this.checkTime(e.endTime)
    return (
      <div
        style={{ margin: '10px 6px', border: '1px solid #e8e8e8', borderRadius: '4px', backgroundColor: time.colorBg, cursor: 'pointer' }}
        onClick={() => this.jumpEditor()}
      >
        <div style={{ backgroundColor: time.colorTitle, padding: 8 }}>
          <div style={{ fontSize: 18 }}>{e.title}</div>
          <div>
            <span style={{ marginRight: 20 }}>截止于：{e.endTime}</span>
            {time.dom}
          </div>
        </div>
        <div style={{ padding: 8 }}>
          <div style={{ marginBottom: 4 }}>
            <span>
              <Icon type="user" style={{ fontSize: '14px', color: 'blue' }} />
              成员
            </span>
            {e.member.map(u => <UserIcon username={u} />)}
          </div>
          <div style={{ wordBreak: 'break-all' }}>描述：{e.desc}</div>
          <div style={{ margin: '8px 0' }}>最近历史</div>
        </div>
      </div>
    )
  }
}
export default MainLayout
