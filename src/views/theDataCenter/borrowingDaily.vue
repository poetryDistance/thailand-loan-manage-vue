<template>
  <div class="main-box">
    <!-- 运营管理 -- 借款日报 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('theData.theData1') + ':'">   <!-- 日期 -->
        <el-date-picker
          v-model="listQuery.time"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage91') + ': '"> <!-- 产品名称 -->
        <el-select
          v-model="listQuery.productId"
          filterable
          clearable
          :placeholder="$t('risk.risk4')"
        > <!-- 请选择产品名称 -->
          <el-option
            v-for="item in productIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button icon="el-icon-folder" type="primary" @click="exportData">{{ $t('common.common110') }}</el-button>   <!-- 导出 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableList"
      :max-height="$store.state.settings.tableHeight"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="date" :label="$t('theData.theData1')" min-width="90" />    <!-- 日期 -->
      <el-table-column :label="$t('common.common108')" min-width="100">    <!-- 全部 -->
        <el-table-column prop="apply" :label="$t('theData.theData15')" />    <!-- 申请笔数 -->
        <el-table-column prop="applyPass" :label="$t('theData.theData16')" />   <!-- 通过笔数 -->
        <el-table-column prop="loanPass" :label="$t('theData.theData18')" />   <!-- 放款笔数 -->
        <el-table-column prop="loanAmount" :label="$t('theData.theData17')" />    <!-- 放款金额 -->
        <el-table-column prop="passRate" :label="$t('theData.theData19')" />   <!-- 通过率 -->
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow22')" min-width="100">    <!-- 新客 -->
        <el-table-column prop="newApplyUser" :label="$t('theData.theData15')" />    <!-- 申请笔数 -->
        <el-table-column prop="newApplyPass" :label="$t('theData.theData16')" />   <!-- 通过笔数 -->
        <el-table-column prop="newLoanPass" :label="$t('theData.theData18')" />   <!-- 放款笔数 -->
        <el-table-column prop="newLoanAmount" :label="$t('theData.theData17')" />    <!-- 放款金额 -->
        <el-table-column prop="newPassRate" :label="$t('theData.theData19')" />   <!-- 通过率 -->
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow21')" min-width="100">    <!-- 老客 -->
        <el-table-column prop="oldApplyUser" :label="$t('theData.theData15')" />    <!-- 申请笔数 -->
        <el-table-column prop="oldApplyPass" :label="$t('theData.theData16')" />   <!-- 通过笔数 -->
        <el-table-column prop="oldLoanPass" :label="$t('theData.theData18')" />   <!-- 放款笔数 -->
        <el-table-column prop="oldLoanAmount" :label="$t('theData.theData17')" />    <!-- 放款金额 -->
        <el-table-column prop="oldPassRate" :label="$t('theData.theData19')" />   <!-- 通过率 -->
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getTableList"
    />
  </div>
</template>

<script>
import { getProductList } from '@/api/loanSupermarket'
import { getDailyStat } from '@/api/theDataCenter'
import { exportData } from '@/api/user'
import { currentYMD } from '@/utils'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'BorrowingDaily',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      productIdOptions: [],
      listQuery: {
        productId: '',
        time: [],
        page: 1,
        size: 10
      },

      // 列表
      listLoading: false,
      tableList: [],
      total: 0,

      // 费用变更弹框
      openBillDrawer: false,
      currentRow: {}
    }
  },

  mounted() {
    this.getProduct()
    this.getTableList()
  },

  methods: {
    // 获取产品
    async getProduct() {
      const res = await getProductList({ page: 1, size: 1000 })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.list.forEach(item => {
        this.productIdOptions.push({
          value: item.id,
          label: item.productName
        })
      })
    },
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k]) {
          if (k === 'time' && this.listQuery[k].length > 0) {
            tmp.startTime = this.listQuery[k][0]
            tmp.endTime = this.listQuery[k][1]
          } else if (k !== 'time') {
            tmp[k] = this.listQuery[k]
          }
        }
      }
      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getDailyStat(tmp)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.total = res.data.total

      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getTableList()
      }
    },
    // 重置
    resetList() {
      this.listQuery = {
        productId: '',
        time: '',
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 导出
    async exportData() {
      const tmp = this.handleListQuery()

      const res = await exportData(tmp)

      const link = document.createElement('a')
      const blob = new Blob([res], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      link.href = url
      link.download = this.$t('route.borrowingDaily') + '_' + currentYMD() + '.csv' /* 借款日报 */
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
