<template>
  <div>
    <!-- 人工入账 -->
    <el-drawer
      :title="$t('financial.financial1')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="artificialRef"
            :model="artificialForm"
            :rules="artificialRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item :label="$t('financial.financial6') + ':'"> <!-- 应还本金 -->
              <div>{{ currentRow.amountDue }}</div>
            </el-form-item>
            <el-form-item prop="paymentAmount" :label="$t('financial.financial2') + ':'"> <!-- 入账金额 -->
              <el-input v-model="artificialForm.paymentAmount" :placeholder="$t('financial.financial3')" /> <!-- 请输入入账金额 -->
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
import { offlinePayment } from '@/api/financialManage'

export default {
  name: 'ArtificialDrawer',
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
      // 人工入账
      artificialForm: {},

      openDrawer: false,
      success: false
    }
  },

  computed: {
    artificialRules() {
      const validateAmount = (rule, value, callback) => {
        const reg = /^[0-9]\d*([.][0-9]{1,2})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('collector.collector17'))) /* 请输入数字值 */
        } else {
          callback()
        }
      }
      return {
        paymentAmount: [
          { required: true, message: this.$t('financial.financial3'), trigger: 'blur' }, /* 请输入入账金额 */
          { required: true, trigger: 'blur', validator: validateAmount }
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('close', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.openDrawer = true
  },

  methods: {
    // 人工入账
    submit() {
      this.$refs['artificialRef'].validate(async(valid) => {
        if (valid) {
          this.artificialForm.periodId = this.currentRow.periodId
          this.artificialForm.borrowId = this.currentRow.borrowId
          const res = await offlinePayment(this.artificialForm)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || this.$t('financial.financial7')) /* 入账失败 */
          this.$message.success(this.$t('financial.financial4')) /* 入账成功 */
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
