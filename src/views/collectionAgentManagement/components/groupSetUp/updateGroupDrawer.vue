<template>
  <div>
    <!-- 修改 -->
    <el-drawer
      :title="$t('sysManage.sysManage26')"
      width="40%"
      :visible.sync="openUpdateGroup"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="updateGroupRef"
            :model="updateGroupForm"
            :rules="updateGroupRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item v-if="!ids.collectionCompanyId" prop="companyName" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-input v-model="updateGroupForm.companyName" disabled />
            </el-form-item>
            <el-form-item prop="collectionLenderUserId" :label="$t('collector.collector5') + ': '"> <!-- 组长 -->
              <el-select
                v-model="updateGroupForm.collectionLenderUserId"
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
              <el-input v-model="updateGroupForm.groupName" :placeholder="$t('collector.collector4')" /> <!-- 请输入组名 -->
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdateGroup">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateGroup = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateGroup, getGroupCollectionUser } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'UpdateGroupDrawer',
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
      // 新增组
      roleOptions: [],
      updateGroupForm: {
        companyName: null,
        groupName: null,
        collectionLenderUserId: null
      },
      teamMembersOptions: [],

      openUpdateGroup: false,
      updateSuccess: false
    }
  },

  computed: {
    ...mapState({
      ids: state => state.permission.ids
    }),
    updateGroupRules() {
      return {
        groupName: [{ required: true, message: this.$t('collector.collector4'), trigger: 'blur' }] /* 请输入组名 */
      }
    }
  },

  watch: {
    openUpdateGroup(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdate', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.updateGroupForm.id = this.currentRow.id || ''
    this.updateGroupForm.companyName = this.currentRow.companyName || ''
    this.updateGroupForm.groupName = this.currentRow.groupName || ''
    this.updateGroupForm.collectionLenderUserId = this.currentRow.groupLeaderId * 1 || ''
    this.getGroupCollectionUser()
    this.openUpdateGroup = true
  },

  methods: {
    // 获取催收组下人员
    async getGroupCollectionUser(item) {
      const res = await getGroupCollectionUser({ groupId: this.currentRow.id })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.teamMembersOptions = res.data || []
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 修改催收公司
    submitUpdateGroup() {
      this.$refs['updateGroupRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.updateGroupForm) {
            tmp[k] = this.updateGroupForm[k]
          }
          tmp.collectionType = this.currentRow.collectionType
          const res = await updateGroup(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.updateSuccess = true
          this.openUpdateGroup = false
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
