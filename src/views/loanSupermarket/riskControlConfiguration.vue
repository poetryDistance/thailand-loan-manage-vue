<template>
  <div class="main-box">
    <!-- 市场管理 -- 风控产品配置 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('risk.risk1') + ': '"> <!-- 对比方法 -->
        <el-select
          v-model="listQuery.compareType"
          filterable
          clearable
          :placeholder="$t('risk.risk11')"
        > <!-- 请选择模型分对比方法 -->
          <el-option
            v-for="item in compareTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage92') + ': '"> <!-- 模型类型 -->
        <el-select
          v-model="listQuery.modelType"
          filterable
          clearable
          :placeholder="$t('borrow.borrow12')"
        > <!-- 请选择模型类型 -->
          <el-option
            v-for="item in modelTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage91') + ': '"> <!-- 产品名称 -->
        <el-select
          v-model="listQuery.productId"
          filterable
          clearable
          :placeholder="$t('risk.risk4')"
        > <!-- 请选择产品名称 -->
          <el-option
            v-for="item in productIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button :loading="btnLoading" type="primary" @click="addRisk">{{ $t('risk.risk8') }}</el-button> <!-- 新增风控配置 -->
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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="90px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button :loading="btnLoading" type="text" @click="openUpdate(row)">{{ $t('sysManage.sysManage26') }}</el-button> <!-- 修改 -->
          <el-button :loading="btnLoading" type="text" @click="delRisk(row)">{{ $t('sysManage.sysManage29') }}</el-button> <!-- 删除 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('sysManage.sysManage91')" prop="productName" align="center" min-width="90px" /> <!-- 产品名称 -->
      <el-table-column :label="$t('sysManage.sysManage92')" prop="modelType" align="center" min-width="90px"> <!-- 模型分类型 -->
        <template slot-scope="{ row }">
          {{ row.modelType | modelTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('risk.risk5')" prop="maxScore" align="center" min-width="90px" /> <!-- 上限分 -->
      <el-table-column :label="$t('risk.risk6')" prop="minScore" align="center" min-width="90px" /> <!-- 下限分 -->
      <el-table-column :label="$t('risk.risk7')" prop="compareType" align="center" min-width="300px"> <!-- 模型分对比方法 -->
        <template slot-scope="{ row }">
          {{ row.compareType | compareTypeFilter }}
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

    <add-risk-drawer v-if="openAddDrawer" @close="close" />
    <update-risk-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getProductList } from '@/api/loanSupermarket'
import { getProductRisks, delProductRisk } from '@/api/riskControlManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addRiskDrawer from './components/riskControlConfiguration/addRiskDrawer'
import updateRiskDrawer from './components/riskControlConfiguration/updateRiskDrawer'
import { mapState } from 'vuex'

export default {
  name: 'RiskControlConfiguration',
  components: {
    Pagination,
    addRiskDrawer,
    updateRiskDrawer
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      productIdOptions: [],
      // 列表
      listLoading: false,
      tableList: [],
      listQuery: {
        userName: '',
        mobile: '',
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        page: 1,
        size: 10
      },
      total: 0,

      // 新增风控配置
      openAddDrawer: false,

      // 修改
      openUpdateDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      borrowStatusOptions: state => state.options.borrowStatusOptions,
      loanTypeOptions: state => state.options.loanTypeOptions,
      modelResultTypeOptions: state => state.options.modelResultTypeOptions,
      modelTypeOptions: state => state.options.modelTypeOptions,
      compareTypeOptions: state => state.options.compareTypeOptions
    })
  },

  mounted() {
    this.getProduct()
    this.getTableList()
  },

  methods: {
    // 获取产品
    async getProduct() {
      const res = await getProductList({ page: 1, size: 1000 })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.list.forEach(item => {
        this.productIdOptions.push({
          value: item.id,
          label: item.productName
        })
      })
    },
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k]) {
          tmp[k] = this.listQuery[k]
        }
      }
      tmp.merchantId = this.$route.query.merchantId
      tmp.monthDate = this.$route.query.monthDate
      return tmp
    },
    // 查询获取风控配置
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getProductRisks(tmp)
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

    // 新增风控配置
    addRisk() {
      this.openAddDrawer = true
    },
    close(item) {
      this.openAddDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 修改风控配置
    openUpdate(row) {
      this.openUpdateDrawer = true
      this.currentRow = row
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false
      if (item) {
        this.getTableList()
      }
    },

    // 删除
    delRisk(row) {
      this.$confirm(this.$t('sysManage.sysManage40'), this.$t('sysManage.sysManage41'), { /* 此操作将删除该用户, 是否继续? 删除用户 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await delProductRisk({ id: row.id })
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
</style>
