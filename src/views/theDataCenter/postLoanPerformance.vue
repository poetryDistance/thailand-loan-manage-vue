<template>
  <div class="main-box" style="padding-bottom: 80px;">
    <!-- 运营管理 -- api转换 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('loanMarket.loanMarket8') + ': '"> <!-- 市场类型 -->
        <el-select
          v-model="listQuery.marketType"
          filterable
          clearable
          :placeholder="$t('loanMarket.loanMarket9')"
        > <!-- 请选择市场类型 -->
          <el-option
            v-for="item in marketTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('theData.theData20') + ': '"> <!-- 月份 -->
        <el-date-picker
          v-model="listQuery.month"
          type="month"
          value-format="yyyy-MM"
          style="width: 178px;"
          :placeholder="$t('theData.theData2')"
        /> <!-- 请选择月份 -->
      </el-form-item>

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableList"
      max-height="700"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('theData.theData14')" prop="statDate" align="center" min-width="60px" /> <!-- 统计日期 -->
      <el-table-column :label="$t('theData.theData3')" prop="firstPushCount" align="center" min-width="60px" /> <!-- 首推数 -->
      <el-table-column :label="$t('theData.theData4')" prop="firstPushScsCount" align="center" min-width="60px" /> <!-- 首推成功数 -->
      <el-table-column :label="$t('theData.theData5')" prop="firstPushScsRate" align="center" min-width="60px"> <!-- 首推成功率 -->
        <template slot="header">
          <span>{{ $t('theData.theData5') + '(' }}</span>
          <span style="color: red;"> % </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('theData.theData6')" prop="secondPushCount" align="center" min-width="60px" /> <!-- 二推数 -->
      <el-table-column :label="$t('theData.theData7')" prop="secondPushScsCount" align="center" min-width="60px" /> <!-- 二推成功数 -->
      <el-table-column :label="$t('theData.theData8')" prop="secondPushScsRate" align="center" min-width="60px"> <!-- 二推成功率 -->
        <template slot="header">
          <span>{{ $t('theData.theData8') + '(' }}</span>
          <span style="color: red;"> % </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('theData.theData9')" prop="releaseScsCount" align="center" min-width="60px" /> <!-- 放款数 -->
      <el-table-column :label="$t('theData.theData10')" prop="releaseScsRate" align="center" min-width="60px"> <!-- 放款成功率 -->
        <template slot="header">
          <span>{{ $t('theData.theData10') + '(' }}</span>
          <span style="color: red;"> % </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('theData.theData11')" prop="riskPassCount" align="center" min-width="60px" /> <!-- 风控通过数 -->
      <el-table-column :label="$t('theData.theData12')" prop="riskPassRate" align="center" min-width="60px"> <!-- 风控通过率 -->
        <template slot="header">
          <span>{{ $t('theData.theData12') + '(' }}</span>
          <span style="color: red;"> % </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('theData.theData13')" prop="totalCovertRate" align="center" min-width="60px"> <!-- 总转换率 -->
        <template slot="header">
          <span>{{ $t('theData.theData13') + '(' }}</span>
          <span style="color: red;"> % </span>
          <span>)</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getApiStat } from '@/api/theDataCenter'
import { mapState } from 'vuex'

export default {
  name: 'PostLoanPerformance',
  data() {
    return {
      // 搜索
      btnLoading: false,
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        marketType: 10,
        month: ''
      }
    }
  },

  computed: {
    ...mapState({
      marketTypeOptions: state => state.options.marketTypeOptions
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 获取当前月
    doHandleDate() {
      const myDate = new Date()
      const tYear = myDate.getFullYear()
      const tMonth = myDate.getMonth()

      let m = tMonth + 1
      if (m.toString().length === 1) {
        m = '0' + m
      }
      return tYear + '-' + m
    },
    // 查询获取api转换信息
    async getTableList() {
      this.listLoading = true
      this.btnLoading = true
      if (!this.listQuery.month) this.listQuery.month = this.doHandleDate()
      const res = await getApiStat(this.listQuery)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.rapiConvertMonthStatVos
    },
    // 重置
    resetList() {
      this.listQuery = {
        marketType: 10,
        month: ''
      }
      this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
