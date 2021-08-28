<template>
  <div>
    <!-- 借款信息 -->
    <el-table
      :data="borrowList"
      :max-height="600"
      border
      fit
      stripe
      highlight-current-row
      :row-class-name="setClassName"
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column v-if="isUserDetails === '4'" key="expand" type="expand" :label="$t('userManage.userManage17')"> <!-- 分期 -->
        <template slot-scope="{ row }">
          <periods-info :borrow-id="row.id" :is-loan="true" />
        </template>
      </el-table-column>
      <el-table-column key="id" :label="$t('borrow.borrow15')" prop="id" align="center" min-width="120px" /> <!-- 贷款编号 -->
      <el-table-column prop="loanAmount" :label="$t('collect.collect7')" align="center" min-width="90" />    <!-- 借款金额 -->
      <el-table-column key="loanType" :label="$t('borrow.borrow5')" prop="loanType" align="center" min-width="90px"> <!-- 贷款类型 -->
        <template slot-scope="{ row }">
          {{ row.loanType | loanTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column key="borrowStatus" :label="$t('borrow.borrow3')" prop="borrowStatus" align="center" min-width="80px"> <!-- 订单状态 -->
        <template slot-scope="{ row }">
          {{ row.borrowStatus | borrowStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column key="loanPurpose" :label="$t('collect.collect136')" prop="loanPurpose" align="center" min-width="80px"> <!-- 借款用途 -->
        <template slot-scope="{ row }">
          {{ row.loanPurpose | loanPurposeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow19')" prop="modelResultScore" align="center" min-width="86px" /> <!-- 模型分 -->
      <el-table-column v-if="permission.isAdmin" key="modelResultType" :label="$t('borrow.borrow10')" prop="modelResultType" align="center" min-width="90px"> <!-- 风控结果 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.modelResultType === 10" size="small" type="success">{{ $t('borrow.borrow7') }}</el-tag> <!-- 通过 -->
          <el-tag v-else-if="row.modelResultType === 20" size="small" type="danger">{{ $t('borrow.borrow8') }}</el-tag> <!-- 永久拒绝 -->
          <el-tag v-else-if="row.modelResultType === 30" size="small" type="danger">{{ $t('borrow.borrow9') }}</el-tag> <!-- 有限拒绝 -->
          <el-tag v-else-if="row.modelResultType === 40" size="small" type="warning">{{ $t('borrow.borrow70') }}</el-tag> <!-- 风控分异常 -->
          <el-tag v-else-if="row.modelResultType === 11" size="small" type="warning">{{ $t('loanMarket.loanMarket50') }}</el-tag> <!-- 人审 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow83')" prop="modelResultReason" align="center" min-width="100px"> <!-- 风控拒绝原因 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.modelResultReason"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.modelResultReason"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="!isModelResultNext && permission.isAdmin" key="modelResultNext" :label="$t('collect.collect168')" prop="modelResultNext" align="center" min-width="80px"> <!-- 准入期 -->
        <template slot-scope="{ row }">
          {{ row.modelResultNext | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column v-if="permission.isAdmin" key="loanConfirmTime" :label="$t('collect.collect166')" prop="loanConfirmTime" align="center" min-width="90px"> <!-- 用户确认时间 -->
        <template slot-scope="{ row }">
          {{ row.loanConfirmTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column v-if="permission.isAdmin" key="releasePayCompany" :label="$t('borrow.borrow35')" prop="releasePayCompany" align="center" min-width="70px"> <!-- 支付公司 -->
        <template slot-scope="{ row }">
          {{ row.releasePayCompany | payCompanyFilter }}
        </template>
      </el-table-column>
      <el-table-column key="releaseResultSucceed" :label="$t('collect.collect186')" align="center" min-width="90px"> <!-- 放款结果是否成功 -->
        <template slot-scope="{ row }">
          {{ row.releaseResultSucceed | releaseResultSucceedFilter }}
        </template>
      </el-table-column>
      <el-table-column key="releaseResultTime" :label="$t('collect.collect187')" align="center" min-width="90px"> <!-- 到账时间 -->
        <template slot-scope="{ row }">
          {{ row.releaseResultTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column key="repayFinishTime" :label="$t('collect.collect194')" align="center" min-width="90px"> <!-- 还款完成时间 -->
        <template slot-scope="{ row }">
          {{ row.repayFinishTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column key="repayOverdueCount" :label="$t('collect.collect195')" prop="repayOverdueCount" align="center" min-width="90px" /> <!-- 还款逾期次数 -->
      <el-table-column key="deductedServiceAmount" :label="$t('collect.collect159')" prop="deductedServiceAmount" align="center" min-width="90px" /> <!-- 扣除的手续费 -->
      <el-table-column key="deductedTaxAmount" :label="$t('collect.collect160')" prop="deductedTaxAmount" align="center" min-width="90px" /> <!-- 扣除的税费 -->
      <el-table-column key="receiveAmount" :label="$t('collector.collector66')" prop="receiveAmount" align="center" min-width="90px" /> <!-- 用户实际收款 -->
      <el-table-column key="expectedRepay" :label="$t('collector.collector67')" prop="expectedRepay" align="center" min-width="90px" /> <!-- 按时还款时的应还金额 -->
      <el-table-column key="principalAmount" :label="$t('borrow.borrow27')" prop="principalAmount" align="center" min-width="90px" /> <!-- 本金 -->
      <el-table-column key="interestAmount" :label="$t('borrow.borrow25')" prop="interestAmount" align="center" min-width="90px" /> <!-- 利息 -->
      <el-table-column v-if="!isTotalOverdue" key="totalOverdue" :label="$t('borrow.borrow34')" prop="totalOverdue" align="center" min-width="90px" /> <!-- 总滞纳金 -->
      <el-table-column key="remainPrincipal" :label="$t('borrow.borrow30')" prop="remainPrincipal" align="center" min-width="90px" /> <!-- 剩余本金 -->
      <el-table-column key="remainInterest" :label="$t('borrow.borrow28')" prop="remainInterest" align="center" min-width="90px" /> <!-- 剩余利息 -->
      <el-table-column key="remainService" :label="$t('collect.collect189')" prop="remainService" align="center" min-width="90px" /> <!-- 剩余手续费 -->
      <el-table-column v-if="!isRemainOverdue" key="remainOverdue" :label="$t('borrow.borrow29')" prop="remainOverdue" align="center" min-width="90px" /> <!-- 剩余滞纳金 -->
      <el-table-column
        v-if="!isOverdueAmount"
        key="overdueAmount"
        :label="$t('collect.collect171')"
        prop="overdueAmount"
        align="center"
        min-width="90px"
      /> <!-- 逾期还款的金额 -->
    </el-table>
  </div>
</template>

<script>
import periodsInfo from './periodsInfo'
import { getUserBorrowData } from '@/api/collectionManagement'
import { mapState } from 'vuex'

export default {
  name: 'OrderBorrowing',
  components: {
    periodsInfo
  },
  props: {
    userId: {
      type: Number,
      default: null
    },
    customerUid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      borrowList: [],
      isUserDetails: '',

      // 是否展示剩余滞纳金 true 展示 false 不展示
      isRemainOverdue: false,

      // 是否展示总滞纳金 true 展示 false 不展示
      isTotalOverdue: false,

      // 是否展示逾期还款的金额 true 展示 false 不展示
      isOverdueAmount: false,

      // 是否展示准入期 true 不展示 false 展示
      isModelResultNext: true
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  mounted() {
    setTimeout(() => {
      this.isUserDetails = this.sessionData('get', 'isUserDetails') ? this.sessionData('get', 'isUserDetails')[this.userId] : ''
      if (this.isUserDetails !== '1') this.getUserBorrowData()
    }, 1)
  },
  methods: {
    setClassName({ row }) {
      return row.isDown ? '' : 'expand'
    },
    // 获取借款订单信息
    async getUserBorrowData() {
      const res = await getUserBorrowData({ customerUid: this.customerUid })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.borrowList = res.data || []
      this.isRemainOverdue = res.data.every(item => item.remainOverdue <= 0)
      this.isTotalOverdue = res.data.every(item => item.totalOverdue <= 0)
      this.isOverdueAmount = res.data.every(item => item.overdueAmount <= 0)
      this.isModelResultNext = res.data.every(item => !item.modelResultNext)
      this.borrowList.forEach(item => {
        item.amountPaid = item.repaidInterest + item.repaidOverdue + item.repaidPrincipal + item.repaidService
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .expand .el-table__expand-column .cell {
  display: none;
}
</style>
