<template>
  <div class="main-box">
    <!-- 借款管理 -- 贷款订单表 -->
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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="90px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('collect.collect94') }} <!-- 审核 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="66px" /> <!-- 编号 -->
      <el-table-column :label="$t('borrow.borrow14')" prop="userName" align="center" min-width="120px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="106px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="140" /> <!-- 身份证号 -->
      <el-table-column :label="$t('collect.collect7')" prop="principalAmount" align="center" min-width="90px" /> <!-- 借款金额 -->
      <el-table-column :label="$t('loanMarket.loanMarket8')" prop="marketName" align="center" min-width="90px" /> <!-- 市场类型 -->
      <el-table-column :label="$t('collect.collect7')" prop="principalAmount" align="center" min-width="90px" /> <!-- 借款金额 -->
      <el-table-column :label="$t('financial.financial27')" prop="score" align="center" min-width="90px" /> <!-- 风控分 -->
      <el-table-column :label="$t('sysManage.sysManage92')" prop="modelType" align="center" min-width="80px"> <!-- 模型类型 -->
        <template slot-scope="{ row }">
          {{ row.modelType | modelTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow10')" prop="modelResultType" align="center" min-width="86px"> <!-- 风控结果 -->
        <template slot-scope="{ row }">
          {{ row.modelResultType | modelResultTypeFilter }}
        </template>
      </el-table-column>
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
      <el-table-column :label="$t('borrow.borrow20')" prop="old" align="center" min-width="80px"> <!-- 客户类型 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.old === true" size="small" type="success">{{ $t('borrow.borrow21') }}</el-tag> <!-- 老客 -->
          <el-tag v-else-if="row.old === false" size="small" type="danger">{{ $t('borrow.borrow22') }}</el-tag> <!-- 新客 -->
          <div v-else />
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow13')" prop="blackCustomer" align="center" min-width="70px"> <!-- 黑名单 -->
        <template slot-scope="{ row }">
          {{ row.blackCustomer | blackCustomerFilter }}
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
  </div>
</template>

<script>
import { loanReviewInfo } from '@/api/borrowManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'HumanReview',
  components: {
    Pagination
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
      currentRow: {},

      // 查看通讯录弹框
      openBookDrawer: false,
      bookRow: {}
    }
  },

  activated() {
    if (this.$route.query.revisarResult) {
      this.getTableList()
      this.$router.push({
        path: '/borrowManage/humanReview'
      })
    }
  },

  mounted() {
    // if (this.$route.query.revisarResult) {

    // }
    this.getTableList()
  },

  methods: {
    setClassName({ row }) {
      return row.isDown ? '' : 'expand'
    },

    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k]) {
          tmp[k] = this.listQuery[k]
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

      const res = await loanReviewInfo(tmp)
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

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '5'
      this.sessionData('set', 'isUserDetails', isUserDetails)
      this.sessionData('set', 'revisarRowSuccess', false)

      this.$router.push({
        path: '/userDetails/' + row.userId,
        query: {
          userId: row.userId,
          customerUid: row.customerUid,
          borrowId: row.id,
          borrowUid: row.borrowUid,
          periodsId: row.periodsId
        }
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
