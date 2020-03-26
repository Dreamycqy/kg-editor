import React from 'react'
import echarts from 'echarts'
import resizeListener, { unbind } from 'element-resize-event'

export default class GraphChart extends React.Component {
  constructor(...props) {
    super(...props)
    this.dom = null
    this.instance = null
  }

  componentDidMount() {
    const { graph, forcename } = this.props
    try {
      this.instance = this.renderChart(this.dom, graph, forcename, this.instance)
      resizeListener(this.dom, () => {
        this.instance = this.renderChart(this.dom, graph, forcename, this.instance, true)
      })
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  componentDidUpdate() {
    this.instance = this.renderChart(this.dom, this.instance)
  }

  componentWillUnmount() {
    unbind(this.dom)
    this.instance && this.instance.dispose()  //  eslint-disable-line
  }

  renderChart = (dom, instance, forceUpdate = false) => {
    const options = {
      grid: {
        top: '15%',
        right: '10%',
        left: '10%',
        bottom: '12%',
      },
      xAxis: [{
        type: 'category',
        color: '#59588D',
        data: ['2016', '2017', '2018', '2019', '2020'],
        axisLabel: {
          margin: 10,
          color: '#999',
          textStyle: {
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#d2d2d2',
          },
        },
        axisTick: {
          show: false,
        },
      }],
      yAxis: [{
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#999',
          textStyle: {
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(107,107,107,0.37)',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(131,101,101,0.2)',
            type: 'dashed',
          },
        },
      }],
      series: [{
        type: 'bar',
        data: [40, 90, 10, 20, 56],
        barWidth: '50px',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#FF9A22', // 0% 处的颜色
            }, {
              offset: 1,
              color: '#FFD56E', // 100% 处的颜色
            }], false),
            barBorderRadius: [30, 30, 0, 0],
          },
        },
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold',
          position: 'top',
          color: 'blue',
          formatter: (params) => { // 单独对第一个label使用样式
            if (params.dataIndex === 0) {
              return `{a|${params.value}}`
            }
          },
          rich: {// 使用富文本编辑字体样式
            a: {
              color: 'red',
            },
          },
        },
      }],
    }
    let myChart = null
    if (forceUpdate === true) {
      myChart = instance
      myChart.resize()
      myChart.setOption(options)
      return myChart
    }
    if (instance) myChart = instance
    else myChart = echarts.init(dom)
    myChart.clear()
    myChart.resize()
    myChart.setOption(options)
    return myChart
  }

  render() {
    return <div className="e-charts-graph" ref={t => this.dom = t} style={{ height: '100%' }} />
  }
}
