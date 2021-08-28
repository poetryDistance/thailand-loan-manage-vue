<template>
  <div>
    <!-- 新增 -->
    <el-drawer
      :title="$t('collector.collector3')"
      width="40%"
      :visible.sync="openAddRules"
      :before-close="handleClose"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="addRulesRef"
            :model="addRulesForm"
            :rules="addRulesRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="companyId" :label="$t('sysManage.sysManage57') + ': '"> <!-- 公司名 -->
              <el-select
                v-model="addRulesForm.companyId"
                filterable
                :placeholder="$t('sysManage.sysManage55')"
                style="width: 100%;"
                @change="companyChange"
              > <!-- 请选择公司名 -->
                <el-option
                  v-for="item in companyNameOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id + '/' + item.collectionType"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="collectionType" :label="$t('loanMarket.loanMarket64') + ':'"> <!-- 催收类型 -->
              <el-select v-model="addRulesForm.collectionType" disabled style="width: 100%;">
                <el-option
                  v-for="item in collectionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="groupId" :label="$t('collector.collector15') + ': '"> <!-- 组 -->
              <el-select
                v-model="addRulesForm.groupId"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('collector.collector16')"
              > <!-- 请选择组 -->
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('loanMarket.loanMarket66') + ':'" required> <!-- 规则天数 -->
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="minDay" style="margin-left: 0;">
                    <el-input v-model.number="addRulesForm.minDay" :placeholder="$t('loanMarket.loanMarket67')" /> <!-- 请输入最小规则天数 -->
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">
                  <i class="el-icon-right" />
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="maxDay" style="margin-left: 0;">
                    <el-input v-model.number="addRulesForm.maxDay" :placeholder="$t('loanMarket.loanMarket68')" /> <!-- 请输入最大规则天数 -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item prop="remark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addRulesForm.remark"
                type="textarea"
                maxlength="100"
                :autosize="{minRows: 1, maxRows: 8}"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="enable" :label="$t('collector.collector20') + ':'"> <!-- 是否自动派单 -->
              <el-radio-group v-model="addRulesForm.enable">
                <el-radio :label="1">{{ $t('common.common15') }}</el-radio> <!-- 开启 -->
                <el-radio :label="0">{{ $t('common.common16') }}</el-radio> <!-- 关闭 -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitAddRules">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddRules = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addGroupRules, getCompanyGroup, checkGroupRules } from '@/api/collectionAgentManagement'
import { mapState } from 'vuex'

export default {
  name: 'AddRulesDrawer',
  data() {
    return {
      // 新增组
      addRulesForm: {
        collectionType: null
      },
      groupOptions: [],

      openAddRules: false,
      addSuccess: false
    }
  },

  computed: {
    ...mapState({
      companyNameOptions: state => state.options.companyNameOptions,
      collectionTypeOptions: state => state.options.collectionTypeOptions
    }),
    addRulesRules() {
      const numValid = (rule, value, callback) => {
        const reg = this.addRulesForm.collectionType === 20 ? (/^(-\d+)|(0+)$/g) : (/^[1-9]\d*$/g)
        /* 请输入负整数 : 请输入正整数 */
        const tip = this.addRulesForm.collectionType === 20 ? this.$t('loanMarket.loanMarket69') : this.$t('sysManage.sysManage116')
        if (!reg.test(value)) {
          callback(new Error(tip))
        } else if (this.addRulesForm.minDay > this.addRulesForm.maxDay) {
          callback(new Error(this.$t('loanMarket.loanMarket70'))) /* 规则最小天数不得大于最大天数 */
        } else {
          callback()
        }
      }
      return {
        companyId: [{ required: true, message: this.$t('sysManage.sysManage55'), trigger: 'change' }], /* 请选择公司名称 */
        groupId: [{ required: true, message: this.$t('collector.collector16'), trigger: 'change' }], /* 请选择组 */
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
    openAddRules(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.addSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.openAddRules = true
  },

  methods: {
    async companyChange(data) {
      this.addRulesForm.collectionType = parseInt(data.split('/')[1]) || ''
      const item = parseInt(data.split('/')[0])
      const res = await getCompanyGroup({ collectionCompanyId: item })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.groupOptions = res.data || []
    },
    // 关闭弹出框
    handleClose(done) {
      done()
    },
    // 添加催收公司
    submitAddRules() {
      this.$refs['addRulesRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addRulesForm) {
            if (k !== 'collectionType' && k !== 'companyId') {
              tmp[k] = this.addRulesForm[k]
            } else if (k === 'companyId') {
              tmp[k] = parseInt(this.addRulesForm[k].split('/')[0])
            }
          }
          if (this.addRulesForm.collectionType === 20) {
            const t = Math.abs(tmp.maxDay)
            tmp.maxDay = Math.abs(tmp.minDay)
            tmp.minDay = t
          }
          console.log(tmp)
          // 验证规则是否存在
          const data = await checkGroupRules(tmp)
          if (data.code !== '0') return this.$message.error(data.message || 'Error')
          if (!data.data) return this.$message.error(this.$t('collector.collector22')) /* 规则已存在 */

          const res = await addGroupRules(tmp)
          if (res.code !== '0') return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.addSuccess = true
          this.openAddRules = false
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
