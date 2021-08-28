<template>
  <div>
    <!-- 添加还款账号 -->
    <el-drawer
      :title="$t('sysManage.sysManage135')"
      width="40%"
      :visible.sync="openAdd"
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
            <el-form-item prop="chineseName" :label="$t('sysManage.sysManage138') + ':'"> <!-- 中文名称 -->
              <el-input v-model="addForm.chineseName" :placeholder="$t('sysManage.sysManage141')" /> <!-- 请输入中文名称 -->
            </el-form-item>
            <el-form-item prop="abbreviation" :label="$t('sysManage.sysManage136') + ':'"> <!-- 英文简写 -->
              <el-input v-model="addForm.abbreviation" :placeholder="$t('sysManage.sysManage142')" /> <!-- 请输入英文简写 -->
            </el-form-item>
            <el-form-item prop="account" :label="$t('sysManage.sysManage137') + ':'"> <!-- 卡号 -->
              <el-input v-model.number="addForm.account" :placeholder="$t('sysManage.sysManage143')" /> <!-- 请输入卡号 -->
            </el-form-item>
            <el-form-item prop="thaiName" :label="$t('sysManage.sysManage140') + ':'"> <!-- 泰语银行名称 -->
              <el-input v-model="addForm.thaiName" :placeholder="$t('sysManage.sysManage144')" /> <!-- 请输入泰语银行名称 -->
            </el-form-item>
            <!-- <el-form-item prop="pictureUrl" :label="$t('sysManage.sysManage139') + ':'"> 银行卡图片地址
              <el-input v-model="addForm.pictureUrl" :placeholder="$t('sysManage.sysManage145')" /> 请输入银行卡图片地址
            </el-form-item> -->
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAdd">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAdd = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addRepayAccount } from '@/api/sysManage'

export default {
  name: 'AddRepaymentDrawer',
  data() {
    return {
      // 添加还款账号
      addForm: {},

      openAdd: false,
      addSuccess: false
    }
  },

  computed: {
    addRules() {
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
    openAdd(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.openAdd = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加还款账号
    submitAdd() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const res = await addRepayAccount(this.addForm)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAdd = false
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
