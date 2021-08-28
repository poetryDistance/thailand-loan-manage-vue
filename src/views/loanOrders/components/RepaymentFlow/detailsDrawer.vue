<template>
  <div>
    <!-- 还款明细 -->
    <el-drawer
      :title="$t('loanOrders.loanOrders25')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="loanRef"
            :model="loanForm"
            :rules="loanRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            style="width: 100%"
            label-width="100px"
          >
            <el-row type="flex" justify="space-around">
              <el-col :span="11">
                <el-form-item :label="$t('collect.collect210') + ':'"> <!-- 借款编号 -->
                  {{ detailsRow.borrowId }}
                </el-form-item>
                <el-form-item :label="$t('borrow.borrow14') + ':'"> <!-- 客户名 -->
                  {{ detailsRow.customerName }}
                </el-form-item>
                <el-form-item :label="$t('common.common28') + ':'"> <!-- 手机号 -->
                  {{ detailsRow.customerMobile }}
                </el-form-item>
                <el-form-item :label="$t('loanOrders.loanOrders20') + ':'"> <!-- 收款银行 -->
                  {{ detailsRow.thaiName }}
                </el-form-item>
                <el-form-item prop="releaseResultSucceed" :label="$t('loanOrders.loanOrders2') + ': '"> <!-- 操作状态 -->
                  <el-select
                    v-model="loanForm.releaseResultSucceed"
                    filterable
                    :placeholder="$t('loanOrders.loanOrders3')"
                    style="width: 100%;"
                  > <!-- 请选择放款状态 -->
                    <el-option
                      v-for="item in releaseResultOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="paymentTime" :label="$t('loanOrders.loanOrders24') + ':'"> <!-- 实际还款时间 -->
                  <el-date-picker
                    v-model="loanForm.paymentTime"
                    type="date"
                    value-format="timestamp"
                    :placeholder="$t('loanOrders.loanOrders17')"
                    style="width: 100%;"
                  /> <!-- 请选择放款时间 -->
                </el-form-item>
              </el-col>
              <el-col :span="11">
                213
              </el-col>
            </el-row>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submit">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { loanOperation } from '@/api/loanOrders'

export default {
  name: 'DetailsDrawer',
  props: {
    detailsRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 放款
      loanForm: {},

      openDrawer: false,
      success: false
    }
  },

  computed: {
    releaseResultOptions() {
      return [
        { value: 1, label: this.$t('collect.collect224') }, /* 成功 */
        { value: 0, label: this.$t('collect.collect225') } /* 失败 */
      ]
    },
    loanRules() {
      return {
        releaseResultSucceed: [
          { required: true, message: this.$t('loanOrders.loanOrders3'), trigger: 'change' } /* 请选择放款状态 */
        ],
        releasePayCompany: [
          { required: true, message: this.$t('loanOrders.loanOrders14'), trigger: 'blur' } /* 请输入支付渠道 */
        ],
        releaseResultTime: [
          { required: true, message: this.$t('loanOrders.loanOrders17'), trigger: 'change' } /* 请选择放款时间 */
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('detailsClose', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.loanForm.id = this.detailsRow.id
    this.openDrawer = true
  },

  methods: {
    // 人工入账
    submit() {
      this.$refs['loanRef'].validate(async(valid) => {
        if (valid) {
          const res = await loanOperation(this.loanForm)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || this.$t('loanOrders.loanOrders18')) /* 操作失败 */
          this.$message.success(this.$t('loanOrders.loanOrders19')) /* 操作成功 */
          this.success = true
        } else {
          console.log('error submit!!')
          return false
        }
        this.openDrawer = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
