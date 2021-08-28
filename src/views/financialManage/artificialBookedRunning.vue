<template>
  <div class="main-box">
    <!-- 财务管理 -- 人工入账流水 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
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
      <el-form-item prop="repayStatus" :label="$t('collect.collect221') + ': '"> <!-- 还款状态 -->
        <el-select
          v-model="listQuery.repayStatus"
          filterable
          clearable
          :placeholder="$t('collect.collect222')"
        > <!-- 请选择还款状态 -->
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
      <!-- <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> --> <!-- 编号 -->
      <el-table-column :label="$t('collect.collect2')" prop="borrowId" align="center" min-width="80px" /> <!-- 订单编号 -->
      <!-- <el-table-column :label="$t('financial.financial8')" prop="borrowUid" align="center" min-width="110px" /> Uid -->
      <el-table-column :label="$t('collect.collect3')" prop="customerName" align="center" min-width="90px" /> <!-- 用户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="100px" /> <!-- 身份证号 -->
      <el-table-column :label="$t('sysManage.sysManage101')" prop="periodNo" align="center" min-width="60px" /> <!-- 期数 -->
      <!-- <el-table-column :label="$t('collect.collect10')" prop="principal" align="center" min-width="80px" /> --> <!-- 待还本金 -->
      <el-table-column :label="$t('borrow.borrow46')" prop="changeType" align="center" min-width="90px"> <!-- 变更类型 -->
        <template slot-scope="{ row }">
          {{ row.changeType | billChangeTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect10')" align="center" min-width="150"> <!-- 待还本金 -->
        <template slot-scope="scope">
          <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.capitalStart }}</span></div> <!-- 变更前 -->
          <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.capitalEnd }}</span></div> <!-- 变更后 -->
          <div>{{ $t('borrow.borrow45') + '：' }}  <!-- 变更值 -->
            <span v-if="scope.row.capitalEnd>=scope.row.capitalStart" style="color: green;">{{ '+' + scope.row.capitalAmount }}</span>
            <span v-else style="color: red;">{{ scope.row.capitalAmount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow52')" align="center" min-width="150"> <!-- 滞纳金 -->
        <template slot-scope="scope">
          <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.overdueStart }}</span></div> <!-- 变更前 -->
          <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.overdueEnd }}</span></div> <!-- 变更后 -->
          <div>{{ $t('borrow.borrow45') + '：' }}  <!-- 变更值 -->
            <span v-if="scope.row.overdueEnd>=scope.row.overdueStart" style="color: green;">{{ '+' + scope.row.overdueAmount }}</span>
            <span v-else style="color: red;">{{ scope.row.overdueAmount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow25')" align="center" min-width="150"> <!-- 利息 -->
        <template slot-scope="scope">
          <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.interestStart }}</span></div>   <!-- 变更前 -->
          <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.interestEnd }}</span></div>   <!-- 变更后 -->
          <div>{{ $t('borrow.borrow45') + '：' }}   <!-- 变更值 -->
            <span v-if="scope.row.interestEnd>=scope.row.interestStart" style="color: green;">{{ '+' + scope.row.interestAmount }}</span>
            <span v-else style="color: red;">{{ scope.row.interestAmount }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow54')" prop="thirdId" align="center" min-width="100px" /> <!-- 第三方编号 -->
      <el-table-column :label="$t('borrow.borrow53')" prop="changeTime" align="center" min-width="90px"> <!-- 变更时间 -->
        <template slot-scope="{ row }">
          {{ row.changeTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="90px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page-sizes="[10, 50, 100, 300, 500, 1000]"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getTableList"
    />
  </div>
</template>

<script>
import { bookedRecord } from '@/api/financialManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'ArtificialBookedRunning',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      groupOptions: [],
      teamMembersOptions: [],
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        changeType: 60,
        page: 1,
        size: 10
      },
      total: 0
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      repayStatusOptions: state => state.options.repayStatusOptions,
      permission: state => state.permission.permission,
      ids: state => state.permission.ids
    })
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
          tmp[k] = this.listQuery[k]
        }
      }
      return tmp
    },
    // 查询催收业绩
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await bookedRecord(tmp)
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
        changeType: 60,
        page: 1,
        size: 10
      }
      this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
