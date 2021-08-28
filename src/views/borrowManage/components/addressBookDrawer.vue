<template>
  <div>
    <!-- 通讯录 -->
    <el-drawer
      :title="$t('borrow.borrow72')"
      width="70%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh; padding-bottom: 50px;">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <h3 style="padding: 0 0 0 30px; margin-top: 0;">{{ $t('borrow.borrow72') }}</h3> <!-- 通讯录 -->
          <el-divider />
          <el-table
            v-loading="listLoading"
            :data="contactsLists"
            :max-height="500"
            border
            fit
            stripe
            highlight-current-row
            header-cell-class-name="table-header-cell"
            style="width: 98%; margin: 10px auto;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="name" :label="$t('common.common13')" align="center" /> <!-- 姓名 -->
            <el-table-column prop="phone" :label="$t('common.common28')" align="center" /> <!-- 手机号 -->
            <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
              <template slot-scope="{ row }">
                {{ row.createTime | ArrayToDateFormat }}
              </template>
            </el-table-column>
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
            style="width: 98%; margin: 10px auto;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="name" :label="$t('borrow.borrow74')" align="center" /> <!-- 通话人 -->
            <el-table-column prop="number" :label="$t('borrow.borrow75')" align="center" /> <!-- 通话手机号 -->
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
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getCustomerCallRecords, getCustomerContacts } from '@/api/borrowManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'AddressBookDrawer',
  components: {
    Pagination
  },
  props: {
    bookRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      openDrawer: false,
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
      contactsLists: []
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddressBook')
        }, 200)
      }
    }
  },
  mounted() {
    this.getCustomerCallRecords()
    this.getCustomerContacts()
    this.openDrawer = true
  },

  methods: {
    // 获取通讯录信息
    async getCustomerContacts() {
      this.listLoading = true

      this.listQuery.borrowId = this.bookRow.id
      this.listQuery.customerId = this.bookRow.userId
      const res = await getCustomerContacts(this.listQuery)
      this.listLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.contactsLists = res.data.list
      this.total = res.data.total
    },
    // 获取通话记录信息
    async getCustomerCallRecords() {
      this.listLoading = true

      const res = await getCustomerCallRecords({
        // borrowId: 100000,
        // customerId: 10013
        borrowId: this.bookRow.id,
        customerId: this.bookRow.userId
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer {
  @media screen and (max-width: 768px) {
    width: 90% !important;
  }
  @media screen and (min-width: 769px) {
    width: 90% !important;
  }
  @media screen and (min-width: 992px) {
    width: 90% !important;
  }
  @media screen and (min-width: 1200px) {
    width: 80% !important;
  }
  @media screen and (min-width: 1920px) {
    width: 70% !important;
  }
}
</style>
