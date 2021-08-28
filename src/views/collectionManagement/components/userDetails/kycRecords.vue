<template>
  <div>
    <!-- kyc信息 -->
    <el-table
      :data="kycRecords"
      :max-height="600"
      border
      fit
      stripe
      highlight-current-row
      header-cell-class-name="table-header-cell"
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column :label="$t('sysManage.sysManage13')" prop="id" align="center" min-width="70px" /> <!-- 编号 -->
      <el-table-column :label="$t('collector.collector55')" prop="itemType" align="center" min-width="110px"> <!-- KYC类型 -->
        <template slot-scope="{ row }">
          {{ row.itemType | itemTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common14')" prop="status" align="center" min-width="70px"> <!-- 状态 -->
        <template slot-scope="{ row }">
          <el-tag v-if="row.status == '0'" size="small" type="warning">{{ $t('collect.collect237') }}</el-tag> <!-- 待验证 -->
          <el-tag v-else-if="row.status == '10'" size="small" type="success">{{ $t('borrow.borrow7') }}</el-tag> <!-- 通过 -->
          <el-tag v-else-if="row.status == '20'" size="small" type="danger">{{ $t('collect.collect238') }}</el-tag> <!-- 未通过 -->
          <el-tag v-else>{{ $t('collect.collect239') }}</el-tag> <!-- 待绑卡 -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('collect.collect149')" prop="updateTime" align="center" min-width="150px"> <!-- 更新时间 -->
        <template slot-scope="{ row }">
          {{ row.updateTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
        <template slot-scope="{ row }">
          {{ row.createTime | ArrayToDateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="80px"> <!-- 备注 -->
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
export default {
  name: 'CardInfo',
  components: {},
  props: {
    kycRecords: {
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

  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
</style>
