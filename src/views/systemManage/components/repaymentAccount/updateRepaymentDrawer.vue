<template>
  <div>
    <!-- 修改还款账号 -->
    <el-drawer
      :title="$t('sysManage.sysManage147')"
      width="40%"
      :visible.sync="openUpdateDrawer"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="updateRef"
            :model="updateForm"
            :rules="updateRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="chineseName" :label="$t('sysManage.sysManage138') + ':'"> <!-- 中文名称 -->
              <el-input v-model="updateForm.chineseName" :placeholder="$t('sysManage.sysManage141')" /> <!-- 请输入中文名称 -->
            </el-form-item>
            <el-form-item prop="abbreviation" :label="$t('sysManage.sysManage136') + ':'"> <!-- 英文简写 -->
              <el-input v-model="updateForm.abbreviation" :placeholder="$t('sysManage.sysManage142')" /> <!-- 请输入英文简写 -->
            </el-form-item>
            <el-form-item prop="account" :label="$t('sysManage.sysManage137') + ':'"> <!-- 卡号 -->
              <el-input v-model.number="updateForm.account" :placeholder="$t('sysManage.sysManage143')" /> <!-- 请输入卡号 -->
            </el-form-item>
            <el-form-item prop="thaiName" :label="$t('sysManage.sysManage140') + ':'"> <!-- 泰语银行名称 -->
              <el-input v-model="updateForm.thaiName" :placeholder="$t('sysManage.sysManage144')" /> <!-- 请输入泰语银行名称 -->
            </el-form-item>
            <!-- <el-form-item prop="pictureUrl" :label="$t('sysManage.sysManage139') + ':'"> 银行卡图片地址
              <el-input v-model="updateForm.pictureUrl" :placeholder="$t('sysManage.sysManage145')" /> 请输入银行卡图片地址
            </el-form-item> -->
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdate">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateRepayAccount } from '@/api/sysManage'

export default {
  name: 'UpdateRepaymentDrawer',
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
      // 修改还款账号
      updateForm: {
        id: null,
        chineseName: null,
        abbreviation: null,
        account: null,
        thaiName: null
      },

      openUpdateDrawer: false,
      updateSuccess: false
    }
  },

  computed: {
    updateRules() {
      const intValid = (rule, value, callback) => {
        const reg = /^[0-9]*$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('sysManage.sysManage146'))) /* 请输入正确的卡号 */
        } else {
          callback()
        }
      }
      return {
        chineseName: [{ required: true, message: this.$t('sysManage.sysManage141'), trigger: 'blur' }], /* 请输入中文名称 */
        abbreviation: [{ required: true, message: this.$t('sysManage.sysManage142'), trigger: 'blur' }], /* 请输入英文简写 */
        account: [
          { required: true, message: this.$t('sysManage.sysManage143'), trigger: 'blur' }, /* 请输入卡号 */
          { required: true, trigger: 'blur', validator: intValid }
        ],
        thaiName: [{ required: true, message: this.$t('sysManage.sysManage144'), trigger: 'blur' }] /* 请输入泰语银行名称 */
      }
    }
  },

  watch: {
    openUpdateDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdate', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    if (this.currentRow.id) this.updateForm.id = this.currentRow.id
    if (this.currentRow.chineseName) this.updateForm.chineseName = this.currentRow.chineseName
    if (this.currentRow.abbreviation) this.updateForm.abbreviation = this.currentRow.abbreviation
    if (this.currentRow.account) this.updateForm.account = this.currentRow.account
    if (this.currentRow.thaiName) this.updateForm.thaiName = this.currentRow.thaiName

    this.openUpdateDrawer = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 修改用户
    submitUpdate() {
      this.$refs['updateRef'].validate(async(valid) => {
        if (valid) {
          const res = await updateRepayAccount(this.updateForm)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.updateSuccess = true
          this.openUpdateDrawer = false
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
