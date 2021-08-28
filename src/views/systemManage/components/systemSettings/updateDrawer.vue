<template>
  <div>
    <!-- 新增 -->
    <el-drawer
      :title="$t('collector.collector3')"
      width="40%"
      :visible.sync="openUpdate"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="updateRef"
            :model="updateForm"
            :rules="updateRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="marketId" :label="$t('loanMarket.loanMarket1') + ':'"> <!-- 市场名称 -->
              <!-- 请选择市场名称 -->
              <el-select
                v-model="updateForm.marketId"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('loanMarket.loanMarket3')"
              >
                <el-option
                  v-for="item in marketNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="paramKey" :label="$t('sysManage.sysManage127') + ':'"> <!-- 键 -->
              <el-input v-model="updateForm.paramKey" :placeholder="$t('sysManage.sysManage128')" /> <!-- 请输入建 -->
            </el-form-item>
            <el-form-item prop="paramValue" :label="$t('sysManage.sysManage129') + ':'"> <!-- 值 -->
              <el-input v-model="updateForm.paramValue" :placeholder="$t('sysManage.sysManage130')" /> <!-- 请输入值 -->
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="updateForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdate">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdate = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateSysParam } from '@/api/sysManage'
import { getMarketNameList } from '@/api/loanSupermarket'

export default {
  name: 'UpdateDrawer',
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
      marketNameOptions: [],
      // 新增
      updateForm: {
        marketId: '',
        paramKey: '',
        paramValue: ''
      },

      openUpdate: false,
      updateSuccess: false
    }
  },

  computed: {
    updateRules() {
      return {
        marketId: [{ required: true, message: this.$t('loanMarket.loanMarket3'), trigger: 'change' }], /* 请选择市场名称 */
        paramKey: [{ required: true, message: this.$t('sysManage.sysManage128'), trigger: 'change' }], /* 请输入建 */
        paramValue: [{ required: true, message: this.$t('sysManage.sysManage130'), trigger: 'blur' }] /* 请输入值 */
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
    this.getMarketNameList()
    this.updateForm.id = this.currentRow.id || ''
    this.updateForm.marketId = this.currentRow.marketId || ''
    this.updateForm.paramKey = this.currentRow.paramKey || ''
    this.updateForm.paramValue = this.currentRow.paramValue || ''
    this.updateForm.remark = this.currentRow.remark || ''
    this.openUpdate = true
  },

  methods: {
    // 获取市场名称
    async getMarketNameList() {
      const res = await getMarketNameList()
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      res.data.forEach(item => {
        this.marketNameOptions.push({
          value: item.id,
          label: item.marketName
        })
      })
    },
    // 修改
    submitUpdate() {
      this.$refs['updateRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.updateForm) {
            if (this.updateForm[k]) {
              tmp[k] = this.updateForm[k]
            }
          }

          const res = await updateSysParam(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
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
