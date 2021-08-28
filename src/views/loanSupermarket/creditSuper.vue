<template>
  <div class="main-box">
    <!-- 系统管理 -- 市场列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('loanMarket.loanMarket1') + ': '"> <!-- 市场名称 -->
        <el-input v-model="listQuery.marketName" :placeholder="$t('loanMarket.loanMarket2')" style="width: 178px;" /> <!-- 请输入市场名称 -->
      </el-form-item>
      <el-form-item :label="$t('loanMarket.loanMarket4') + ': '"> <!-- 市场电话 -->
        <el-input v-model="listQuery.marketPhone" :placeholder="$t('loanMarket.loanMarket5')" style="width: 178px;" /> <!-- 请输入市场电话 -->
      </el-form-item>
      <el-form-item :label="$t('loanMarket.loanMarket6') + ':'"> <!-- 市场状态 -->
        <!-- 请选择市场状态 -->
        <el-select
          v-model="listQuery.marketStatus"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('loanMarket.loanMarket7')"
        >
          <el-option
            v-for="item in marketStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('loanMarket.loanMarket8') + ': '"> <!-- 市场类型 -->
        <el-select v-model="listQuery.marketType" filterable clearable :placeholder="$t('loanMarket.loanMarket9')"> <!-- 请选择市场类型 -->
          <el-option
            v-for="item in marketTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button @click="reset">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button type="primary" @click="openAdd">{{ $t('loanMarket.loanMarket13') }}</el-button> <!-- 添加市场 -->
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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="120px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="updateMarketStatus(row)">
            {{ row.marketStatus === 10 ? $t('sysManage.sysManage27') : $t('sysManage.sysManage28') }} <!-- 禁用 启用 -->
          </el-button>
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('loanMarket.loanMarket1')" prop="marketName" align="center" min-width="80px" /> <!-- 市场名称 -->
      <el-table-column :label="$t('loanMarket.loanMarket15')" prop="marketPhone" align="center" min-width="90px" /> <!-- 市场电话 -->
      <el-table-column :label="$t('loanMarket.loanMarket16')" prop="contactsName" align="center" min-width="90px" /> <!-- 市场联系人名称 -->
      <el-table-column :label="$t('loanMarket.loanMarket17')" prop="contactsMobile" align="center" min-width="90px" /> <!-- 市场联系人手机 -->
      <el-table-column :label="$t('loanMarket.loanMarket8')" prop="marketType" align="center" min-width="90px"> <!-- 市场类型 -->
        <template slot-scope="{ row }">
          {{ row.marketType | marketTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket18')" prop="givenId" align="center" min-width="90px" /> <!-- 市场分配给我方的唯一ID -->
      <el-table-column :label="$t('loanMarket.loanMarket20')" prop="marketAddress" align="center" min-width="90px" /> <!-- 市场地址 -->
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect149')" prop="updateTime" align="center" min-width="150px"> <!-- 更新时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket19')" prop="whitelistIps" align="center" min-width="80px">  <!-- 白名单IP -->
        <template slot-scope="{ row }">
          <!-- 白名单IP -->
          <el-popover
            v-if="row.whitelistIps"
            placement="left-start"
            :title="$t('loanMarket.loanMarket19') + ':'"
            width="160"
            trigger="click"
            :visible-arrow="false"
          >
            <div v-for="(item, i) in row.whitelistIps" :key="i" style="padding-left: 10px;">
              {{ item }}
            </div>
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="marketRemark" align="center" min-width="70px"> <!-- 备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.marketRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.marketRemark"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket6')" prop="marketStatus" align="center" min-width="80px"> <!-- 市场状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.marketStatus === 10" size="small" type="success">{{ $t('sysManage.sysManage24') }}</el-tag> <!-- 已启用 -->
          <el-tag v-else size="small" type="danger">{{ $t('sysManage.sysManage25') }}</el-tag> <!-- 已禁用 -->
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

    <add-market-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-market-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getMarketList, updateMarket } from '@/api/loanSupermarket'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addMarketDrawer from './components/creditSuper/addMarketDrawer'
import updateMarketDrawer from './components/creditSuper/updateMarketDrawer'
import { mapState } from 'vuex'

export default {
  name: 'CreditSuper',
  components: {
    Pagination,
    addMarketDrawer,
    updateMarketDrawer
  },
  data() {
    return {
      // 搜索
      // 登录信息
      listLoading: false,
      tableList: [],
      listQuery: {
        marketType: '',
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
      marketTypeOptions: state => state.options.marketTypeOptions
    }),
    marketStatusOptions() {
      return [
        { value: 10, label: this.$t('loanMarket.loanMarket10') }, /* 正常 */
        { value: 20, label: this.$t('loanMarket.loanMarket11') } /* 注销 */
      ]
    }
  },

  mounted() {
    if (this.$store.getters.currentMarketId) {
      this.listQuery.marketType = this.$store.getters.currentMarketId * 1
    }
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
    // 获取市场
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      const tmp = this.handleListQuery()

      const res = await getMarketList(tmp)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.tableList.forEach(item => {
        if (item.whitelistIps) item.whitelistIps = item.whitelistIps.split(';')
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

    // 控制添加弹框
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getTableList()
      }
    },
    // 控制修改弹框
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
    // 禁用启用
    async updateMarketStatus(row) {
      const tips = row.valid ? this.$t('sysManage.sysManage31') : this.$t('sysManage.sysManage32') /* 此操作将禁用该用户, 是否继续? 此操作将启用该用户, 是否继续? */
      const title = row.valid ? this.$t('sysManage.sysManage33') : this.$t('sysManage.sysManage34') /* 禁用用户 启用用户 */
      const msg = row.valid ? this.$t('sysManage.sysManage37') : this.$t('sysManage.sysManage38') /* 禁用成功 启用成功 */
      this.$confirm(tips, title, {
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const tmp = {
          marketStatus: row.marketStatus === 10 ? 20 : 10,
          id: row.id
        }
        const res = await updateMarket(tmp)
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: msg
        })
        this.getTableList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('sysManage.sysManage39') /* 已取消禁用 */
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
        const res = await updateMarket({ id: row.id, deleted: true })
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
