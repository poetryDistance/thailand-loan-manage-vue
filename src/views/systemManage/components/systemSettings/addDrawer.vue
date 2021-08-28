<template>
  <div>
    <!-- 新增 -->
    <el-drawer
      :title="$t('collector.collector3')"
      width="40%"
      :visible.sync="openAdd"
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
            <el-form-item prop="marketId" :label="$t('loanMarket.loanMarket1') + ':'"> <!-- 市场名称 -->
              <!-- 请选择市场名称 -->
              <el-select
                v-model="addForm.marketId"
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
              <el-input v-model="addForm.paramKey" :placeholder="$t('sysManage.sysManage128')" /> <!-- 请输入建 -->
            </el-form-item>
            <el-form-item prop="paramValue" :label="$t('sysManage.sysManage129') + ':'"> <!-- 值 -->
              <el-input v-model="addForm.paramValue" :placeholder="$t('sysManage.sysManage130')" /> <!-- 请输入值 -->
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
              <el-button size="small" @click="openAdd = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addSysParam } from '@/api/sysManage'
import { getMarketNameList } from '@/api/loanSupermarket'

export default {
  name: 'AddDrawer',
  data() {
    return {
      marketNameOptions: [],
      // 新增
      addForm: {},

      openAdd: false,
      addSuccess: false
    }
  },

  computed: {
    addRules() {
      return {
        marketId: [{ required: true, message: this.$t('loanMarket.loanMarket3'), trigger: 'change' }], /* 请选择市场名称 */
        paramKey: [{ required: true, message: this.$t('sysManage.sysManage128'), trigger: 'change' }], /* 请输入建 */
        paramValue: [{ required: true, message: this.$t('sysManage.sysManage130'), trigger: 'blur' }] /* 请输入值 */
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
    this.getMarketNameList()
    this.openAdd = true
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
    // 添加
    submitAdd() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addForm) {
            if (this.addForm[k]) {
              tmp[k] = this.addForm[k]
            }
          }

          const res = await addSysParam(tmp)
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
