import React from 'react'
import { Empty } from 'antd'
import Tree from '@/components/tree/simpleTree'
import taskData from '@/utils/mock/task2'
import treeData from '@/utils/mock/publicIndis'
import HistoryList from '@/components/history'
import historyData from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/newGrapeChart'

class PublicResource extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNode: '',
    }
  }

  selectNode = (selectNode) => {
    this.setState({ selectNode })
  }

  rebuildChartData = (selectNode) => {
    return {
      data: [{
        name: selectNode,
        draggable: true,
      }],
      links: [],
    }
  }

  render() {
    const {
      selectNode,
    } = this.state
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', width: 300, borderRight: '1px solid #e8e8e8' }}>
          <Tree iconType="tag" iconColor="#1296db" data={treeData} selectNode={this.selectNode} />
        </div>
        <div style={{ flexGrow: 1, padding: '0 20px', minWidth: 600 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>
            Class: {selectNode}
          </div>
          <div style={{ border: '1px solid #e8e8e8', height: 400, marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode)} />
          </div>
          <div>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>讨论</div>
            <Empty style={{ marginTop: 10 }} />
          </div>
        </div>
        <div style={{ height: '100%', width: 450, borderLeft: '1px solid #e8e8e8', paddingLeft: 10 }}>
          <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>图例</div>
          <div style={{ height: 400, border: '1px solid #e8e8e8', marginBottom: 20 }}>
            <Chart graph={this.rebuildChartData(selectNode)} />
          </div>
          <div style={{ minHeight: 350 }}>
            <div style={{ marginBottom: 10, fontSize: 20, fontWeight: 600 }}>最近更改</div>
            {historyData[0]
              ? <HistoryList data={[historyData[0]]} type="lastone" />
              : <Empty />
            }
          </div>
        </div>
      </div>
    )
  }
}
export default PublicResource
