<template>
  <div class="main-box">
    <!-- 预提醒管理 -- 预提醒记录 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="userName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.userName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('loanMarket.loanMarket58') + ':'"> <!-- 债务人手机号 -->
        <el-input v-model="listQuery.mobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="borrowId" :label="$t('collect.collect2') + ':'"> <!-- 订单编号 -->
        <el-input v-model="listQuery.borrowId" :placeholder="$t('collect.collect74')" style="width: 178px;" /> <!-- 请输入订单编号 -->
      </el-form-item>
      <el-form-item prop="distanceRepayEndDay" :label="$t('loanMarket.loanMarket71') + ':'"> <!-- 到期天数 -->
        <el-input v-model="listQuery.distanceRepayEndDay" :placeholder="$t('loanMarket.loanMarket72')" style="width: 178px;" /> <!-- 请输入到期天数 -->
      </el-form-item>
      <el-form-item prop="relationMobile" :label="$t('loanMarket.loanMarket59') + ':'"> <!-- 联系人手机号 -->
        <el-input v-model="listQuery.relationMobile" style="width: 178px;" />
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
      <el-form-item prop="relation" :label="$t('collect.collect53') + ': '"> <!-- 联系人与债主的关系 -->
        <el-select
          v-model="listQuery.relation"
          filterable
          clearable
          style="width: 100%;"
          :placeholder="$t('collect.collect71')"
        > <!-- 请选择联系人与债主的关系 -->
          <el-option
            v-for="item in relationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item :label="$t('collect.collect103') + ':'">   <!-- 催收时间 -->
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
        v-if="permission.isAdmin"
        key="groupName"
        :label="$t('collector.collector11')"
        prop="groupName"
        align="center"
        min-width="90px"
      /> <!-- 催收组 -->
      <!-- v-if="permission.isAdmin || permission.isCollectionLead || permission.isGroupLead" -->
      <el-table-column
        v-if="permission.isAdmin"
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
      <el-table-column :label="$t('loanMarket.loanMarket71')" sortable prop="distanceRepayEndDay" align="center" min-width="100px" /> <!-- 到期天数 -->
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
import { getCompanyGroup, getGroupCollectionUser } from '@/api/collectionAgentManagement'
import { remindRecordInfo, exportRemindRecordInfo } from '@/api/remindController'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import { mapState } from 'vuex'

export default {
  name: 'RemindRecordInfo',
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
        userName: '',
        mobile: '',
        collectionCompanyId: '',
        collectionGroupId: '',
        id: '',
        orderId: '',
        status: '',
        page: 1,
        size: 10
      },
      total: 0
    }
  },

  computed: {
    ...mapState({
      companyNameRemindOptions: state => state.options.companyNameRemindOptions,
      permission: state => state.permission.permission,
      flagOptions: state => state.options.flagOptions,
      ids: state => state.permission.ids
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
    relationOptions() {
      return [
        { value: 80, label: this.$t('collect.collect231') }, /* 本人 */
        { value: 10, label: this.$t('collect.collect54') }, /* 配偶 */
        { value: 20, label: this.$t('collect.collect55') }, /* 父母 */
        { value: 40, label: this.$t('collect.collect57') }, /* 子女 */
        { value: 60, label: this.$t('collect.collect59') }, /* 亲人 */
        { value: 100, label: this.$t('collect.collect61') }, /* 同事 */
        { value: 110, label: this.$t('collect.collect60') }, /* 朋友 */
        { value: 1000, label: this.$t('collect.collect62') } /* 其他 */
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
        if (this.listQuery[k]) {
          if (k === 'collectionTime' && this.listQuery[k].length > 0) {
            tmp.collectionStartTime = this.listQuery[k][0]
            tmp.collectionEndTime = this.listQuery[k][1] + 86399999
          } else {
            tmp[k] = this.listQuery[k]
          }
        }
      }
      tmp.collectionType = 20

      return tmp
    },
    // 查询催收记录
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await remindRecordInfo(tmp)
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
        orderId: '',
        status: '',
        page: 1,
        size: 100
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

      const res = await exportRemindRecordInfo(tmp)

      const BLOB = res // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
      const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
      fileReader.readAsDataURL(BLOB)
      // 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
      fileReader.onload = (event) => {
        // 处理load事件。该事件在读取操作完成时触发
        // 新建个下载的a标签，完成后移除。
        const a = document.createElement('a')
        a.download = `remind_record_info_${nowStr}.xlsx`
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
