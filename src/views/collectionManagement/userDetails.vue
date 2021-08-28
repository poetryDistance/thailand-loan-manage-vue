<template>
  <div style="padding-bottom: 80px;">
    <!-- 数据管理 -- 详情页 -->
    <el-card shadow="hover" class="basic-info">
      <div class="title">{{ $t('loanMarket.loanMarket41') }}</div> <!-- 客户信息 -->
      <el-divider />
      <base-info :customers="customers" :record-data="commonData" @addBlack="addBlack" @addRecordSuccess="addRecordSuccess" />
    </el-card>

    <el-card v-if="isUserDetails === '6'" shadow="hover" class="basic-info">
      <div class="title">{{ $t('collect.collect79') }}</div> <!-- 基本信息 -->
      <el-divider />
      <user-borrow-info :user-borrow-data="customers.userBorrowInfo" :customers="customers" />
    </el-card>

    <el-card
      v-if="isUserDetails === '4' || isUserDetails === '2' || isUserDetails === '5' || isUserDetails === '6'"
      shadow="hover"
      class="basic-info"
    >
      <div class="title">{{ $t('collect.collect80') }}</div> <!-- 借款订单 -->
      <el-divider />
      <order-borrowing
        v-if="isUserDetails === '4' || isUserDetails === '2' || isUserDetails === '5' || isUserDetails === '6'"
        :customer-uid="commonData.customerUid"
        :user-id="commonData.userId"
      />
    </el-card>

    <el-card v-if="isUserDetails !== '4'" shadow="hover" class="basic-info">
      <div class="title">{{ $t('collect.collect81') }}</div> <!-- 分期信息 -->
      <el-divider />
      <periods-info
        v-if="isUserDetails !== '4'"
        :user-id="commonData.userId"
        :period-id="commonData.periodId"
        :borrow-uid="commonData.borrowUid"
      />
    </el-card>

    <el-card v-if="recordFlag" shadow="hover" class="basic-info">
      <div class="title">{{ $t('collect.collect82') }}</div> <!-- 催记 -->
      <el-divider />
      <record-info :record-data="commonData" :is-remind="commonData.isRemind" :customers="customers" />
    </el-card>

    <!-- 通讯录和通话记录 -->
    <el-card v-if="isUserDetails === '1' || isUserDetails === '5' && isAddressBook" shadow="hover" class="basic-info">
      <address-book :book-row="commonData" :customers="customers" @addRecordSuccess="addRecordSuccess" />
    </el-card>

    <el-card v-if="permission.isAdmin && isUserDetails === '1'" shadow="hover" class="basic-info">
      <div class="title">{{ $t('collect.collect232') }}</div> <!-- 委案变更记录 -->
      <el-divider />
      <case-change :period-id="commonData.periodId" />
    </el-card>

    <el-card v-if="permission.isAdmin" shadow="hover" class="basic-info">
      <div class="title">{{ $t('collector.collector54') }}</div> <!-- 用户认证KYC记录 -->
      <el-divider />
      <kyc-records :kyc-records="customers.customerKycRecords" />
    </el-card>

    <el-card shadow="hover" class="basic-info">
      <div class="title">{{ $t('collector.collector47') }}</div> <!-- 绑卡信息 -->
      <el-divider />
      <card-info :card-info="customers.customerBankCards" />
    </el-card>

    <el-button
      v-if="isUserDetails === '5' && !openRevisarDrawer && isRevisar === 'false'"
      class="btn-revisar"
      type="primary"
      @click="openRevisar"
    >{{ $t('collect.collect94') }}</el-button> <!-- 审核 -->

    <revisar-drawer v-if="openRevisarDrawer" :revisar-row="revisarRow" @close="close" />

  </div>
</template>

<script>
import { getUserDate, isBlack } from '@/api/collectionManagement'
import baseInfo from './components/userDetails/baseInfo'
import orderBorrowing from './components/userDetails/orderBorrowing'
import periodsInfo from './components/userDetails/periodsInfo'
import recordInfo from './components/userDetails/recordInfo'
import caseChange from './components/userDetails/caseChange'
import cardInfo from './components/userDetails/cardInfo'
import kycRecords from './components/userDetails/kycRecords'
import addressBook from './components/userDetails/addressBook'
import revisarDrawer from './components/userDetails/revisarDrawer'
import userBorrowInfo from './components/userDetails/userBorrowInfo'
import { mapState } from 'vuex'

export default {
  // name: 'UserDetails',
  components: {
    baseInfo,
    orderBorrowing,
    periodsInfo,
    recordInfo,
    caseChange,
    cardInfo,
    kycRecords,
    addressBook,
    revisarDrawer,
    userBorrowInfo
  },
  data() {
    return {
      activeName: 'userInfo',

      userInfo: {},
      orderInfoList: [],
      customers: {},

      userId: null,
      periodId: null,
      borrowId: null,
      remainOverdue: null,

      recordFlag: true,

      commonData: {},

      isUserDetails: '',

      // 审核
      isRevisar: true,
      openRevisarDrawer: false,
      revisarRow: {},

      // 是否展示通讯录
      isAddressBook: false
    }
  },

  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.userId) this.commonData.userId = this.$route.query.userId * 1
      if (this.$route.query.orderId) this.commonData.orderId = this.$route.query.orderId * 1
      if (this.$route.query.periodId) this.commonData.periodId = this.$route.query.periodId * 1
      if (this.$route.query.borrowId) this.commonData.borrowId = this.$route.query.borrowId * 1
      if (this.$route.query.borrowUid) this.commonData.borrowUid = this.$route.query.borrowUid
      if (this.$route.query.collectionOrderId) this.commonData.collectionOrderId = this.$route.query.collectionOrderId * 1
      if (this.$route.query.remainOverdue) this.commonData.remainOverdue = this.$route.query.remainOverdue * 1
      if (this.$route.query.principal) this.commonData.principal = this.$route.query.principal * 1
      if (this.$route.query.isRemind) this.commonData.isRemind = this.$route.query.isRemind
      if (this.$route.query.customerUid) this.commonData.customerUid = this.$route.query.customerUid

      this.isRevisar = this.sessionData('get', 'revisarRowSuccess')
      this.isUserDetails = this.sessionData('get', 'isUserDetails')[this.$route.query.userId]
      this.getUserDate({ customerUid: this.$route.query.customerUid })

      // 判断是否展示通讯录和通讯记录
      const loginUser = this.sessionData('get', 'login_user') || {}
      this.isAddressBook = loginUser.sysRole.isOpenContact
    })
  },
  methods: {
    // 获取用户基本信息
    async getUserDate(item) {
      const res = await getUserDate(item)
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      if (!Array.isArray(res.data.faceImage)) res.data.faceImage = ['']
      this.customers = res.data || {}
      this.customers.overDueDays = this.$route.query.overDueDays
    },
    // 添加黑名单
    async addBlack(blackCustomer) {
      const res = await isBlack({ blackCustomer: blackCustomer, id: this.$route.query.userId })
      if (res.code !== '0' && !res.data) return this.$message.error(res.message || 'Error')
      this.getUserDate({ customerUid: this.$route.query.customerUid })
      this.$message.success(blackCustomer ? this.$t('sysManage.sysManage75') : this.$t('userManage.userManage28')) /* 添加成功 移出成功 */
    },
    // 新增催记成功
    addRecordSuccess() {
      // 移除组件
      this.recordFlag = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
        this.recordFlag = true
      })
    },

    // 审核弹框
    openRevisar() {
      this.openRevisarDrawer = true
      this.revisarRow.userId = this.$route.query.userId
      this.revisarRow.borrowId = this.$route.query.borrowId
    },
    close(isSuccess) {
      if (isSuccess) {
        this.getUserDate({ customerUid: this.$route.query.customerUid })
        this.$router.push({
          path: '/borrowManage/humanReview',
          query: {
            revisarResult: true
          }
        })
      }
      this.openRevisarDrawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs {
  padding-left: 20px;
  background-color: #fff;
}
.basic-info {
  margin-bottom: 10px;
  .title {
    padding: 10px 0 0 10px;
    font-size: 20px;
    font-weight: 600;
  }
}
.btn-revisar {
  position: fixed;
  right: 4px;
  top: 120px;
  width: 30px;
  height: 100px;
  font-size: 16px;
  white-space: pre-wrap;
  padding: 10px 0;
  line-height: 1.5;
  border: 0;
  z-index: 9999;
}
</style>
