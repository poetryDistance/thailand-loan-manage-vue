<template>
  <div>
    <!-- 重置密码  修改用户 -->
    <el-drawer
      :title="currentRow.isResetPwd ? $t('sysManage.sysManage30') : $t('sysManage.sysManage76')"
      width="40%"
      :visible.sync="openUpdateUser"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            v-if="!currentRow.isResetPwd"
            ref="updateUserRef"
            :model="updateUserForm"
            :rules="updateUserRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item v-if="currentRow.userType !== 20" prop="department" :label="$t('sysManage.sysManage15') + ':'"> <!-- 部门 -->
              <el-input v-model="updateUserForm.department" :placeholder="$t('sysManage.sysManage63')" /> <!-- 请输入部门 -->
            </el-form-item>
            <el-form-item prop="loginName" :label="$t('sysManage.sysManage1') + ':'"> <!-- 登录名 -->
              <el-input v-model="updateUserForm.loginName" :placeholder="$t('sysManage.sysManage5')" disabled /> <!-- 请输入登录名 -->
            </el-form-item>
            <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model.number="updateUserForm.mobile" :placeholder="$t('common.common29')" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="email" :label="$t('sysManage.sysManage17') + ':'"> <!-- 邮箱 -->
              <el-input v-model="updateUserForm.email" :placeholder="$t('sysManage.sysManage65')" /> <!-- 请输入邮箱 -->
            </el-form-item>
            <el-form-item prop="roleId" :label="$t('sysManage.sysManage44') + ':'"> <!-- 角色 -->
              <el-select v-model="updateUserForm.roleId" filterable disabled :placeholder="$t('sysManage.sysManage66')" style="width: 100%;"> <!-- 请选择角色 -->
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdateUser">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateUser = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>

          <el-form
            v-else
            ref="updateUserRef"
            :model="resetPassword"
            :rules="updateUserRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> <!-- 密码 -->
              <!-- 请输入密码 -->
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="resetPassword.password"
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
                v-model.trim="resetPassword.confirmPassword"
                :type="confirmPwdType"
                :placeholder="$t('sysManage.sysManage70')"
              />
              <span class="show-pwd" @click="showPwd(2)">
                <svg-icon :icon-class="confirmPwdType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <!-- <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> 密码
              <el-input v-model="resetPassword.password" :placeholder="$t('sysManage.sysManage68')" /> 请输入密码
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> 确认密码
              <el-input v-model="resetPassword.confirmPassword" :placeholder="$t('sysManage.sysManage70')" /> 请再次输入密码
            </el-form-item> -->
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdateUser">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateUser = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
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
import { updatePassword, getRoleList } from '@/api/sysManage'

export default {
  name: 'UpdateUserDrawer',
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
      // 修改用户
      roleOptions: [],
      updateUserForm: {
        department: null,
        loginName: null,
        mobile: null,
        email: null,
        roleId: null
      },
      // 重置密码
      resetPassword: {},
      passwordType: 'password',
      confirmPwdType: 'password',

      openUpdateUser: false,
      updateSuccess: false
    }
  },

  computed: {
    updateUserRules() {
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
        } else if (value !== this.resetPassword.password) {
          callback(new Error(this.$t('sysManage.sysManage73'))) /* 两次输入的密码不一致 */
        } else {
          callback()
        }
      }
      return {
        loginName: [{ required: true, message: this.$t('sysManage.sysManage5'), trigger: 'blur' }], /* 请输入登录名 */
        mobile: [
          { required: true, message: this.$t('common.common29'), trigger: 'blur' }, /* 请输入手机号 */
          { validator: mobileValid, trigger: 'blur' }
        ],
        roleId: [{ required: true, message: this.$t('sysManage.sysManage66'), trigger: 'change' }], /* 请选择角色 */
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }]
      }
    }
  },

  watch: {
    openUpdateUser(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdateUser', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.getRoleList()

    if (!this.currentRow.isResetPwd) {
      if (this.currentRow.department) this.updateUserForm.department = this.currentRow.department
      // if (this.currentRow.nickname) this.updateUserForm.nickname = this.currentRow.nickname
      if (this.currentRow.loginName) this.updateUserForm.loginName = this.currentRow.loginName
      if (this.currentRow.mobile) this.updateUserForm.mobile = this.currentRow.mobile
      if (this.currentRow.email) this.updateUserForm.email = this.currentRow.email
      if (this.currentRow.roleId) this.updateUserForm.roleId = this.currentRow.roleId
    }

    this.openUpdateUser = true
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
    // 获取所有角色
    async getRoleList() {
      const res = await getRoleList({ page: 1, size: 100 })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.list.forEach(item => {
        if (item.id !== 49 && item.id !== 50 && item.id !== 51) {
          this.roleOptions.push({
            value: item.id,
            label: item.name
          })
        }
      })
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 修改用户
    submitUpdateUser() {
      this.$refs['updateUserRef'].validate(async(valid) => {
        if (valid) {
          let tmp = {}
          // 是否是重置密码
          if (this.currentRow.isResetPwd) {
            tmp.loginName = this.currentRow.loginName
            // tmp.password = md5(this.resetPassword.password)
            tmp.password = encrypt(md5(this.resetPassword.password), this.keys, this.ivStr)
          } else {
            tmp = { ...this.updateUserForm }
          }
          if (this.currentRow.id) tmp.userId = this.currentRow.id
          const res = await updatePassword(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.currentRow.isResetPwd ? this.$t('sysManage.sysManage77') : this.$t('sysManage.sysManage78')) /* 重置密码成功  修改成功 */
          this.updateSuccess = true
          this.openUpdateUser = false
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
