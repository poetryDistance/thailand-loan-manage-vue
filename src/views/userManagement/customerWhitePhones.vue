<template>
  <div class="main-box">
    <!-- 用户管理 -- 白名单列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="phone" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.phone" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button :loading="btnLoading" type="primary" @click="openAddDrawer">{{ $t('risk.risk65') }}</el-button> <!-- 添加白名单 -->
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
          <el-button size="mini" type="text" @click="delCustomerWhite(row)">{{ $t('sysManage.sysManage29') }}</el-button> <!-- 删除 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('common.common28')" prop="phone" align="center" min-width="180px" /> <!-- 手机号 -->
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

    <add-white-drawer v-if="openAddWhiteDrawer" @closeAddDrawer="closeAddDrawer" />
  </div>
</template>

<script>
import { customerWhitePhones, cancelCustomerWhitePhone } from '@/api/userManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addWhiteDrawer from './components/addWhiteDrawer'

export default {
  name: 'CustomerWhitePhones',
  components: {
    Pagination,
    addWhiteDrawer
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        content: '',
        page: 1,
        size: 10
      },
      total: 0,

      // 添加
      openAddWhiteDrawer: false
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

      const res = await customerWhitePhones(tmp)
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
    delCustomerWhite(row) {
      this.$confirm(this.$t('risk.risk66'), this.$t('risk.risk67'), { /* 此操作将删除该白名单, 是否继续?  删除白名单 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await cancelCustomerWhitePhone({ id: row.id })
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

    // 添加白名单
    openAddDrawer() {
      this.openAddWhiteDrawer = true
    },
    closeAddDrawer(item) {
      this.openAddWhiteDrawer = false
      if (item) {
        this.getTableList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
