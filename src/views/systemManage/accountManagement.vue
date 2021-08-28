<template>
  <div class="main-box">
    <!-- 系统管理 -- 账号管理 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('sysManage.sysManage1') + ': '"> <!-- 登录名 -->
        <el-input v-model="listQuery.loginName" :placeholder="$t('sysManage.sysManage5')" style="width: 178px;" /> <!-- 请输入登录名 -->
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage44') + ': '"> <!-- 角色 -->
        <el-select v-model="listQuery.roleId" filterable clearable :placeholder="$t('sysManage.sysManage66')"> <!-- 请选择角色 -->
          <el-option
            v-for="item in roleIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage2') + ': '"> <!-- 账户状态 -->
        <el-select v-model="listQuery.valid" filterable clearable :placeholder="$t('sysManage.sysManage6')"> <!-- 请选择状态 -->
          <el-option
            v-for="item in isValidOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage3') + ': '"> <!-- 用户类型 -->
        <el-select v-model="listQuery.userType" filterable clearable :placeholder="$t('sysManage.sysManage7')"> <!-- 请选择类型 -->
          <el-option
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage4') + ': '"> <!-- 创建时间 -->
        <el-date-picker
          v-model="listQuery.createTime"
          type="datetimerange"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          style="width: 260px;"
        /> <!-- 开始日期 结束日期 -->
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getUserList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="resetUserList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button type="primary" @click="openAddUser">{{ $t('sysManage.sysManage12') }}</el-button> <!-- 添加用户 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="userInfoList"
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
          <el-dropdown split-button type="primary" trigger="click" @command="handleCommand(row, $event)">
            <span v-if="row.valid" @click="updateUser(row, false)">{{ $t('sysManage.sysManage26') }}</span> <!-- 修改 -->
            <span v-else style="cursor: not-allowed;">{{ $t('sysManage.sysManage26') }}</span> <!-- 修改 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a" :disabled="row.id === loginUser.id || row.id === 1">
                {{ row.valid ? $t('sysManage.sysManage27') : $t('sysManage.sysManage28') }} <!-- 禁用 启用 -->
              </el-dropdown-item>
              <!-- <el-dropdown-item command="b" :disabled="row.id === loginUser.id || row.id === 1 || !row.valid">
                {{ $t('sysManage.sysManage29') }} 删除
              </el-dropdown-item> -->
              <el-dropdown-item command="c" :disabled="!row.valid">
                {{ $t('sysManage.sysManage30') }} <!-- 重置密码 -->
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <el-table-column :label="$t('sysManage.sysManage1')" prop="loginName" align="center" min-width="90px" /> <!-- 登录名 -->
      <el-table-column :label="$t('sysManage.sysManage44')" prop="roleName" align="center" min-width="90px" /> <!-- 角色 -->
      <el-table-column :label="$t('sysManage.sysManage57')" prop="companyName" align="center" min-width="120px" /> <!-- 催收公司 -->
      <el-table-column :label="$t('common.common28')" prop="mobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('sysManage.sysManage17')" prop="email" align="center" min-width="120px" /> <!-- 邮箱 -->
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage19')" prop="loginTime" align="center" min-width="150px"> <!-- 上次登录时间 -->
        <template slot-scope="{ row }">
          {{ row.loginTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage20')" prop="ip" align="center" min-width="120px" /> <!-- 上次登录IP -->
      <el-table-column :label="$t('sysManage.sysManage21')" prop="userType" align="center" min-width="90px"> <!-- 用户类型 -->
        <template slot-scope="{ row }">
          {{ row.userType | userTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage22')" prop="valid" align="center" min-width="90px"> <!-- 账户状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.valid" size="small" type="success">{{ $t('sysManage.sysManage24') }}</el-tag> <!-- 已启用 -->
          <el-tag v-else size="small" type="danger">{{ $t('sysManage.sysManage25') }}</el-tag> <!-- 已禁用 -->
          <!-- {{ row.valid ? '已启用' : '已禁用' }} -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getUserList"
    />

    <add-user-drawer v-if="openAddUserDrawer" @closeAddUser="closeAddUser" />
    <update-user-drawer v-if="openUpdateUserDrawer" :current-row="currentRow" @closeUpdateUser="closeUpdateUser" />
  </div>
</template>

<script>
import { getUserList, updatePassword, getRoleList } from '@/api/sysManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addUserDrawer from './components/account/addUserDrawer'
import updateUserDrawer from './components/account/updateUserDrawer'
import { mapState } from 'vuex'

export default {
  name: 'AccountManagement',
  components: {
    Pagination,
    addUserDrawer,
    updateUserDrawer
  },
  data() {
    return {
      // 搜索
      roleIdOptions: [],
      // 登录信息
      loginUser: null,
      listLoading: false,
      userInfoList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      // 添加用户
      openAddUserDrawer: false,
      // 修改用户
      openUpdateUserDrawer: false,
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
    this.loginUser = this.sessionData('get', 'login_user')
    this.getRoleList()
    this.getUserList()
  },

  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleList({ page: 1, size: 1000 })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.list.forEach(item => {
        this.roleIdOptions.push({
          value: item.id,
          label: item.name
        })
      })
    },
    // 下拉菜单
    handleCommand(row, command) {
      switch (command) {
        case 'a':
          this.validUser(row)
          break
        case 'b':
          this.delUser(row)
          break
        case 'c':
          this.updateUser(row, true)
          break
      }
    },

    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] || this.listQuery[k] === 0) {
          if (k !== 'createTime') {
            tmp[k] = this.listQuery[k]
          } else if (k === 'createTime') {
            tmp.startTime = this.listQuery[k][0]
            tmp.endTime = this.listQuery[k][1] + 86399000
          }
        }
      }
      return tmp
    },
    // 获取用户
    async getUserList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await getUserList(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.userInfoList = res.data.list
      this.total = res.data.total

      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getUserList()
      }
    },
    // 重置
    resetUserList() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.getUserList()
    },

    // 控制添加用户弹框
    openAddUser() {
      this.openAddUserDrawer = true
    },
    closeAddUser(item) {
      this.openAddUserDrawer = false
      if (item) {
        this.getUserList()
      }
    },
    // 控制修改用户弹框
    updateUser(row, isResetPwd, userType) {
      this.openUpdateUserDrawer = true
      this.currentRow = row
      // 是否是重置密码 true 是 false 否
      this.currentRow.isResetPwd = isResetPwd
    },
    closeUpdateUser(item) {
      this.openUpdateUserDrawer = false
      if (item) {
        this.getUserList()
      }
    },
    // 禁用用户
    async validUser(row) {
      const tips = row.valid ? this.$t('sysManage.sysManage31') : this.$t('sysManage.sysManage32') /* 此操作将禁用该用户, 是否继续? 此操作将启用该用户, 是否继续? */
      const title = row.valid ? this.$t('sysManage.sysManage33') : this.$t('sysManage.sysManage34') /* 禁用用户 启用用户 */
      const msg = row.valid ? this.$t('sysManage.sysManage37') : this.$t('sysManage.sysManage38') /* 禁用成功 启用成功 */
      this.$confirm(tips, title, {
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const tmp = {
          valid: !row.valid,
          userId: row.id
        }
        if (row.roleId === 49) {
          tmp.roleId = row.roleId
          tmp.companyId = row.companyId
        }
        const res = await updatePassword(tmp)
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: msg
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('sysManage.sysManage39') /* 已取消禁用 */
        })
      })
    },
    // 删除用户
    delUser(row) {
      this.$confirm(this.$t('sysManage.sysManage40'), this.$t('sysManage.sysManage41'), { /* 此操作将删除该用户, 是否继续? 删除用户 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updatePassword({ deleted: true, userId: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getUserList()
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
