<template>
  <div>
    <!-- 添加角色 -->
    <el-drawer
      :title="$t('sysManage.sysManage45')"
      width="40%"
      :visible.sync="openAddRole"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addRoleRef"
            :model="addRoleForm"
            :rules="addRoleRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="name" :label="$t('sysManage.sysManage85') + ':'"> <!-- 角色名 -->
              <el-input v-model="addRoleForm.name" :placeholder="$t('sysManage.sysManage86')" /> <!-- 请输入角色名 -->
            </el-form-item>
            <el-form-item prop="permissions" :label="$t('sysManage.sysManage87') + ':'"> <!-- 角色权限 -->
              <el-tree
                ref="tree"
                :data="roleMenu"
                :props="defaultProps"
                node-key="id"
                show-checkbox
                default-expand-all
                check-on-click-node
                :expand-on-click-node="false"
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button size="small" type="primary" @click="submitAddRole">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddRole = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addRole } from '@/api/sysManage'

export default {
  name: 'AddRoleDrawer',
  props: {},
  data() {
    return {
      // 当前用户权限
      roleMenu: [],
      defaultProps: {
        label: 'name',
        children: 'child'
      },
      // 添加角色
      addRoleForm: {},

      openAddRole: false,
      addSuccess: false
    }
  },
  computed: {
    addRoleRules() {
      return {
        name: [{ required: true, message: this.$t('sysManage.sysManage86'), trigger: 'blur' }] /* 请输入角色名 */
      }
    }
  },
  watch: {
    openAddRole(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddRole', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.roleMenu = this.sessionData('get', 'login_user').permissions
    this.openAddRole = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加角色
    submitAddRole() {
      this.addRoleForm.permissions = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()) || []
      if (this.addRoleForm.permissions.length <= 0) return this.$message.error(this.$t('sysManage.sysManage88')) /* 至少选择一个角色权限 */
      this.$refs['addRoleRef'].validate(async(valid) => {
        if (valid) {
          const res = await addRole(this.addRoleForm)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddRole = false
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
