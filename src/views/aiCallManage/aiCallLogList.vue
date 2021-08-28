<template>
  <div class="main-box">
    <!-- 语音管理 -- 语音记录 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="borrowId" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowId" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item :label="$t('risk.risk22') + ':'">   <!-- 呼叫日期 -->
        <el-date-picker
          v-model="listQuery.time"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>
      <el-form-item :label="$t('collect.collect211') + ': '"> <!-- 是否接通 -->
        <el-select
          v-model="listQuery.status"
          filterable
          clearable
          :placeholder="$t('risk.risk20')"
        > <!-- 请选择外呼场景 -->
          <el-option
            v-for="item in connectStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('risk.risk14') + ': '"> <!-- 催收等级 -->
        <el-select
          v-model="listQuery.collectionLevel"
          filterable
          clearable
          :placeholder="$t('risk.risk21')"
        > <!-- 请选择催收等级 -->
          <el-option
            v-for="item in collectionLevelOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="mobileNumber" :label="$t('risk.risk24') + ':'"> <!-- 被叫号码 -->
        <el-input v-model="listQuery.mobileNumber" :placeholder="$t('risk.risk29')" style="width: 178px;" /> <!-- 请输入被叫号码 -->
      </el-form-item>
      <el-form-item :label="$t('risk.risk23') + ': '"> <!-- 服务商 -->
        <el-select
          v-model="listQuery.companyId"
          filterable
          clearable
          :placeholder="$t('risk.risk30')"
        > <!-- 请选择服务商 -->
          <el-option
            v-for="item in companyIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
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
      <el-table-column prop="borrowId" :label="$t('collect.collect2')" align="center" min-width="90" />    <!-- 订单编号 -->
      <el-table-column prop="callDate" :label="$t('risk.risk22')" align="center" min-width="90">    <!-- 呼叫日期 -->
        <template slot-scope="{ row }">
          {{ row.callDate | ArrayToDateFormat2 }}
        </template>
      </el-table-column>
      <el-table-column prop="companyId" :label="$t('risk.risk23')" align="center" min-width="90">    <!-- 服务商 -->
        <template slot-scope="{ row }">
          {{ row.companyId | companyIdFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('risk.risk24')" align="center" min-width="120" />    <!-- 被叫号码 -->
      <el-table-column prop="callStartTime" :label="$t('risk.risk25')" align="center" min-width="150">    <!-- 呼出开始时间 -->
        <template slot-scope="{ row }">
          {{ row.callStartTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="callEndTime" :label="$t('risk.risk26')" align="center" min-width="150">    <!-- 呼出结束时间 -->
        <template slot-scope="{ row }">
          {{ row.callEndTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="duration" :label="$t('risk.risk27')" align="center" min-width="90">    <!-- 通话时间(分) -->
        <template slot-scope="{ row }">
          {{ row.duration | durationFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('collect.collect211')" align="center" min-width="90">    <!-- 是否接通 -->
        <template slot-scope="{ row }">
          {{ row.status | connectStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="collectionLevel" :label="$t('risk.risk14')" align="center" min-width="90" />    <!-- 催收等级 -->
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
import { getFetchAiCallLogByPage } from '@/api/aiCallManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'AiCallLogList',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        borrowId: '',
        time: [],
        status: '',
        collectionLevel: '',
        mobileNumber: '',
        companyId: '',
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
      callStatsCountOptions: state => state.options.callStatsCountOptions,
      collectionLevelOptions: state => state.options.collectionLevelOptions
    }),
    connectStatusOptions() {
      return [
        { value: 0, label: this.$t('risk.risk31') }, /* 呼叫执行中 */
        { value: 10, label: this.$t('risk.risk32') }, /* 未接通 */
        { value: 20, label: this.$t('risk.risk33') }, /* 接通 */
        { value: 30, label: this.$t('risk.risk34') } /* 异常状态 */
      ]
    },
    companyIdOptions() {
      return [
        { value: 10, label: 'ONCE' }
      ]
    }
  },

  mounted() {
    this.listQuery.borrowId = this.$route.params.borrowId || ''
    this.getTableList()
  },

  methods: {
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] || this.listQuery[k] === 0) {
          if (k === 'time' && this.listQuery['time'].length > 0) {
            tmp.callDateStart = this.listQuery[k][0]
            tmp.callDateEnd = this.listQuery[k][1] + 86399999
          } else if (k !== 'time') {
            tmp[k] = this.listQuery[k]
          }
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

      const res = await getFetchAiCallLogByPage(tmp)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== 0) return this.$message.error(res.message || 'Error')
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
        borrowId: '',
        time: [],
        status: '',
        collectionLevel: '',
        mobileNumber: '',
        companyId: '',
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 播放记录
    playbackRecord(row) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
