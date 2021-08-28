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
            ref="revisarRef"
            :model="revisarForm"
            :rules="revisarRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
            size="small"
          >
            <el-form-item prop="reviewStatus" :label="$t('loanMarket.loanMarket33') + ': '"> <!-- 是否通过 -->
              <el-select
                v-model="revisarForm.reviewStatus"
                filterable
                style="width: 100%;"
                :placeholder="$t('loanMarket.loanMarket34')"
              > <!-- 请选择是否通过 -->
                <el-option
                  v-for="item in reviewStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="reviewRemark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="revisarForm.reviewRemark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              v-if="revisarForm.reviewStatus === 20"
              prop="blackCustomer"
              label=" "
            >
              <el-checkbox v-model="revisarForm.blackCustomer">{{ $t('loanMarket.loanMarket35') }}</el-checkbox> <!-- 加入黑名单 -->
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
import { loanReview } from '@/api/borrowManage'

export default {
  name: 'RevisarDrawer',
  props: {
    revisarRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 提交减免
      revisarForm: {
        blackCustomer: false
      },
      isSuccess: false,

      openDrawer: false
    }
  },

  computed: {
    reviewStatusOptions() {
      return [
        { value: 10, label: this.$t('borrow.borrow7') }, /* 通过 */
        { value: 20, label: this.$t('collect.collect98') } /* 拒绝 */
      ]
    },
    revisarRules() {
      return {
        reviewStatus: [
          { required: true, message: this.$t('loanMarket.loanMarket34'), trigger: 'change' } /* 请选择是否通过 */
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('close', this.isSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.openDrawer = true
  },

  methods: {
    // 提交减免
    submit() {
      this.$refs['revisarRef'].validate(async(valid) => {
        if (valid) {
          this.revisarForm.userId = this.revisarRow.userId
          this.revisarForm.borrowId = this.revisarRow.borrowId
          const res = await loanReview(this.revisarForm)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.isSuccess = true
          this.sessionData('set', 'revisarRowSuccess', true)

          if (this.revisarForm.reviewStatus === 10) {
            this.$message.success(this.$t('collect.collect99')) /* 审核通过 */
          } else {
            this.$message.success(this.$t('collect.collect100')) /* 审核拒绝 */
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
