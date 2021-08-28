<template>
  <div>
    <!-- 修改 -->
    <el-drawer
      :title="$t('sysManage.sysManage26')"
      width="40%"
      :visible.sync="openUpdateRules"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="updateRulesRef"
            :model="updateRulesForm"
            :rules="updateRulesRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="companyId" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-select
                v-model="updateRulesForm.companyId"
                filterable
                disabled
                :placeholder="$t('sysManage.sysManage55')"
                style="width: 100%;"
              > <!-- 请选择公司名 -->
                <el-option
                  v-for="item in companyNameOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="collectionType" :label="$t('loanMarket.loanMarket64') + ':'"> <!-- 催收类型 -->
              <el-select v-model="updateRulesForm.collectionType" disabled style="width: 100%;">
                <el-option
                  v-for="item in collectionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="groupNmae" :label="$t('collector.collector15') + ': '"> <!-- 组 -->
              <el-input v-model="groupName" disabled />
            </el-form-item>
            <el-form-item :label="$t('loanMarket.loanMarket66') + ':'" required> <!-- 规则天数 -->
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="minDay" style="margin-left: 0;">
                    <el-input v-model.number="updateRulesForm.minDay" :placeholder="$t('loanMarket.loanMarket67')" /> <!-- 请输入最小规则天数 -->
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">
                  <i class="el-icon-right" />
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="maxDay" style="margin-left: 0;">
                    <el-input v-model.number="updateRulesForm.maxDay" :placeholder="$t('loanMarket.loanMarket68')" /> <!-- 请输入最大规则天数 -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="updateRulesForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="enable" :label="$t('collector.collector20') + ':'"> <!-- 是否自动派单 -->
              <el-radio-group v-model="updateRulesForm.enable">
                <el-radio :label="1">{{ $t('common.common15') }}</el-radio> <!-- 开启 -->
                <el-radio :label="0">{{ $t('common.common16') }}</el-radio> <!-- 关闭 -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpdateRules">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateRules = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateGroupRules, checkGroupRules } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'UpdateRulesDrawer',
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
      updateRulesForm: {
        minDay: null,
        maxDay: null,
        remark: null,
        enable: null,
        collectionType: null
      },
      groupName: '',

      openUpdateRules: false,
      updateSuccess: false
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      collectionTypeOptions: state => state.options.collectionTypeOptions
    }),
    updateRulesRules() {
      const numValid = (rule, value, callback) => {
        const reg = this.updateRulesForm.collectionType === 20 ? (/^(-\d+)|(0+)$/g) : (/^[1-9]\d*$/g)
        /* 请输入负整数 : 请输入正整数 */
        const tip = this.updateRulesForm.collectionType === 20 ? this.$t('loanMarket.loanMarket69') : this.$t('sysManage.sysManage116')
        if (!reg.test(value)) {
          callback(new Error(tip))
        } else if (this.updateRulesForm.minDay > this.updateRulesForm.maxDay) {
          callback(new Error(this.$t('loanMarket.loanMarket70'))) /* 规则最小天数不得大于最大天数 */
        } else {
          callback()
        }
      }
      return {
        maxDay: [
          { required: true, message: this.$t('loanMarket.loanMarket68'), trigger: 'blur' }, /* 请输入最大规则天数 */
          { validator: numValid, trigger: 'blur' }
        ],
        minDay: [
          { required: true, message: this.$t('loanMarket.loanMarket67'), trigger: 'blur' }, /* 请输入最小规则天数 */
          { validator: numValid, trigger: 'blur' }
        ],
        enable: [
          { required: true, message: this.$t('collector.collector21'), trigger: 'change' } /* 请选择是否自动派单 */
        ]
      }
    }
  },

  watch: {
    openUpdateRules(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdate', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.groupName = this.currentRow.groupName || ''
    this.updateRulesForm.companyId = this.currentRow.companyId || ''
    this.updateRulesForm.remark = this.currentRow.remark
    this.updateRulesForm.enable = this.currentRow.enable
    this.updateRulesForm.groupId = this.currentRow.groupId
    this.updateRulesForm.collectionType = this.currentRow.collectionType || ''
    this.updateRulesForm.id = this.currentRow.id

    if (this.currentRow.collectionType === 20) {
      this.updateRulesForm.minDay = -this.currentRow.maxDay
      this.updateRulesForm.maxDay = -this.currentRow.minDay
    } else {
      this.updateRulesForm.minDay = this.currentRow.minDay
      this.updateRulesForm.maxDay = this.currentRow.maxDay
    }

    this.openUpdateRules = true
  },

  methods: {
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加催收公司
    submitUpdateRules() {
      this.$refs['updateRulesRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.updateRulesForm) {
            if (k !== 'collectionType') {
              tmp[k] = this.updateRulesForm[k]
            }
          }
          if (this.updateRulesForm.collectionType === 20) {
            const t = Math.abs(tmp.maxDay)
            tmp.maxDay = Math.abs(tmp.minDay)
            tmp.minDay = t
          }
          // 验证规则是否存在
          const data = await checkGroupRules(tmp)
          if (data.code !== '0') return this.$message.error(data.message || 'Error')
          if (!data.data) return this.$message.error(this.$t('collector.collector22')) /* 规则已存在 */

          const res = await updateGroupRules(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.updateSuccess = true
          this.openUpdateRules = false
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
