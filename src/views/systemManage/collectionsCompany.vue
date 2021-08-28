<template>
  <div class="main-box">
    <!-- 系统管理 -- 催收公司管理 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('sysManage.sysManage54') + ': '"> <!-- 公司名称 -->
        <!-- 请选择公司名称 -->
        <el-select
          v-model="listQuery.companyName"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage55')"
        >
          <el-option
            v-for="item in companyNameOptions"
            :key="item.id"
            :label="item.companyName"
            :value="item.companyName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getCompanyList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="resetCompanyList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button type="primary" @click="openAddCompany">{{ $t('sysManage.sysManage56') }}</el-button> <!-- 添加催收公司 -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="companyList"
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
          <el-button size="mini" type="text" @click="openModifyCompany(row)">{{ $t('sysManage.sysManage26') }}</el-button> <!-- 修改 -->
          <!-- <el-button size="mini" type="text" @click="delCompany(row)">{{ $t('sysManage.sysManage29') }}</el-button> --> <!-- 删除 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <el-table-column :label="$t('sysManage.sysManage57')" prop="companyName" align="center" min-width="90px" /> <!-- 公司名 -->
      <el-table-column :label="$t('loanMarket.loanMarket64')" prop="collectionType" align="center" min-width="90px"> <!-- 催收类型 -->
        <template slot-scope="{ row }">
          {{ row.collectionType | collectionTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage79')" prop="adminUserName" align="center" min-width="90px" /> <!-- 主管登录名 -->
      <el-table-column :label="$t('sysManage.sysManage59')" prop="updateTime" align="center" min-width="150px"> <!-- 修改时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="110px"> <!-- 备注 -->
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
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getCompanyList"
    />

    <add-company-drawer v-if="openAddCompanyDrawer" @closeAddCompany="closeAddCompany" />
    <modify-company-drawer v-if="openModifyCompanyDrawer" :current-row="currentRow" @closeModifyCompany="closeModifyCompany" />
  </div>
</template>

<script>
import { getCompany, updateCompany } from '@/api/sysManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addCompanyDrawer from './components/collectionsCompany/addCompanyDrawer'
import modifyCompanyDrawer from './components/collectionsCompany/modifyCompanyDrawer'
import { mapState } from 'vuex'

export default {
  name: 'CollectionsCompany',
  components: {
    Pagination,
    addCompanyDrawer,
    modifyCompanyDrawer
  },
  data() {
    return {
      // 搜索
      listLoading: false,
      companyList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      // 添加公司
      openAddCompanyDrawer: false,
      // 修改公司
      openModifyCompanyDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions
    })
  },

  mounted() {
    this.getCompanyList()
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
    // 获取用户
    async getCompanyList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await getCompany(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.companyList = res.data.list || []
      this.total = res.data.total || 0

      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getCompanyList()
      }
    },
    // 重置
    resetCompanyList() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.getCompanyList()
    },
    // 添加公司
    openAddCompany() {
      this.openAddCompanyDrawer = true
    },
    closeAddCompany(item) {
      this.openAddCompanyDrawer = false
      if (item) {
        this.getCompanyList()
      }
    },
    // 修改公司
    openModifyCompany(row) {
      this.currentRow = row
      this.openModifyCompanyDrawer = true
    },
    closeModifyCompany(item) {
      this.openModifyCompanyDrawer = false
      if (item) {
        this.getCompanyList()
      }
    },
    // 删除公司
    delCompany(row) {
      this.$confirm(this.$t('sysManage.sysManage61'), this.$t('sysManage.sysManage62'), { /* 此操作将删除该公司, 是否继续?  删除公司 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await updateCompany({ id: row.id, deleted: true })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getCompanyList()
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
