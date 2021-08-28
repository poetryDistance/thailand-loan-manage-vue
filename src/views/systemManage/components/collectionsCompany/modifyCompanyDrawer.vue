<template>
  <div>
    <!-- 修改 -->
    <el-drawer
      :title="$t('sysManage.sysManage26')"
      width="40%"
      :visible.sync="openModifyCompany"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="modifyCompanyRef"
            :model="modifyCompanyForm"
            :rules="modifyCompanyRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="companyName" :label="$t('sysManage.sysManage57') + ':'"> <!-- 公司名 -->
              <el-input v-model="modifyCompanyForm.companyName" :placeholder="$t('sysManage.sysManage80')" /> <!-- 请输入公司名 -->
            </el-form-item>
            <el-form-item prop="collectionType" :label="$t('loanMarket.loanMarket64') + ':'"> <!-- 催收类型 -->
              <el-select v-model="modifyCompanyForm.collectionType" :placeholder="$t('loanMarket.loanMarket65')" style="width: 100%;"> <!-- 请选择催收类型 -->
                <el-option
                  v-for="item in collectionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="adminUserId" :label="$t('sysManage.sysManage79') + ':'"> <!-- 主管登录名 -->
              <el-select v-model="modifyCompanyForm.adminUserId" filterable :placeholder="$t('sysManage.sysManage83')" style="width: 100%;"> <!-- 请选择主管 -->
                <el-option
                  v-for="item in loginNameOptions"
                  :key="item.id"
                  :label="item.loginName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="modifyCompanyForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitModifyCompany">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openModifyCompany = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateCompany, getCompanyUsers, checkCompanyName } from '@/api/sysManage'
import { mapState } from 'vuex'

export default {
  name: 'ModifyCompanyDrawer',
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
      loginNameOptions: [],
      // 添加用户
      roleOptions: [],
      modifyCompanyForm: {
        companyName: null,
        adminUserId: null,
        remark: null,
        collectionType: null
      },

      openModifyCompany: false,
      modifySuccess: false
    }
  },
  computed: {
    ...mapState({
      collectionTypeOptions: state => state.options.collectionTypeOptions
    }),
    modifyCompanyRules() {
      const validateCompanyName = async(rule, value, callback) => {
        // 验证公司名是否存在
        const data = await checkCompanyName({ id: this.currentRow.id, companyName: value })
        if (data.code !== '0') return this.$message.error(data.message || 'Error')
        if (!data.data) {
          callback(new Error(this.$t('sysManage.sysManage123'))) /* 公司名已被使用 */
        } else {
          callback()
        }
      }
      return {
        companyName: [
          { required: true, message: this.$t('sysManage.sysManage80'), trigger: 'blur' }, /* 请输入公司名 */
          { required: true, validator: validateCompanyName, trigger: 'blur' }
        ],
        collectionType: [{ required: true, message: this.$t('loanMarket.loanMarket65'), trigger: 'change' }] /* 请选择催收类型 */
      }
    }
  },
  watch: {
    openModifyCompany(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeModifyCompany', this.modifySuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.modifyCompanyForm.id = this.currentRow.id || ''
    this.modifyCompanyForm.companyName = this.currentRow.companyName || ''
    this.modifyCompanyForm.remark = this.currentRow.remark || ''
    this.modifyCompanyForm.collectionType = this.currentRow.collectionType || ''
    this.getCompanyUsers()
    this.openModifyCompany = true
  },

  methods: {
    // 获取人员
    async getCompanyUsers() {
      const res = await getCompanyUsers({ collectionCompanyId: this.currentRow.id })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.loginNameOptions = res.data
    },

    // 修改催收公司
    submitModifyCompany() {
      this.$refs['modifyCompanyRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.modifyCompanyForm) {
            if (k === 'adminUserId' && this.modifyCompanyForm['adminUserId'] === this.currentRow.adminUserId) {
              continue
            }
            tmp[k] = this.modifyCompanyForm[k]
          }

          const res = await updateCompany(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          if (!res.data) return this.$message.error(res.message || 'Error')
          // 获取所有公司名和id
          this.$store.dispatch('options/getCompanyNameOptions')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.modifySuccess = true
          this.openModifyCompany = false
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
