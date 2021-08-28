<template>
  <div :class="className" :style="{height: height, width: width, minWidth: '460px'}" />
</template>

<script>
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val.xData, val.yData, val.suffix, val.type, val.select)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = this.$echart.init(this.$el, 'macarons')
    },
    setOptions(chartXData, chartYData, suffix, type, select) {
      const series = []
      chartYData.forEach(item => {
        series.push(
          {
            name: item.name,
            itemStyle: item.itemStyle,
            smooth: false,
            type: 'line',
            data: item.y,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        )
      })
      this.chart.setOption({
        xAxis: {
          data: chartXData,
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 55
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}' + suffix
          }
        },
        color: select.color,
        legend: {
          selected: select.selected,
          data: select.data
        },
        series: series
      })
    }
  }
}
</script>
