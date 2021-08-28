<template>
  <div>
    <!-- 修改角色 -->
    <el-drawer
      :title="$t('sysManage.sysManage89')"
      width="40%"
      :visible.sync="openUpdateRole"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="updateRoleRef"
            :model="updateRoleForm"
            :rules="updateRoleRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="name" :label="$t('sysManage.sysManage85') + ':'"> <!-- 角色名 -->
              <el-input v-model="updateRoleForm.name" :placeholder="$t('sysManage.sysManage86')" /> <!-- 请输入角色名 -->
            </el-form-item>
            <el-form-item prop="permissions" :label="$t('sysManage.sysManage87') + ':'"> <!-- 角色权限 -->
              <el-tree
                ref="tree"
                :data="roleMenu"
                :props="defaultProps"
                :default-checked-keys="defaultCheck"
                node-key="id"
                show-checkbox
                default-expand-all
                check-on-click-node
                :expand-on-click-node="false"
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button size="small" type="primary" @click="submitUpdateRole">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateRole = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getRolePermission, updateRole } from '@/api/sysManage'

export default {
  name: 'UpdateRoleDrawer',
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
      // 当前用户权限
      roleMenu: [],
      defaultCheck: [],
      defaultProps: {
        label: 'name',
        children: 'child'
      },
      // 添加角色
      updateRoleForm: {},

      openUpdateRole: false,
      updateSuccess: false
    }
  },
  computed: {
    updateRoleRules() {
      return {
        name: [{ required: true, message: this.$t('sysManage.sysManage86'), trigger: 'blur' }] /* 请输入角色名 */
      }
    }
  },
  watch: {
    openUpdateRole(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdateRole', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.roleMenu = this.sessionData('get', 'login_user').permissions
    this.updateRoleForm.id = this.currentRow.id
    this.updateRoleForm.name = this.currentRow.name
    this.getRolePermission()
    this.openUpdateRole = true
  },

  methods: {
    // 获取角色已有权限
    async getRolePermission() {
      const res = await getRolePermission({ id: this.currentRow.id })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.forEach(item => {
        // 判断是否是父节点
        const isFather = this.roleMenu.findIndex(val => val.id === item.permissionId)
        if (isFather === -1) {
          this.defaultCheck.push(item.permissionId)
        }
      })
      this.$refs.tree.setCheckedKeys(this.defaultCheck)
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 修改角色
    submitUpdateRole() {
      this.updateRoleForm.permissions = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()) || []
      if (this.updateRoleForm.permissions.length <= 0) return this.$message.error(this.$t('sysManage.sysManage88')) /* 至少选择一个角色权限 */
      this.$refs['updateRoleRef'].validate(async(valid) => {
        if (valid) {
          const res = await updateRole(this.updateRoleForm)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.updateSuccess = true
          this.openUpdateRole = false
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
