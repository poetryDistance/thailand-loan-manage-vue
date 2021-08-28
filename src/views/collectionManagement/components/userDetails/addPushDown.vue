<template>
  <div>
    <!-- 新增提醒 : 新增催记 -->
    <el-drawer
      :title="isRemind ? $t('loanMarket.loanMarket73') : $t('collect.collect42')"
      width="40%"
      :visible.sync="openDrawer"
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
            size="small"
          >
            <el-form-item prop="relation" :label="$t('collect.collect53') + ': '"> <!-- 联系人与债主的关系 -->
              <el-select
                v-model="addForm.relation"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collect.collect71')"
                @change="relationChange"
              > <!-- 请选择联系人与债主的关系 -->
                <el-option
                  v-for="item in relationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="relationName" :label="$t('collect.collect49') + ': '"> <!-- 联系人姓名 -->
              <el-input v-model="addForm.relationName" :placeholder="$t('collect.collect50')" /> <!-- 请输入联系人姓名 -->
            </el-form-item>
            <el-form-item prop="relationMobile" :label="$t('collect.collect51') + ': '"> <!-- 联系人电话 -->
              <el-input v-model="addForm.relationMobile" :placeholder="$t('collect.collect52')" /> <!-- 请输入联系人电话 -->
            </el-form-item>
            <el-form-item v-if="addForm.answer !== 0" prop="principal" :label="$t('collect.collect45') + ': '"> <!-- 承诺还款金额 -->
              <el-input v-model="addForm.commitmentAmount" :placeholder="$t('collect.collect46')" /> <!-- 请输入承诺还款金额 -->
            </el-form-item>
            <el-form-item v-if="addForm.answer !== 0" prop="commitmentTime" :label="$t('collect.collect47') + ': '"> <!-- 承诺还款时间 -->
              <el-date-picker
                v-model="addForm.commitmentTime"
                type="datetime"
                value-format="timestamp"
                style="width: 100%;"
                :placeholder="$t('collect.collect48')"
                :picker-options="pickerOptions"
              /> <!-- 选择日期时间 -->
            </el-form-item>
            <el-form-item v-if="addForm.answer !== 0" prop="remindTime" :label="$t('collect.collect63') + ': '"> <!-- 下次跟进时间 -->
              <el-date-picker
                v-model="addForm.remindTime"
                type="datetime"
                value-format="timestamp"
                style="width: 100%;"
                :placeholder="$t('collect.collect48')"
                :picker-options="pickerOptions"
              /> <!-- 选择日期时间 -->
            </el-form-item>
            <el-form-item v-if="addForm.answer !== 0" prop="repayWish" :label="$t('collect.collect65') + ': '"> <!-- 还款意愿 -->
              <el-select
                v-model="addForm.repayWish"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collect.collect73')"
              > <!-- 请选择还款意愿 -->
                <el-option
                  v-for="item in repayWishOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item prop="type" :label="$t('collect.collect67') + ': '"> 类型
              <el-radio-group v-model="addForm.type">
                <el-radio :label="0">{{ $t('common.common36') }}</el-radio> 催收
                <el-radio :label="1">{{ $t('common.common37') }}</el-radio> 客服
              </el-radio-group>
            </el-form-item> -->
            <el-form-item prop="flag" :label="$t('collect.collect15') + ': '"> <!-- 标签 -->
              <el-select
                v-model="addForm.flag"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collect.collect68')"
              > <!-- 请选择标签 -->
                <el-option
                  v-for="item in flagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="content" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addForm.content"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submit">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addPushDown } from '@/api/collectionManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddPushDown',
  props: {
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isRemind: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      groupOptions: [],
      teamMembersOptions: [],
      // 新增组
      addForm: {
        relationName: null,
        relationMobile: null
      },

      openDrawer: false,
      success: false,

      // 时间选择器限制当前时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      }
    }
  },

  computed: {
    ...mapState({
      flagOptions: state => state.options.flagOptions,
      permission: state => state.permission.permission,
      ids: state => state.permission.ids
    }),
    relationOptions() {
      return [
        { value: 80, label: this.$t('collect.collect231') }, /* 本人 */
        { value: 10, label: this.$t('collect.collect54') }, /* 配偶 */
        { value: 20, label: this.$t('collect.collect55') }, /* 父母 */
        { value: 40, label: this.$t('collect.collect57') }, /* 子女 */
        { value: 60, label: this.$t('collect.collect59') }, /* 亲人 */
        { value: 100, label: this.$t('collect.collect61') }, /* 同事 */
        { value: 110, label: this.$t('collect.collect60') }, /* 朋友 */
        { value: 1000, label: this.$t('collect.collect62') } /* 其他 */
      ]
    },
    repayWishOptions() {
      return [
        { value: 10, label: this.$t('financial.financial23') }, /* 有能力有意愿还款 */
        { value: 20, label: this.$t('financial.financial24') }, /* 有能力无意愿还款 */
        { value: 30, label: this.$t('financial.financial25') }, /* 无能力有意愿还款 */
        { value: 40, label: this.$t('financial.financial26') }, /* 无意愿无能力还款 */
        { value: 50, label: this.$t('financial.financial22') } /* 其他 */
      ]
    },
    addRules() {
      const numValid = (rule, value, callback) => {
        const reg = /^\d*$/g
        if (!reg.test(value)) {
          callback(new Error(this.$t('collect.collect70'))) /* 请输入正确的格式 */
        } else {
          callback()
        }
      }
      const validateInt = (rule, value, callback) => {
        const reg = /^[0-9]\d*$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else {
          callback()
        }
      }
      return {
        answer: [{ required: true, message: this.$t('collect.collect69'), trigger: 'change' }], /* 请选择电话是否接通 */
        relationName: [{ required: true, message: this.$t('collect.collect50'), trigger: 'blur' }], /* 请输入联系人姓名 */
        relationMobile: [
          { required: true, message: this.$t('collect.collect52'), trigger: 'blur' }, /* 请输入联系人电话 */
          { validator: numValid, trigger: 'blur' }
        ],
        relation: [
          { required: true, message: this.$t('collect.collect71'), trigger: 'change' } /* 请选择联系人与债主的关系 */
        ],
        remindWish: [{ required: true, message: this.$t('collect.collect72'), trigger: 'change' }], /* 请选择是否愿意转告 */
        repayWish: [{ required: true, message: this.$t('collect.collect73'), trigger: 'change' }], /* 请选择本人还款意愿 */
        type: [{ required: true, message: this.$t('sysManage.sysManage7'), trigger: 'change' }], /* 请选择类型 */
        flag: [{ required: true, message: this.$t('collect.collect68'), trigger: 'change' }], /* 请选择标签 */
        commitmentAmount: [
          { validator: validateInt, trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.addForm.userId = this.currentRow.userId
    this.addForm.orderId = this.currentRow.orderId
    this.addForm.periodId = this.currentRow.periodId
    this.addForm.borrowId = this.currentRow.borrowId
    this.addForm.overDueDays = this.currentRow.overDueDays
    this.addForm.collectionOrderId = this.currentRow.collectionOrderId
    this.openDrawer = true
  },

  methods: {
    relationChange(e) {
      if (e === 80) {
        this.addForm.relationName = this.currentRow.customerName
        this.addForm.relationMobile = this.currentRow.customerMobile
      } else {
        this.addForm.relationName = null
        this.addForm.relationMobile = null
      }
    },
    // 提交新增催记
    submit() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addForm) {
            if (this.addForm[k] || this.addForm[k] === 0) tmp[k] = this.addForm[k]
          }
          tmp.type = 0
          tmp.collectionType = this.isRemind ? 20 : 10
          const res = await addPushDown(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('collect.collect66')) /* 新增催记成功 */
          this.success = true
          this.openDrawer = false
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
