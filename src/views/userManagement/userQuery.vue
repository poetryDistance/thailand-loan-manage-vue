<template>
  <div class="main-box">
    <!-- 用户管理 -- 用户查询 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage1') + ': '"> <!-- 申请中的贷款 -->
        <el-select
          v-model="listQuery.applyingCustomer"
          filterable
          clearable
          :placeholder="$t('userManage.userManage18')"
        > <!-- 请选择是否有申请中的贷款 -->
          <el-option
            v-for="item in whetherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage7') + ': '"> <!-- 贷款中的贷款 -->
        <el-select
          v-model="listQuery.loaningCustomer"
          filterable
          clearable
          :placeholder="$t('userManage.userManage19')"
        > <!-- 请选择是否有贷款中的贷款 -->
          <el-option
            v-for="item in whetherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage9') + ': '"> <!-- 逾期行为 -->
        <el-select
          v-model="listQuery.overdueCustomer"
          filterable
          clearable
          :placeholder="$t('userManage.userManage20')"
        > <!-- 请选择是否有逾期行为 -->
          <el-option
            v-for="item in whetherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage11') + ': '"> <!-- 已还款的贷款 -->
        <el-select
          v-model="listQuery.repaidCustomer"
          filterable
          clearable
          :placeholder="$t('userManage.userManage21')"
        > <!-- 请选择是否有已还款的贷款 -->
          <el-option
            v-for="item in whetherOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage5') + ': '"> <!-- 性别 -->
        <el-select
          v-model="listQuery.customerSex"
          filterable
          clearable
          :placeholder="$t('userManage.userManage22')"
        > <!-- 请选择性别 -->
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userManage.userManage8') + ': '"> <!-- 婚姻状况 -->
        <el-select
          v-model="listQuery.maritalStatus"
          filterable
          clearable
          :placeholder="$t('userManage.userManage23')"
        > <!-- 请选择婚姻状况 -->
          <el-option
            v-for="item in maritalStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('borrow.borrow20') + ': '"> <!-- 客户类型 -->
        <el-select
          v-model="listQuery.old"
          filterable
          clearable
          :placeholder="$t('userManage.userManage24')"
        > <!-- 请选择客户类型 -->
          <el-option
            v-for="item in oldOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('borrow.borrow13') + ': '"> <!-- 黑名单 -->
        <el-select
          v-model="listQuery.blackCustomer"
          filterable
          clearable
          :placeholder="$t('userManage.userManage25')"
        > <!-- 请选择是否是黑名单 -->
          <el-option
            v-for="item in blackCustomerOptions"
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
      max-height="560"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="100px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('common.common32') }} <!-- 查看详情 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <!-- <el-table-column :label="$t('userManage.userManage6')" prop="customerUid" align="center" min-width="180px" /> 用户唯一编号 -->
      <el-table-column :label="$t('borrow.borrow14')" prop="customerName" align="center" min-width="140px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="110px" /> <!-- 身份证号 -->
      <el-table-column :label="$t('loanMarket.loanMarket8')" prop="marketId" align="center" min-width="90px"> <!-- 市场类型 -->
        <template slot-scope="{ row }">
          {{ row.marketId | marketTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('userManage.userManage5')" prop="customerSex" align="center" min-width="50px"> <!-- 性别 -->
        <template slot-scope="{ row }">
          {{ row.customerSex | userSexFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('userManage.userManage8')" prop="maritalStatus" align="center" min-width="70px"> <!-- 婚姻状况 -->
        <template slot-scope="{ row }">
          {{ row.maritalStatus | maritalStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow20')" prop="old" align="center" min-width="80px"> <!-- 客户类型 -->
        <template slot-scope="{ row }">
          {{ row.old | oldFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('userManage.userManage3')" prop="customerBirthday" align="center" min-width="90px"> <!-- 客户生日 -->
        <template slot-scope="{ row }">
          {{ row.customerBirthday | ArrayToDateFormat2 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('userManage.userManage1')" prop="applyingCustomer" align="center" min-width="60px"> <!-- 申请中的贷款 -->
        <template slot-scope="{ row }">
          {{ row.applyingCustomer | whetherFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('userManage.userManage7')" prop="loaningCustomer" align="center" min-width="60px"> <!-- 贷款中的贷款 -->
        <template slot-scope="{ row }">
          {{ row.loaningCustomer | whetherFilter }}
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('userManage.userManage9')" prop="overdueCustomer" align="center" min-width="70px"> 逾期行为
        <template slot-scope="{ row }">
          {{ row.overdueCustomer | whetherFilter }}
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('userManage.userManage11')" prop="repaidCustomer" align="center" min-width="60px"> <!-- 已还款的贷款 -->
        <template slot-scope="{ row }">
          {{ row.repaidCustomer | whetherFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow13')" prop="blackCustomer" align="center" min-width="60px"> <!-- 黑名单 -->
        <template slot-scope="{ row }">
          {{ row.blackCustomer | blackCustomerFilter }}
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('userManage.userManage4')" prop="customerPostcode" align="center" min-width="80px" /> --> <!-- 现居邮编 -->
      <el-table-column :label="$t('userManage.userManage2')" prop="customerAddress" align="center" min-width="70px"> <!-- 现居地址 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.customerAddress"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.customerAddress"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
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
import { getUserInfo } from '@/api/userManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'UserQuery',
  components: {
    Pagination
  },
  data() {
    return {
      // 搜索
      btnLoading: false,
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
        size: 10
      },
      total: 0
    }
  },

  computed: {
    ...mapState({
      whetherOptions: state => state.options.whetherOptions,
      sexOptions: state => state.options.sexOptions,
      maritalStatusOptions: state => state.options.maritalStatusOptions,
      oldOptions: state => state.options.oldOptions,
      blackCustomerOptions: state => state.options.blackCustomerOptions
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] || this.listQuery[k] === 0 || this.listQuery[k] === false) {
          tmp[k] = this.listQuery[k]
        }
      }
      tmp.merchantId = this.$route.query.merchantId
      tmp.monthDate = this.$route.query.monthDate
      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getUserInfo(tmp)
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
        size: 10
      }
      this.getTableList()
    },
    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.id] = '4'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.id,
        query: {
          userId: row.id,
          customerUid: row.customerUid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
