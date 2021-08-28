div<template>
  <!-- 系统管理 -- app升级设置 -->
  <div class="main-box haibei-box">
    <!-- :max-height="$store.state.settings.tableHeight" -->
    <el-table
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="90px" /> <!-- 编号 -->
      <el-table-column :label="$t('sysManage.sysManage156')" align="center" min-width="100px"> <!-- 是否启用 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.open"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="enableChange(row, $event, 2)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage151')" prop="code" align="center" min-width="100px" /> <!-- 风控code -->
      <el-table-column :label="$t('sysManage.sysManage153')" prop="compareType" align="center" min-width="100px" /> <!-- 对比类型 -->
      <el-table-column :label="$t('sysManage.sysManage154')" prop="thresholdValue" align="center" min-width="160px"> <!-- 阈值 -->
        <template slot-scope="{ row }">
          <div v-if="parseInt(row.variableType) === 1">
            <el-input
              v-model="row.thresholdValue"
              type="text"
              style="width: 130px;"
              size="mini"
            />
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 10px;"
              @click="enableChange(row, $event, 3)"
            >
              {{ $t('sysManage.sysManage157') }}
            </el-button>	<!-- 保存 -->
          </div>
          <div v-else>
            <el-switch
              v-model="row.thresholdValue"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="enableChange(row, $event, 4)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage155')" prop="variableType" align="center" min-width="100px"> <!-- 变量类型 -->
        <template slot-scope="{ row }">
          {{ parseInt(row.variableType) === 1 ? $t('sysManage.sysManage158') : $t('sysManage.sysManage159') }} <!-- 数值 bool值 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage152')" prop="addToBlackWhenHit" align="center" min-width="100px"> <!-- 命中后是否加入黑名单 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.addToBlackWhenHit"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="enableChange(row, $event, 1)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="160px" /> <!-- 备注 -->
    </el-table>
  </div>
</template>

<script>
import { getHaibeiRiskConfig, haibeiRiskConfigUpdate } from '@/api/sysManage'

export default {
  name: 'SystemSettings',
  components: {},
  data() {
    return {
      // 获取
      listLoading: true,
      tableList: [],
      total: 0,
      listQuery: {},

      // 添加
      openAddDrawer: false,

      // 修改
      openUpdateDrawer: false,
      currentRow: {}
    }
  },

  mounted() {
    this.fetchAppUpdateSetting()
  },

  methods: {
    // 获取列表
    async fetchAppUpdateSetting() {
      this.listLoading = true
      const res = await getHaibeiRiskConfig(this.listQuery)
      this.listLoading = false
      if (parseInt(res.code) !== 0) return this.$message.error(res.message || 'Error')
      this.tableList = res.data
    },

    // 是否启用
    async enableChange(row, e, type) {
      if (type === 1 || type === 2 || type === 4) {
        const tips = e ? this.$t('sysManage.sysManage160') : this.$t('sysManage.sysManage161') /* 此操作将开启, 是否继续? 此操作将关闭, 是否继续? */
        const title = e ? this.$t('common.common15') : this.$t('common.common16') /* 开启 关闭 */
        // 开启成功  关闭成功
        const msg = e ? this.$t('common.common18') : this.$t('common.common19')

        this.$confirm(tips, title, {
          confirmButtonText: this.$t('common.common10'), /* 确定 */
          cancelButtonText: this.$t('common.common11'), /* 取消 */
          type: 'warning'
        }).then(async() => {
          const res = await haibeiRiskConfigUpdate({
            id: row.id,
            open: row.open,
            addToBlackWhenHit: row.addToBlackWhenHit,
            thresholdValue: row.thresholdValue
          })
          if (parseInt(res.code) !== 0) {
            this.fetchAppUpdateSetting()
            return this.$message.error(res.message || 'Error')
          }
          this.$message({
            type: 'success',
            message: msg
          })
          this.fetchAppUpdateSetting()
        }).catch(() => {
          if (type === 1) {
            row.addToBlackWhenHit = !e
          } else if (type === 2) {
            row.open = !e
          } else if (type === 4) {
            row.thresholdValue = e ? 0 : 1
          }
          this.$message({
            type: 'info',
            message: this.$t('common.common17') /* 已取消 */
          })
        })
      } else if (type === 3) {
        const res = await haibeiRiskConfigUpdate({ id: row.id, thresholdValue: row.thresholdValue })
        if (parseInt(res.code) !== 0) {
          this.fetchAppUpdateSetting()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: this.$t('sysManage.sysManage162') /* 保存成功 */
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.haibei-box {
  min-height: calc(100vh - 120px);
  background-color: #fff;
}
</style>
