<template>
  <div>
    <!-- 绑卡信息 -->
    <el-table
      :data="cardInfo"
      :max-height="500"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('borrow.borrow23')" prop="customerId" align="center" min-width="70px" /> <!-- 客户编号 -->
      <el-table-column :label="$t('collect.collect156')" prop="bankAccount" align="center" min-width="110px" /> <!-- 银行账号 -->
      <el-table-column :label="$t('collect.collect158')" prop="openBank" align="center" min-width="90px" /> <!-- 绑卡开户行 -->
      <el-table-column :label="$t('collect.collect157')" prop="bankCode" align="center" min-width="70px" /> <!-- 银行代码 -->
      <el-table-column :label="$t('collector.collector49')" prop="bankUserName" align="center" min-width="100px" /> <!-- 开户人姓名 -->
      <el-table-column :label="$t('common.common14')" prop="validateStatus" align="center" min-width="70px"> <!-- 状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.validateStatus == '0'" size="small" type="warning">{{ $t('collect.collect237') }}</el-tag> <!-- 待验证 -->
          <el-tag v-else-if="row.validateStatus == '10'" size="small" type="success">{{ $t('borrow.borrow7') }}</el-tag> <!-- 通过 -->
          <el-tag v-else-if="row.validateStatus == '20'" size="small" type="danger">{{ $t('collect.collect238') }}</el-tag> <!-- 未通过 -->
          <el-tag v-else>{{ $t('collect.collect239') }}</el-tag> <!-- 待绑卡 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('collector.collector51')" prop="validateResponseTime" align="center" min-width="150px"> <!-- 检验响应时间 -->
        <template slot-scope="{ row }">
          {{ row.validateResponseTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column v-if="permission.isAdmin" key="validateResContent" :label="$t('collector.collector53')" prop="validateResContent" align="center" min-width="110px"> <!-- 验卡返回的内容 -->
        <template slot-scope="{ row }">
          <el-popover
            v-if="row.validateResContent"
            placement="left-start"
            :title="$t('common.common12') + ':'"
            width="100"
            trigger="click"
            :content="row.validateResContent"
            :visible-arrow="false"
          >
            <el-button slot="reference" type="text">{{ $t('common.common20') }}</el-button> <!-- 查看 -->
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('collector.collector52')" prop="remark" align="center" min-width="80px"> <!-- 绑卡说明 -->
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
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CardInfo',
  components: {},
  props: {
    cardInfo: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isUserDetails: ''
    }
  },

  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },

  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
</style>
