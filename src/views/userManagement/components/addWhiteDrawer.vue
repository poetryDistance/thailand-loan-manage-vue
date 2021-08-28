<template>
  <div>
    <!-- 添加黑名单 -->
    <el-drawer
      :title="$t('sysManage.sysManage12')"
      width="40%"
      :visible.sync="openAddDrawer"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addRef"
            :model="addForm"
            :rules="addRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="phone" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model="addForm.phone" :placeholder="$t('common.common29')" style="width: 178px;" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAdd">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addCustomerWhitePhone } from '@/api/userManagement'

export default {
  name: 'AddWhiteDrawer',
  data() {
    return {
      // 黑名单
      addForm: {},

      openAddDrawer: false,
      addSuccess: false
    }
  },

  computed: {
    addRules() {
      const phoneValid = (rule, value, callback) => {
        const reg = /^[+]{0,1}(\d+)$/g
        if (!reg.test(value)) {
          callback(new Error(this.$t('sysManage.sysManage71'))) /* 请输入正确的手机号 */
        } else {
          callback()
        }
      }
      return {
        phone: [
          { required: true, message: this.$t('common.common29'), trigger: 'blur' }, /* 请输入手机号 */
          { validator: phoneValid, trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    openAddDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddDrawer', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.openAddDrawer = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加黑名单
    submitAdd() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const res = await addCustomerWhitePhone(this.addForm)
          if (res.code !== '0' && !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddDrawer = false
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
