<template>
  <div class="main-box">
    <!-- 系统管理 -- 还款账号管理 -->
    <el-button size="mini" type="primary" @click="openAdd">{{ $t('sysManage.sysManage135') }}</el-button> <!-- 添加还款账号 -->

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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="130px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="validAccount(row)">
            {{ row.valid ? $t('sysManage.sysManage27') : $t('sysManage.sysManage28') }} <!-- 禁用 启用 -->
          </el-button>
          <el-button size="mini" type="text" @click="delAccount(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage136')" prop="abbreviation" align="center" min-width="120px" /> <!-- 英文简写 -->
      <el-table-column :label="$t('sysManage.sysManage137')" prop="account" align="center" min-width="120px" /> <!-- 卡号 -->
      <el-table-column :label="$t('sysManage.sysManage138')" prop="chineseName" align="center" min-width="90px" /> <!-- 中文名称 -->
      <el-table-column :label="$t('sysManage.sysManage139')" prop="pictureUrl" align="center" min-width="120px" /> <!-- 银行卡图片地址 -->
      <el-table-column :label="$t('sysManage.sysManage140')" prop="thaiName" align="center" min-width="120px" /> <!-- 泰语银行名称 -->
      <el-table-column :label="$t('sysManage.sysManage22')" prop="valid" align="center" min-width="90px"> <!-- 账户状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.valid" size="small" type="success">{{ $t('sysManage.sysManage24') }}</el-tag> <!-- 已启用 -->
          <el-tag v-else size="small" type="danger">{{ $t('sysManage.sysManage25') }}</el-tag> <!-- 已禁用 -->
          <!-- {{ row.valid ? '已启用' : '已禁用' }} -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
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

    <add-repayment-drawer v-if="openAddRepaymentDrawer" @closeAdd="closeAdd" />
    <update-repayment-drawer v-if="openUpdateRepaymentDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getAccountInfo, updateRepayAccount } from '@/api/sysManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addRepaymentDrawer from './components/repaymentAccount/addRepaymentDrawer'
import updateRepaymentDrawer from './components/repaymentAccount/updateRepaymentDrawer'
import { mapState } from 'vuex'

export default {
  name: 'RepaymentAccount',
  components: {
    Pagination,
    addRepaymentDrawer,
    updateRepaymentDrawer
  },
  data() {
    return {
      // 搜索
      listLoading: false,
      tableList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      // 添加还款账号
      openAddRepaymentDrawer: false,
      // 修改还款账号
      openUpdateRepaymentDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      userTypeOptions: state => state.options.userTypeOptions,
      isValidOptions: state => state.options.isValidOptions
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 获取用户
    async getTableList() {
      this.listLoading = true
      const res = await getAccountInfo(this.listQuery)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.total = res.data.total
    },
    // 重置
    resetUserList() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 控制添加还款账号弹框
    openAdd() {
      this.openAddRepaymentDrawer = true
    },
    closeAdd(item) {
      this.openAddRepaymentDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 控制修改还款账号弹框
    openUpdate(row) {
      this.openUpdateRepaymentDrawer = true
      this.currentRow = row
    },
    closeUpdate(item) {
      this.openUpdateRepaymentDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 禁用用户
    async validAccount(row) {
      const tips = row.valid ? this.$t('sysManage.sysManage148') : this.$t('sysManage.sysManage149') /* 此操作将禁用该账号, 是否继续? 此操作将启用该账号, 是否继续? */
      const title = row.valid ? this.$t('sysManage.sysManage27') : this.$t('sysManage.sysManage28') /* 禁用 启用 */
      const msg = row.valid ? this.$t('sysManage.sysManage37') : this.$t('sysManage.sysManage38') /* 禁用成功 启用成功 */
      this.$confirm(tips, title, {
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const tmp = {
          valid: row.valid ? 0 : 1,
          id: row.id
        }
        const res = await updateRepayAccount(tmp)
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message.success(msg)
        this.getTableList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('sysManage.sysManage39') /* 已取消禁用 */
        })
      })
    },
    // 删除用户
    delAccount(row) {
      this.$confirm(this.$t('sysManage.sysManage150'), this.$t('sysManage.sysManage29'), { /* 此操作将删除该账号, 是否继续? 删除 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateRepayAccount({ deleted: 1, id: row.id })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  position: relative;
  width: 520px;
  max-width: 100%;
  // padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}
.el-dropdown-menu__item {
  font-size: 12px;
  color: #409eff;
}
.is-disabled {
  cursor: default;
  color: #bbb;
  pointer-events: none;
}
</style>
