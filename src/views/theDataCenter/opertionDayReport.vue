<template>
  <div class="main-box">
    <!-- 运营管理 -- 运营日报 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item :label="$t('theData.theData37') + ':'">   <!-- 到期日 -->
        <el-date-picker
          v-model="listQuery.time"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :clearable="false"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>
      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <!-- <el-button icon="el-icon-folder" type="primary" @click="exportData">{{ $t('common.common110') }}</el-button> -->   <!-- 导出 -->
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
      <el-table-column prop="statDate" align="center" :label="$t('theData.theData37')" min-width="90">    <!-- 到期日 -->
        <template slot-scope="{ row }">
          {{ row.statDate | ArrayToDateFormat2 }}
        </template>
      </el-table-column>
      <el-table-column prop="overDate" align="center" :label="$t('theData.theData36')" min-width="90">    <!-- 放款日 -->
        <template slot-scope="{ row }">
          {{ row.overDate | ArrayToDateFormat2 }}
        </template>
      </el-table-column>
      <el-table-column prop="dueNeedRepayCount" align="center" :label="$t('theData.theData38')" min-width="60" />    <!-- 到期应还款数 -->
      <el-table-column prop="dueNeedRepayAmount" align="center" :label="$t('theData.theData57')" min-width="70" />    <!-- 到期应还款金额 -->
      <el-table-column prop="dueRepaymentCount" align="center" :label="$t('theData.theData58')" min-width="70" />    <!-- 到期已还笔数 -->
      <el-table-column prop="dueRepaymentAmount" align="center" :label="$t('theData.theData59')" min-width="70" />    <!-- 到期已还金额 -->
      <el-table-column :label="$t('theData.theData39')" align="center" min-width="100">    <!-- 到期 -->
        <el-table-column prop="dueNewCustomerCount" align="center" :label="$t('theData.theData40')" min-width="90" />    <!-- 到期新客数 -->
        <el-table-column prop="dueOldCustomerCount" align="center" :label="$t('theData.theData41')" min-width="90" />   <!-- 到期老客数 -->
        <el-table-column prop="dueNoRepayNewCustomerCount" align="center" :label="$t('theData.theData42')" min-width="110" />   <!-- 到期未还新客数 -->
        <el-table-column prop="dueNoRepayOldCustomerCount" align="center" :label="$t('theData.theData43')" min-width="110" />    <!-- 到期未还老客数 -->
      </el-table-column>
      <el-table-column :label="$t('theData.theData44')" align="center" min-width="100">    <!-- 首逾 -->
        <el-table-column prop="firstOverDueRataNew" align="center" :label="$t('theData.theData45')" min-width="90">    <!-- 首逾率(新客) -->
          <template slot-scope="{ row }">
            {{ row.firstOverDueRataNew + '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="firstOverDueRateOld" align="center" :label="$t('theData.theData46')" min-width="90">   <!-- 首逾率(老客) -->
          <template slot-scope="{ row }">
            {{ row.firstOverDueRateOld + '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="firstOverDueRateTotal" align="center" :label="$t('theData.theData47')" min-width="70">   <!-- 总首逾率 -->
          <template slot-scope="{ row }">
            {{ row.firstOverDueRateTotal + '%' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="$t('theData.theData48')" align="center" min-width="100">    <!-- 在逾 -->
        <el-table-column prop="overDueRepayCount" align="center" :label="$t('theData.theData49')" min-width="90" />    <!-- 逾期还款数 -->
        <el-table-column prop="overDueNewCustomerCount" align="center" :label="$t('theData.theData50')" min-width="90" />   <!-- 在逾新客数 -->
        <el-table-column prop="overDueOldCustomerCount" align="center" :label="$t('theData.theData51')" min-width="90" />   <!-- 在逾老客数 -->
        <el-table-column prop="overDueRateNew" align="center" :label="$t('theData.theData52')" min-width="90">    <!-- 新客在逾率 -->
          <template slot-scope="{ row }">
            {{ row.overDueRateNew + '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="overDueRateOld" align="center" :label="$t('theData.theData53')" min-width="90">   <!-- 老客在逾率 -->
          <template slot-scope="{ row }">
            {{ row.overDueRateOld + '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="overDueRateTotal" align="center" :label="$t('theData.theData54')" min-width="70">   <!-- 总在逾率 -->
          <template slot-scope="{ row }">
            {{ row.overDueRateTotal + '%' }}
          </template>
        </el-table-column>
        <el-table-column prop="collectionRate" align="center" :label="$t('theData.theData55')" min-width="60">   <!-- 催回率 -->
          <template slot-scope="{ row }">
            {{ row.collectionRate + '%' }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page-sizes="[10, 20]"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getTableList"
    />
  </div>
</template>

<script>
import { getOperationDayReport, exportOperationDayReport } from '@/api/theDataCenter'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'OpertionDayReport',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        page: 1,
        size: 10,
        time: []
      },

      // 列表
      listLoading: false,
      tableList: [],
      total: 0,

      // 费用变更弹框
      openBillDrawer: false,
      currentRow: {}
    }
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 获取当前月
    getCurrentMon() {
      const time = new Date() // 当前月 要计算其他时间点自己传入即可
      let year = time.getFullYear()
      let month = parseInt(time.getMonth() + 1)

      // 开始时间 时间戳
      const start = new Date(year + '-' + month + '-01 00:00:00').getTime()
      // 结束时间 时间戳
      if (month === 12) {
        // 十二月的时候进位，这里直接用加减法算了
        // 也可以用 time.setMonth( month + 1 )去计算并获取结束时间的月份和年份
        month = 0
        year += 1
      }
      const end = new Date(year + '-' + (month + 1) + '-01 00:00:00').getTime()
      return [start, end - 86400000]
    },
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      if (!this.listQuery['time'] || this.listQuery['time'].length <= 0) {
        this.listQuery['time'] = this.getCurrentMon()
      }
      for (const k in this.listQuery) {
        if (this.listQuery[k]) {
          if (k === 'time') {
            tmp.startDate = this.listQuery['time'][0]
            tmp.endDate = this.listQuery['time'][1] + 86399999
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

      if (this.listQuery['time'].length > 0 && this.listQuery['time'][1] - this.listQuery['time'][0] > 2678400000) {
        return this.$message.error(this.$t('theData.theData56')) /* 最多查询一个月的报表 */
      }
      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getOperationDayReport(tmp)
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
        size: 10,
        time: []
      }
      this.getTableList()
    },

    // 导出
    async exportData() {
      const tmp = this.handleListQuery()
      delete tmp.page
      delete tmp.size

      const now = new Date()
      const nowStr = now.toLocaleDateString()

      const res = await exportOperationDayReport(tmp)

      const BLOB = res // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
      const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
      fileReader.readAsDataURL(BLOB)
      // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
      fileReader.onload = (event) => {
        // 处理load事件。该事件在读取操作完成时触发
        // 新建个下载的a标签，完成后移除。
        const a = document.createElement('a')
        a.download = `operation_daily_${nowStr}.xlsx`
        a.href = event.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
