<template>
  <!-- 通讯录 -->
  <div style="padding-bottom: 50px;">
    <h3 style="padding: 0 0 0 30px; margin-top: 0;">{{ $t('borrow.borrow72') }}</h3> <!-- 通讯录 -->
    <el-divider />
    <el-table
      v-loading="listLoading"
      :data="contactsData"
      :max-height="500"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="margin: 10px auto;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="contactName" :label="$t('common.common13')" align="center" /> <!-- 姓名 -->
      <el-table-column prop="timesContacted" :label="$t('loanMarket.loanMarket51')" align="center" /> <!-- 联系次数 -->
      <el-table-column prop="phone" :label="$t('common.common28')" align="center"> <!-- 手机号 -->
        <template slot-scope="{ row }">
          <div style="cursor: pointer;" @click="openAdd(row.name, row.phone)">{{ row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px" /> <!-- 创建时间 -->
      <el-table-column :label="$t('collect.collect149')" prop="createTime" align="center" min-width="150px" /> <!-- 更新时间 -->
    </el-table>
    <pagination
      v-show="total>0"
      class="pagination"
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getCustomerContacts"
    />

    <h3 style="padding: 20px 0 0 30px;">{{ $t('borrow.borrow73') }}</h3> <!-- 通话记录 -->
    <el-divider />
    <el-table
      v-loading="listLoading"
      :data="paginationList"
      :max-height="500"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="margin: 10px auto;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" :label="$t('borrow.borrow74')" align="center" /> <!-- 通话人 -->
      <el-table-column prop="number" :label="$t('borrow.borrow75')" align="center"> <!-- 通话手机号 -->
        <template slot-scope="{ row }">
          <div style="cursor: pointer;" @click="openAdd(row.name, row.number)">{{ row.number }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('borrow.borrow77')" align="center"> <!-- 通话类型 -->
        <template slot-scope="{ row }">
          <div v-if="parseInt(row.type) === 1">{{ $t('borrow.borrow80') }}</div> <!-- 呼出 -->
          <div v-else-if="parseInt(row.type) === 2">{{ $t('borrow.borrow81') }}</div> <!-- 呼入 -->
          <div v-else-if="parseInt(row.type) === 3">{{ $t('borrow.borrow82') }}</div> <!-- 未接 -->
        </template>
      </el-table-column>
      <el-table-column prop="duration" :label="$t('borrow.borrow78')" align="center" /> <!-- 通话时长(秒) -->
      <el-table-column prop="time" :label="$t('borrow.borrow79')" align="center" /> <!-- 通话时间 -->
    </el-table>
    <pagination
      v-show="addressTotal>0"
      class="pagination"
      :total="addressTotal"
      :page.sync="addressQuery.page"
      :size.sync="addressQuery.size"
      @pagination="getAddressList"
    />

    <add-push-down v-if="openAddDrawer" :current-row="currentRow" @closeAdd="closeAdd" />
  </div>
</template>

<script>
import { getCustomerCallRecords, getCustomerContacts } from '@/api/borrowManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import addPushDown from './addPushDown'
import { mapState } from 'vuex'

export default {
  name: 'AddressBook',
  components: {
    Pagination,
    addPushDown
  },
  props: {
    customers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bookRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      listLoading: false,

      // 通话记录
      addressList: [],
      paginationList: [],
      addressQuery: {
        page: 1,
        size: 10
      },
      addressTotal: 0,
      // 通讯录
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      contactsLists: [],
      contactsData: [],

      // 新增催记
      openAddDrawer: false,
      currentRow: {},

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
      const obj = this.sessionData('get', 'isUserDetails') || {}
      this.isUserDetails = obj[this.bookRow.userId]
    }, 10)
    this.getCustomerCallRecords()
    this.getCustomerContacts()
  },

  methods: {
    // 获取通讯录信息
    async getCustomerContacts() {
      this.listLoading = true

      this.listQuery.borrowId = this.$route.query.borrowId
      this.listQuery.customerId = this.$route.query.userId
      const res = await getCustomerContacts(this.listQuery)
      this.listLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.contactsLists = res.data

      // 通讯录假分页
      this.contactsData = this.contactsLists.slice((this.listQuery.page - 1) * this.listQuery.size, (this.listQuery.page - 1) * this.listQuery.size + this.listQuery.size)
      this.total = this.contactsLists.length
      this.total = this.contactsLists
    },
    // 获取通话记录信息
    async getCustomerCallRecords() {
      this.listLoading = true
      const res = await getCustomerCallRecords({
        // borrowId: 100000,
        // customerId: 10013
        borrowId: this.$route.query.borrowId,
        customerId: this.$route.query.userId
      })
      this.listLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.addressList = res.data || []
      this.getAddressList()
      this.addressTotal = this.addressList.length
    },
    // 通话记录假分页
    getAddressList() {
      this.paginationList = this.addressList.slice((this.addressQuery.page - 1) * this.addressQuery.size, (this.addressQuery.page - 1) * this.addressQuery.size + this.addressQuery.size)
    },

    // 增加催记
    openAdd(name, mobile) {
      if (!(this.isUserDetails === '1' && !this.permission.isAdmin)) return false
      this.currentRow = {
        userId: this.bookRow.userId,
        orderId: this.bookRow.orderId,
        periodId: this.bookRow.periodId,
        borrowId: this.bookRow.borrowId,
        collectionOrderId: this.bookRow.orderId,
        customerName: this.customers.customerName,
        customerMobile: this.customers.customerMobile,
        overDueDays: this.customers.overDueDays,
        relationName: name,
        relationMobile: mobile
      }
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.$emit('addRecordSuccess')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c {
  cursor: pointer;
}
</style>
