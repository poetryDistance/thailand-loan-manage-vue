<template>
  <div class="main-box">
    <!-- 催收管理 -- 减免订单列表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="userName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.userName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.mobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="borrowUid" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowUid" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item :label="$t('collect.collect75') + ': '"> <!-- 减免状态 -->
        <el-select
          v-model="listQuery.status"
          filterable
          clearable
          :placeholder="$t('collect.collect76')"
        > <!-- 请选择减免状态 -->
          <el-option
            v-for="item in discountStatusOptions"
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
            v-for="item in companyNameCollectOptions"
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
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="120px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status === 0 && permission.isAdmin"
            size="mini"
            type="text"
            @click="auditDiscount(row)"
          >
            {{ $t('collect.collect94') }} <!-- 审核 -->
          </el-button>
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('common.common32') }} <!-- 查看详情 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect2')" prop="borrowUid" align="center" min-width="100px" /> <!-- 订单编号 -->
      <el-table-column :label="$t('collect.collect3')" prop="customerName" align="center" min-width="90px" /> <!-- 用户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('collect.collect5')" prop="idCardNo" align="center" min-width="110px" /> <!-- 身份证号 -->
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
        key="loginName"
        :label="$t('collect.collect13')"
        prop="loginName"
        align="center"
        min-width="90px"
      /> <!-- 催收员 -->
      <el-table-column :label="$t('collect.collect95')" prop="principal" align="center" min-width="90px" /> <!-- 待还金额 -->
      <el-table-column :label="$t('collect.collect9')" prop="discountAmount" align="center" min-width="90px" /> <!-- 减免金额 -->
      <el-table-column :label="$t('collect.collect89')" prop="applyTime" align="center" min-width="150px"> <!-- 减免申请时间 -->
        <template slot-scope="{ row }">
          {{ row.applyTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect90')" prop="auditTime" align="center" min-width="150px"> <!-- 减免审核时间 -->
        <template slot-scope="{ row }">
          {{ row.auditTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect75')" prop="status" align="center" min-width="90px"> <!-- 减免状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0" size="small" type="warning">{{ $t('collect.collect77') }}</el-tag> <!-- 待审核 -->
          <el-tag v-else-if="row.status === 10" size="small" type="success">{{ $t('borrow.borrow7') }}</el-tag> <!-- 通过 -->
          <el-tag v-else-if="row.status === 20" size="small" type="danger">{{ $t('collect.collect78') }}</el-tag> <!-- 驳回 -->
          <div v-else />
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect91')" prop="auditRemark" align="center" min-width="70px"> <!-- 审核备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.auditRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.auditRemark"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect92')" prop="applyRemark" align="center" min-width="70px"> <!-- 减免备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.applyRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.applyRemark"
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

    <audit-drawer v-if="openAuditDrawer" :current-row="currentRow" @closeAuditDrawer="closeAuditDrawer" />
  </div>
</template>

<script>
import { getCompanyGroup, getGroupCollectionUser } from '@/api/collectionAgentManagement'
import { discountList } from '@/api/collectionManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import auditDrawer from './components/breaksTheOrder/auditDrawer'
import { mapState } from 'vuex'

export default {
  name: 'CollectionOrderList',
  components: {
    Pagination,
    auditDrawer
  },
  data() {
    return {
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
        borrowUid: '',
        status: '',
        page: 1,
        size: 10
      },
      total: 0,

      // 审核
      openAuditDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      companyNameCollectOptions: state => state.options.companyNameCollectOptions,
      discountStatusOptions: state => state.options.discountStatusOptions,
      permission: state => state.permission.permission,
      ids: state => state.permission.ids
    })
  },

  mounted() {
    if (this.permission.isCollectionLead) {
      this.companyChange(this.ids.collectionCompanyId)
    } else if (this.permission.isGroupLead) {
      this.companyChange(this.ids.collectionCompanyId)
      this.groupChange(this.ids.collectionGroupId)
    }
    this.getTableList()
  },

  methods: {
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
        if (this.listQuery[k] || k === 'status') {
          tmp[k] = this.listQuery[k]
        }
      }
      tmp.merchantId = this.$route.query.merchantId
      tmp.monthDate = this.$route.query.monthDate
      return tmp
    },
    // 查询减免订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await discountList(tmp)
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
        borrowUid: '',
        status: '',
        page: 1,
        size: 100
      }
      this.getTableList()
    },

    // 审核
    auditDiscount(row) {
      this.currentRow = row
      this.openAuditDrawer = true
    },
    closeAuditDrawer(item) {
      this.openAuditDrawer = false
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
        path: '/userDetails/' + row.userId,
        query: {
          orderId: row.orderId,
          periodId: row.periodId,
          userId: row.userId,
          customerUid: row.customerUid,
          borrowId: row.borrowId,
          borrowUid: row.borrowUid,
          overDueDays: row.overDueDays
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
