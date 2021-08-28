<template>
  <div>
    <!-- 修改风控配置 -->
    <el-drawer
      :title="$t('risk.risk12')"
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
            <el-form-item :label="$t('sysManage.sysManage91') + ': '"> <!-- 产品名称 -->
              <div>{{ currentRow.productName }}</div>
            </el-form-item>
            <el-form-item prop="modelType" :label="$t('sysManage.sysManage92') + ': '"> <!-- 模型类型 -->
              <el-select
                v-model="updateForm.modelType"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('borrow.borrow12')"
              > <!-- 请选择模型类型 -->
                <el-option
                  v-for="item in modelTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="compareType" :label="$t('risk.risk7') + ': '"> <!-- 模型分对比方法 -->
              <el-select
                v-model="updateForm.compareType"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('risk.risk11')"
              > <!-- 请选择模型分对比方法 -->
                <el-option
                  v-for="item in compareTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="maxScore" :label="$t('risk.risk5') + ':'"> <!-- 上限分 -->
              <el-input v-model="updateForm.maxScore" :placeholder="$t('risk.risk9')" /> <!-- 请输入上限分 -->
            </el-form-item>
            <el-form-item prop="minScore" :label="$t('risk.risk6') + ':'"> <!-- 下限分 -->
              <el-input v-model="updateForm.minScore" :placeholder="$t('risk.risk10')" /> <!-- 请输入下限分 -->
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddCollector">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdate = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateProductRisk } from '@/api/riskControlManagement'
import { mapState } from 'vuex'

export default {
  name: 'UpdateRiskDrawer',
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
      // 添加
      updateForm: {
        id: null,
        productId: null,
        modelType: null,
        compareType: null,
        maxScore: null,
        minScore: null
      },

      openUpdate: false,
      success: false
    }
  },

  computed: {
    ...mapState({
      modelTypeOptions: state => state.options.modelTypeOptions,
      compareTypeOptions: state => state.options.compareTypeOptions
    }),
    updateRules() {
      const numValid = (rule, value, callback) => {
        const reg = /^[0-9]\d*([.][0-9]{1,5})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage120'))) /* 请输入最多五位小数的数字值 */
        } else {
          callback()
        }
      }
      return {
        modelType: [{ required: true, message: this.$t('borrow.borrow12'), trigger: 'change' }], /* 请选择模型类型 */
        compareType: [{ required: true, message: this.$t('risk.risk11'), trigger: 'change' }], /* 请选择模型分对比方法 */
        maxScore: [
          { required: true, message: this.$t('risk.risk9'), trigger: 'blur' }, /* 请输入上限分 */
          { validator: numValid, trigger: 'blur' }
        ],
        minScore: [
          { required: true, message: this.$t('risk.risk10'), trigger: 'blur' }, /* 请输入下限分 */
          { validator: numValid, trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    openUpdate(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdate', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    if (this.currentRow.id) this.updateForm.id = this.currentRow.id
    if (this.currentRow.productId) this.updateForm.productId = this.currentRow.productId
    if (this.currentRow.modelType) this.updateForm.modelType = this.currentRow.modelType
    if (this.currentRow.compareType) this.updateForm.compareType = this.currentRow.compareType
    if (this.currentRow.maxScore) this.updateForm.maxScore = this.currentRow.maxScore
    if (this.currentRow.minScore) this.updateForm.minScore = this.currentRow.minScore
    this.openUpdate = true
  },

  methods: {
    // 添加
    submitAddCollector() {
      this.$refs['updateRef'].validate(async(valid) => {
        if (valid) {
          const res = await updateProductRisk(this.updateForm)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.success = true
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
