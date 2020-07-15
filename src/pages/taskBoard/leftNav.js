import React from 'react'
import { Progress, Empty, Skeleton } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import {
  getProjectClassesTree, getProjectPropertiesTree, getProjectIndividualsTree,
} from '@/services/edukg'
import HistoryList from '@/components/history'
import CountDown from '@/components/items/countDown'
import hisdata from '@/utils/mock/totalHistory'
import Chart from '@/components/charts/foldGrape'

const name = {
  class: '概念',
  propertyObj: '对象属性',
  propertyData: '数据属性',
  individual: '实体',
  triple: '三元组',
}

class LeftPart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classData: [],
      propertyObj: [],
      propertyData: [],
      treeData: [],
      loading: true,
    }
  }

  componentWillMount = () => {
    this.getClass(this.props.data.projectName)
    this.getPdata(this.props.data.projectName)
    this.getPobj(this.props.data.projectName)
    this.getIndis(this.props.data.projectName)
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.projectName !== this.props.data.projectName) {
      this.getClass(nextProps.data.projectName)
      this.getPdata(nextProps.data.projectName)
      this.getPobj(nextProps.data.projectName)
      this.getIndis(nextProps.data.projectName)
    }
  }

  getClass = async (projectName) => {
    this.setState({ loading: true })
    const data = await getProjectClassesTree({
      projectName,
    })
    if (data) {
      this.setState({ classData: data.data })
    }
    this.setState({ loading: false })
  }

  getPobj = async (projectName) => {
    this.setState({ loading: true })
    const data = await getProjectPropertiesTree({
      projectName,
      type: 'object',
    })
    if (data) {
      this.setState({ propertyObj: data.data })
    }
    this.setState({ loading: false })
  }

  getPdata = async (projectName) => {
    this.setState({ loading: true })
    const data = await getProjectPropertiesTree({
      projectName,
      type: 'data',
    })
    if (data) {
      this.setState({ propertyData: data.data })
    }
    this.setState({ loading: false })
  }

  getIndis = async (projectName) => {
    this.setState({ loading: true })
    const data = await getProjectIndividualsTree({
      projectName,
    })
    if (data) {
      this.setState({ treeData: data.data.filter((e) => { return !!e.key }) })
    }
    this.setState({ loading: false })
  }

  makeProcess = (obj) => {
    const result = []
    for (const i in obj) { // eslint-disable-line
      if (i === '') {
        return
      }
      result.push(
        <div style={{ padding: '0 0 20px 10px' }}>
          <div style={{ width: 80, display: 'inline-block' }}>{name[i]}</div>
          <Progress
            style={{ width: '70%' }}
            percent={Math.round(obj[i].rate * 100) / 100}
          />
          <div style={{ display: 'inline-block', marginLeft: 40 }}>{obj[i].text}</div>
        </div>,
      )
    }
    return result
  }

  rebuildChartData = (classData, treeData) => {
    const data = []
    const links = []
    classData.forEach((e, index) => {
      const opacity = index === 0 ? 1 : e.target.indexOf(classData[0].key) > -1 ? 1 : 0
      const item = {
        name: `${e.title}(概念)`,
        draggable: true,
        open: index === 0,
        category: 0,
        itemStyle: {
          opacity,
        },
      }
      data.push(item)
      if (!e.target) {
        return
      }
      e.target.forEach((i) => {
        links.push({
          source: `${e.title}(概念)`,
          target: `${_.find(classData, { key: i }).title}(概念)`,
          lineStyle: {
            opacity,
          },
        })
      })
    })
    treeData.forEach((e) => {
      const opacity = e.types.indexOf(classData[0] ? classData[0].key : '') > -1 ? 1 : 0
      e.types.forEach((i) => {
        const item = {
          name: `${e.title}(实体)`,
          draggable: true,
          category: 1,
          itemStyle: {
            opacity,
          },
        }
        data.push(item)
        links.push({
          source: `${e.title}(实体)`,
          target: _.find(classData, { key: i }) ? `${_.find(classData, { key: i }).title}(概念)` : '',
          lineStyle: {
            opacity,
          },
        })
      })
    })
    return {
      data: _.uniqBy(data, 'name'),
      links,
    }
  }

  render() {
    const { data } = this.props
    const {
      loading, classData, propertyObj, propertyData, treeData,
    } = this.state
    const process = {}
    data.expectation.forEach((e) => {
      const key = e.split('=')[0]
      const value = e.split('=')[1]
      if (key === 'class') {
        process[key] = {
          rate: classData.length * 100 / value,
          text: `${classData.length} / ${value}`,
        }
      } else if (key === 'propertyObj') {
        process[key] = {
          rate: propertyObj.length * 100 / value,
          text: `${propertyObj.length} / ${value}`,
        }
      } else if (key === 'propertyData') {
        process[key] = {
          rate: propertyData.length * 100 / value,
          text: `${propertyData.length} / ${value}`,
        }
      } else if (key === 'individual') {
        process[key] = {
          rate: treeData.length * 100 / value,
          text: `${treeData.length} / ${value}`,
        }
      } else {
        const array = []
        treeData.forEach((p) => {
          p.relationships.forEach((q) => {
            array.push(q)
          })
        })
        process[key] = {
          rate: array.length / value,
          text: `${array.length} / ${value}`,
        }
      }
    })
    return (
      <div style={{ height: '100%', overflowY: 'scroll' }}>
        <div style={{ borderBottom: '1px solid #e8e8e8', padding: 10, backgroundColor: '#fbfbfb', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 20 }}>{data.taskName.split('______')[1]}</span>
            <span style={{ marginLeft: 20 }}>截止于：{data.endTime}</span>
          </div>
          <span style={{ marginRight: 20 }}>
            所属图谱：
            <span style={{ color: 'red' }}>{data.projectName}</span>
          </span>
          <span>剩余时间：</span>
          <CountDown style={{ fontSize: 20, color: 'red' }} target={moment(data.endTime).valueOf()} />
          <div style={{ wordBreak: 'break-all', marginTop: 10 }}>描述：{data.desc}</div>
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>预期指标</div>
          <Skeleton active loading={loading}>
            {
              this.makeProcess(process)
            }
          </Skeleton>
          {/* <Row>
            <Col style={{ height: 300 }} span={12}>
              <Chart1 />
            </Col>
            <Col style={{ height: 300 }} span={12}>
              <Chart2 />
            </Col>
          </Row>
          <Row>
            <Col style={{ height: 300 }} span={12}>
              <Chart3 />
            </Col>
            <Col style={{ height: 300 }} span={12}>
              <Chart4 />
            </Col>
          </Row> */}
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>图谱展示</div>
          <div style={{ height: 400 }}>
            <Chart graph={this.rebuildChartData(classData, treeData)} />
          </div>
        </div>
        <div style={{ backgroundColor: '#fbfbfb', padding: 10, borderBottom: '1px solid #e8e8e8', marginBottom: 10 }}>
          <div style={{ fontSize: 20, paddingBottom: 10 }}>最近编辑</div>
          <div>
            <HistoryList data={hisdata} type="lastone" />
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
