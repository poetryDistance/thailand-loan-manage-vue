<template>
  <div>
    <!-- 新增风控配置 -->
    <el-drawer
      :title="$t('risk.risk8')"
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
            <el-form-item prop="productId" :label="$t('sysManage.sysManage91') + ': '"> <!-- 产品名称 -->
              <el-select
                v-model="addForm.productId"
                filterable
                :placeholder="$t('risk.risk4')"
                style="width: 100%;"
                @change="productChange"
              > <!-- 请选择产品名称 -->
                <el-option
                  v-for="item in productIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="modelType" :label="$t('sysManage.sysManage92') + ': '"> <!-- 模型类型 -->
              <el-select
                v-model="addForm.modelType"
                filterable
                clearable
                disabled
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
                v-model="addForm.compareType"
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
              <el-input v-model="addForm.maxScore" :placeholder="$t('risk.risk9')" /> <!-- 请输入上限分 -->
            </el-form-item>
            <el-form-item prop="minScore" :label="$t('risk.risk6') + ':'"> <!-- 下限分 -->
              <el-input v-model="addForm.minScore" :placeholder="$t('risk.risk10')" /> <!-- 请输入下限分 -->
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
import { addProductRisk, getNoRiskProduct } from '@/api/riskControlManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddRiskDrawer',
  data() {
    return {
      productIdOptions: [],
      // 添加
      addForm: {
        modelType: ''
      },

      openAdd: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      modelTypeOptions: state => state.options.modelTypeOptions,
      compareTypeOptions: state => state.options.compareTypeOptions
    }),
    addRules() {
      const validateFloat = (rule, value, callback) => {
        const reg = /^[0-9]\d*([.][0-9]{1,5})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage120'))) /* 请输入最多五位小数的数字值 */
        } else {
          callback()
        }
      }
      return {
        productId: [{ required: true, message: this.$t('risk.risk4'), trigger: 'change' }], /* 请选择产品名称 */
        modelType: [{ required: true, message: this.$t('borrow.borrow12'), trigger: 'change' }], /* 请选择模型类型 */
        compareType: [{ required: true, message: this.$t('risk.risk11'), trigger: 'change' }], /* 请选择模型分对比方法 */
        maxScore: [
          { required: true, message: this.$t('risk.risk9'), trigger: 'blur' }, /* 请输入上限分 */
          { validator: validateFloat, trigger: 'blur' }
        ],
        minScore: [
          { required: true, message: this.$t('risk.risk10'), trigger: 'blur' }, /* 请输入下限分 */
          { validator: validateFloat, trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    openAdd(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('close', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.getProduct()
    this.openAdd = true
  },

  methods: {
    // 获取产品
    async getProduct() {
      const res = await getNoRiskProduct()
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          this.productIdOptions.push({
            value: item.id,
            label: item.productName,
            modelType: item.modelType
          })
        })
      }
    },
    // 改变产品
    productChange(e) {
      const i = this.productIdOptions.findIndex(val => val.value === e)
      this.addForm.modelType = this.productIdOptions[i].modelType
    },
    // 添加
    submitAddCollector() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const res = await addProductRisk(this.addForm)
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
