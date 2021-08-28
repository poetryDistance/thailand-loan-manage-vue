<template>
  <div class="main-box">
    <!-- 市场管理 -- 产品列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('sysManage.sysManage91') + ': '"> <!-- 产品名称 -->
        <el-input v-model="listQuery.productName" :placeholder="$t('sysManage.sysManage104')" style="width: 178px;" /> <!-- 请输入产品名称 -->
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage92') + ':'"> <!-- 模型分类型 -->
        <!-- 请选择模型分类型 -->
        <el-select
          v-model="listQuery.modelType"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('sysManage.sysManage105')"
        >
          <el-option
            v-for="item in modelTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage100') + ': '"> <!-- 期单位 -->
        <el-select v-model="listQuery.periodUnit" filterable clearable :placeholder="$t('sysManage.sysManage113')"> <!-- 请选择期单位 -->
          <el-option
            v-for="item in periodUnitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="reset">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button type="primary" @click="openAdd">{{ $t('sysManage.sysManage90') }}</el-button> <!-- 添加产品 -->
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
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="100px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <!-- isUse 有借款则不能删除 -->
          <!-- <el-button :disabled="!row.isUse" size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} 删除
          </el-button> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage91')" prop="productName" align="center" min-width="90px" /> <!-- 产品名称 -->
      <el-table-column :label="$t('loanMarket.loanMarket1')" prop="marketName" align="center" min-width="70px" /> <!-- 市场名称 -->
      <el-table-column :label="$t('sysManage.sysManage92')" prop="modelType" align="center" min-width="90px"> <!-- 模型分类型 -->
        <template slot-scope="{ row }">
          {{ row.modelType | modelTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage101')" prop="periodCount" align="center" min-width="60px" /> <!-- 期数 -->
      <el-table-column :label="$t('sysManage.sysManage100')" prop="periodUnit" align="center" min-width="70px"> <!-- 期单位 -->
        <template slot-scope="{ row }">
          {{ row.periodUnit | periodUnitFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage102')" prop="repayTimes" align="center" min-width="70px"> <!-- 还款时间 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.repayTimes"
            placement="left-start"
            :title="$t('sysManage.sysManage102') + ':'"
            width="100"
            trigger="click"
            :visible-arrow="false"
          >
            <div v-for="(item, i) in row.repayTimes" :key="item">
              {{ (i+1) + $t('sysManage.sysManage117') + ': ' + item }}
              {{ row.periodUnit | periodUnitFilter }}
            </div> <!-- 期 -->
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage93')" prop="loanStartAmount" align="center" min-width="90px"> <!-- 最小贷款金额 -->
        <template slot="header">
          <span>{{ $t('sysManage.sysManage93') + '(' }}</span>
          <span style="color: red;"> MXN </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage94')" prop="loanEndAmount" align="center" min-width="90px"> <!-- 最大贷款金额 -->
        <template slot="header">
          <span>{{ $t('sysManage.sysManage94') + '(' }}</span>
          <span style="color: red;"> MXN </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage95')" prop="loanAmountStep" align="center" min-width="100px"> <!-- 贷款金额步进值 -->
        <template slot="header">
          <span>{{ $t('sysManage.sysManage95') + '(' }}</span>
          <span style="color: red;"> MXN </span>
          <span>)</span>
        </template>
      </el-table-column>
      <el-table-column prop="deductedServiceRate" :label="$t('sysManage.sysManage96')" align="center" min-width="110px" /> <!-- 扣除手续费率 -->
      <el-table-column prop="deductedTaxRate" :label="$t('sysManage.sysManage97')" align="center" min-width="100px" /> <!-- 扣除税费率 -->
      <el-table-column prop="normalInterestRate" :label="$t('sysManage.sysManage98')" align="center" min-width="100px" /> <!-- 正常还款利率 -->
      <el-table-column prop="overdueInterestRate" :label="$t('sysManage.sysManage99')" align="center" min-width="80px" /> <!-- 逾期利率 -->
      <el-table-column :label="$t('loanMarket.loanMarket26')" prop="upTime" align="center" min-width="150px"> <!-- 上架时间 -->
        <template slot-scope="{ row }">
          {{ row.upTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket27')" prop="downTime" align="center" min-width="150px"> <!-- 下架时间 -->
        <template slot-scope="{ row }">
          {{ row.downTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="productRemark" align="center" min-width="70px"> <!-- 备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.productRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.productRemark"
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
      @pagination="getTableList"
    />

    <add-product-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-product-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getProductList, delProduct } from '@/api/loanSupermarket'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addProductDrawer from './components/productManagement/addProductDrawer'
import updateProductDrawer from './components/productManagement/updateProductDrawer'
import { mapState } from 'vuex'

export default {
  name: 'ProductManagement',
  components: {
    Pagination,
    addProductDrawer,
    updateProductDrawer
  },
  data() {
    return {
      // 搜索
      // 登录信息
      listLoading: false,
      tableList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      // 添加产品
      openAddDrawer: false,
      // 修改产品
      openUpdateDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      modelTypeOptions: state => state.options.modelTypeOptions,
      periodUnitOptions: state => state.options.periodUnitOptions
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
    // 获取产品
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await getProductList(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.tableList.forEach(item => {
        item.repayTimes = JSON.parse(item.repayTimes) || []
      })
      this.total = res.data.total

      if (this.listQuery.page > 1 && res.data.total !== 0 && res.data.list.length <= 0) {
        this.listQuery.page = 1
        this.getTableList()
      }
    },
    // 重置
    reset() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 控制添加用户弹框
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 控制修改用户弹框
    openUpdate(row, isResetPwd, userType) {
      this.openUpdateDrawer = true
      this.currentRow = row
      // 是否是重置密码 true 是 false 否
      this.currentRow.isResetPwd = isResetPwd
      // 判断账号类型 10 管理账号 20 商户账号
      this.currentRow.userType = userType
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 删除用户
    del(row) {
      this.$confirm(this.$t('sysManage.sysManage40'), this.$t('sysManage.sysManage41'), { /* 此操作将删除该用户, 是否继续? 删除用户 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await delProduct({ id: row.id })
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
