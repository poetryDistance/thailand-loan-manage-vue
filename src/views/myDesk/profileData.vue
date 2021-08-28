<template>
  <div class="dashboard-editor-container">
    <panel-group :home-data="homeData" />

    <el-row class="data-warp">
      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <div class="dailyData-display">
          <ul class="dailyData-item">
            <li class="data-title" />
            <li class="data-title">{{ $t('theData.theData21') }}</li>    <!-- 注册人数 -->
            <li class="data-title">{{ $t('theData.theData15') }}</li>    <!-- 申请笔数 -->
            <li class="data-title">{{ $t('theData.theData16') }}</li>    <!-- 通过笔数 -->
            <li class="data-title">{{ $t('theData.theData18') }}</li>    <!-- 放款笔数 -->
          </ul>
          <ul v-for="(item, i) in tabelData" :key="item.date" class="dailyData-item">
            <li class="data-time" :style="{ color: (i === 0 ? 'red' : '') }">
              {{ i === 0 ? $t('theData.theData22') : $t('theData.theData23') }}
            </li>   <!-- 今日  昨日 -->
            <li class="data-number">{{ item.userCount || 0 }}</li>
            <li class="data-number">{{ item.apply || 0 }}</li>
            <li class="data-number">{{ item.applyPass || 0 }}</li>
            <li class="data-number">{{ item.loanPass || 0 }}</li>
          </ul>
        </div>
        <div style="overflow-x: auto;">
          <line-chart :chart-data="b1Data" style="min-width: 100%;" />
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <div class="dailyData-display">
          <ul class="dailyData-item">
            <li class="data-title" />
            <li class="data-title">{{ $t('theData.theData24') }}</li>    <!-- 总还款笔数 -->
            <li class="data-title">{{ $t('theData.theData25') }}</li>    <!-- 到期笔数 -->
            <li class="data-title">{{ $t('theData.theData26') }}</li>    <!-- 到期未还笔数 -->
            <li class="data-title">{{ $t('theData.theData27') }}</li>    <!-- 未还比率(%) -->
          </ul>
          <ul v-for="(item, i) in tabelData" :key="item.date" class="dailyData-item">
            <li class="data-time" :style="{ color: (i === 0 ? 'red' : '') }">
              {{ i === 0 ? $t('theData.theData22') : $t('theData.theData23') }}
            </li>   <!-- 今日  昨日 -->
            <li class="data-number">{{ item.repayCount || 0 }}</li>
            <li class="data-number">{{ item.overdueCount || 0 }}</li>
            <li class="data-number">{{ item.dueToStill || 0 }}</li>
            <li class="data-number">{{ item.notRate }}</li>
          </ul>
        </div>
        <div style="overflow-x: auto;">
          <line-chart :chart-data="b2Data" style="min-width: 100%;" />
        </div>
      </el-col>
    </el-row>

    <el-row class="data-warp">
      <el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11">
        <div class="dailyData-display">
          <ul class="dailyData-item">
            <li class="data-title" />
            <li class="data-title">{{ $t('theData.theData17') }}</li>    <!-- 放款金额 -->
            <li class="data-title">{{ $t('collect.collect12') }}</li>    <!-- 还款金额 -->
          </ul>
          <ul v-for="(item, i) in tabelData" :key="item.date" class="dailyData-item">
            <li class="data-time" :style="{ color: (i === 0 ? 'red' : '') }">
              {{ i === 0 ? $t('theData.theData22') : $t('theData.theData23') }}
            </li>   <!-- 今日  昨日 -->
            <li class="data-number">{{ item.loanAmount || 0 }}</li>
            <li class="data-number">{{ item.repayAmount || 0 }}</li>
          </ul>
        </div>
        <div style="overflow-x: auto;">
          <line-chart :chart-data="b3Data" style="min-width: 100%;" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { profileData } from '@/api/theDataCenter'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

export default {
  name: 'ProfileData',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      params: {},
      tabelData: [],
      homeData: {},
      b1Data: {
        xData: [],
        yData: [],
        suffix: '',
        type: 'line'
      },
      b2Data: {
        xData: [],
        yData: [],
        suffix: '',
        type: 'line'
      },
      b3Data: {
        xData: [],
        yData: [],
        suffix: '',
        type: 'line'
      }
    }
  },
  mounted() {
    this.getMarketInfo()
  },
  methods: {
    // 获取数据
    async getMarketInfo() {
      const res = await profileData()
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.homeData = res.data

      if (this.homeData.dailyStatVos[0]) {
        this.tabelData.push(this.homeData.dailyStatVos[0])
      }
      if (this.homeData.dailyStatVos[1]) {
        this.tabelData.push(this.homeData.dailyStatVos[1])
      }

      this.chartB1Filter(res.data.days, res.data.dailyStatVos)
      this.chartB2Filter(res.data.days, res.data.dailyStatVos)
      this.chartB3Filter(res.data.days, res.data.dailyStatVos)
    },
    // 重置
    resetTime() {
      this.listQuery = { time: [] }
      this.getMarketInfo()
    },

    // 处理数据 -- b1
    chartB1Filter(xData, yData) {
      this.b1Data.xData = []
      this.b1Data.yData = [
        {
          y: [],
          name: this.$t('theData.theData21') /* 注册人数 */
        },
        {
          y: [],
          name: this.$t('theData.theData15') /* 申请笔数 */
        },
        {
          y: [],
          name: this.$t('theData.theData16') /* 通过笔数 */
        },
        {
          y: [],
          name: this.$t('theData.theData18') /* 放款笔数 */
        }
      ]

      this.b1Data.xData = xData
      this.b1Data.select = {
        color: ['#FF005A', '#dc7194', '#ff00ff', '#8b27e3'],
        data: [
          this.$t('theData.theData21'), /* 注册人数 */
          this.$t('theData.theData15'), /* 申请笔数 */
          this.$t('theData.theData16'), /* 通过笔数 */
          this.$t('theData.theData18') /* 放款笔数 */
        ]
      }
      xData.forEach(item => {
        const i = yData.findIndex(val => val.date === item)
        if (i === -1) {
          this.b1Data.yData[0].y.push(0)
          this.b1Data.yData[1].y.push(0)
          this.b1Data.yData[2].y.push(0)
          this.b1Data.yData[3].y.push(0)
        } else {
          this.b1Data.yData[0].y.push(yData[i].userCount || 0)
          this.b1Data.yData[1].y.push(yData[i].apply || 0)
          this.b1Data.yData[2].y.push(yData[i].applyPass || 0)
          this.b1Data.yData[3].y.push(yData[i].loanPass || 0)
        }
      })
    },

    // 处理数据 -- b2
    chartB2Filter(xData, yData) {
      this.b2Data.xData = []
      this.b2Data.yData = [
        {
          y: [],
          name: this.$t('theData.theData24') /* 总还款笔数 */
        },
        {
          y: [],
          name: this.$t('theData.theData25') /* 到期笔数 */
        },
        {
          y: [],
          name: this.$t('theData.theData26') /* 到期未还笔数 */
        },
        {
          y: [],
          name: this.$t('theData.theData27') /* 未还比率(%) */
        }
      ]

      this.b2Data.xData = xData
      this.b2Data.select = {
        color: ['#ff00ff', '#b98703', '#ff8d00', '#818100'],
        data: [
          this.$t('theData.theData24'), /* 总还款笔数 */
          this.$t('theData.theData25'), /* 到期笔数 */
          this.$t('theData.theData26'), /* 到期未还笔数 */
          this.$t('theData.theData27') /* 未还比率(%) */
        ]
      }
      xData.forEach(item => {
        const i = yData.findIndex(val => val.date === item)
        if (i === -1) {
          this.b2Data.yData[0].y.push(0)
          this.b2Data.yData[1].y.push(0)
          this.b2Data.yData[2].y.push(0)
          this.b2Data.yData[3].y.push(0)
        } else {
          this.b2Data.yData[0].y.push(yData[i].repayCount || 0)
          this.b2Data.yData[1].y.push(yData[i].overdueCount || 0)
          this.b2Data.yData[2].y.push(yData[i].dueToStill || 0)
          this.b2Data.yData[3].y.push(yData[i].notRate || 0)
        }
      })
    },

    // 处理数据 -- b3
    chartB3Filter(xData, yData) {
      this.b3Data.xData = []
      this.b3Data.yData = [
        {
          y: [],
          name: this.$t('theData.theData17') /* 放款金额 */
        },
        {
          y: [],
          name: this.$t('collect.collect12') /* 还款金额 */
        }
      ]

      this.b3Data.xData = xData
      this.b3Data.select = {
        color: ['#f4a560', '#b31c1c'],
        data: [
          this.$t('theData.theData17'), /* 放款金额 */
          this.$t('collect.collect12') /* 还款金额 */
        ],
        selected: {}
      }
      xData.forEach(item => {
        const i = yData.findIndex(val => val.date === item)
        if (i === -1) {
          this.b3Data.yData[0].y.push(0)
          this.b3Data.yData[1].y.push(0)
        } else {
          this.b3Data.yData[0].y.push(yData[i].loanAmount || 0)
          this.b3Data.yData[1].y.push(yData[i].repayAmount || 0)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
@media (max-width:550px) {
  .dashboard-editor-container {
    padding: 0;
  }
}

.data-warp {
  background:#fff;
  padding:16px 16px 0;
  margin-bottom:10px;

  .dailyData-display {
    width: 98%;
    height: 154px;
    margin: 0 auto 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: #f9f9f9;
    .dailyData-item {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      padding: 8px 16px;
      .data-title {
        width: 20%;
        text-align: center;
        color: #333;
        font-size: 12px;
        line-height: 18px;
      }
      .data-time {
        width: 20%;
        text-align: center;
        color: #999;
        font-size: 12px;
        line-height: 18px;
      }
      .data-number {
        width: 20%;
        text-align: center;
        color: #333;
        font-size: 16px;
        line-height: 22px;
      }
      .finance-item {
        width: 50%;
      }
    }
  }
}
</style>
