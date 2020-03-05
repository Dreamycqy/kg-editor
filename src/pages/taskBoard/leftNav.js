import React from 'react'
import { Progress, Empty } from 'antd'
import moment from 'moment'
import HistoryList from '@/components/history'
import CountDown from '@/components/items/countDown'

class LeftPart extends React.Component {
  render() {
    const { data } = this.props
    return (
      <div>
        <div style={{ borderBottom: '1px solid #e8e8e8', padding: 10, backgroundColor: '#fbfbfb', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 20 }}>{data.name}</span>
            <span style={{ marginLeft: 20 }}>截止于：{data.endTime}</span>
          </div>
          <span style={{ marginRight: 20 }}>剩余时间</span>
          <CountDown style={{ fontSize: 20, color: 'red' }} target={moment(data.endTime).valueOf()} />
          <div style={{ wordBreak: 'break-all' }}>描述：{data.desc}</div>
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>任务进度</div>
          <div style={{ padding: '0 0 20px 10px' }}>
            <div style={{ width: 80, display: 'inline-block' }}>Classes</div>
            <Progress
              style={{ width: 200 }}
              percent={Number(data.process.classes.toFixed(2))}
            />
          </div>
          <div style={{ padding: '0 0 20px 10px' }}>
            <div style={{ width: 80, display: 'inline-block' }}>Properties</div>
            <Progress
              style={{ width: 200 }}
              percent={Number(data.process.properties.toFixed(2))}
            />
          </div>
          <div style={{ padding: '0 0 20px 10px' }}>
            <div style={{ width: 80, display: 'inline-block' }}>Individuals</div>
            <Progress
              style={{ width: 200 }}
              percent={Number(data.process.individuals.toFixed(2))}
            />
          </div>
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>最近编辑</div>
          <div>
            {data.history[0]
              ? <HistoryList data={[data.history[0]]} type="lastone" />
              : <Empty />
            }
          </div>
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>相关评论</div>
          <Empty />
        </div>
      </div>
    )
  }
}
export default LeftPart
