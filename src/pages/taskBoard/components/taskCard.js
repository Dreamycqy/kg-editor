import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Button, Card, Avatar } from 'antd'
import UserIcon from '@/components/items/usericon'

const { Meta } = Card

@connect()
class taskCard extends React.Component {
  checkTime = (time) => {
    const remain = moment(time).diff(moment()) / 86400000
    let color = '#000000a6'
    let colorTitle = '#00ff814d'
    let colorBg = '#fbfbfb'
    if (remain < 0) {
      colorTitle = '#e8e8e8'
    } else if (remain <= 3) {
      color = 'red'
      colorTitle = '#ff52004d'
      colorBg = '#fff4f4'
    } else if (remain <= 7) {
      colorTitle = '#FAFAD2'
      colorBg = '#eeffed'
    }
    return {
      colorTitle,
      colorBg,
      dom: <span style={{ color }}>剩余时间：{remain > 0 ? Number(remain.toFixed(0)) : 0} 天</span>,
    }
  }

  jumpEditor = (e) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/editor',
      query: {
        taskName: e.taskName,
        projectName: e.projectName,
      },
    }))
  }

  render() {
    const e = this.props.info
    const time = this.checkTime(e.endTime)
    return (
      <Card
        style={{ borderRadius: '4px', backgroundColor: time.colorBg, cursor: 'pointer', marginRight: 4 }}
        cover={(
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        )}
        actions={[
          <Button>编辑信息</Button>,
          <Button onClick={() => this.jumpEditor(e)}>进入任务</Button>,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={e.taskName}
          description={e.desc}
        />
        <div style={{ marginTop: 20, paddingLeft: 8 }}>
          <p>预期时间：{e.endTime}</p>
          <p>{time.dom}</p>
          <p>优先级别：{e.urgency === 'high' ? '高' : e.urgency === 'low' ? '低' : '中'}</p>
          <p>覆盖范围：{e.type.map(u => (u === 'class' ? '概念 ' : u === 'property' ? '属性 ' : '实体 '))}</p>
        </div>
        <div style={{ padding: 8, marginTop: 10 }}>
          <div style={{ marginBottom: 4 }}>
            <div style={{ marginRight: 4, float: 'left', marginTop: 2 }}>
              <Icon type="team" style={{ fontSize: '14px', color: '#24b0e6' }} />
              成员：
            </div>
            <div style={{ float: 'left', overflow: 'hidden' }}>
              {e.members.map(u => <UserIcon size="small" username={u} />)}
            </div>
          </div>
        </div>
      </Card>
    )
  }
}
export default taskCard
