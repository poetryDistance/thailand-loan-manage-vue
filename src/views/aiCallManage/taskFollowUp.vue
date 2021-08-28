<template>
  <div class="main-box">
    <!-- 语音管理 -- 任务跟进 -->
    <el-button :disabled="mobileNumberList === ''" :loading="btnLoading" type="primary" size="mini" @click="groupCallPlanIVR">{{ $t('risk.risk38') }}</el-button> <!-- 拨打 -->
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column :label="$t('risk.risk38')" align="center" align="center" min-width="90px"> 拨打
        <template slot-scope="{ row }">
          <el-button :loading="btnLoading" type="primary" size="mini" @click="groupCallPlanIVR(row)">{{ $t('risk.risk38') }}</el-button> 拨打
        </template>
      </el-table-column> -->
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column :label="$t('common.common13')" align="center" min-width="90">    <!-- 姓名 -->
        <template slot-scope="{ row }">
          {{ row.relation === '0' ? row.customerName : row.relationName }}
        </template>
      </el-table-column>
      <el-table-column prop="relation" :label="$t('collect.collect53')" align="center" min-width="120">    <!-- 联系人与债主的关系 -->
        <template slot-scope="{ row }">
          {{ row.relation | relationFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('common.common28')" align="center" min-width="120" />    <!-- 手机号 -->
      <!-- <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="90px"> 备注
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
      <el-table-column prop="callStatsCount" :label="$t('risk.risk37')" align="center" min-width="90" />    <!-- 呼叫次数 -->
    </el-table>
  </div>
</template>

<script>
import { getAiCallLogCount, groupCallPlanIVR } from '@/api/aiCallManage'

export default {
  name: 'TaskFollowUp',
  data() {
    return {
      // 搜索
      btnLoading: false,

      // 列表
      listLoading: false,
      tableList: [],

      mobileNumberList: ''
    }
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 查询获取订单信息
    async getTableList() {
      this.listLoading = true
      this.btnLoading = true
      const res = await getAiCallLogCount({ borrowId: this.$route.query.borrowId, customerId: this.$route.query.customerId })
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== 0) return this.$message.error(res.message || 'Error')
      this.tableList = res.data
    },

    // 选择
    handleSelectionChange(val) {
      this.mobileNumberList = ''
      val.forEach(item => {
        if (item.mobileNumber) {
          this.mobileNumberList = item.mobileNumber + ',' + this.mobileNumberList
        }
      })
      this.currentRow = val[0]
    },
    // 拨打
    async groupCallPlanIVR() {
      this.listLoading = true
      this.btnLoading = true
      const tmp = {
        borrowId: this.currentRow.borrowId || '',
        borrowPeriodId: this.currentRow.borrowPeriodId || '',
        businessSoundId: '605440764b87a3001139de39',
        callType: 10,
        collectionLevel: this.$route.query.collectionLevel || '',
        collectionOrderId: this.$route.query.collectionOrderId || '',
        collectionUserId: this.$route.query.collectionUserId || '',
        customerId: this.currentRow.customerId || '',
        mobileNumber: this.mobileNumberList || '',
        planName: 'Recordatorio tardío'
      }
      const res = await groupCallPlanIVR(tmp)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== 0 && !res.data) return this.$message.error(res.message || 'Error')
      this.$message.success(this.$t('risk.risk39')) /* 拨打成功 */
      this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
