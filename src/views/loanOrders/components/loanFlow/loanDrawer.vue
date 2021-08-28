<template>
  <div>
    <!-- 放款 -->
    <el-drawer
      :title="$t('loanOrders.loanOrders1')"
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
            label-width="100px"
          >
            <el-form-item prop="releaseResultSucceed" :label="$t('loanOrders.loanOrders2') + ': '"> <!-- 放款状态 -->
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
            <el-form-item v-if="loanForm.releaseResultSucceed === true" prop="releasePayCompany" :label="$t('loanOrders.loanOrders13') + ':'"> <!-- 支付渠道 -->
              <el-input v-model="loanForm.releasePayCompany" :placeholder="$t('loanOrders.loanOrders14')" /> <!-- 请输入支付渠道 -->
            </el-form-item>
            <el-form-item v-if="loanForm.releaseResultSucceed === true" prop="releaseResultResponeId" :label="$t('loanOrders.loanOrders15') + ':'"> <!-- 银行流水号 -->
              <el-input v-model="loanForm.releaseResultResponeId" :placeholder="$t('loanOrders.loanOrders16')" /> <!-- 请输入银行流水号 -->
            </el-form-item>
            <el-form-item v-if="loanForm.releaseResultSucceed === true" prop="releaseResultTime" :label="$t('borrow.borrow62') + ':'"> <!-- 放款时间 -->
              <el-date-picker
                v-model="loanForm.releaseResultTime"
                type="date"
                value-format="timestamp"
                :placeholder="$t('loanOrders.loanOrders17')"
                style="width: 100%;"
              /> <!-- 请选择放款时间 -->
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="loanForm.remark"
                type="textarea"
                maxlength="500"
                :autosize="{minRows: 1, maxRows: 20}"
                show-word-limit
              />
            </el-form-item>
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
  name: 'LoanDrawer',
  props: {
    currentRow: {
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
          this.$emit('loanClose', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.loanForm.id = this.currentRow.id
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
