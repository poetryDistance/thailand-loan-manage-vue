<template>
  <div class="main-box">
    <!-- 用户管理 -- 黑名单列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="content" :label="$t('risk.risk55') + ':'"> <!-- 身份证号或手机号 -->
        <el-input v-model="listQuery.content" :placeholder="$t('risk.risk56')" style="width: 178px;" /> <!-- 请输入身份证号或手机号 -->
      </el-form-item>
      <el-form-item :label="$t('collect.collect67') + ': '"> <!-- 类型 -->
        <el-select
          v-model="listQuery.type"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage7')"
        > <!-- 请选择类型 -->
          <el-option
            v-for="item in blackTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button :loading="btnLoading" type="primary" @click="openAddDrawer">{{ $t('risk.risk59') }}</el-button> <!-- 添加黑名单 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableList"
      max-height="560"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="100px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="delCustomerBlack(row)">{{ $t('sysManage.sysManage29') }}</el-button> <!-- 删除 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('risk.risk55')" prop="content" align="center" min-width="180px" /> <!-- 手机号或身份证号 -->
      <el-table-column :label="$t('collect.collect67')" prop="type" align="center" min-width="160px"> <!-- 类型 -->
        <template slot-scope="{ row }">
          {{ row.type | blackTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="160px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="160px" /> <!-- 备注 -->
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getTableList"
    />

    <add-black-drawer v-if="openAddBlackDrawer" @closeAddDrawer="closeAddDrawer" />
  </div>
</template>

<script>
import { customerBlackDateInfo, cancelCustomerBlack } from '@/api/userManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addBlackDrawer from './components/addBlackDrawer'
import { mapState } from 'vuex'

export default {
  name: 'CustomerBlackDateInfo',
  components: {
    Pagination,
    addBlackDrawer
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

      // 添加
      openAddBlackDrawer: false
    }
  },

  computed: {
    ...mapState({
      blackTypeOptions: state => state.options.blackTypeOptions
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

      const res = await customerBlackDateInfo(tmp)
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

    // 删除
    delCustomerBlack(row) {
      this.$confirm(this.$t('risk.risk57'), this.$t('risk.risk58'), { /* 此操作将删除该黑名单, 是否继续?  删除黑名单 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await cancelCustomerBlack({ id: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getTableList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('sysManage.sysManage43') /* 已取消删除 */
        })
      })
    },

    // 添加黑名单
    openAddDrawer() {
      this.openAddBlackDrawer = true
    },
    closeAddDrawer(item) {
      this.openAddBlackDrawer = false
      if (item) {
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
