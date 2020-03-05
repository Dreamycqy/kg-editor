import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Button } from 'antd'
import UserIcon from '@/components/items/usericon'

@connect()
class taskCard extends React.Component {
  checkTime = (time) => {
    const remain = moment().to(moment(time), true)
    let color = '#000000a6'
    let colorTitle = '#65c294'
    const colorBg = '#fbfbfb'
    if (remain.split(' ')[0] <= 3) {
      color = 'red'
      colorTitle = '#f8aba6'
    } else if (remain.split(' ')[0] <= 7) {
      colorTitle = '#FAFAD2'
    }
    return {
      colorTitle,
      colorBg,
      dom: <span style={{ color }}>剩余时间：{remain}</span>,
    }
  }

  jumpEditor = (e) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/editor',
      query: {
        taskName: e.name,
      },
    }))
  }

  render() {
    const e = this.props.info
    const time = this.checkTime(e.endTime)
    return (
      <div
        style={{ margin: '10px 6px', border: '1px solid #e8e8e8', borderRadius: '4px', backgroundColor: time.colorBg, cursor: 'pointer' }}
      >
        <div
          style={{ backgroundColor: time.colorTitle, padding: 8, overflow: 'hidden' }}
        >
          <div style={{ float: 'left' }}>
            <div style={{ fontSize: 18 }}>{e.name}</div>
            <div>
              <span style={{ marginRight: 20 }}>截止于：{e.endTime}</span>
              {time.dom}
            </div>
          </div>
          <Button style={{ float: 'right', marginTop: 6 }} onClick={() => this.jumpEditor(e)}>进入任务</Button>
        </div>
        <div style={{ padding: 8 }}>
          <div style={{ marginBottom: 4 }}>
            <span>
              <Icon type="user" style={{ fontSize: '14px', color: 'blue' }} />
              成员
            </span>
            {e.members.map(u => <UserIcon size="small" username={u} />)}
          </div>
          <div style={{ wordBreak: 'break-all' }}>描述：{e.desc}</div>
        </div>
      </div>
    )
  }
}
export default taskCard
