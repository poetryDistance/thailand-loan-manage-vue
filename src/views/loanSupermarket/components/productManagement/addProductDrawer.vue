<template>
  <div>
    <!-- 添加产品 -->
    <el-drawer
      :title="$t('sysManage.sysManage90')"
      width="40%"
      :visible.sync="openAddDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addProductRef"
            :model="addProductForm"
            :rules="addProductRules"
            class="login-form"
            auto-complete="on"
            size="small"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="productName" :label="$t('sysManage.sysManage91') + ':'"> <!-- 产品名称 -->
              <el-input v-model="addProductForm.productName" :placeholder="$t('sysManage.sysManage104')" /> <!-- 请输入产品名称 -->
            </el-form-item>
            <el-form-item prop="marketId" :label="$t('loanMarket.loanMarket1') + ':'"> <!-- 市场名称 -->
              <!-- 请选择市场名称 -->
              <el-select
                v-model="addProductForm.marketId"
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
            <el-form-item prop="upTime" :label="$t('loanMarket.loanMarket26') + ':'"> <!-- 上架时间 -->
              <el-date-picker
                v-model="addProductForm.upTime"
                type="date"
                value-format="timestamp"
                :placeholder="$t('loanMarket.loanMarket28')"
                :picker-options="pickerOptions"
                style="width: 100%;"
              /> <!-- 请选择上架时间 -->
            </el-form-item>
            <el-form-item prop="downTime" :label="$t('loanMarket.loanMarket27') + ':'"> <!-- 下架时间 -->
              <el-date-picker
                v-model="addProductForm.downTime"
                type="date"
                value-format="timestamp"
                :placeholder="$t('loanMarket.loanMarket29')"
                :picker-options="pickerOptions"
                style="width: 100%;"
              /> <!-- 请选择下架时间 -->
            </el-form-item>
            <el-form-item prop="modelType" :label="$t('sysManage.sysManage92') + ':'"> <!-- 模型类型 -->
              <!-- 请选择模型分类型 -->
              <el-select
                v-model="addProductForm.modelType"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('sysManage.sysManage105')"
              >
                <el-option
                  v-for="item in modelTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="loanStartAmount" :label="$t('sysManage.sysManage93') + ':'"> <!-- 最小贷款金额 -->
              <el-row>
                <el-col :xs="18" :sm="20">
                  <el-input v-model="addProductForm.loanStartAmount" :placeholder="$t('sysManage.sysManage106')" /> <!-- 请输入最小贷款金额 -->
                </el-col>
                <el-col :xs="2" :sm="2" :offset="1"><span style="color: red;">MXN</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="loanEndAmount" :label="$t('sysManage.sysManage94') + ':'"> <!-- 最大贷款金额 -->
              <el-row>
                <el-col :xs="18" :sm="20">
                  <el-input v-model="addProductForm.loanEndAmount" :placeholder="$t('sysManage.sysManage107')" /> <!-- 请输入最大贷款金额 -->
                </el-col>
                <el-col :xs="2" :sm="2" :offset="1"><span style="color: red;">MXN</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="loanAmountStep" :label="$t('sysManage.sysManage95') + ':'"> <!-- 贷款金额步进值 -->
              <el-row>
                <el-col :xs="18" :sm="20">
                  <el-input v-model="addProductForm.loanAmountStep" :placeholder="$t('sysManage.sysManage108')" /> <!-- 请输入贷款金额步进值 -->
                </el-col>
                <el-col :xs="2" :sm="2" :offset="1"><span style="color: red;">MXN</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="deductedServiceRate" :label="$t('sysManage.sysManage96') + ':'"> <!-- 扣除手续费率 -->
              <el-input v-model="addProductForm.deductedServiceRate" :placeholder="$t('sysManage.sysManage109')" /> <!-- 请输入扣除手续费率 -->
            </el-form-item>
            <el-form-item prop="deductedTaxRate" :label="$t('sysManage.sysManage97') + ':'"> <!-- 扣除税费率 -->
              <el-input v-model="addProductForm.deductedTaxRate" :placeholder="$t('sysManage.sysManage110')" /> <!-- 请输入扣除税费率 -->
            </el-form-item>
            <el-form-item prop="normalInterestRate" :label="$t('sysManage.sysManage98') + ':'"> <!-- 正常还款利率 -->
              <el-input v-model="addProductForm.normalInterestRate" :placeholder="$t('sysManage.sysManage111')" /> <!-- 请输入正常还款时的利率 -->
            </el-form-item>
            <el-form-item prop="overdueInterestRate" :label="$t('sysManage.sysManage99') + ':'"> <!-- 逾期利率 -->
              <el-input v-model="addProductForm.overdueInterestRate" :placeholder="$t('sysManage.sysManage112')" /> <!-- 请输入逾期时的利率 -->
            </el-form-item>
            <el-form-item prop="periodUnit" :label="$t('sysManage.sysManage100') + ':'"> <!-- 期单位 -->
              <el-radio-group v-model="addProductForm.periodUnit">
                <el-radio v-for="item in periodUnitOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="periodCount" :label="$t('sysManage.sysManage101') + ':'"> <!-- 期数 -->
              <el-input v-model="addProductForm.periodCount" :placeholder="$t('sysManage.sysManage114')" @blur="countBlur(addProductForm.periodCount)" /> <!-- 请输入期数 -->
            </el-form-item>
            <!-- 期还款时间 -->
            <el-form-item
              v-for="(item, i) in addProductForm.repayTimes"
              :key="item.id"
              :prop="'repayTimes.' + i + '.value'"
              :label="(i+1) + $t('sysManage.sysManage118') + ':'"
              :rules="[
                { required: true, message: $t('sysManage.sysManage115'), trigger: 'blur' },
                { required: true, validator: validateRepay, trigger: 'blur' }
              ]"
            > <!-- 请选择还款时间 -->
              <el-row>
                <el-col :xs="19" :sm="21">
                  <el-input v-model="item.value" :placeholder="$t('sysManage.sysManage115')" /> <!-- 请输入还款时间 -->
                </el-col>
                <el-col :xs="1" :sm="1" :offset="1">{{ addProductForm.periodUnit | periodUnitFilter }}</el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="productRemark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addProductForm.productRemark"
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
import { addProduct, getMarketNameList } from '@/api/loanSupermarket'
import { mapState } from 'vuex'

export default {
  name: 'AddProductDrawer',
  data() {
    return {
      // 添加产品
      marketNameOptions: [],
      addProductForm: {
        repayTimes: [{
          value: ''
        }]
      },

      // 时间选择器限制当前时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      },

      openAddDrawer: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      modelTypeOptions: state => state.options.modelTypeOptions,
      periodUnitOptions: state => state.options.periodUnitOptions
    }),
    addProductRules() {
      const validateInt = (rule, value, callback) => {
        const reg = /^[1-9]\d*$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else {
          callback()
        }
      }
      const validateFloat = (rule, value, callback) => {
        const reg = /^[0-9]\d*([.][0-9]{1,5})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage120'))) /* 请输入最多五位小数的数字值 */
        } else {
          callback()
        }
      }
      const validateAmount = (rule, value, callback) => {
        const min = this.addProductForm.loanStartAmount * 1
        const max = this.addProductForm.loanEndAmount * 1
        if (min > max) {
          callback(new Error(this.$t('sysManage.sysManage121'))) /* 最小贷款金额不得大于最大贷款金额 */
        } else {
          callback()
        }
      }
      const validateStep = (rule, value, callback) => {
        const min = this.addProductForm.loanStartAmount * 1
        const max = this.addProductForm.loanEndAmount * 1
        const reg = /^[1-9]\d*$/g
        if (!(reg.test(parseFloat(value)) && value % 100 === 0)) {
          callback(new Error(this.$t('sysManage.sysManage134'))) /* 请输入一百的倍数 */
        } else if ((max - min) < parseFloat(value)) {
          callback(new Error(this.$t('sysManage.sysManage122'))) /* 步进值不得大于贷款金额 */
        } else {
          callback()
        }
      }
      const validateTime = (rule, value, callback) => {
        if (this.addProductForm.upTime > this.addProductForm.downTime) {
          callback(new Error(this.$t('loanMarket.loanMarket30'))) /* 下架时间不得小于上架时间 */
        } else {
          callback()
        }
      }
      return {
        productName: [{ required: true, message: this.$t('sysManage.sysManage104'), trigger: 'blur' }], /* 请输入产品名称 */
        marketId: [{ required: true, message: this.$t('loanMarket.loanMarket3'), trigger: 'change' }], /* 请选择市场名称 */
        modelType: [{ required: true, message: this.$t('sysManage.sysManage105'), trigger: 'change' }], /* 请选择模型分类型 */
        loanStartAmount: [
          { required: true, message: this.$t('sysManage.sysManage106'), trigger: 'blur' }, /* 请输入最小贷款金额 */
          { required: true, trigger: 'blur', validator: validateInt },
          { required: true, trigger: 'blur', validator: validateAmount }
        ],
        loanEndAmount: [
          { required: true, message: this.$t('sysManage.sysManage107'), trigger: 'blur' }, /* 请输入最大贷款金额 */
          { required: true, trigger: 'blur', validator: validateInt },
          { required: true, trigger: 'blur', validator: validateAmount }
        ],
        loanAmountStep: [
          { required: true, message: this.$t('sysManage.sysManage108'), trigger: 'blur' }, /* 请输入贷款金额步进值 */
          { required: true, trigger: 'blur', validator: validateStep }
        ],
        deductedServiceRate: [
          { required: true, message: this.$t('sysManage.sysManage109'), trigger: 'blur' }, /* 请输入扣除手续费率 */
          { required: true, validator: validateFloat, trigger: 'blur' }
        ],
        deductedTaxRate: [
          { required: true, message: this.$t('sysManage.sysManage110'), trigger: 'blur' }, /* 请输入扣除税费率 */
          { required: true, validator: validateFloat, trigger: 'blur' }
        ],
        normalInterestRate: [
          { required: true, message: this.$t('sysManage.sysManage111'), trigger: 'blur' }, /* 请输入正常还款时的利率 */
          { required: true, validator: validateFloat, trigger: 'blur' }
        ],
        overdueInterestRate: [
          { required: true, message: this.$t('sysManage.sysManage112'), trigger: 'blur' }, /* 请输入逾期时的利率 */
          { required: true, validator: validateFloat, trigger: 'blur' }
        ],
        upTime: [
          { required: true, message: this.$t('loanMarket.loanMarket28'), trigger: 'change' }, /* 请选择上架时间 */
          { required: true, trigger: 'change', validator: validateTime }
        ],
        downTime: [
          { required: true, message: this.$t('loanMarket.loanMarket29'), trigger: 'change' }, /* 请选择下架时间 */
          { required: true, trigger: 'change', validator: validateTime }
        ],
        periodUnit: [{ required: true, message: this.$t('sysManage.sysManage113'), trigger: 'change' }], /* 请选择期单位 */
        periodCount: [
          { required: true, message: this.$t('sysManage.sysManage114'), trigger: 'blur' }, /* 请输入期数 */
          { required: true, trigger: 'blur', validator: validateInt }
        ]
      }
    }
  },

  watch: {
    openAddDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.getMarketNameList()
    this.openAddDrawer = true
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
    validateRepay(rule, value, callback) {
      const i = rule.fullField.split('.')[1] * 1
      const reg = /^[0-9]\d*$/g
      if (!reg.test(value * 1)) {
        callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
      }
      if (i !== 0 && this.addProductForm.repayTimes[i - 1].value >= value) {
        callback(new Error(this.$t('sysManage.sysManage119'))) /* 当前期时间要大于前一期 */
      }
      callback()
    },
    // 改变期数
    countBlur(val) {
      this.addProductForm.repayTimes = [{
        value: ''
      }]
      for (let i = 0; i < val - 1; i++) {
        this.addProductForm.repayTimes.push({
          value: '',
          key: Date.now()
        })
      }
    },
    // 添加产品
    submitAdd() {
      this.$refs['addProductRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          const arr = []
          for (const k in this.addProductForm) {
            if (k === 'repayTimes') {
              this.addProductForm.repayTimes.forEach(item => {
                arr.push(item.value * 1)
              })
              tmp[k] = JSON.stringify(arr)
            } else {
              tmp[k] = this.addProductForm[k]
            }
          }
          const res = await addProduct(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
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
