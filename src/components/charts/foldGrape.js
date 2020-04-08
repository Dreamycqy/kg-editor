import React from 'react'
import echarts from 'echarts'
import _ from 'lodash'
import resizeListener, { unbind } from 'element-resize-event'

export default class GraphChart extends React.Component {
  constructor(...props) {
    super(...props)
    this.dom = null
    this.instance = null
  }

  componentDidMount() {
    const { graph } = this.props
    try {
      this.instance = this.renderChart(this.dom, graph, this.instance)
      resizeListener(this.dom, () => {
        this.instance = this.renderChart(this.dom, graph, this.instance, true)
      })
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      graph,
    } = nextProps
    return !_.isEqual(graph, this.props.graph)
  }

  componentDidUpdate() {
    const { graph } = this.props
    this.instance = this.renderChart(this.dom, graph, this.instance)
  }

  componentWillUnmount() {
    unbind(this.dom)
    this.instance && this.instance.dispose()  //  eslint-disable-line
  }

  openOrFold = (param, graph) => {
    console.log(param)
    const { name, open } = param.data
    const { data, links } = graph
    const newNodes = data
    const newlink = links
    if (open === true) {
      // if (_.find(newNodes, { name }) !== undefined) {
      //   _.find(newNodes, { name }).open = false
      //   const temp = _.filter(newlink, { target: name })
      //   if (!temp.length) {
      //     return
      //   }
      //   temp.forEach((e) => {
      //     e.lineStyle.opacity = 0
      //     _.find(newNodes, { name: e.source }).itemStyle.opacity = 0
      //   })
      // }
    } else if (_.find(newNodes, { name }) !== undefined) {
      _.find(newNodes, { name }).open = true
      const temp = _.filter(newlink, { target: name })
      if (!temp.length) {
        return
      }
      temp.forEach((e) => {
        e.lineStyle.opacity = 1
        _.find(newNodes, { name: e.source }).itemStyle.opacity = 1
      })
    }
    this.renderChart(this.dom, { data: newNodes, links: newlink }, this.instance)
  }

  renderChart = (dom, graph, instance, forceUpdate = false) => {
    let options
    const that = this
    if (!graph.data || graph.data.length < 1) {
      options = {
        ...options,
        title: {
          text: '暂无数据',
          x: '46%',
          y: 'center',
        },
      }
    } else {
      options = {
        title: {
          text: '',
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12,
            },
          },
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            symbolSize: 45,
            focusNodeAdjacency: true,
            roam: true,
            categories: [{
              name: 'unselect',
              itemStyle: {
                normal: {
                  color: '#4592FF',
                },
              },
            }, {
              name: 'fold',
              itemStyle: {
                normal: {
                  color: 'orange',
                },
              },
            }],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                },
              },
            },
            force: {
              repulsion: 1000,
            },
            edgeSymbol: ['none', 'arrow'],
            edgeSymbolSize: [8, 8],
            data: graph.data,
            links: graph.links,
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0,
              },
            },
          },
        ],
      }
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
    if (myChart._$handlers.click) { // eslint-disable-line
      myChart._$handlers.click.length = 0 // eslint-disable-line
    }
    myChart.on('click', (params) => {
      that.openOrFold(params, graph)
    })
    return myChart
  }

  render() {
    return <div className="e-charts-graph" ref={t => this.dom = t} style={{ height: '100%' }} />
  }
}
