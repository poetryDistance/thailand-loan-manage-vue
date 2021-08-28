<template>
  <div>
    <!-- 添加催收公司 -->
    <el-drawer
      :title="$t('sysManage.sysManage56')"
      width="40%"
      :visible.sync="openAddCompany"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addCompanyRef"
            :model="addCompanyForm"
            :rules="addCompanyRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="companyName" :label="$t('sysManage.sysManage57') + ':'"> <!-- 公司名 -->
              <el-input v-model="addCompanyForm.companyName" :placeholder="$t('sysManage.sysManage80')" /> <!-- 请输入公司名 -->
            </el-form-item>
            <el-form-item prop="collectionType" :label="$t('loanMarket.loanMarket64') + ':'"> <!-- 催收类型 -->
              <el-select v-model="addCompanyForm.collectionType" :placeholder="$t('loanMarket.loanMarket65')" style="width: 100%;"> <!-- 请选择催收类型 -->
                <el-option
                  v-for="item in collectionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="loginName" :label="$t('sysManage.sysManage79') + ':'"> <!-- 主管登录名 -->
              <el-input v-model="addCompanyForm.loginName" :placeholder="$t('sysManage.sysManage81')" /> <!-- 请输入主管登录名 -->
            </el-form-item>
            <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model.number="addCompanyForm.mobile" :placeholder="$t('common.common29')" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="email" :label="$t('sysManage.sysManage17') + ':'"> <!-- 邮箱 -->
              <el-input v-model="addCompanyForm.email" :placeholder="$t('sysManage.sysManage65')" /> <!-- 请输入邮箱 -->
            </el-form-item>

            <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> <!-- 密码 -->
              <!-- 请输入密码 -->
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="addCompanyForm.password"
                :type="passwordType"
                :placeholder="$t('sysManage.sysManage68')"
              />
              <span class="show-pwd" @click="showPwd(1)">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> <!-- 确认密码 -->
              <!-- 请再次输入密码 -->
              <el-input
                :key="confirmPwdType"
                ref="confirmPassword"
                v-model.trim="addCompanyForm.confirmPassword"
                :type="confirmPwdType"
                :placeholder="$t('sysManage.sysManage70')"
              />
              <span class="show-pwd" @click="showPwd(2)">
                <svg-icon :icon-class="confirmPwdType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <!-- <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> 密码
              <el-input v-model="addCompanyForm.password" :placeholder="$t('sysManage.sysManage68')" /> 请输入密码
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> 确认密码
              <el-input v-model="addCompanyForm.confirmPassword" :placeholder="$t('sysManage.sysManage70')" /> 请再次输入密码
            </el-form-item> -->
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addCompanyForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddCompany">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddCompany = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { encrypt } from '@/utils/crypto'
import { checkUserLoginName, checkCompanyName, addCompany } from '@/api/sysManage'
import { mapState } from 'vuex'

export default {
  name: 'AddCompanyDrawer',
  data() {
    return {
      // 添加用户
      roleOptions: [],
      addCompanyForm: {},

      openAddCompany: false,
      addSuccess: false,

      passwordType: 'password',
      confirmPwdType: 'password'
    }
  },

  computed: {
    ...mapState({
      collectionTypeOptions: state => state.options.collectionTypeOptions
    }),
    addCompanyRules() {
      const validateLoginName = async(rule, value, callback) => {
        // 验证用户登录名是否存在
        const data = await checkUserLoginName({ loginName: value })
        if (data.code !== '0') return this.$message.error(data.message || 'Error')
        if (!data.data) {
          callback(new Error(this.$t('sysManage.sysManage82'))) /* 主管登录名已被使用 */
        } else {
          callback()
        }
      }
      const validateCompanyName = async(rule, value, callback) => {
        // 验证公司名是否存在
        const data = await checkCompanyName({ companyName: value })
        if (data.code !== '0') return this.$message.error(data.message || 'Error')
        if (!data.data) {
          callback(new Error(this.$t('sysManage.sysManage123'))) /* 公司名已被使用 */
        } else {
          callback()
        }
      }
      const mobileValid = (rule, value, callback) => {
        const reg = /^[+]{0,1}(\d+)$/g
        if (!reg.test(value)) {
          callback(new Error(this.$t('sysManage.sysManage71'))) /* 请输入正确的手机号 */
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!value || value.length < 6) {
          callback(new Error(this.$t('sysManage.sysManage72'))) /* 密码不能少于6位 */
        } else {
          callback()
        }
      }
      const validateConfirmPwd = (rule, value, callback) => {
        if (!value || value.length < 6) {
          callback(new Error(this.$t('sysManage.sysManage72'))) /* 密码不能少于6位 */
        } else if (value !== this.addCompanyForm.password) {
          callback(new Error(this.$t('sysManage.sysManage73'))) /* 两次输入的密码不一致 */
        } else {
          callback()
        }
      }
      return {
        companyName: [
          { required: true, message: this.$t('sysManage.sysManage80'), trigger: 'blur' }, /* 请输入公司名 */
          { required: true, validator: validateCompanyName, trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: this.$t('sysManage.sysManage5'), trigger: 'blur' }, /* 请输入登录名 */
          { required: true, validator: validateLoginName, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: this.$t('common.common29'), trigger: 'blur' }, /* 请输入手机号 */
          { validator: mobileValid, trigger: 'blur' }
        ],
        roleId: [{ required: true, message: this.$t('sysManage.sysManage66'), trigger: 'change' }], /* 请选择角色 */
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }],
        collectionType: [{ required: true, message: this.$t('loanMarket.loanMarket65'), trigger: 'change' }] /* 请选择催收类型 */
      }
    }
  },

  watch: {
    openAddCompany(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddCompany', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.openAddCompany = true
  },

  methods: {
    showPwd(type) {
      if (type === 1) {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      } else if (type === 2) {
        if (this.confirmPwdType === 'password') {
          this.confirmPwdType = ''
        } else {
          this.confirmPwdType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.confirmPassword.focus()
        })
      }
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加催收公司
    submitAddCompany() {
      this.$refs['addCompanyRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addCompanyForm) {
            if (k === 'password') {
              // tmp[k] = md5(this.addCompanyForm.password)
              tmp[k] = encrypt(md5(this.addCompanyForm.password), this.keys, this.ivStr)
            } else if (k === 'confirmPassword') {
              continue
            } else {
              tmp[k] = this.addCompanyForm[k]
            }
          }
          const res = await addCompany(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          // 获取所有公司名和id
          this.$store.dispatch('options/getCompanyNameOptions')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddCompany = false
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
.show-pwd {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>
