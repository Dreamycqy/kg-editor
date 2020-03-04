import React from 'react'
import { Icon } from 'antd'
import UserIcon from '@/components/items/usericon'
import styles from './style.less'

class History extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [{
        date: 'Wed, 5 Mar 2020',
        event: 'Created data property ',
        children: [
          {
            time: '2020-03-05 09:00:00',
            dataType: 'Property',
            event: 'Move',
            user: 'admin',
            node: '属性0-0-1',
            origin: '属性0-0',
            target: '属性0-1',
            children: ['delete', 'add'],
            place: '公共属性',
          },
          {
            time: '2020-03-05 08:00:00',
            user: 'chenqiuyang',
            node: '实体a',
            dataType: 'Individual',
            event: 'Create',
            children: ['add'],
            place: '公共实体',
          },
        ],
      }, {
        date: 'Wed, 4 Mar 2020',
        event: 'Created data property ',
        children: [
          {
            time: '2020-03-04 09:00:00',
            dataType: 'Property',
            event: 'Move',
            user: 'admin',
            node: '属性0-0-1',
            origin: '属性0-0',
            target: '属性0-1',
            children: ['delete', 'add'],
            place: '任务1',
          },
          {
            time: '2020-03-04 07:00:00',
            user: 'chenqiuyang',
            node: '实体b',
            dataType: 'Individual',
            event: 'Delete',
            children: ['delete'],
            place: '任务1',
          },
        ],
      }],
    }
  }

  renderDate = (data) => {
    const result = []
    data.forEach((e) => {
      const item = (
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10, fontSize: 16, color: '#888' }}>◉ Changes on {e.date}</div>
          {this.renderAction(e.children)}
        </div>
      )
      result.push(item)
    })
    return result
  }

  renderAction = (data) => {
    const result = []
    data.forEach((e) => {
      const item = (
        <div className={styles.actionCard}>
          <div style={{ marginBottom: 10 }}>{e.event}&nbsp;{e.dataType}
            {e.event === 'Move'
              ? <span>{` ${e.node} from ${e.origin} to ${e.target}`}</span> : null
            }
          </div>
          <div>
            <UserIcon size="small" username={e.user} />
            <span style={{ color: '#888', fontSize: 12 }}>
              {`${e.user} authored ${e.children.length} changes at ${e.time}`}
            </span>
          </div>
          <div style={{ padding: '6px 40px', fontSize: 12 }}>{this.renderDetail(e)}</div>
        </div>
      )
      result.push(item)
    })
    return result
  }

  renderDetail = (params) => {
    switch (params.event) {
      case 'Move':
        return (
          <div>
            <div style={{ backgroundColor: '#f5fffa', padding: 2, borderBottom: '1px solid #e8e8e8' }}>
              <Icon style={{ color: '#00a60e' }} type="plus-circle" />
              &nbsp;&nbsp;
              {`${params.dataType} ${params.node} of ${params.target}`}
            </div>
            <div style={{ backgroundColor: '#fff5fa', padding: 2, borderBottom: '1px solid #e8e8e8' }}>
              <Icon style={{ color: 'red' }} type="minus-circle" />
              &nbsp;&nbsp;
              {`${params.dataType} ${params.node} of ${params.origin}`}
            </div>
          </div>
        )
      case 'Create':
        return (
          <div>
            <div style={{ backgroundColor: '#f5fffa', padding: 2, borderBottom: '1px solid #e8e8e8' }}>
              <Icon style={{ color: '#00a60e' }} type="plus-circle" />
              &nbsp;&nbsp;
              {`${params.dataType} ${params.node}`}
            </div>
          </div>
        )
      case 'Delete':
        return (
          <div>
            <div style={{ backgroundColor: '#fff5fa', padding: 2, borderBottom: '1px solid #e8e8e8' }}>
              <Icon style={{ color: 'red' }} type="minus-circle" />
              &nbsp;&nbsp;
              {`${params.dataType} ${params.node}`}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    console.log(styles)
    return (
      <div>
        {this.renderDate(this.state.data)}
      </div>
    )
  }
}
export default History
