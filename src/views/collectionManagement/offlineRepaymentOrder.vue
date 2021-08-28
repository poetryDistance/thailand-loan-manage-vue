<template>
  <div class="main-box">
    <!-- 催收管理 -- 线下还款订单 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="companyPhone" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.companyPhone" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
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
      <el-form-item prop="repayStatus" :label="$t('collect.collect221') + ': '"> <!-- 还款状态 -->
        <el-select
          v-model="listQuery.repayStatus"
          filterable
          clearable
          :placeholder="$t('collect.collect222')"
        > <!-- 请选择还款状态 -->
          <el-option
            v-for="item in repayStatusOptions"
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
    >
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="150px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('common.common32') }} <!-- 查看详情 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('borrow.borrow35')" prop="payCompany" align="center" min-width="70px"> <!-- 支付公司 -->
        <template slot-scope="{ row }">
          {{ row.payCompany | payCompanyFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow37')" prop="repayRealPayAmount" align="center" min-width="100px" /> <!-- 实际支付金额 -->
      <el-table-column :label="$t('collect.collect221')" prop="repayStatus" align="center" min-width="70px"> <!-- 还款状态 -->
        <template slot-scope="{ row }">
          {{ row.repayStatus | repayStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect226')" prop="repayWay" align="center" min-width="70px"> <!-- 还款途径 -->
        <template slot-scope="{ row }">
          {{ row.repayWay | repayWayFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow39')" prop="notifyType" align="center" min-width="70px" /> <!-- 通知类型 -->
      <!-- <el-table-column :label="$t('borrow.borrow40')" prop="marketTradeId" align="center" min-width="100px" /> --> <!-- 商超还款流水号 -->
      <!-- <el-table-column :label="$t('borrow.borrow36')" prop="repayAccount" align="center" min-width="90px" /> --> <!-- 还款账号 -->
      <el-table-column :label="$t('collect.collect3')" prop="customerName" align="center" min-width="90px" /> <!-- 用户名 -->
      <el-table-column :label="$t('common.common28')" prop="companyPhone" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="100px" /> <!-- 身份证号 -->
      <el-table-column v-if="permission.isAdmin" key="companyName" :label="$t('sysManage.sysManage57')" prop="companyName" align="center" min-width="70px" /> <!-- 催收公司 -->
      <el-table-column v-if="permission.isAdmin || permission.isCollectionLead" key="groupName" :label="$t('collector.collector11')" prop="groupName" align="center" min-width="70px" /> <!-- 催收组 -->
      <el-table-column v-if="permission.isAdmin || permission.isCollectionLead || permission.isGroupLead" key="loginName" :label="$t('collect.collect13')" prop="loginName" align="center" min-width="70px" /> <!-- 催收员 -->
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow38')" prop="repayLink" align="center" min-width="80px"> <!-- 还款h5链接 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.repayLink"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.repayLink"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="70px"> <!-- 备注 -->
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
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
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
  </div>
</template>

<script>
import { getCompanyGroup, getGroupCollectionUser } from '@/api/collectionAgentManagement'
import { getOfflineRepay } from '@/api/collectionManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'CollectionOrderList',
  components: {
    Pagination
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
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        repayWay: 30,
        page: 1,
        size: 10
      },
      total: 0
    }
  },

  computed: {
    ...mapState({
      companyNameCollectOptions: state => state.options.companyNameCollectOptions,
      repayStatusOptions: state => state.options.repayStatusOptions,
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
        if (this.listQuery[k] || this.listQuery[k] === 0) {
          tmp[k] = this.listQuery[k]
        }
      }
      return tmp
    },
    // 查询催收业绩
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getOfflineRepay(tmp)
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
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        repayWay: 30,
        page: 1,
        size: 10
      }
      this.getTableList()
    },

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '1'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.userId,
        query: {
          principal: row.principal,
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
