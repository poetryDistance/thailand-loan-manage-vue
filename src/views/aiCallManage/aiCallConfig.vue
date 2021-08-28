<template>
  <div class="main-box">
    <!-- 语音管理 -- 策略配置 -->
    <el-button size="mini" type="primary" @click="openAddDrawer">{{ $t('risk.risk35') }}</el-button> <!-- 添加策略 -->

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
      <el-table-column prop="itemType" :label="$t('sysManage.sysManage23')" align="center" min-width="90">    <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="openUpdate(row)">
            {{ $t('sysManage.sysManage26') }} <!-- 修改 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="companyId" :label="$t('risk.risk23')" align="center" min-width="90">    <!-- 服务商 -->
        <template slot-scope="{ row }">
          {{ row.companyId | companyIdFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="level" :label="$t('risk.risk14')" align="center" min-width="90" />    <!-- 催收等级 -->
      <el-table-column prop="daysOverdueStart" :label="$t('risk.risk70')" align="center" min-width="90" />    <!-- 逾期开始天数 -->
      <el-table-column prop="daysOverdueEnd" :label="$t('risk.risk71')" align="center" min-width="90" />    <!-- 逾期结束天数 -->
      <el-table-column :label="$t('risk.risk36')" align="center" min-width="90">    <!-- 拨打时间 -->
        <template slot-scope="{ row }">
          {{ row.callTimeStart + ' - ' + row.callTimeEnd }}
        </template>
      </el-table-column>
      <el-table-column prop="retryCount" :label="$t('risk.risk46')" align="center" min-width="90" />    <!-- 重试次数 -->
      <el-table-column prop="retryInterval" :label="$t('risk.risk73')" align="center" min-width="90" />    <!-- 重试间隔时间(小时) -->

      <el-table-column :label="$t('common.common14')" prop="status" align="center" min-width="90px"> <!-- 状态 -->
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="10"
            :inactive-value="0"
            @change="validChange(row, $event)"
          />
        </template>
      </el-table-column>
    </el-table>

    <add-config v-if="openAddConfigDrawer" @closeAddDrawer="closeAddDrawer" />
    <update-config v-if="openUpdateConfigDrawer" :current-row="currentRow" @closeUpdateDrawer="closeUpdateDrawer" />
  </div>
</template>

<script>
import { getAiCallConfig, updateAiCallConfig } from '@/api/aiCallManage'
import addConfig from './components/addConfig'
import updateConfig from './components/updateConfig'
import { mapState } from 'vuex'

export default {
  name: 'AiCallConfig',
  components: {
    addConfig,
    updateConfig
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        itemType: '',
        status: '',
        time: [],
        page: 1,
        size: 10
      },

      // 列表
      listLoading: false,
      tableList: [],

      // 添加
      openAddConfigDrawer: false,
      // 修改
      openUpdateConfigDrawer: false
    }
  },

  computed: {
    ...mapState({
      callStatsCountOptions: state => state.options.callStatsCountOptions,
      itemTypeOptions: state => state.options.itemTypeOptions
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 查询获取订单信息
    async getTableList() {
      this.listLoading = true
      this.btnLoading = true

      const res = await getAiCallConfig()
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== 0) return this.$message.error(res.message || 'Error')
      this.tableList = res.data
    },

    // 添加策略弹框
    openAddDrawer() {
      this.openAddConfigDrawer = true
    },
    closeAddDrawer(item) {
      this.openAddConfigDrawer = false
      if (item) {
        this.getTableList()
      }
    },

    // 修改
    openUpdate(row) {
      this.openUpdateConfigDrawer = true
      this.currentRow = row
    },
    closeUpdateDrawer(item) {
      this.openUpdateConfigDrawer = false

      if (item) {
        this.getTableList()
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
        const res = await updateAiCallConfig({ status: e, id: row.id, level: row.level })
        if (res.code !== 0 || !res.data) {
          this.getTableList()
          return this.$message.error(res.message || 'Error')
        }
        this.$message({
          type: 'success',
          message: msg
        })
        this.getTableList()
      }).catch(() => {
        row.status = e ? 0 : 10
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
