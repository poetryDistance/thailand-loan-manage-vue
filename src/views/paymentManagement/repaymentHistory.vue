<template>
  <div class="main-box">
    <!-- 还款管理 -- 还款记录 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="customerName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.customerName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" style="width: 178px;" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <!-- <el-form-item prop="borrowUid" :label="$t('financial.financial8') + ':'"> Uid
        <el-input v-model="listQuery.borrowUid" :placeholder="$t('financial.financial10')" style="width: 178px;" /> 请输入Uid
      </el-form-item> -->
      <el-form-item v-if="permission.isAdmin" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
        <el-select
          v-model="listQuery.collectionCompanyId"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage55')"
          @change="companyChange"
        > <!-- 请选择公司名 -->
          <el-option
            v-for="item in companyNameOptions"
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
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
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
      <!-- <el-form-item prop="payChannel" :label="$t('risk.risk63') + ': '"> 还款通道
        <el-select
          v-model="listQuery.payChannel"
          filterable
          clearable
          :placeholder="$t('risk.risk64')"
        > 请选择还款通道
          <el-option
            v-for="item in repayWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('sysManage.sysManage102') + ':'">   <!-- 还款时间 -->
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

      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList(true)">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
        <el-button :loading="btnLoading" @click="resetList">{{ $t('common.common31') }}</el-button> <!-- 重置 -->
        <el-button
          v-if="permission.isAdmin"
          icon="el-icon-folder"
          type="primary"
          @click="exportData"
        >{{ $t('common.common110') }}</el-button>   <!-- 导出 -->
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
      <el-table-column :label="$t('sysManage.sysManage23')" align="center" min-width="80px"> <!-- 操作 -->
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="viewDetails(row)">
            {{ $t('common.common32') }} <!-- 查看详情 -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <el-table-column :label="$t('collect.collect2')" prop="borrowId" align="center" min-width="80px" /> <!-- 订单编号 -->
      <!-- <el-table-column :label="$t('financial.financial8')" prop="borrowUid" align="center" min-width="120px" /> Uid -->
      <el-table-column :label="$t('borrow.borrow35')" prop="payCompany" align="center" min-width="80px"> <!-- 支付公司 -->
        <template slot-scope="{ row }">
          {{ row.payCompany | payCompanyFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow37')" prop="repayRealPayAmount" align="center" min-width="80px" /> <!-- 实际支付金额 -->
      <el-table-column :label="$t('collect.collect221')" prop="repayStatus" align="center" min-width="90px"> <!-- 还款状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.repayStatus === 0" size="small" type="warning">{{ $t('collect.collect223') }}</el-tag> <!-- 等待中 -->
          <el-tag v-else-if="row.repayStatus === 10" size="small" type="success">{{ $t('collect.collect224') }}</el-tag> <!-- 成功 -->
          <el-tag v-else-if="row.repayStatus === 20" size="small" type="danger">{{ $t('collect.collect225') }}</el-tag> <!-- 失败 -->
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('risk.risk63')" prop="payChannel" align="center" min-width="70px"> 还款通道
        <template slot-scope="{ row }">
          {{ row.payChannel | payChannelFilter }}
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('borrow.borrow39')" prop="notifyType" align="center" min-width="70px" /> <!-- 通知类型 -->
      <!-- <el-table-column :label="$t('borrow.borrow40')" prop="marketTradeId" align="center" min-width="100px" /> --> <!-- 商超还款流水号 -->
      <!-- <el-table-column :label="$t('borrow.borrow36')" prop="repayAccount" align="center" min-width="90px" /> --> <!-- 还款账号 -->
      <el-table-column :label="$t('collect.collect3')" prop="customerName" align="center" min-width="130px" /> <!-- 用户名 -->
      <el-table-column :label="$t('common.common109')" prop="customerMobile" align="center" min-width="110px" /> <!-- 用户手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="110px" /> <!-- 身份证号 -->
      <!-- 催收公司 -->
      <el-table-column v-if="permission.isAdmin" key="companyName" :label="$t('sysManage.sysManage57')" prop="companyName" align="center" min-width="70px" />
      <el-table-column v-if="permission.isAdmin || permission.isCollectionLead" key="groupName" :label="$t('collector.collector11')" prop="groupName" align="center" min-width="70px" /> <!-- 催收组 -->
      <el-table-column v-if="permission.isAdmin || permission.isCollectionLead || permission.isGroupLead" key="loginName" :label="$t('collect.collect13')" prop="loginName" align="center" min-width="70px" /> <!-- 催收员 -->
      <el-table-column :label="$t('sysManage.sysManage102')" prop="createTime" align="center" min-width="150px"> <!-- 还款时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect14')" prop="createTime" align="center" min-width="90px"> <!-- 应还款时间 -->
        <template slot-scope="{ row }">
          {{ row.repayStartTime | ArrayToDateFormat2 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('loanMarket.loanMarket47')" prop="applyRequestId" align="center" min-width="120px" /> <!-- 发起还款请求编号 -->
      <el-table-column :label="$t('loanMarket.loanMarket48')" prop="applyResponseId" align="center" min-width="120px" /> <!-- 发起还款响应编号 -->
      <el-table-column :label="$t('borrow.borrow62')" prop="repayStartTime" align="center" min-width="150px"> <!-- 放款时间 -->
        <template slot-scope="{ row }">
          {{ row.releaseResultTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow38')" prop="repayLink" align="center" min-width="80px"> <!-- 还款h5链接 -->
        <template slot-scope="{ row }">
          <el-button type="text" @click="viewH5(row.repayLink)">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
        </template>
        <!-- <template slot-scope="{ row }">
          <el-popover
            v-if="row.repayLink"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.repayLink"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> 查看
          </el-popover>
        </template> -->
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
import { getOfflineRepay, exportOfflineRepay } from '@/api/collectionManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'RepaymentHistory',
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
        payChannel: null,
        page: 1,
        size: 10
      },
      total: 0
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      repayStatusOptions: state => state.options.repayStatusOptions,
      repayWayOptions: state => state.options.repayWayOptions,
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
          if (k === 'time' && this.listQuery[k].length > 0) {
            tmp.startTime = this.listQuery[k][0]
            tmp.endTime = this.listQuery[k][1] + 86399999
          } else if (k !== 'time') {
            tmp[k] = this.listQuery[k]
          }
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
        payChannel: null,
        page: 1,
        size: 10
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

      const res = await exportOfflineRepay(tmp)

      const BLOB = res // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
      const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
      fileReader.readAsDataURL(BLOB)
      // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
      fileReader.onload = (event) => {
        // 处理load事件。该事件在读取操作完成时触发
        // 新建个下载的a标签，完成后移除。
        const a = document.createElement('a')
        a.download = `repayment_history_${nowStr}.xlsx`
        a.href = event.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },

    // 查看H5还款链接
    viewH5(link) {
      window.open(link, '_blank')
    },

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '3'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.userId,
        query: {
          periodId: row.periodId,
          userId: row.userId,
          customerUid: row.customerUid,
          borrowId: row.borrowId,
          borrowUid: row.borrowUid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
