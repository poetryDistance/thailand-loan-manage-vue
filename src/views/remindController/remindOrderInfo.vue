<template>
  <div class="main-box">
    <!-- 预提醒管理 -- 预提醒订单列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="userName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.userName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.mobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="borrowId" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowId" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item prop="flag" :label="$t('collect.collect15') + ': '"> <!-- 标签 -->
        <el-select
          v-model="listQuery.flag"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('collect.collect68')"
        > <!-- 请选择标签 -->
          <el-option
            v-for="item in flagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="distanceRepayEndDay" :label="$t('loanMarket.loanMarket71') + ':'"> <!-- 到期天数 -->
        <el-input v-model="listQuery.distanceRepayEndDay" :placeholder="$t('loanMarket.loanMarket72')" style="width: 178px;" /> <!-- 请输入到期天数 -->
      </el-form-item>
      <el-form-item prop="repayWish" :label="$t('collect.collect65') + ': '"> <!-- 还款意愿 -->
        <el-select
          v-model="listQuery.repayWish"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('collect.collect73')"
        > <!-- 请选择还款意愿 -->
          <el-option
            v-for="item in repayWishOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="permission.isAdmin" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
        <el-select
          v-model="listQuery.collectionCompanyId"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage55')"
          @change="companyChange"
        > <!-- 请选择公司名 -->
          <el-option
            v-for="item in companyNameRemindOptions"
            :key="item.id"
            :label="item.companyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="permission.isAdmin || permission.isCollectionLead" :label="$t('collector.collector11') + ': '"> <!-- 催收组 -->
        <el-select
          v-model="listQuery.collectionGroupId"
          filterable
          clearable
          :placeholder="$t('collector.collector35')"
          @change="groupChange"
        > <!-- 请选择催收组 -->
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="permission.isAdmin || permission.isCollectionLead || permission.isGroupLead"
        prop="id"
        :label="$t('collect.collect16') + ': '"
      > <!-- 人员 -->
        <el-select
          v-model="listQuery.id"
          filterable
          clearable
          :placeholder="$t('collect.collect17')"
        > <!-- 请选择人员 -->
          <el-option
            v-for="item in teamMembersOptions"
            :key="item.id"
            :label="item.loginName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" :label="$t('borrow.borrow3') + ': '"> <!-- 订单状态 -->
        <el-select
          v-model="listQuery.status"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('borrow.borrow4')"
        > <!-- 请选择订单状态 -->
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('sysManage.sysManage102') + ':'">   <!-- 还款时间 -->
        <el-date-picker
          v-model="listQuery.lastRepayTime"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>
      <el-form-item :label="$t('loanMarket.loanMarket32') + ':'">   <!-- 最近一次跟进时间 -->
        <el-date-picker
          v-model="listQuery.collectionTime"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>
      <el-form-item :label="$t('collect.collect14') + ':'">   <!-- 应还款时间 -->
        <el-date-picker
          v-model="listQuery.repayTime"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  <!-- 开始日期  结束日期 -->
      </el-form-item>

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button
          v-if="permission.isAdmin || permission.isCollectionLead"
          :disabled="!isBatchBtn"
          :loading="btnLoading"
          type="primary"
          @click="openBatch"
        >{{ $t('collect.collect18') }}</el-button> <!-- 批量派单 -->
        <el-button
          v-if="permission.isAdmin"
          icon="el-icon-folder"
          type="primary"
          @click="exportData"
        >{{ $t('common.common110') }}</el-button>   <!-- 导出 -->
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
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
      <el-table-column
        v-if="permission.isAdmin || permission.isCollectionLead"
        key="selection"
        type="selection"
        align="center"
        width="55"
        :selectable="checkboxInit"
      />
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="140px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('common.common32') }} <!-- 查看详情 -->
          </el-button>
          <el-button v-if="!permission.isAdmin && row.periodStatus === 50" size="mini" type="text" @click="openRecord(row)">
            {{ $t('loanMarket.loanMarket73') }} <!-- 新增提醒 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect2')" prop="borrowId" align="center" min-width="70px" /> <!-- 订单编号 -->
      <el-table-column :label="$t('collect.collect3')" prop="customerName" align="center" min-width="120px" /> <!-- 用户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('collect.collect7')" prop="principalAmount" align="center" min-width="80px" /> <!-- 借款金额 -->
      <el-table-column :label="$t('loanMarket.loanMarket71')" sortable prop="distanceRepayEndDay" align="center" min-width="100px" /> <!-- 到期天数 -->
      <el-table-column :label="$t('collect.collect95')" prop="principal" align="center" min-width="80px" /> <!-- 待还金额 -->
      <el-table-column :label="$t('borrow.borrow3')" prop="periodStatus" align="center" min-width="80px"> <!-- 订单状态 -->
        <template slot-scope="{ row }">
          {{ row.periodStatus | borrowStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect15')" prop="flag" align="center" min-width="90px"> <!-- 标签 -->
        <template slot-scope="{ row }">
          {{ row.flag | flagFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect65')" prop="lastRepayWish" align="center" min-width="80px"> <!-- 还款意愿 -->
        <template slot-scope="{ row }">
          {{ row.lastRepayWish | repayWishFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect14')" prop="repayStart" align="center" min-width="150px" /> <!-- 应还款时间 -->
      <el-table-column :label="$t('collect.collect13')" prop="loginName" align="center" min-width="90px" /> <!-- 催收员 -->
      <el-table-column :label="$t('sysManage.sysManage102')" prop="lastRepayTime" align="center" min-width="150px"> <!-- 还款时间 -->
        <template slot-scope="{ row }">
          {{ row.lastRepayTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket32')" prop="lastCollectionTime" align="center" min-width="150px"> <!-- 最近一次跟进时间 -->
        <template slot-scope="{ row }">
          {{ row.lastCollectionTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page-sizes="[10, 50, 100, 300, 500, 1000]"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getTableList"
    />

    <batch-collection v-if="openBatchDrawer" :is-remind="true" :batch-team-id="batchTeamId" :current-row="currentRow" @closeBatch="closeBatch" />
    <add-push-down v-if="openRecordDrawer" :is-remind="true" :current-row="recordRow" @closeAdd="closeRecord" />
  </div>
</template>

<script>
import { getCompanyGroup, getGroupCollectionUser } from '@/api/collectionAgentManagement'
import { remindOrderInfo, exportRemindOrderInfo } from '@/api/remindController'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'
import batchCollection from '@/views/collectionManagement/components/collectionOrder/batchCollection'
import addPushDown from '@/views/collectionManagement/components/userDetails/addPushDown'

export default {
  name: 'RemindOrderInfo',
  components: {
    Pagination,
    batchCollection,
    addPushDown
  },
  data() {
    return {
      scrollTop: null,
      // 搜索
      btnLoading: false,
      groupOptions: [],
      teamMembersOptions: [],
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
        size: 100
      },
      total: 0,
      // 是否展示批量派单
      batchTeamId: null,
      isBatchBtn: false,

      // 批量派单
      openBatchDrawer: false,
      currentRow: [],

      // 新增提醒
      openRecordDrawer: false,
      recordRow: {}
    }
  },

  computed: {
    ...mapState({
      companyNameRemindOptions: state => state.options.companyNameRemindOptions,
      permission: state => state.permission.permission,
      ids: state => state.permission.ids,
      flagOptions: state => state.options.flagOptions
    }),
    repayWishOptions() {
      return [
        { value: 10, label: this.$t('financial.financial23') }, /* 有能力有意愿还款 */
        { value: 20, label: this.$t('financial.financial24') }, /* 有能力无意愿还款 */
        { value: 30, label: this.$t('financial.financial25') }, /* 无能力有意愿还款 */
        { value: 40, label: this.$t('financial.financial26') }, /* 无意愿无能力还款 */
        { value: 50, label: this.$t('financial.financial22') } /* 其他 */
      ]
    },
    statusOptions() {
      return [
        { value: 50, label: this.$t('collect.collect30') }, /* 到期未还款(借贷中) */
        { value: 1000, label: this.$t('collect.collect33') } /* 到期已还款(正常完成) */
      ]
    }
  },

  mounted() {
    if (this.permission.isCollectionLead) {
      this.companyChange(this.ids.collectionCompanyId)
    } else if (this.permission.isGroupLead) {
      this.companyChange(this.ids.collectionCompanyId)
      this.groupChange(this.ids.collectionGroupId)
    }
    this.getTableList()
    // 监听滚动条的位置
    this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {
      const height = res.target
      this.scrollTop = height.scrollTop
    }, false)
  },

  activated() {
    this.saveScroll()
  },
  beforeDestroy() {
    this.$refs.table.bodyWrapper.removeEventListener('scroll', (res) => {
      const height = res.target
      this.scrollTop = height.scrollTop
    }, false)
  },

  methods: {
    // 这里如果直接赋值给this.$el.querySelector('.el-table__body-wrapper').scrollTop会失效，需要加上setTimeout才行。
    saveScroll() {
      this.$nextTick(() => {
        setTimeout(() => {
          var scrollTop = this.$el.querySelector('.el-table__body-wrapper')
          scrollTop.scrollTop = this.scrollTop
        }, 13)
      })
    },

    // 修改公司名获取对应的组
    async companyChange(item) {
      this.teamMembersOptions = []
      this.listQuery.collectionGroupId = ''
      this.listQuery.id = ''
      const res = await getCompanyGroup({ collectionCompanyId: item })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupOptions = res.data || []
    },
    async groupChange(item) {
      this.listQuery.id = ''
      const res = await getGroupCollectionUser({ groupId: item })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.teamMembersOptions = res.data || []
    },
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k]) {
          if (k === 'lastRepayTime' && this.listQuery[k].length > 0) {
            tmp.lastRepayStartTime = this.listQuery[k][0]
            tmp.lastRepayEndTime = this.listQuery[k][1] + 86399999
          } else if (k === 'collectionTime' && this.listQuery[k].length > 0) {
            tmp.collectionStartTime = this.listQuery[k][0]
            tmp.collectionEndTime = this.listQuery[k][1] + 86399999
          } else if (k === 'repayTime' && this.listQuery[k].length > 0) {
            tmp.repayStartTime = this.listQuery[k][0]
            tmp.repayEndTime = this.listQuery[k][1] + 86399999
          } else {
            tmp[k] = this.listQuery[k]
          }
        }
      }
      if (this.listQuery.status) {
        tmp.periodStatus = [this.listQuery.status]
      } else {
        tmp.periodStatus = [50, 1000]
      }
      tmp.collectionType = 20

      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      // 当页码改变的时候滚动条重新到顶部
      this.scrollTop = 0
      this.saveScroll()
      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await remindOrderInfo(tmp)
      if (this.listQuery.collectionGroupId) {
        this.batchTeamId = this.listQuery.collectionGroupId
        this.isBatchBtn = true
      } else {
        this.isBatchBtn = false
      }
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
        userName: '',
        mobile: '',
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        page: 1,
        size: 100
      }
      this.getTableList()
    },

    // 选择行
    handleSelectionChange(val) {
      this.currentRow = []
      val.forEach(item => {
        if (item.principal !== 0) {
          this.currentRow.push(item)
        }
      })
    },
    // tabel组件复选框控制禁止选择
    checkboxInit(row) {
      if (row.principal === 0) {
        return 0
      } else {
        return 1
      }
    },
    // 批量派单
    openBatch() {
      if (this.currentRow.length <= 0) return this.$message.error(this.$t('collect.collect19')) /* 请选择至少一个订单 */
      this.openBatchDrawer = true
    },
    closeBatch(item) {
      this.openBatchDrawer = false
      if (item) {
        this.getTableList()
      }
    },

    // 导出
    async exportData() {
      const tmp = this.handleListQuery()
      delete tmp.page
      delete tmp.size

      const now = new Date()
      const nowStr = now.toLocaleDateString()

      const res = await exportRemindOrderInfo(tmp)

      const BLOB = res // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
      const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
      fileReader.readAsDataURL(BLOB)
      // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
      fileReader.onload = (event) => {
        // 处理load事件。该事件在读取操作完成时触发
        // 新建个下载的a标签，完成后移除。
        const a = document.createElement('a')
        a.download = `remind_order_info_${nowStr}.xlsx`
        a.href = event.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },

    // 增加提醒
    openRecord(row) {
      this.recordRow = {
        userId: row.userId,
        orderId: row.orderId,
        periodId: row.periodId,
        borrowId: row.borrowId,
        collectionOrderId: row.orderId,
        customerName: row.customerName,
        customerMobile: row.customerMobile,
        overDueDays: row.overDueDays
      }
      this.openRecordDrawer = true
    },
    closeRecord(item) {
      this.openRecordDrawer = false
      if (item) {
        this.getTableList()
      }
    },

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '1'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.borrowId,
        query: {
          remainOverdue: row.remainOverdue.toString(),
          orderId: row.orderId,
          periodId: row.periodId,
          userId: row.userId,
          customerUid: row.customerUid,
          borrowId: row.borrowId,
          borrowUid: row.borrowUid,
          principal: row.principal,
          overDueDays: row.overDueDays,
          isRemind: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
