<template>
  <div>
    <!-- 审核 -->
    <el-drawer
      :title="$t('collect.collect94')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="auditRef"
            :model="auditForm"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
            size="small"
          >
            <el-form-item prop="customerName" :label="$t('borrow.borrow14') + ':'"> <!-- 客户名 -->
              <div style="font-size: 16px;">{{ auditForm.customerName || '' }}</div>
              <!-- <el-input v-model="auditForm.userName" disabled /> -->
            </el-form-item>
            <el-form-item prop="principal" :label="$t('collect.collect95') + ':'"> <!-- 待还金额 -->
              <div style="font-size: 16px;">
                {{ auditForm.principal || 0 }}
                <span>&nbsp;MXN</span>
              </div>
            </el-form-item>
            <el-form-item prop="discountAmount" :label="$t('collect.collect9') + ':'"> <!-- 减免金额 -->
              <div style="font-size: 16px;">
                {{ auditForm.discountAmount || 0 }}
                <span>&nbsp;MXN</span>
              </div>
            </el-form-item>
            <el-form-item prop="applyRemark" :label="$t('collect.collect97') + ':'"> <!-- 减免原因 -->
              <div style="font-size: 16px;">{{ auditForm.applyRemark || 0 }}</div>
            </el-form-item>
            <el-form-item prop="auditRemark" :label="$t('collect.collect96') + ':'"> <!-- 审核意见 -->
              <el-input
                v-model="auditForm.auditRemark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submit(10)">{{ $t('borrow.borrow7') }}</el-button> <!-- 通过 -->
              <el-button size="small" @click="submit(20)">{{ $t('collect.collect98') }}</el-button> <!-- 拒绝 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { auditDiscount } from '@/api/collectionManagement'

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
      // 审核
      auditForm: {},
      auditRules: [],

      success: false,

      openDrawer: false
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAuditDrawer', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.auditForm = this.currentRow
    console.log(this.auditForm)
    this.openDrawer = true
  },

  methods: {
    // 提交审核
    submit(status) {
      this.$refs['auditRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          tmp.status = status
          tmp.id = this.auditForm.id
          tmp.periodId = this.auditForm.periodId
          tmp.discountAmount = this.auditForm.discountAmount
          tmp.auditRemark = this.auditForm.auditRemark
          const res = await auditDiscount(tmp)
          if (res.code !== '0' || !res.data) {
            this.openDrawer = false
            return this.$message.error(res.message || 'Error')
          }
          if (status === 10) {
            this.$message.success(this.$t('collect.collect99')) /* 审核通过 */
          } else if (status === 20) {
            this.$message.success(this.$t('collect.collect100')) /* 审核拒绝 */
          }
          this.success = true
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
