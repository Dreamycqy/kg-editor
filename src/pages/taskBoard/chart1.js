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
      tooltip: {
        trigger: 'axis',
      },
      xAxis: [{
        type: 'category',
        data: ['2019-12', '2020-01', '2020-02', '2020-03', '2020-04', '2020-05'],
        axisLine: {
          lineStyle: {
            color: '#999',
          },
        },
      }],
      yAxis: [{
        type: 'value',
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#DDD',
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#333',
          },
        },
        nameTextStyle: {
          color: '#999',
        },
        splitArea: {
          show: false,
        },
      }],
      series: [{
        name: '节点',
        type: 'line',
        data: [23, 60, 20, 36, 23, 85],
        lineStyle: {
          normal: {
            width: 8,
            color: {
              type: 'linear',

              colorStops: [{
                offset: 0,
                color: '#A9F387', // 0% 处的颜色
              }, {
                offset: 1,
                color: '#48D8BF', // 100% 处的颜色
              }],
              globalCoord: false, // 缺省为 false
            },
            shadowColor: 'rgba(72,216,191, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20,
          },
        },
        itemStyle: {
          normal: {
            color: '#fff',
            borderWidth: 10,
            /* shadowColor: 'rgba(72,216,191, 0.3)',
                  shadowBlur: 100, */
            borderColor: '#A9F387',
          },
        },
        smooth: true,
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
