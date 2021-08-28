<template>
  <div>
    <!-- 添加催收员 -->
    <el-drawer
      :title="$t('collector.collector31')"
      width="40%"
      :visible.sync="openAdd"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addCollectorRef"
            :model="addCollectorForm"
            :rules="addCollectorRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item v-if="!ids.collectionCompanyId" prop="collectionCompanyId" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-select
                v-model="addCollectorForm.collectionCompanyId"
                filterable
                :placeholder="$t('sysManage.sysManage55')"
                style="width: 100%;"
                @change="companyChange"
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
                v-model="addCollectorForm.collectionGroupId"
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
              <el-input v-model="addCollectorForm.loginName" :placeholder="$t('sysManage.sysManage5')" /> <!-- 请输入登录名 -->
            </el-form-item>
            <el-form-item prop="mobile" :label="$t('common.common28') + ':'"> <!-- 手机号 -->
              <el-input v-model.number="addCollectorForm.mobile" :placeholder="$t('common.common29')" /> <!-- 请输入手机号 -->
            </el-form-item>
            <el-form-item prop="email" :label="$t('sysManage.sysManage17') + ':'"> <!-- 邮箱 -->
              <el-input v-model="addCollectorForm.email" :placeholder="$t('sysManage.sysManage65')" /> <!-- 请输入邮箱 -->
            </el-form-item>
            <el-form-item prop="password" :label="$t('sysManage.sysManage67') + ':'"> <!-- 密码 -->
              <el-input v-model="addCollectorForm.password" :placeholder="$t('sysManage.sysManage68')" /> <!-- 请输入密码 -->
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('sysManage.sysManage69') + ':'"> <!-- 确认密码 -->
              <el-input v-model="addCollectorForm.confirmPassword" :placeholder="$t('sysManage.sysManage70')" /> <!-- 请再次输入密码 -->
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addCollectorForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddCollector">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAdd = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
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
import { addCollectionUser, getCompanyGroup } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddCollectorDrawer',
  data() {
    return {
      // 添加催收员
      addCollectorForm: {},
      groupOptions: [],

      openAdd: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      ids: state => state.permission.ids
    }),
    addCollectorRules() {
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
        } else if (value !== this.addCollectorForm.password) {
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
    openAdd(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    if (this.ids.collectionCompanyId) {
      this.addCollectorForm.collectionCompanyId = this.ids.collectionCompanyId
      this.companyChange(this.ids.collectionCompanyId)
    }
    this.openAdd = true
  },

  methods: {
    async companyChange(item) {
      const res = await getCompanyGroup({ collectionCompanyId: item })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupOptions = res.data || []
    },
    // 添加催收员
    submitAddCollector() {
      this.$refs['addCollectorRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addCollectorForm) {
            if (k === 'password') {
              // tmp[k] = md5(this.addCollectorForm.password)
              tmp[k] = encrypt(md5(this.addCollectorForm.password), this.keys, this.ivStr)
            } else if (k === 'confirmPassword') {
              continue
            } else {
              tmp[k] = this.addCollectorForm[k]
            }
          }
          tmp.collectionType = this.companyNameOptions.filter(val => val.id === this.addCollectorForm.collectionCompanyId)[0].collectionType

          const res = await addCollectionUser(tmp)
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
