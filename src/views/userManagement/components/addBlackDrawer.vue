<template>
  <div>
    <!-- 添加黑名单 -->
    <el-drawer
      :title="$t('sysManage.sysManage12')"
      width="40%"
      :visible.sync="openAddDrawer"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addRef"
            :model="addForm"
            :rules="addRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="content" :label="$t('risk.risk55') + ':'"> <!-- 身份证号或手机号 -->
              <el-input v-model="addForm.content" :placeholder="$t('risk.risk56')" /> <!-- 请输入身份证号或手机号 -->
            </el-form-item>
            <el-form-item prop="type" :label="$t('collect.collect67') + ': '"> <!-- 类型 -->
              <el-select
                v-model="addForm.type"
                filterable
                clearable
                :placeholder="$t('sysManage.sysManage7')"
              > <!-- 请选择类型 -->
                <el-option
                  v-for="item in blackTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAdd">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addCustomerBlack } from '@/api/userManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddBlackDrawer',
  props: {
    idCardNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 黑名单
      addForm: {
        content: ''
      },

      openAddDrawer: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      blackTypeOptions: state => state.options.blackTypeOptions
    }),
    addRules() {
      return {
        content: [
          { required: true, message: this.$t('risk.risk56'), trigger: 'blur' } /* 请输入身份证号或手机号 */
        ],
        type: [
          { required: true, message: this.$t('sysManage.sysManage7'), trigger: 'change' } /* 请选择类型 */
        ]
      }
    }
  },

  watch: {
    openAddDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAddDrawer', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    if (this.idCardNo) {
      this.addForm.content = this.idCardNo
    }
    this.openAddDrawer = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加黑名单
    submitAdd() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const res = await addCustomerBlack(this.addForm)
          if (res.code !== '0' && !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddDrawer = false
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
