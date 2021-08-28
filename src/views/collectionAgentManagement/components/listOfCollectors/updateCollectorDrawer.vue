<template>
  <div>
    <!-- 修改 -->
    <el-drawer
      :title="$t('sysManage.sysManage26')"
      width="40%"
      :visible.sync="openUpdate"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            v-if="!currentRow.isPwd"
            ref="updateCollectorRef"
            :model="updateCollectorForm"
            :rules="updateCollectorRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item v-if="!ids.collectionCompanyId" prop="collectionCompanyId" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-select
                v-model="updateCollectorForm.collectionCompanyId"
                filterable
                disabled
                :placeholder="$t('sysManage.sysManage55')"
                style="width: 100%;"
              > <!-- 请选择公司名 -->
                <el-option
                  v-for="item in companyNameOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="collectionGroupId" :label="$t('collector.collector15') + ': '"> <!-- 组 -->
              <el-select
                v-model="updateCollectorForm.collectionGroupId"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collector.collector16')"
              > <!-- 请选择组 -->
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="loginName" :label="$t('sysManage.sysManage1') + ':'"> <!-- 登录名 -->
              <el-input v-model="updateCollectorForm.loginName" :placeholder="$t('sysManage.sysManage5')" /> <!-- 请输入登录名 -->
            </el-form-item>
            <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model.number="updateCollectorForm.mobile" :placeholder="$t('common.common29')" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="email" :label="$t('sysManage.sysManage17') + ':'"> <!-- 邮箱 -->
              <el-input v-model="updateCollectorForm.email" :placeholder="$t('sysManage.sysManage65')" /> <!-- 请输入邮箱 -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="submitUpdateCollector">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdate = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>

          <el-form
            v-else
            ref="updateCollectorRef"
            :model="updateCollectorForm"
            :rules="updateCollectorRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> <!-- 密码 -->
              <el-input v-model="updateCollectorForm.password" :placeholder="$t('sysManage.sysManage68')" /> <!-- 请输入密码 -->
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> <!-- 确认密码 -->
              <el-input v-model="updateCollectorForm.confirmPassword" :placeholder="$t('sysManage.sysManage70')" /> <!-- 请再次输入密码 -->
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="resetPwd">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdate = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
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
import { checkUserLoginName } from '@/api/sysManage'
import { updateCollectionUser, getCompanyGroup } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'UpdateCollectorDrawer',
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
      // 修改催收员
      updateCollectorForm: {
        collectionCompanyId: null,
        collectionGroupId: null,
        loginName: null,
        mobile: null,
        email: null,
        remark: null
      },
      groupOptions: [],

      openUpdate: false,
      updateSuccess: false
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      ids: state => state.permission.ids
    }),
    updateCollectorRules() {
      const validateLoginName = async(rule, value, callback) => {
        // 验证用户登录名是否存在
        const data = await checkUserLoginName({ loginName: value, id: this.currentRow.id })
        if (data.code !== '0') return this.$message.error(data.message || 'Error')
        if (!data.data) {
          callback(new Error(this.$t('sysManage.sysManage74'))) /* 登录名已被使用 */
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
        } else if (value !== this.updateCollectorForm.password) {
          callback(new Error(this.$t('sysManage.sysManage73'))) /* 两次输入的密码不一致 */
        } else {
          callback()
        }
      }
      return {
        collectionCompanyId: [{ required: true, message: this.$t('sysManage.sysManage55'), trigger: 'change' }], /* 请选择公司名称 */
        collectionGroupId: [{ required: true, message: this.$t('collector.collector16'), trigger: 'change' }], /* 请选择组 */
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
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPwd }]
      }
    }
  },

  watch: {
    openUpdate(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdate', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.updateCollectorForm.id = this.currentRow.id || ''
    if (!this.currentRow.isPwd) {
      this.updateCollectorForm.collectionCompanyId = this.currentRow.companyId || ''
      this.updateCollectorForm.collectionGroupId = this.currentRow.groupId || ''
      this.updateCollectorForm.loginName = this.currentRow.collectionName || ''
      this.updateCollectorForm.mobile = this.currentRow.mobile || ''
      this.updateCollectorForm.email = this.currentRow.email || ''
    }
    this.getCompanyGroup()
    this.openUpdate = true
  },

  methods: {
    async getCompanyGroup() {
      const res = await getCompanyGroup({ collectionCompanyId: this.currentRow.companyId })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupOptions = res.data || []
    },
    // 修改催收员
    submitUpdateCollector() {
      this.$refs['updateCollectorRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.updateCollectorForm) {
            if (this.updateCollectorForm[k]) {
              tmp[k] = this.updateCollectorForm[k]
            }
          }
          tmp.collectionType = this.companyNameOptions.filter(val => val.id === this.updateCollectorForm.collectionCompanyId)[0].collectionType

          const res = await updateCollectionUser(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.updateSuccess = true
          this.openUpdate = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置密码
    resetPwd() {
      this.$refs['updateCollectorRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          // tmp['password'] = md5(this.updateCollectorForm.password)
          tmp['password'] = encrypt(md5(this.updateCollectorForm.password), this.keys, this.ivStr)
          tmp['loginName'] = this.currentRow.collectionName
          tmp['id'] = this.currentRow.id

          const res = await updateCollectionUser(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage77')) /* 重置密码成功 */
          this.updateSuccess = true
          this.openUpdate = false
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
