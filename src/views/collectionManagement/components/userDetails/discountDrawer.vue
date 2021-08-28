<template>
  <div>
    <!-- 提交减免 -->
    <el-drawer
      :title="$t('collect.collect83')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="discountRef"
            :model="discountForm"
            :rules="discountRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
            size="small"
          >
            <el-form-item prop="remainOverdue" :label="$t('collector.collector45') + ':'"> <!-- 可减金额 -->
              <el-row>
                <el-col :xs="19" :sm="21">
                  <el-input v-model="remainOverdue" disabled />
                </el-col>
                <el-col :xs="1" :sm="1" :offset="1"><span style="color: red;">MXN</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="discountAmount" :label="$t('collect.collect9') + ':'"> <!-- 减免金额 -->
              <el-row>
                <el-col :xs="19" :sm="21">
                  <el-input v-model="discountForm.discountAmount" :placeholder="$t('collect.collect84')" /> <!-- 请输入减免金额 -->
                </el-col>
                <el-col :xs="1" :sm="1" :offset="1"><span style="color: red;">MXN</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="applyRemark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="discountForm.applyRemark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
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
import { addDiscount } from '@/api/collectionManagement'

export default {
  name: 'AddPushDown',
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
      // 提交减免
      discountForm: {},
      remainOverdue: 0,

      openDrawer: false
    }
  },

  computed: {
    discountRules() {
      const numValid = (rule, value, callback) => {
        const reg = /^\d+(\.\d{1,2})?$/
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('collect.collect85'))) /* 请输入最多两位小数数字 */
        } else if (value > this.remainOverdue * 1) {
          callback(new Error(this.$t('collect.collect87'))) /* 减免金额不能大于可减金额 */
        } else if (value * 1 <= 0) {
          callback(new Error(this.$t('borrow.borrow64'))) /* 提交减免金额必须大于 0 */
        } else {
          callback()
        }
      }
      return {
        discountAmount: [
          { required: true, message: this.$t('collect.collect84'), trigger: 'blur' }, /* 请输入减免金额 */
          { required: true, trigger: 'blur', validator: numValid }
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeDiscount')
        }, 200)
      }
    }
  },
  mounted() {
    this.remainOverdue = this.currentRow.remainOverdue || 0
    this.discountForm.periodId = this.currentRow.periodId
    this.discountForm.borrowId = this.currentRow.borrowId
    this.openDrawer = true
  },

  methods: {
    // 提交减免
    submit() {
      this.$refs['discountRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.discountForm) {
            if (this.discountForm[k] || this.discountForm[k] === 0) tmp[k] = this.discountForm[k]
          }
          const res = await addDiscount(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          if (res.data) {
            this.$message.success(this.$t('collect.collect86')) /* 提交减免成功 */
          } else {
            this.$message.error(this.$t('collect.collect93')) /* 已存在减免订单,减免失败 */
          }
          this.openDrawer = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
