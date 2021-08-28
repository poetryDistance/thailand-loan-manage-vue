<template>
  <div>
    <!-- 费用变更 -->
    <el-drawer
      :title="$t('borrow.borrow41')"
      width="70%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-table
            v-loading="listLoading"
            :data="tableList"
            :max-height="$store.state.settings.tableHeight"
            border
            fit
            stripe
            highlight-current-row
            header-cell-class-name="table-header-cell"
            style="width: 98%; margin: 10px auto;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="id" :label="$t('sysManage.sysManage13')" /> <!-- 编号 -->
            <el-table-column v-if="type === 1" key="periodId" prop="periodId" :label="$t('collect.collect209')" /> <!-- 期数编号 -->
            <el-table-column prop="thirdId" :label="$t('borrow.borrow54')" /> <!-- 第三方编号 -->
            <el-table-column :label="$t('collect.collect10')" width="130"> <!-- 待还本金 -->
              <template slot-scope="scope">
                <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.capitalStart }}</span></div> <!-- 变更前 -->
                <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.capitalEnd }}</span></div> <!-- 变更后 -->
                <div>{{ $t('borrow.borrow45') + '：' }}  <!-- 变更值 -->
                  <span v-if="scope.row.capitalEnd>=scope.row.capitalStart" style="color: green;">{{ '+' + scope.row.capitalAmount }}</span>
                  <span v-else style="color: red;">{{ scope.row.capitalAmount }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('borrow.borrow46')" prop="changeType" align="center" min-width="150px"> <!-- 变更类型 -->
              <template slot-scope="{ row }">
                {{ row.changeType | billChangeTypeFilter }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('borrow.borrow52')" width="130"> <!-- 滞纳金 -->
              <template slot-scope="scope">
                <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.overdueStart }}</span></div> <!-- 变更前 -->
                <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.overdueEnd }}</span></div> <!-- 变更后 -->
                <div>{{ $t('borrow.borrow45') + '：' }}  <!-- 变更值 -->
                  <span v-if="scope.row.overdueEnd>=scope.row.overdueStart" style="color: green;">{{ '+' + scope.row.overdueAmount }}</span>
                  <span v-else style="color: red;">{{ scope.row.overdueAmount }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('borrow.borrow25')" width="130"> <!-- 利息 -->
              <template slot-scope="scope">
                <div>{{ $t('borrow.borrow43') + '：' }}<span>{{ scope.row.interestStart }}</span></div>   <!-- 变更前 -->
                <div>{{ $t('borrow.borrow44') + '：' }}<span>{{ scope.row.interestEnd }}</span></div>   <!-- 变更后 -->
                <div>{{ $t('borrow.borrow45') + '：' }}   <!-- 变更值 -->
                  <span v-if="scope.row.interestEnd>=scope.row.interestStart" style="color: green;">{{ '+' + scope.row.interestAmount }}</span>
                  <span v-else style="color: red;">{{ scope.row.interestAmount }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('borrow.borrow53')" prop="changeTime" align="center" min-width="150px"> <!-- 变更时间 -->
              <template slot-scope="{ row }">
                {{ row.changeTime | ArrayToDateFormat }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('sysManage.sysManage4')" prop="createTime" align="center" min-width="150px"> <!-- 创建时间 -->
              <template slot-scope="{ row }">
                {{ row.createTime | ArrayToDateFormat }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.common12')" prop="remark" align="center" min-width="90px"> <!-- 备注 -->
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
            :page.sync="listQuery.page"
            :size.sync="listQuery.size"
            @pagination="getTableList"
          />
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getBorrowBill } from '@/api/borrowManage'
import Pagination from '@/components/Pagination' // 基于 el-pagination 的二次包

export default {
  name: 'BillChangeDrawer',
  components: {
    Pagination
  },
  props: {
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      openDrawer: false,

      btnLoading: false,
      listLoading: false,
      tableList: [],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('close')
        }, 200)
      }
    }
  },
  mounted() {
    this.getTableList()
    this.openDrawer = true
  },

  methods: {
    // 查询获取信息
    async getTableList() {
      this.listLoading = true
      this.btnLoading = true

      if (this.type === 1) {
        this.listQuery.borrowId = this.currentRow.id
      } else if (this.type === 2) {
        this.listQuery.borrowPeriodId = this.currentRow.id
      }
      const res = await getBorrowBill(this.listQuery)
      this.listLoading = false
      this.btnLoading = false

      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.tableList = res.data.list
      this.total = res.data.total
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
