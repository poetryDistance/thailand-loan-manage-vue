<template>
  <div class="main-box">
    <!-- 财务管理 -- 人工入账 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="userName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.userName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <!-- <el-form-item prop="borrowUid" :label="$t('financial.financial8') + ':'"> Uid
        <el-input v-model="listQuery.borrowUid" :placeholder="$t('financial.financial10')" style="width: 178px;" /> 请输入Uid
      </el-form-item> -->
      <el-form-item :label="$t('borrow.borrow3') + ': '"> <!-- 订单状态 -->
        <el-select
          v-model="listQuery.borrowStatus"
          filterable
          clearable
          :placeholder="$t('borrow.borrow4')"
        > <!-- 请选择订单状态 -->
          <el-option
            v-for="item in borrowStatusOptions1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('borrow.borrow5') + ': '"> <!-- 贷款类型 -->
        <el-select
          v-model="listQuery.loanType"
          filterable
          clearable
          :placeholder="$t('borrow.borrow6')"
        > <!-- 请选择贷款类型 -->
          <el-option
            v-for="item in loanTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="modelResultType" :label="$t('borrow.borrow10') + ': '"> 风控结果
        <el-select
          v-model="listQuery.modelResultType"
          filterable
          clearable
          :placeholder="$t('borrow.borrow11')"
        > 请选择风控结果
          <el-option
            v-for="item in modelResultTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="modelType" :label="$t('sysManage.sysManage92') + ': '"> 模型类型
        <el-select
          v-model="listQuery.modelType"
          filterable
          clearable
          :placeholder="$t('borrow.borrow12')"
        > 请选择模型类型
          <el-option
            v-for="item in modelTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
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
      :row-class-name="setClassName"
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="expand" :label="$t('userManage.userManage17')" min-width="80px"> <!-- 分期 -->
        <template slot-scope="{ row }">
          <periods-info
            :borrow-id="row.id"
            :principal="row.principal"
            :is-loan="true"
            :is-booked="true"
            @entrySuccess="entrySuccess"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="150px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-dropdown split-button type="primary" trigger="click" @command="handleCommand(row, $event)">
            <span @click="viewDetails(row)">{{ $t('common.common32') }}</span> <!-- 查看详情 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                {{ $t('borrow.borrow41') }} <!-- 费用变更 -->
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="66px" /> <!-- 编号 -->
      <!-- <el-table-column :label="$t('financial.financial8')" prop="borrowUid" align="center" min-width="120px" /> Uid -->
      <el-table-column :label="$t('borrow.borrow14')" prop="userName" align="center" min-width="120px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="106px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="110" /> <!-- 身份证号 -->
      <el-table-column :label="$t('collect.collect95')" prop="principal" align="center" min-width="80px" /> <!-- 待还金额 -->
      <!-- <el-table-column :label="$t('borrow.borrow28')" prop="remainInterest" align="center" min-width="80px" /> 剩余利息
      <el-table-column :label="$t('borrow.borrow29')" prop="remainOverdue" align="center" min-width="90px" /> 剩余滞纳金
      <el-table-column :label="$t('borrow.borrow30')" prop="remainPrincipal" align="center" min-width="80px" /> 剩余本金 -->
      <!-- <el-table-column :label="$t('collect.collect189')" prop="remainService" align="center" min-width="90px" /> --> <!-- 剩余手续费 -->
      <el-table-column :label="$t('borrow.borrow3')" prop="borrowStatus" align="center" min-width="90px"> <!-- 订单状态 -->
        <template slot-scope="{ row }">
          {{ row.borrowStatus | borrowStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow5')" prop="loanType" align="center" min-width="70px"> <!-- 贷款类型 -->
        <template slot-scope="{ row }">
          {{ row.loanType | loanTypeFilter }}
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('borrow.borrow19')" prop="modelResultScore" align="center" min-width="86px" /> 模型分
      <el-table-column :label="$t('borrow.borrow10')" prop="modelResultType" align="center" min-width="70px"> 风控结果
        <template slot-scope="{ row }">
          {{ row.modelResultType | modelResultTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage92')" prop="modelType" align="center" min-width="80px"> 模型类型
        <template slot-scope="{ row }">
          {{ row.modelType | modelTypeFilter }}
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('borrow.borrow20')" prop="old" align="center" min-width="80px"> <!-- 客户类型 -->
        <template slot-scope="{ row }">
          {{ row.old | oldFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow13')" prop="blackCustomer" align="center" min-width="70px"> <!-- 黑名单 -->
        <template slot-scope="{ row }">
          {{ row.blackCustomer | blackCustomerFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow62')" prop="releaseApplyResponeTime" align="center" min-width="150px"> <!-- 放款时间 -->
        <template slot-scope="{ row }">
          {{ row.releaseApplyResponeTime | ArrayToDateFormat }}
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

    <bill-change-drawer v-if="openBillDrawer" :current-row="currentRow" :type="1" @close="close" />
  </div>
</template>

<script>
import { getBorrowInfo } from '@/api/borrowManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import periodsInfo from '@/views/collectionManagement/components/userDetails/periodsInfo'
import billChangeDrawer from '../borrowManage/components/billChangeDrawer'
import { mapState } from 'vuex'

export default {
  name: 'ArtificialBooked',
  components: {
    Pagination,
    periodsInfo,
    billChangeDrawer
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        userName: '',
        mobile: '',
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        page: 1,
        size: 10
      },
      total: 0,

      // 费用变更弹框
      openBillDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      borrowStatusOptions1: state => state.options.borrowStatusOptions1,
      loanTypeOptions: state => state.options.loanTypeOptions,
      modelResultTypeOptions: state => state.options.modelResultTypeOptions,
      modelTypeOptions: state => state.options.modelTypeOptions
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    setClassName({ row }) {
      return row.isDown ? '' : 'expand'
    },

    // 下拉菜单
    handleCommand(row, command) {
      switch (command) {
        // 费用变更
        case 'a':
          this.openBillChange(row)
          break
      }
    },

    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] && k !== 'borrowStatus') {
          tmp[k] = this.listQuery[k]
        }
      }
      if (this.listQuery.borrowStatus === undefined) {
        tmp.status = [50, 60, 70]
      } else {
        tmp.status = [this.listQuery.borrowStatus]
      }
      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getBorrowInfo(tmp)
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

    // 费用变更
    openBillChange(row) {
      this.openBillDrawer = true
      this.currentRow = row
    },
    close() {
      this.openBillDrawer = false
    },

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '2'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.userId,
        query: {
          userId: row.userId,
          borrowId: row.id,
          borrowUid: row.borrowUid,
          customerUid: row.customerUid,
          periodsId: row.periodsId
        }
      })
    },

    // 人工入账成功
    entrySuccess(isSuccess) {
      if (isSuccess) {
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .expand .el-table__expand-column .cell {
  display: none;
}
</style>
