<template>
  <div class="main-box">
    <!-- 语音管理 -- 语音跟进 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="borrowId" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowId" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="mobileNumber" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.mobileNumber" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>

      <el-form-item :label="$t('risk.risk13') + ': '"> <!-- 外呼场景 -->
        <el-select
          v-model="listQuery.callStatsCount"
          filterable
          clearable
          :placeholder="$t('risk.risk20')"
        > <!-- 请选择外呼场景 -->
          <el-option
            v-for="item in callStatsCountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('risk.risk14') + ': '"> <!-- 催收等级 -->
        <el-select
          v-model="listQuery.collectionLevel"
          filterable
          clearable
          :placeholder="$t('risk.risk21')"
        > <!-- 请选择催收等级 -->
          <el-option
            v-for="item in collectionLevelOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column :label="$t('risk.risk15')" align="center" min-width="90">    <!-- AI外呼记录 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="taskFollowUp(row)">
            {{ $t('risk.risk16') }} <!-- 任务跟进 -->
          </el-button>
          <el-button size="mini" type="text" @click="viewRecords(row)">
            {{ $t('risk.risk17') }} <!-- 查看记录 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="borrowId" :label="$t('collect.collect2')" align="center" min-width="90" />    <!-- 订单编号 -->
      <el-table-column prop="customerName" :label="$t('borrow.borrow14')" align="center" min-width="90" />    <!-- 客户名称 -->
      <el-table-column prop="customerMobile" :label="$t('common.common28')" align="center" min-width="120" />    <!-- 手机号 -->
      <el-table-column prop="loanAmount" :label="$t('collect.collect7')" align="center" min-width="90" />    <!-- 借款金额 -->
      <el-table-column prop="overdueDays" :label="$t('collect.collect8')" align="center" min-width="90" />    <!-- 逾期天数 -->
      <el-table-column prop="callStatsCount" :label="$t('risk.risk13')" align="center" min-width="90" />    <!-- 外呼场景 -->
      <el-table-column prop="collectionLevel" :label="$t('risk.risk14')" align="center" min-width="90" />    <!-- 催收等级 -->
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
import { getAiCallLogStatsByPage } from '@/api/aiCallManage'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'AiCallLogStats',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        borrowId: null,
        customerName: null,
        mobileNumber: null,
        page: 1,
        size: 10
      },
      total: 0,

      // 列表
      listLoading: false,
      tableList: []
    }
  },

  computed: {
    ...mapState({
      callStatsCountOptions: state => state.options.callStatsCountOptions,
      collectionLevelOptions: state => state.options.collectionLevelOptions
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
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getAiCallLogStatsByPage(tmp)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== 0) return this.$message.error(res.message || 'Error')
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
        borrowId: null,
        customerName: null,
        mobileNumber: null,
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 任务跟进
    taskFollowUp(row) {
      this.$router.push({
        path: '/taskFollowUp/' + row.customerId,
        query: {
          customerId: row.customerId,
          borrowId: row.borrowId,
          collectionLevel: row.collectionLevel,
          collectionOrderId: row.collectionOrderId,
          collectionUserId: row.collectionUserId
        }
      })
    },
    // 查看记录
    viewRecords(row) {
      this.$router.push({
        name: 'AiCallLogList',
        params: {
          borrowId: row.borrowId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
