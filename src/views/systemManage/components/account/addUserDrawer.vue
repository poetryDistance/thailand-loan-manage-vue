<template>
  <div>
    <!-- 添加用户 -->
    <el-drawer
      :title="$t('sysManage.sysManage12')"
      width="40%"
      :visible.sync="openAddUser"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addUserRef"
            :model="addUserForm"
            :rules="addUserRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="department" :label="$t('sysManage.sysManage15') + ':'"> <!-- 部门 -->
              <el-input v-model="addUserForm.department" :placeholder="$t('sysManage.sysManage63')" /> <!-- 请输入部门 -->
            </el-form-item>
            <el-form-item prop="loginName" :label="$t('sysManage.sysManage1') + ':'"> <!-- 登录名 -->
              <el-input v-model="addUserForm.loginName" :placeholder="$t('sysManage.sysManage5')" /> <!-- 请输入登录名 -->
            </el-form-item>
            <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model.number="addUserForm.mobile" :placeholder="$t('common.common29')" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="email" :label="$t('sysManage.sysManage17') + ':'"> <!-- 邮箱 -->
              <el-input v-model="addUserForm.email" :placeholder="$t('sysManage.sysManage65')" /> <!-- 请输入邮箱 -->
            </el-form-item>
            <el-form-item prop="roleId" :label="$t('sysManage.sysManage44') + ':'"> <!-- 角色 -->
              <el-select v-model="addUserForm.roleId" filterable :placeholder="$t('sysManage.sysManage66')" style="width: 100%;"> <!-- 请选择角色 -->
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> <!-- 密码 -->
              <!-- 请输入密码 -->
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="addUserForm.password"
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
                v-model.trim="addUserForm.confirmPassword"
                :type="confirmPwdType"
                :placeholder="$t('sysManage.sysManage70')"
              />
              <span class="show-pwd" @click="showPwd(2)">
                <svg-icon :icon-class="confirmPwdType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <!-- <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> 密码
              <el-input v-model="addUserForm.password" :placeholder="$t('sysManage.sysManage68')" /> 请输入密码
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> 确认密码
              <el-input v-model="addUserForm.confirmPassword" :placeholder="$t('sysManage.sysManage70')" /> 请再次输入密码
            </el-form-item> -->
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddUser">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddUser = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
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
import { checkUserLoginName, addUser, getRoleList } from '@/api/sysManage'

export default {
  name: 'AddUserDrawer',
  data() {
    return {
      // 添加用户
      roleOptions: [],
      addUserForm: {},

      openAddUser: false,
      addSuccess: false,

      passwordType: 'password',
      confirmPwdType: 'password'
    }
  },

  computed: {
    addUserRules() {
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
        } else if (value !== this.addUserForm.password) {
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
    openAddUser(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddUser', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.getRoleList()
    this.openAddUser = true
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
        if (item.id !== 49 && item.id !== 50 && item.id !== 55 && item.id !== 57) {
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
    // 添加用户
    submitAddUser() {
      this.$refs['addUserRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addUserForm) {
            if (k === 'password') {
              // tmp[k] = md5(this.addUserForm.password)
              tmp[k] = encrypt(md5(this.addUserForm.password), this.keys, this.ivStr)
            } else if (k === 'confirmPassword') {
              break
            } else {
              tmp[k] = this.addUserForm[k]
            }
          }
          // 验证用户登录名是否存在
          const data = await checkUserLoginName({ loginName: this.addUserForm.loginName })
          if (data.code !== '0') return this.$message.error(data.message || 'Error')
          if (!data.data) return this.$message.error(this.$t('sysManage.sysManage74')) /* 登录名已被使用 */

          const res = await addUser(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddUser = false
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
