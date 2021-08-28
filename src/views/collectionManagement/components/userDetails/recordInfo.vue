<template>
  <div>
    <!-- 催记 -->
    <el-button
      v-if="isUserDetails === '1' && !permission.isAdmin && recordData.principal"
      type="primary"
      size="small"
      @click="openAdd"
    >{{ recordData.isRemind ? $t('loanMarket.loanMarket73') : $t('collect.collect42') }}</el-button> <!-- 新增提醒 : 新增催记 -->
    <el-button
      v-if="isUserDetails === '1' && !permission.isAdmin && isDiscount && recordData.principal && !isRemind"
      type="primary"
      size="small"
      @click="openAddDiscount"
    >{{ $t('collect.collect83') }}</el-button> <!-- 提交减免 -->
    <el-table
      :data="recordList"
      :max-height="600"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('collect.collect2')" prop="borrowId" align="center" min-width="70px" /> <!-- 订单编号 -->
      <el-table-column :label="$t('collect.collect3')" prop="userName" align="center" min-width="120px" /> <!-- 用户名 -->
      <el-table-column :label="$t('loanMarket.loanMarket58')" prop="companyPhone" align="center" min-width="100px" /> <!-- 债务人手机号 -->
      <el-table-column :label="$t('collect.collect53')" prop="relation" align="center" min-width="140px"> <!-- 联系人与债主的关系 -->
        <template slot-scope="{ row }">
          {{ row.relation | relationFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket59')" prop="relationMobile" align="center" min-width="100px" /> <!-- 联系人手机号 -->
      <el-table-column :label="$t('loanMarket.loanMarket60')" prop="relationName" align="center" min-width="90px" /> <!-- 联系人名称 -->
      <el-table-column
        v-if="permission.isAdmin"
        key="companyName"
        :label="$t('sysManage.sysManage57')"
        prop="companyName"
        align="center"
        min-width="90px"
      /> <!-- 公司名 -->
      <el-table-column
        v-if="permission.isAdmin || permission.isCollectionLead"
        key="groupName"
        :label="$t('collector.collector11')"
        prop="groupName"
        align="center"
        min-width="90px"
      /> <!-- 催收组 -->
      <el-table-column
        v-if="permission.isAdmin || permission.isCollectionLead || permission.isGroupLead"
        key="collectionUserName"
        :label="$t('collect.collect13')"
        prop="collectionUserName"
        align="center"
        min-width="80px"
      /> <!-- 催收员 -->
      <el-table-column :label="$t('collect.collect103')" prop="entryTime" align="center" min-width="150px"> <!-- 催收时间 -->
        <template slot-scope="{ row }">
          {{ row.entryTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect15')" prop="flag" align="center" min-width="90px"> <!-- 标签 -->
        <template slot-scope="{ row }">
          {{ row.flag | flagFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect65')" prop="repayWish" align="center" min-width="70px"> <!-- 还款意愿 -->
        <template slot-scope="{ row }">
          {{ row.repayWish | repayWishFilter }}
        </template>
      </el-table-column>
      <el-table-column v-if="!isRemind" :label="$t('collect.collect8')" prop="overDueDays" align="center" min-width="70px" /> <!-- 逾期天数 -->
      <el-table-column :label="$t('loanMarket.loanMarket71')" prop="distanceRepayEndDay" align="center" min-width="100px" /> <!-- 到期天数 -->
      <el-table-column :label="$t('common.common12')" prop="content" align="center" min-width="70px" /> <!-- 备注 -->
      <!-- <template slot-scope="{ row }">
          <el-popover
            v-if="row.content"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.content"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> 查看
          </el-popover>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="recordTotal>0"
      class="pagination"
      :total="recordTotal"
      :page.sync="recordQuery.page"
      :size.sync="recordQuery.size"
      @pagination="getRecordInfo"
    />

    <add-push-down v-if="openAddDrawer" :is-remind="isRemind" :current-row="currentRow" @closeAdd="closeAdd" />
    <discount-drawer v-if="openDiscountDrawer" :current-row="discountRow" @closeDiscount="closeDiscount" />
  </div>
</template>

<script>
import { getRecordInfo } from '@/api/collectionManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addPushDown from '../userDetails/addPushDown'
import discountDrawer from '../userDetails/discountDrawer'
import { mapState } from 'vuex'

export default {
  name: 'RecordInfo',
  components: {
    Pagination,
    addPushDown,
    discountDrawer
  },
  props: {
    recordData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isRemind: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      recordQuery: {
        page: 1,
        size: 10
      },
      recordTotal: 0,
      recordList: [],

      // 新增催记
      openAddDrawer: false,
      currentRow: {},

      // 提交减免
      isDiscount: false,
      openDiscountDrawer: false,
      discountRow: {},

      isUserDetails: ''
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  mounted() {
    setTimeout(() => {
      if ('remainOverdue' in this.recordData) {
        this.isDiscount = true
      } else {
        this.isDiscount = false
      }
      const obj = this.sessionData('get', 'isUserDetails') || {}
      this.isUserDetails = obj[this.recordData.userId]
      this.getRecordInfo()
    }, 10)
  },
  methods: {
    // 获取催记
    async getRecordInfo() {
      if (this.isUserDetails === '4') {
        this.recordQuery.customerUid = this.recordData.customerUid
      } else if (this.isUserDetails === '2' || this.isUserDetails === '5' || this.isUserDetails === '6') {
        this.recordQuery.borrowUid = this.recordData.borrowUid
      } else {
        this.recordQuery.borrowPeriodId = this.recordData.periodId
      }
      const res = await getRecordInfo(this.recordQuery)
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.recordList = res.data.list || []
      this.recordTotal = res.data.total
    },
    // 增加催记
    openAdd() {
      this.currentRow = {
        userId: this.recordData.userId,
        orderId: this.recordData.orderId,
        periodId: this.recordData.periodId,
        borrowId: this.recordData.borrowId,
        collectionOrderId: this.recordData.orderId,
        customerName: this.customers.customerName,
        customerMobile: this.customers.customerMobile,
        overDueDays: this.customers.overDueDays
      }
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.getRecordInfo()
      }
    },
    // 提交减免
    openAddDiscount() {
      console.log(this.recordData.remainOverdue)
      if (this.recordData.remainOverdue * 1 <= 0) return this.$message.error(this.$t('borrow.borrow63')) /* 暂无可减免金额 */
      this.discountRow = {
        periodId: this.recordData.periodId,
        borrowId: this.recordData.borrowId,
        remainOverdue: this.recordData.remainOverdue
      }
      this.openDiscountDrawer = true
    },
    closeDiscount(item) {
      this.openDiscountDrawer = false
    }
  }
}
</script>

<style lang="scss">
</style>
