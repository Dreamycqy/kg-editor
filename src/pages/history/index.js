import React from 'react'
import { Pagination } from 'antd'
import History from '@/components/history'
import data from '@/utils/mock/totalHistory'

class HistoryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <History data={data} />
        <div style={{ overflow: 'hidden', marginRight: 30 }}>
          <Pagination
            style={{ float: 'right' }}
            defaultCurrent={1} total={2}
          />
        </div>
      </div>
    )
  }
}
export default HistoryList
