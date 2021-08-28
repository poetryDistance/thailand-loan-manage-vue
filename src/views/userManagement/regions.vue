<template>
  <div class="main-box">
    <!-- 用户管理 -- 区域列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('borrow.borrow13') + ': '"> <!-- 黑名单 -->
        <el-select
          v-model="listQuery.blackRegion"
          filterable
          clearable
          :placeholder="$t('risk.risk74')"
        > <!-- 请选择是否黑名单区域 -->
          <el-option
            v-for="item in blackCustomerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
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
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('risk.risk68')" prop="regionName" align="center" min-width="180px" /> <!-- 地区 -->
      <el-table-column :label="$t('risk.risk69')" prop="blackRegion" align="center" min-width="180px"> <!-- 是否黑名单区域 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.blackRegion"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
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
      @pagination="getTableList"
    />
  </div>
</template>

<script>
import { getRegions, regionsBlackControl } from '@/api/userManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'Regions',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        blackRegion: '',
        page: 1,
        size: 10
      },
      total: 0,

      // 列表
      listLoading: false,
      tableList: []
    }
  },

  computed: {
    ...mapState({
      blackCustomerOptions: state => state.options.blackCustomerOptions
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
        if (this.listQuery[k] || this.listQuery[k] === 0 || this.listQuery[k] === false) {
          tmp[k] = this.listQuery[k]
        }
      }
      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getRegions(tmp)
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
        const res = await regionsBlackControl({ blackRegion: e, id: row.id })
        if (res.code !== '0' || !res.data) {
          this.getTableList()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getTableList()
      }).catch(() => {
        row.blackRegion = !e
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
