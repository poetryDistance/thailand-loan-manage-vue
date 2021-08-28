<template>
  <div class="main-box">
    <!-- 催收员管理 -- 催收员列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item v-if="permission.isAdmin" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
        <el-select
          v-model="listQuery.collectionCompanyId"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage55')"
          @change="companyChange"
        > <!-- 请选择公司名 -->
          <el-option
            v-for="item in companyNameOptions"
            :key="item.id"
            :label="item.companyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('collector.collector11') + ': '"> <!-- 催收组 -->
        <el-select v-model="listQuery.collectionGroupId" filterable clearable :placeholder="$t('collector.collector35')"> <!-- 请选择催收组 -->
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getCollectionUserInfo(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button v-if="permission.isAdmin || permission.isCollectionLead" type="primary" @click="openAdd">{{ $t('collector.collector31') }}</el-button> <!-- 添加催收员 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="groupCollectorList"
      :max-height="$store.state.settings.tableHeight"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column v-if="permission.isAdmin || permission.isCollectionLead" key="operation" :label="$t('sysManage.sysManage23')" align="center" min-width="120px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="openUpdate(row, false)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
          <el-button :disabled="row.valid === 0" size="mini" type="text" @click="openUpdate(row, true)">
            {{ $t('sysManage.sysManage30') }} <!-- 重置密码 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <!-- 公司名称 -->
      <el-table-column
        v-if="permission.isAdmin"
        key="companyName"
        :label="$t('sysManage.sysManage54')"
        prop="companyName"
        align="center"
        min-width="90px"
      />
      <el-table-column :label="$t('collector.collector11')" prop="groupName" align="center" min-width="90px" /> <!-- 催收组 -->
      <el-table-column :label="$t('sysManage.sysManage1')" prop="collectionName" align="center" min-width="90px" /> <!-- 登录名 -->
      <el-table-column :label="$t('sysManage.sysManage17')" prop="email" align="center" min-width="90px" /> <!-- 邮箱 -->
      <el-table-column :label="$t('common.common28')" prop="mobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('collector.collector13')" prop="roleName" align="center" min-width="90px" /> <!-- 职位 -->
      <!-- <el-table-column :label="$t('loanMarket.loanMarket61')" prop="ip" align="center" min-width="120px" /> 最近一次登录IP -->
      <el-table-column :label="$t('sysManage.sysManage20')" prop="ip" align="center" min-width="120px" /> <!-- 上次登录IP -->
      <el-table-column :label="$t('sysManage.sysManage19')" prop="loginTime" align="center" min-width="150px"> <!-- 上次登录时间 -->
        <template slot-scope="{ row }">
          {{ row.loginTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column v-if="permission.isAdmin" key="valid" :label="$t('common.common14')" align="center" min-width="90px"> <!-- 状态 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.valid"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="validChange(row, $event)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getCollectionUserInfo"
    />

    <add-collector-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-collector-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getCompanyGroup, collectionUserInfo, updateCollectionUser } from '@/api/collectionAgentManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addCollectorDrawer from './components/listOfCollectors/addCollectorDrawer'
import updateCollectorDrawer from './components/listOfCollectors/updateCollectorDrawer'
import { mapState } from 'vuex'

export default {
  name: 'ListOfCollectors',
  components: {
    Pagination,
    addCollectorDrawer,
    updateCollectorDrawer
  },
  data() {
    return {
      // 搜索
      groupOptions: [],

      listLoading: false,
      groupCollectorList: [],
      listQuery: {
        page: 1,
        size: 10,
        collectionGroupId: ''
      },
      total: 0,

      // 新增
      openAddDrawer: false,
      // 修改
      openUpdateDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      permission: state => state.permission.permission,
      ids: state => state.permission.ids
    })
  },

  mounted() {
    if (this.permission.isCollectionLead) {
      this.companyChange(this.ids.collectionCompanyId)
      this.listQuery.collectionCompanyId = this.ids.collectionCompanyId
    }
    this.getCollectionUserInfo()
  },

  methods: {
    // 修改公司名获取对应的组
    async companyChange(item) {
      const res = await getCompanyGroup({ collectionCompanyId: item })
      this.listQuery.collectionGroupId = ''
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupOptions = res.data || []
    },

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
    // 获取催收员列表
    async getCollectionUserInfo(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await collectionUserInfo(tmp)
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupCollectorList = res.data.list
      this.total = res.data.total
      this.listLoading = false
      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getCollectionUserInfo()
      }
    },
    // 重置
    resetList() {
      this.listQuery = {
        page: 1,
        size: 10,
        collectionGroupId: ''
      }
      if (this.permission.isCollectionLead) {
        this.listQuery.collectionCompanyId = this.ids.collectionCompanyId
      }
      this.groupOptions = []
      this.getCollectionUserInfo()
    },

    // 控制新增弹框
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getCollectionUserInfo()
      }
    },
    // 控制修改用户弹框
    openUpdate(row, isPwd) {
      this.openUpdateDrawer = true
      this.currentRow = row
      this.currentRow.isPwd = isPwd
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false
      if (item) {
        this.getCollectionUserInfo()
      }
    },
    // 是否禁用
    async validChange(row, e) {
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
        const res = await updateCollectionUser({ valid: e, id: row.id })
        if (res.code !== '0' || !res.data) {
          this.getCollectionUserInfo()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getCollectionUserInfo()
      }).catch(() => {
        row.valid = e ? 0 : 1
        this.$message({
          type: 'info',
          message: this.$t('common.common17') /* 已取消 */
        })
      })
    },
    // 删除用户
    del(row) {
      this.$confirm(this.$t('sysManage.sysManage40'), this.$t('sysManage.sysManage41'), { /* 此操作将删除该用户, 是否继续? 删除用户 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateCollectionUser({ deleted: 1, id: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getCollectionUserInfo()
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
