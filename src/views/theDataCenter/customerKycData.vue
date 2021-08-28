<template>
  <div class="main-box">
    <!-- 运营管理 -- KYC认证 -->
    <el-form ref="listQueryForm" :model="listQuery" size="mini" label-width="auto" inline>
      <!-- <el-form-item :label="$t('theData.theData1') + ':'">   日期
        <el-date-picker
          v-model="listQuery.time"
          type="daterange"
          range-separator="-"
          value-format="timestamp"
          :start-placeholder="$t('sysManage.sysManage8')"
          :end-placeholder="$t('sysManage.sysManage9')"
          :editable="false"
        />  开始日期  结束日期
      </el-form-item> -->
      <el-form-item :label="$t('theData.theData31') + ': '"> <!-- KYC类型 -->
        <el-select
          v-model="listQuery.itemType"
          filterable
          clearable
          :placeholder="$t('theData.theData35')"
        > <!-- 请选择KYC类型 -->
          <el-option
            v-for="item in itemTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common.common14') + ': '"> <!-- 状态 -->
        <el-select
          v-model="listQuery.status"
          filterable
          clearable
          :placeholder="$t('sysManage.sysManage6')"
        > <!-- 请选择状态 -->
          <el-option
            v-for="item in kycStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button :loading="btnLoading" type="primary" @click="getTableList">{{ $t('common.common30') }}</el-button> <!-- 查询 -->
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
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="itemType" :label="$t('theData.theData31')" min-width="90">    <!-- KYC类型 -->
        <template slot-scope="{ row }">
          {{ row.itemType | itemTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('common.common14')" min-width="90">    <!-- 状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.status == '0'" size="small" type="warning">{{ $t('collect.collect237') }}</el-tag> <!-- 待验证 -->
          <el-tag v-else-if="row.status == '10'" size="small" type="success">{{ $t('borrow.borrow7') }}</el-tag> <!-- 通过 -->
          <el-tag v-else-if="row.status == '20'" size="small" type="danger">{{ $t('collect.collect238') }}</el-tag> <!-- 未通过 -->
          <el-tag v-else-if="row.status == '30'">{{ $t('theData.theData34') }}</el-tag> <!-- 验证时发生错误 -->
        </template>
      </el-table-column>
      <el-table-column prop="count" :label="$t('theData.theData33')" min-width="90" />    <!-- 数量 -->
    </el-table>
  </div>
</template>

<script>
import { getCustomerKycData } from '@/api/theDataCenter'
import { mapState } from 'vuex'

export default {
  name: 'CustomerKycData',
  data() {
    return {
      // 搜索
      btnLoading: false,
      listQuery: {
        itemType: '',
        status: '',
        time: [],
        page: 1,
        size: 10
      },

      // 列表
      listLoading: false,
      tableList: [],

      // 费用变更弹框
      openBillDrawer: false,
      currentRow: {}
    }
  },

  computed: {
    ...mapState({
      kycStatusOptions: state => state.options.kycStatusOptions,
      itemTypeOptions: state => state.options.itemTypeOptions
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
        if (this.listQuery[k] || this.listQuery[k] === 0) {
          if (k === 'time' && this.listQuery['time'].length > 0) {
            tmp.authKycStartTime = this.listQuery[k][0]
            tmp.authKycEndTime = this.listQuery[k][1] + 86399999
          } else if (k !== 'time') {
            tmp[k] = this.listQuery[k]
          }
        }
      }
      return tmp
    },
    // 查询获取订单信息
    async getTableList() {
      this.listLoading = true
      this.btnLoading = true
      const tmp = this.handleListQuery()

      const res = await getCustomerKycData(tmp)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data
    },
    // 重置
    resetList() {
      this.listQuery = {
        itemType: '',
        status: '',
        time: '',
        page: 1,
        size: 10
      }
      this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
