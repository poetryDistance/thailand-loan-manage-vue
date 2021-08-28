<template>
  <div class="main-box">
    <!-- 催收员管理 -- 分组设置 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item v-if="permission.isAdmin" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
        <el-select
          v-model="listQuery.companyId"
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
        <el-select v-model="listQuery.collectionLenderUserId" filterable clearable :placeholder="$t('collector.collector35')"> <!-- 请选择催收组 -->
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getGroupInfo(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button v-if="permission.isAdmin || permission.isCollectionLead" type="primary" @click="openAdd">{{ $t('collector.collector3') }}</el-button> <!-- 新增 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="groupInfoList"
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
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <!-- 公司名 -->
      <el-table-column
        v-if="permission.isAdmin"
        key="companyName"
        :label="$t('sysManage.sysManage57')"
        prop="companyName"
        align="center"
        min-width="90px"
      />
      <el-table-column :label="$t('collector.collector11')" prop="groupName" align="center" min-width="90px" /> <!-- 催收组 -->
      <el-table-column :label="$t('collector.collector5')" prop="loginName" align="center" min-width="90px" /> <!-- 组长 -->
      <el-table-column :label="$t('common.common28')" prop="mobile" align="center" min-width="90px" /> <!-- 手机号 -->
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getGroupInfo"
    />

    <add-group-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-group-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getGroupInfo, getCompanyGroup, updateGroup } from '@/api/collectionAgentManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addGroupDrawer from './components/groupSetUp/addGroupDrawer'
import updateGroupDrawer from './components/groupSetUp/updateGroupDrawer'
import { mapState } from 'vuex'

export default {
  name: 'GroupSetUp',
  components: {
    Pagination,
    addGroupDrawer,
    updateGroupDrawer
  },
  data() {
    return {
      // 搜索
      groupOptions: [],
      listLoading: false,
      groupInfoList: [],
      listQuery: {
        page: 1,
        size: 10,
        collectionLenderUserId: ''
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
      this.listQuery.companyId = this.ids.collectionCompanyId
    }
    this.getGroupInfo()
  },

  methods: {
    // 修改公司名获取对应的组
    async companyChange(item) {
      this.collectionLenderUserId = ''
      const res = await getCompanyGroup({ collectionCompanyId: item })
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
    // 获取组列表
    async getGroupInfo(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await getGroupInfo(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupInfoList = res.data.list
      this.total = res.data.total
      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getGroupInfo()
      }
    },
    // 重置
    resetList() {
      this.listQuery = {
        page: 1,
        size: 10,
        collectionLenderUserId: ''
      }
      if (this.permission.isCollectionLead) {
        this.listQuery.companyId = this.ids.collectionCompanyId
      }
      this.groupOptions = []
      this.getGroupInfo()
    },

    // 控制新增弹框
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getGroupInfo()
      }
    },
    // 控制修改用户弹框
    openUpdate(row) {
      this.openUpdateDrawer = true
      this.currentRow = row
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false
      if (item) {
        this.getGroupInfo()
      }
    },
    // 删除组
    del(row) {
      this.$confirm(this.$t('collector.collector25'), this.$t('collector.collector26'), { /* 此操作将删除该组, 是否继续? 删除组 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateGroup({ removed: 1, id: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getGroupInfo()
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
