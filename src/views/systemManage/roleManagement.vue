div<template>
  <!-- 系统管理 -- 角色设置 -->
  <div class="main-box">
    <el-button size="mini" type="primary" @click="openAddRole">{{ $t('sysManage.sysManage45') }}</el-button> <!-- 添加角色 -->
    <el-table
      v-loading="listLoading"
      :data="roleInfoList"
      :max-height="$store.state.settings.tableHeight"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="100px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button :disabled="row.id === 1" size="mini" type="text" @click="openUpdateRole(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button
            :disabled="row.id === 1 || row.id === 49 || row.id === 50 || row.id === 51 || row.id === 55 || row.id === 56 || row.id === 57"
            size="mini"
            type="text"
            @click="delRole(row)"
          >
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <el-table-column :label="$t('sysManage.sysManage46')" prop="name" align="center" min-width="100px" /> <!-- 角色名称 -->
      <el-table-column :label="$t('loanMarket.loanMarket57')" prop="isOpenContact" align="center" min-width="120px"> <!-- 是否开放通讯录 -->
        <template slot-scope="{ row }">
          <el-switch
            v-if="row.id === 1"
            v-model="defaultValue"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
          <el-switch
            v-else
            v-model="row.isOpenContact"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="isOpenContactChange(row, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage47')" prop="updateTime" align="center" min-width="150px"> <!-- 上次修改时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getRoleList"
    />
    <add-role-drawer v-if="openAddRoleDrawer" @closeAddRole="closeAddRole" />
    <update-role-drawer v-if="openUpdateRoleDrawer" :current-row="currentRow" @closeUpdateRole="closeUpdateRole" />
  </div>

</template>

<script>
import { getRoleList, updateRole, isOpenRoleContact } from '@/api/sysManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addRoleDrawer from './components/role/addRoleDrawer'
import updateRoleDrawer from './components/role/updateRoleDrawer'

export default {
  name: 'RoleManagement',
  components: {
    Pagination,
    addRoleDrawer,
    updateRoleDrawer
  },
  data() {
    return {
      loginUser: {},
      // 获取角色
      listLoading: true,
      roleInfoList: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      openAddRoleDrawer: false,
      // 修改
      openUpdateRoleDrawer: false,
      currentRow: {},

      defaultValue: true
    }
  },

  mounted() {
    this.loginUser = this.sessionData('get', 'login_user')
    this.getRoleList()
  },

  methods: {
    // 获取角色列表
    async getRoleList() {
      this.listLoading = true
      const res = await getRoleList(this.listQuery)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.roleInfoList = res.data.list
      this.total = res.data.total
    },
    // 添加角色弹框
    openAddRole() {
      this.openAddRoleDrawer = true
    },
    closeAddRole(item) {
      this.openAddRoleDrawer = false
      if (item) {
        this.getRoleList()
      }
    },

    // 修改角色弹框
    openUpdateRole(row) {
      this.currentRow = row
      this.openUpdateRoleDrawer = true
    },
    closeUpdateRole(item) {
      this.openUpdateRoleDrawer = false

      if (item) {
        this.getRoleList()
      }
    },

    // 删除
    delRole(row) {
      this.$confirm(this.$t('sysManage.sysManage52'), this.$t('sysManage.sysManage53'), { /* 此操作将删除该角色, 是否继续? 删除角色 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateRole({ id: row.id, deleted: true })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('sysManage.sysManage43') /* 已取消删除 */
        })
      })
    },

    // 是否开放通讯录
    isOpenContactChange(row, e) {
      // 确认启用? 确认禁用?
      const tips = e ? this.$t('collector.collector32') : this.$t('collector.collector33')
      // 开启  关闭
      const title = e ? this.$t('common.common15') : this.$t('common.common16')
      // 开启成功  关闭成功
      const msg = e ? this.$t('common.common18') : this.$t('common.common19')

      this.$confirm(tips, title, {
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await isOpenRoleContact({ isOpenContact: e, id: row.id })
        if (res.code !== '0' || !res.data) {
          this.getRoleList()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getRoleList()
      }).catch(() => {
        row.roleCode = e ? 0 : 1
        this.$message({
          type: 'info',
          message: this.$t('common.common17') /* 已取消 */
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
