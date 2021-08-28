<template>
  <div>
    <!-- 分期信息 -->
    <el-table
      :data="periodsList"
      :max-height="500"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column v-if="isBooked" key="operation" :label="$t('sysManage.sysManage23')" align="center" min-width="90px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button v-if="principal" size="mini" type="text" @click="manualEntry(row)">
            {{ $t('financial.financial1') }} <!-- 人工入账 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage124')" prop="id" align="center" min-width="80px" /> <!-- 分期编号 -->
      <el-table-column :label="$t('borrow.borrow3')" prop="periodStatus" align="center" min-width="90px"> <!-- 订单状态 -->
        <template slot-scope="{ row }">
          {{ row.periodStatus | borrowStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow27')" prop="principalAmount" align="center" min-width="80px"> <!-- 本金 -->
        <template slot-scope="{ row }">
          {{ row.principalAmount | principalAmountFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect95')" prop="principal" align="center" min-width="80px"> <!-- 待还金额 -->
        <template slot-scope="{ row }">
          {{ row.principal | principalAmountFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect9')" prop="discountAmount" align="center" min-width="80px"> <!-- 减免金额 -->
        <template slot-scope="{ row }">
          {{ row.discountAmount | principalAmountFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect198')" prop="expectedRepay" align="center" min-width="90px"> <!-- 本期按时还款时的应还金额 -->
        <template slot-scope="{ row }">
          {{ row.expectedRepay | principalAmountFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow25')" prop="interestAmount" align="center" min-width="70px" /> <!-- 利息 -->
      <el-table-column :label="$t('collect.collect8')" prop="overDueDays" align="center" min-width="80px" /> <!-- 逾期天数 -->
      <el-table-column
        v-if="!isOverdueAmount"
        key="overdueAmount"
        :label="$t('collect.collect171')"
        prop="overdueAmount"
        align="center"
        min-width="90px"
      /> <!-- 逾期还款的金额 -->
      <el-table-column :label="$t('borrow.borrow26')" prop="periodNo" align="center" min-width="80px" /> <!-- 当前期数 -->
      <!-- <el-table-column :label="$t('collect.collect173')" prop="punctualAmount" align="center" min-width="90px" /> 按时还款的金额 -->
      <el-table-column :label="$t('borrow.borrow28')" prop="remainInterest" align="center" min-width="80px" /> <!-- 剩余利息 -->
      <el-table-column
        v-if="!isRemainOverdue"
        key="remainOverdue"
        :label="$t('borrow.borrow29')"
        prop="remainOverdue"
        align="center"
        min-width="90px"
      /> <!-- 剩余滞纳金 -->
      <el-table-column :label="$t('borrow.borrow30')" prop="remainPrincipal" align="center" min-width="80px"> <!-- 剩余本金 -->
        <template slot-scope="{ row }">
          {{ row.remainPrincipal | principalAmountFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow31')" prop="repaidInterest" align="center" min-width="80px" /> <!-- 已还利息 -->
      <el-table-column :label="$t('borrow.borrow32')" prop="repaidOverdue" align="center" min-width="90px" /> <!-- 已还滞纳金 -->
      <el-table-column :label="$t('borrow.borrow33')" prop="repaidPrincipal" align="center" min-width="80px" /> <!-- 已还本金 -->
      <el-table-column :label="$t('borrow.borrow34')" prop="totalOverdue" align="center" min-width="80px" /> <!-- 总滞纳金 -->
      <el-table-column :label="$t('collect.collect149')" prop="updateTime" align="center" min-width="150px"> <!-- 更新时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect206')" prop="repayStart" align="center" min-width="150px"> <!-- 正常还款的开始时间 -->
        <template slot-scope="{ row }">
          {{ row.repayStart | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect205')" prop="repayEnd" align="center" min-width="150px"> <!-- 正常还款的结束时间 -->
        <template slot-scope="{ row }">
          {{ row.repayEnd | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect200')" prop="lastCalcFeeTime" align="center" min-width="150px"> <!-- 最近一次计算息费时间 -->
        <template slot-scope="{ row }">
          {{ row.lastCalcFeeTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect204')" prop="lastRepayTime" align="center" min-width="150px"> <!-- 最近一次还款时间 -->
        <template slot-scope="{ row }">
          {{ row.lastRepayTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect199')" prop="finishedTime" align="center" min-width="90px"> <!-- 本期最终完成时间 -->
        <template slot-scope="{ row }">
          {{ row.finishedTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="periodRemark" align="center" min-width="90px"> <!-- 备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.periodRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.periodRemark"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="periodsTotal>0 && !isLoan"
      class="pagination"
      :total="periodsTotal"
      :page.sync="periodsQuery.page"
      :size.sync="periodsQuery.size"
      @pagination="getBorrowPeriods"
    />

    <artificial-drawer v-if="openDrawer" :current-row="currentRow" @close="close" />
  </div>
</template>

<script>
import { getBorrowPeriods } from '@/api/collectionManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import artificialDrawer from '@/views/financialManage/components/artificialDrawer'

export default {
  name: 'PeriodsInfo',
  components: {
    Pagination,
    artificialDrawer
  },
  props: {
    userId: {
      type: Number,
      default: null
    },
    borrowUid: {
      type: String,
      default: null
    },
    periodId: {
      type: Number,
      default: null
    },
    isLoan: {
      type: Boolean,
      default: false
    },
    isBooked: {
      type: Boolean,
      default: false
    },
    principal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      periodsQuery: {
        page: 1,
        size: 10
      },
      periodsTotal: 0,
      periodsList: [],

      isUserDetails: '',

      // 人工入账
      currentRow: {},
      openDrawer: false,

      // 是否展示剩余滞纳金 true 展示 false 不展示
      isRemainOverdue: false,

      // 是否展示逾期还款的金额 true 展示 false 不展示
      isOverdueAmount: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.isUserDetails = this.sessionData('get', 'isUserDetails') ? this.sessionData('get', 'isUserDetails')[this.userId] : ''
      this.getBorrowPeriods()
    }, 10)
  },
  methods: {
    // 获取分期信息
    async getBorrowPeriods() {
      let res = null
      if (this.isLoan || this.isUserDetails === '2' || this.isUserDetails === '5' || this.isUserDetails === '6') {
        this.periodsQuery.borrowUid = this.borrowUid
        res = await getBorrowPeriods(this.periodsQuery)
      } else if (this.isUserDetails === '1' || this.isUserDetails === '3') {
        this.periodsQuery.borrowPeriodId = this.periodId
        res = await getBorrowPeriods(this.periodsQuery)
      }
      if (res) {
        if (res.code !== '0') return this.$message.error(res.message || 'Error')
        this.isRemainOverdue = res.data.list.every(item => item.remainOverdue <= 0)
        this.isOverdueAmount = res.data.list.every(item => item.overdueAmount <= 0)
        this.periodsList = res.data.list || []
        this.periodsTotal = res.data.total
      }
    },

    // 人工入账
    manualEntry(row) {
      this.currentRow = {
        borrowId: row.borrowId,
        periodId: row.id,
        amountDue: this.principal
      }
      this.openDrawer = true
    },
    close(isSuccess) {
      if (isSuccess) {
        this.$emit('entrySuccess', isSuccess)
      }
      this.openDrawer = false
    }
  }
}
</script>

<style lang="scss">
</style>
