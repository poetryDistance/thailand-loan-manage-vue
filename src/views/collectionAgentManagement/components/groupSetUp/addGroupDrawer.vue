<template>
  <div>
    <!-- 新增 -->
    <el-drawer
      :title="$t('collector.collector3')"
      width="40%"
      :visible.sync="openAddGroup"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addGroupRef"
            :model="addGroupForm"
            :rules="addGroupRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item v-if="!ids.collectionCompanyId" prop="companyId" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-select
                v-model="addGroupForm.companyId"
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
            <el-form-item prop="collectionLenderUserId" :label="$t('collector.collector5') + ': '"> <!-- 组长 -->
              <el-select
                v-model="addGroupForm.collectionLenderUserId"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collector.collector6')"
              > <!-- 请选择组长 -->
                <el-option
                  v-for="item in teamMembersOptions"
                  :key="item.id"
                  :label="item.loginName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="groupName" :label="$t('collector.collector11') + ':'"> <!-- 催收组 -->
              <el-input v-model="addGroupForm.groupName" :placeholder="$t('collector.collector4')" /> <!-- 请输入组名 -->
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddGroup">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddGroup = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getCompanyUsers } from '@/api/sysManage'
import { addCollectionGroup, checkGroupName } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddGroupDrawer',
  data() {
    return {
      // 新增组
      roleOptions: [],
      addGroupForm: {},
      teamMembersOptions: [],
      collectionType: null,

      openAddGroup: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      ids: state => state.permission.ids
    }),
    addGroupRules() {
      return {
        companyId: [{ required: true, message: this.$t('sysManage.sysManage55'), trigger: 'change' }], /* 请选择公司名称 */
        groupName: [{ required: true, message: this.$t('collector.collector4'), trigger: 'blur' }] /* 请输入组名 */
      }
    }
  },

  watch: {
    openAddGroup(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    if (this.ids.collectionCompanyId) {
      this.addGroupForm.companyId = this.ids.collectionCompanyId
      this.companyChange(this.ids.collectionCompanyId)
    }
    this.openAddGroup = true
  },

  methods: {
    async companyChange(item) {
      const res = await getCompanyUsers({ collectionCompanyId: item })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.teamMembersOptions = res.data || []
      this.collectionType = this.companyNameOptions.filter(val => val.id === item)[0].collectionType
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加催收公司
    submitAddGroup() {
      this.$refs['addGroupRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addGroupForm) {
            tmp[k] = this.addGroupForm[k]
          }
          tmp.collectionType = this.collectionType

          // 验证催收组是否存在
          const data = await checkGroupName({ companyId: this.addGroupForm.companyId, groupName: this.addGroupForm.groupName })
          if (data.code !== '0') return this.$message.error(res.message || 'Error')
          if (!data.data) {
            this.addGroupForm.groupName = ''
            return this.$message.error(this.$t('collector.collector34')) /* 催收组已存在 */
          }

          const res = await addCollectionGroup(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddGroup = false
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
