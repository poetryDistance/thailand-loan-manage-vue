<template>
  <div class="main-box">
    <!-- 还款管理 -- 还款分期表 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <el-form-item prop="userName" :label="$t('collect.collect3') + ':'"> <!-- 用户名 -->
        <el-input v-model="listQuery.userName" :placeholder="$t('login.iptUserName')" style="width: 178px;" /> <!-- 请输入用户名 -->
      </el-form-item>
      <el-form-item prop="customerMobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
        <el-input v-model="listQuery.customerMobile" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
      </el-form-item>
      <el-form-item prop="idCardNo" :label="$t('borrow.borrow1') + ':'"> <!-- 身份证号 -->
        <el-input v-model="listQuery.idCardNo" :placeholder="$t('borrow.borrow2')" /> <!-- 请输入身份证号 -->
      </el-form-item>
      <!-- <el-form-item prop="borrowUid" :label="$t('financial.financial8') + ':'"> Uid
        <el-input v-model="listQuery.borrowUid" :placeholder="$t('financial.financial10')" style="width: 178px;" /> 请输入Uid
      </el-form-item> -->
      <el-form-item :label="$t('borrow.borrow3') + ': '"> <!-- 订单状态 -->
        <el-select
          v-model="listQuery.periodStatus"
          filterable
          clearable
          :placeholder="$t('borrow.borrow4')"
        > <!-- 请选择订单状态 -->
          <el-option
            v-for="item in borrowStatusOptions1"
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
          <el-dropdown split-button type="primary" trigger="click" @command="handleCommand(row, $event)">
            <span @click="viewDetails(row)">{{ $t('common.common32') }}</span> <!-- 查看详情 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                {{ $t('borrow.borrow41') }} <!-- 费用变更 -->
              </el-dropdown-item>
              <el-dropdown-item :disabled="!row.releasePayCompany" command="b">
                {{ $t('borrow.borrow56') }} <!-- 获取还款链接 -->
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="60px" /> <!-- 编号 -->
      <!-- <el-table-column :label="$t('financial.financial8')" prop="borrowUid" align="center" min-width="120px" /> Uid -->
      <el-table-column :label="$t('borrow.borrow14')" prop="userName" align="center" min-width="110px" /> <!-- 客户名 -->
      <el-table-column :label="$t('common.common28')" prop="customerMobile" align="center" min-width="90px" /> <!-- 手机号 -->
      <el-table-column :label="$t('borrow.borrow1')" prop="idCardNo" align="center" min-width="120px" /> <!-- 身份证号 -->
      <el-table-column :label="$t('borrow.borrow25')" prop="interestAmount" align="center" min-width="70px" /> <!-- 利息 -->
      <el-table-column :label="$t('collect.collect8')" prop="overDueDays" align="center" min-width="70px" /> <!-- 逾期天数 -->
      <el-table-column :label="$t('borrow.borrow26')" prop="periodNo" align="center" min-width="70px" /> <!-- 当前期数 -->
      <el-table-column :label="$t('borrow.borrow27')" prop="principalAmount" align="center" min-width="70px" /> <!-- 本金 -->
      <el-table-column :label="$t('borrow.borrow3')" prop="periodStatus" align="center" min-width="80px"> <!-- 订单状态 -->
        <template slot-scope="{ row }">
          {{ row.periodStatus | borrowStatusFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('borrow.borrow28')" prop="remainInterest" align="center" min-width="70px" /> <!-- 剩余利息 -->
      <el-table-column :label="$t('borrow.borrow29')" prop="remainOverdue" align="center" min-width="90px" /> <!-- 剩余滞纳金 -->
      <!-- <el-table-column :label="$t('collect.collect189')" prop="remainService" align="center" min-width="90px" /> --> <!-- 剩余手续费 -->
      <el-table-column :label="$t('borrow.borrow30')" prop="remainPrincipal" align="center" min-width="70px" /> <!-- 剩余本金 -->
      <el-table-column :label="$t('borrow.borrow31')" prop="repaidInterest" align="center" min-width="70px" /> <!-- 已还利息 -->
      <el-table-column :label="$t('borrow.borrow32')" prop="repaidOverdue" align="center" min-width="90px" /> <!-- 已还滞纳金 -->
      <el-table-column :label="$t('borrow.borrow33')" prop="repaidPrincipal" align="center" min-width="70px" /> <!-- 已还本金 -->
      <el-table-column :label="$t('borrow.borrow34')" prop="totalOverdue" align="center" min-width="70px" /> <!-- 总滞纳金 -->
      <el-table-column :label="$t('collect.collect9')" prop="discountAmount" align="center" min-width="90px" /> <!-- 减免金额 -->
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="periodRemark" align="center" min-width="70px"> <!-- 备注 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.periodRemark"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.periodRemark"
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

    <bill-change-drawer v-if="openBillDrawer" :current-row="currentRow" :type="2" @close="close" />
  </div>
</template>

<script>
import { getBorrowPeriodInfo, createPayLink } from '@/api/paymentManagement'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包
import billChangeDrawer from '../borrowManage/components/billChangeDrawer'
import { mapState } from 'vuex'

export default {
  name: 'RepaymentOrder',
  components: {
    Pagination,
    billChangeDrawer
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
      total: 0,

      // 费用变更弹框
      openBillDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      borrowStatusOptions1: state => state.options.borrowStatusOptions1
    })
  },

  mounted() {
    this.getTableList()
  },

  methods: {
    // 下拉菜单
    handleCommand(row, command) {
      switch (command) {
        // 费用变更
        case 'a':
          this.openBillChange(row)
          break
        // 获取还款链接
        case 'b':
          this.createPayLink(row)
          break
      }
    },

    // 处理查询条件
    handleListQuery() {
      const tmp = {}
      for (const k in this.listQuery) {
        if (this.listQuery[k] && k !== 'borrowStatus') {
          tmp[k] = this.listQuery[k]
        }
      }
      if (this.listQuery.borrowStatus || this.listQuery.borrowStatus === 0) {
        tmp.status = [this.listQuery.borrowStatus]
      }
      return tmp
    },
    // 查询获取订单信息
    async getTableList(isSearch) {
      if (isSearch === true) this.listQuery.page = 1

      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getBorrowPeriodInfo(tmp)
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

    // 费用变更
    openBillChange(row) {
      this.openBillDrawer = true
      this.currentRow = row
    },
    close() {
      this.openBillDrawer = false
    },

    // 查看详情
    viewDetails(row) {
      const isUserDetails = this.sessionData('get', 'isUserDetails') || {}
      isUserDetails[row.userId] = '3'
      this.sessionData('set', 'isUserDetails', isUserDetails)

      this.$router.push({
        path: '/userDetails/' + row.userId,
        query: {
          userId: row.userId,
          customerUid: row.customerUid,
          periodId: row.id
        }
      })
    },

    // 获取还款链接
    async createPayLink(row) {
      if (!row.releasePayCompany) return this.$message.error(this.$t('borrow.borrow57')) /* 无法生成还款链接 */
      const res = await createPayLink({ payCompany: row.releasePayCompany, periodId: row.id })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      if (!res.data) return this.$message.error(this.$t('borrow.borrow69')) /* 暂无 */
      const link = res.data

      this.$confirm(link, this.$t('borrow.borrow58'), { /* 还款链接 */
        confirmButtonText: this.$t('borrow.borrow59'), /* 复制 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'info'
      }).then(async() => {
        const oInput = document.createElement('input')
        oInput.value = link
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;

        try {
          await document.execCommand('Copy') // 执行浏览器复制命令
          this.$message({
            type: 'success',
            message: this.$t('borrow.borrow60') /* 复制成功 */
          })
        } catch {
          this.$message({
            type: 'error',
            message: this.$t('borrow.borrow61') /* 复制失败 */
          })
        }
        oInput.remove()
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
