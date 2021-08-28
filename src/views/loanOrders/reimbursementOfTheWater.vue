<template>
  <div class="main-box">
    <!-- 结算管理 -- 还款流水 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="borrowId" :label="$t('collect.collect210') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowId" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNumber" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNumber" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <el-form-item :label="$t('borrow.borrow62') + ':'">   <!-- 还款时间 -->
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
      <el-form-item :label="$t('loanOrders.loanOrders2') + ': '"> <!-- 还款状态 -->
        <el-select
          v-model="listQuery.repayStatus"
          filterable
          clearable
          :placeholder="$t('loanOrders.loanOrders3')"
        > <!-- 请选择放款状态 -->
          <el-option
            v-for="item in repayStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <!-- <el-button :loading="btnLoading" type="primary" @click="batchExport">{{ $t('loanOrders.loanOrders5') }}</el-button> 导出待放款单
        <el-button :loading="btnLoading" type="primary" @click="batchImport">{{ $t('loanOrders.loanOrders4') }}</el-button> 导入放款结果 -->
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
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="100px"> 操作
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewRepaymentDetails(row)">
            {{ $t('loanOrders.loanOrders25') }} <!-- 还款明细 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center" min-width="60px" />
      <el-table-column :label="$t('collect.collect210')" prop="borrowId" align="center" min-width="80px" /> <!-- 借款编号 -->
      <el-table-column :label="$t('borrow.borrow14')" prop="customerName" align="center" min-width="110px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNumber" align="center" min-width="120px" /> <!-- 身份证号 -->
      <el-table-column :label="$t('loanOrders.loanOrders20')" prop="thaiName" align="center" min-width="90px" /> <!-- 收款银行 -->
      <el-table-column :label="$t('loanOrders.loanOrders21')" prop="englishName" align="center" min-width="130px" /> <!-- 用户提交还款银行名称 -->
      <el-table-column :label="$t('loanOrders.loanOrders22')" prop="account" align="center" min-width="100px" /> <!-- 收款银行卡号 -->
      <el-table-column :label="$t('collect.collect221')" prop="repayStatus" align="center" min-width="70px"> <!-- 还款状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="parseInt(row.repayStatus) === 0" size="small" type="warning">{{ $t('collect.collect223') }}</el-tag> <!-- 等待还款 -->
          <el-tag v-else-if="parseInt(row.repayStatus) === 10" size="small" type="success">{{ $t('collect.collect224') }}</el-tag> <!-- 成功 -->
          <el-tag v-else-if="parseInt(row.repayStatus) === 20" size="small" type="danger">{{ $t('collect.collect225') }}</el-tag> <!-- 失败 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect12')" prop="repayAmount" align="center" min-width="70px" /> <!-- 还款金额 -->
      <el-table-column :label="$t('loanOrders.loanOrders23')" prop="createTime" align="center" min-width="150px"> <!-- 用户还款时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanOrders.loanOrders24')" prop="paymentTime" align="center" min-width="150px"> <!-- 实际还款时间 -->
        <template slot-scope="{ row }">
          {{ row.paymentTime | ArrayToDateFormat }}
        </template>
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

    <details-drawer v-if="openDetailsDrawer" :current-row="detailsRow" @detailsClose="detailsClose" />

  </div>
</template>

<script>
import { getRepaymentRecord } from '@/api/loanOrders'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import detailsDrawer from './components/RepaymentFlow/detailsDrawer'

export default {
  name: 'ReimbursementOfTheWater',
  components: {
    Pagination,
    detailsDrawer
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,

      // 查看还款明细
      openDetailsDrawer: false,
      detailsRow: {}
    }
  },

  computed: {
    repayStatusOptions() {
      return [
        { value: 0, label: this.$t('collect.collect223') }, /* 等待还款 */
        { value: 10, label: this.$t('collect.collect224') }, /* 还款成功 */
        { value: 20, label: this.$t('collect.collect225') } /* 还款失败 */
      ]
    }
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] || parseInt(this.listQuery[k]) === 0) {
          if (k === 'time' && this.listQuery[k].length > 0) {
            tmp.repayStartTime = this.listQuery[k][0]
            tmp.repayEndTime = this.listQuery[k][1]
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

      const res = await getRepaymentRecord(tmp)
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
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 查看还款明细
    viewRepaymentDetails(row) {
      this.openDetailsDrawer = true
      this.detailsRow = row
    },
    detailsClose() {
      this.openDetailsDrawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
