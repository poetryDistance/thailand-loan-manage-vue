<template>
  <div class="main-box">
    <!-- 催收员管理 -- 自动派单 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
        <el-select
          v-model="listQuery.companyId"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage55')"
          @change="companyChange"
        > <!-- 请选择公司名 -->
          <el-option
            v-for="item in companyNameCollectOptions"
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
        <el-button type="primary" @click="getGroupRules(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button type="primary" @click="openAdd">{{ $t('collector.collector7') }}</el-button> <!-- 新增规则 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="groupRulesList"
      :max-height="$store.state.settings.tableHeight"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="120px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage54')" prop="companyName" align="center" min-width="90px" /> <!-- 公司名称 -->
      <el-table-column :label="$t('loanMarket.loanMarket64')" prop="collectionType" align="center" min-width="90px"> <!-- 催收类型 -->
        <template slot-scope="{ row }">
          {{ row.collectionType | collectionTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collector.collector11')" prop="groupName" align="center" min-width="90px" /> <!-- 催收组 -->
      <el-table-column :label="$t('loanMarket.loanMarket66')" align="center" min-width="90px"> <!-- 规则天数 -->
        <template slot-scope="{ row }">
          <div v-if="row.collectionType === 10 || !row.collectionType">
            <span style="color: red;">{{ row.minDay }}</span>
            &nbsp;<i class="el-icon-right" />&nbsp;
            <span style="color: red;">{{ row.maxDay }}</span>
          </div>
          <div v-if="row.collectionType === 20">
            <span style="color: red;">{{ '-' + row.maxDay }}</span>
            &nbsp;<i class="el-icon-right" />&nbsp;
            <span style="color: red;">{{ '-' + row.minDay }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="$t('collector.collector9')" prop="minDay" align="center" min-width="90px"> 逾期最小天数
        <template slot-scope="{ row }">
          <div v-if="row.collectionType === 10">{{ row.minDay }}</div>
          <div v-if="row.collectionType === 20">{{ row.minDay === 0 ? 0 : ('-' + row.minDay) }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collector.collector10')" prop="maxDay" align="center" min-width="90px"> 逾期最大天数
        <template slot-scope="{ row }">
          <div v-if="row.collectionType === 10">{{ row.maxDay }}</div>
          <div v-if="row.collectionType === 20">{{ row.maxDay === 0 ? 0 : ('-' + row.maxDay) }}</div>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="90px"> <!-- 备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.remark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.remark"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collector.collector20')" prop="remark" align="center" min-width="90px"> <!-- 是否自动派单 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="enableChange(row, $event)"
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
      @pagination="getGroupRules"
    />

    <add-rules-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-rules-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { groupRules, getCompanyGroup, updateGroupRules, deleteRules } from '@/api/collectionAgentManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addRulesDrawer from './components/groupRules/addRulesDrawer'
import updateRulesDrawer from './components/groupRules/updateRulesDrawer'
import { mapState } from 'vuex'

export default {
  name: 'GroupSetUp',
  components: {
    Pagination,
    addRulesDrawer,
    updateRulesDrawer
  },
  data() {
    return {
      // 搜索
      groupOptions: [],
      // 登录信息
      loginUser: null,
      listLoading: false,
      groupRulesList: [],
      listQuery: {
        page: 1,
        size: 10
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
      companyNameCollectOptions: state => state.options.companyNameCollectOptions
    })
  },

  mounted() {
    this.loginUser = this.sessionData('get', 'login_user')
    this.getGroupRules()
  },

  methods: {
    // 修改公司名获取对应的组
    async companyChange(item) {
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
    async getGroupRules(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await groupRules(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupRulesList = res.data.list
      this.total = res.data.total

      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getGroupRules()
      }
    },
    // 重置
    resetList() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.getGroupRules()
    },

    // 控制新增弹框
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getGroupRules()
      }
    },
    // 控制修改弹框
    openUpdate(row) {
      this.openUpdateDrawer = true
      this.currentRow = row
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false
      if (item) {
        this.getGroupRules()
      }
    },
    // 是否自动派单
    async enableChange(row, e) {
      // 此操作将开启该规则, 是否继续? 此操作将关闭改规则, 是否继续?
      const tips = e ? this.$t('collector.collector27') : this.$t('collector.collector28')
      // 开启规则  关闭规则
      const title = e ? this.$t('collector.collector29') : this.$t('collector.collector30')
      // 开启成功  关闭成功
      const msg = e ? this.$t('common.common18') : this.$t('common.common19')

      this.$confirm(tips, title, {
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateGroupRules({ enable: e, id: row.id, groupId: row.groupId })
        if (res.code !== '0' || !res.data) {
          this.getGroupRules()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getGroupRules()
      }).catch(() => {
        row.enable = e ? 0 : 1
        this.$message({
          type: 'info',
          message: this.$t('common.common17') /* 已取消 */
        })
      })
    },
    // 删除
    del(row) {
      this.$confirm(this.$t('collector.collector23'), this.$t('collector.collector24'), { /* 此操作将删除该规则, 是否继续? 删除规则 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await deleteRules({ id: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getGroupRules()
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
