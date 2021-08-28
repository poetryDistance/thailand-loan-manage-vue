<template>
  <div class="main-box">
    <!-- 结算管理 -- 放款流水 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="borrowUid" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowUid" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <el-form-item :label="$t('borrow.borrow62') + ':'">   <!-- 放款时间 -->
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
      <el-form-item :label="$t('loanOrders.loanOrders2') + ': '"> <!-- 放款状态 -->
        <el-select
          v-model="listQuery.releaseResultSucceed"
          filterable
          clearable
          :placeholder="$t('loanOrders.loanOrders3')"
        > <!-- 请选择放款状态 -->
          <el-option
            v-for="item in releaseResultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button :loading="btnLoading" type="primary" @click="batchExport">{{ $t('loanOrders.loanOrders5') }}</el-button> <!-- 导出待放款单 -->
        <el-button :loading="btnLoading" type="success" @click="batchImport">{{ $t('loanOrders.loanOrders4') }}</el-button> <!-- 导入放款结果 -->
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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="80px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button :disabled="!(row.releaseResultSucceed === null)" size="mini" type="text" @click="loanStart(row)">
            {{ $t('loanOrders.loanOrders1') }} <!-- 放款 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="80px" /> <!-- 编号 -->
      <el-table-column :label="$t('financial.financial8')" prop="borrowUid" align="center" min-width="120px" /> <!-- Uid -->
      <el-table-column :label="$t('borrow.borrow14')" prop="customerName" align="center" min-width="100px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="130px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="120px" /> <!-- 身份证号 -->
      <el-table-column :label="$t('collector.collector66')" prop="receiveAmount" align="center" min-width="70px" /> <!-- 用户实际收款 -->
      <el-table-column :label="$t('collect.collect158')" prop="openBank" align="center" min-width="70px" /> <!-- 绑卡开户行 -->
      <el-table-column :label="$t('collect.collect156')" prop="bankAccount" align="center" min-width="70px" /> <!-- 银行账号 -->
      <el-table-column :label="$t('loanOrders.loanOrders2')" prop="releaseResultSucceed" align="center" min-width="80px"> <!-- 放款状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.releaseResultSucceed === 1" size="small" type="success">{{ $t('collect.collect224') }}</el-tag> <!-- 成功 -->
          <el-tag v-else-if="row.releaseResultSucceed === 0" size="small" type="danger">{{ $t('collect.collect225') }}</el-tag> <!-- 失败 -->
          <el-tag v-else-if="row.releaseResultSucceed === null" size="small" type="warning">{{ $t('loanOrders.loanOrders12') }}</el-tag> <!-- 待放款 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect180')" prop="releaseApplyRequestTime" align="center" min-width="150px"> <!-- 放款请求时间 -->
        <template slot-scope="{ row }">
          {{ row.releaseApplyRequestTime | ArrayToDateFormat }}
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

    <loan-drawer v-if="loanStartDrawer" :current-row="loanRow" @loanClose="loanClose" />
    <loan-import-drawer v-if="loanImportDrawer" @loanImportClose="loanImportClose" />

  </div>
</template>

<script>
import { forLending } from '@/api/loanOrders'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import loanDrawer from './components/loanFlow/loanDrawer'
import loanImportDrawer from './components/loanFlow/loanImportDrawer'

export default {
  name: 'LendingFlowingWater',
  components: {
    Pagination,
    loanDrawer,
    loanImportDrawer
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

      // 放款弹框
      loanStartDrawer: false,
      loanRow: {},

      // 放款弹框
      loanImportDrawer: false
    }
  },

  computed: {
    releaseResultOptions() {
      return [
        { value: 1, label: this.$t('collect.collect224') }, /* 成功 */
        { value: 0, label: this.$t('collect.collect225') }, /* 失败 */
        { value: 2, label: this.$t('loanOrders.loanOrders12') } /* 待放款 */
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
        if (this.listQuery[k] || this.listQuery[k] === 0) {
          if (k === 'time' && this.listQuery[k].length > 0) {
            tmp.releaseApplyRequestStartTime = this.listQuery[k][0]
            tmp.releaseApplyRequestEndTimes = this.listQuery[k][1]
          } else if (k === 'releaseResultSucceed' && this.listQuery[k] === 2) {
            tmp['isForLending'] = true
          } else {
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

      const res = await forLending(tmp)
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

    // 放款弹框
    loanStart(row) {
      this.loanStartDrawer = true
      this.loanRow = row
    },
    loanClose(item) {
      if (item) {
        this.getTableList()
      }
      this.loanStartDrawer = false
    },

    // 导出待放款单
    async batchExport() {
      this.btnLoading = true

      const tmp = this.handleListQuery()

      let url = process.env.VUE_APP_SERVER_URL + process.env.VUE_APP_SERVER_PORT + process.env.VUE_APP_BASE_API + 'export/exportForLending?'
      for (const k in tmp) {
        if (k !== 'page' && k !== 'size') {
          url += k + '=' + tmp[k] + '&'
        }
      }
      url = url.substr(0, url.length - 1)
      console.log(url)
      this.btnLoading = false
      window.open(url)

      // const res = await exportForLending(tmp)
      // this.btnLoading = false

      // if (res.code === '9999') return this.$message.error(res.message || 'Error')

      // const url = window.URL.createObjectURL(new Blob([res]))
      // console.log(url)
      // window.open(url)
      // const link = document.createElement('a')
      // link.style.display = 'none'
      // link.href = url
      // link.setAttribute('download', ' .xls')

      // document.body.appendChild(link)
      // link.click()
    },
    // 导入放款结果弹框
    batchImport() {
      this.loanImportDrawer = true
    },
    loanImportClose(item) {
      this.loanImportDrawer = false
      if (item) {
        this.tableList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
