div<template>
  <!-- 系统管理 -- 系统设置 -->
  <div class="main-box">
    <el-button size="mini" type="primary" @click="openAdd">{{ $t('sysManage.sysManage126') }}</el-button> <!-- 添加设置 -->
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
          <el-button :disabled="row.id === 1" size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
          <el-button size="mini" type="text" @click="del(row)">
            {{ $t('sysManage.sysManage29') }} <!-- 删除 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <el-table-column :label="$t('loanMarket.loanMarket1')" prop="marketName" align="center" min-width="120px" /> <!-- 市场名称 -->
      <el-table-column :label="$t('sysManage.sysManage127')" prop="paramKey" align="center" min-width="100px" /> <!-- 键 -->
      <el-table-column :label="$t('sysManage.sysManage129')" prop="paramValue" align="center" min-width="100px" /> <!-- 值 -->
      <el-table-column :label="$t('collect.collect149')" prop="updateTime" align="center" min-width="150px"> <!-- 更新时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="100px" /> <!-- 备注 -->

      <!-- <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="110px"> 备注
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
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> 查看
          </el-popover>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getSysParam"
    />

    <add-drawer v-if="openAddDrawer" @closeAdd="closeAdd" />
    <update-drawer v-if="openUpdateDrawer" :current-row="currentRow" @closeUpdate="closeUpdate" />
  </div>
</template>

<script>
import { getSysParam, delSysParam } from '@/api/sysManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addDrawer from './components/systemSettings/addDrawer'
import updateDrawer from './components/systemSettings/updateDrawer'

export default {
  name: 'SystemSettings',
  components: {
    Pagination,
    addDrawer,
    updateDrawer
  },
  data() {
    return {
      // 获取
      listLoading: true,
      tableList: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },

      // 添加
      openAddDrawer: false,

      // 修改
      openUpdateDrawer: false,
      currentRow: {}
    }
  },

  mounted() {
    this.getSysParam()
  },

  methods: {
    // 获取列表
    async getSysParam() {
      this.listLoading = true
      const res = await getSysParam(this.listQuery)
      this.listLoading = false
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.total = res.data.total
    },

    // 添加
    openAdd() {
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false

      if (item) {
        this.getSysParam()
      }
    },

    // 修改
    openUpdate(row) {
      this.openUpdateDrawer = true
      this.currentRow = row
    },
    closeUpdate(item) {
      this.openUpdateDrawer = false

      if (item) {
        this.getSysParam()
      }
    },

    // 删除
    del(row) {
      this.$confirm(this.$t('sysManage.sysManage132'), this.$t('sysManage.sysManage133'), { /* 此操作将删除该设置, 是否继续?  删除设置 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        const res = await delSysParam({ id: row.id })
        if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage42') /* 删除成功 */
        })
        this.getSysParam()
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
