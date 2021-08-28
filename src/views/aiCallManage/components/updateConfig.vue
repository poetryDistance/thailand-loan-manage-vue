<template>
  <div>
    <!-- 修改策略 -->
    <el-drawer
      :title="$t('risk.risk72')"
      width="40%"
      :visible.sync="openUpdateDrawer"
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
            size="small"
          >
            <el-form-item prop="companyId" :label="$t('risk.risk23') + ': '"> <!-- 服务商 -->
              <el-select
                v-model="updateForm.companyId"
                filterable
                clearable
                :placeholder="$t('risk.risk30')"
              > <!-- 请选择服务商 -->
                <el-option
                  v-for="item in companyIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="level" :label="$t('risk.risk14') + ': '"> <!-- 催收等级 -->
              <el-select
                v-model="updateForm.level"
                filterable
                clearable
                :disabled="currentRow.level=='T0'"
                :placeholder="$t('risk.risk21')"
              > <!-- 请选择催收等级 -->
                <el-option
                  v-for="item in collectionLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="daysOverdue" :label="$t('collect.collect8') + ':'"> <!-- 逾期天数 -->
              <el-input v-model="updateForm.daysOverdueStart" :disabled="currentRow.level=='T0'" :placeholder="$t('risk.risk40')" style="width: 169px;" /> <!-- 请输入开始天数 -->
              -
              <el-input v-model="updateForm.daysOverdueEnd" :disabled="currentRow.level=='T0'" :placeholder="$t('risk.risk41')" style="width: 169px;" /> <!-- 请输入结束天数 -->
            </el-form-item>
            <el-form-item prop="time" :label="$t('risk.risk36') + ':'"> <!-- 拨打时间 -->
              <el-time-picker
                v-model="updateForm.time"
                is-range
                value-format="HH:mm"
                :range-separator="$t('risk.risk42')"
                :start-placeholder="$t('risk.risk43')"
                :end-placeholder="$t('risk.risk44')"
                :placeholder="$t('risk.risk45')"
              />  <!-- 至  开始时间 结束时间 选择时间范围 -->
            </el-form-item>
            <el-form-item prop="retryCount" :label="$t('risk.risk46') + ':'"> <!-- 重试次数 -->
              <el-input v-model.number="updateForm.retryCount" :placeholder="$t('risk.risk47')" /> <!-- 请输入重试次数 -->
            </el-form-item>
            <el-form-item prop="retryInterval" :label="$t('risk.risk48') + ':'"> <!-- 重试间隔时间 -->
              <el-row>
                <el-col :span="19">
                  <el-input v-model.number="updateForm.retryInterval" :placeholder="$t('risk.risk49')" /> <!-- 请输入重试间隔时间 -->
                </el-col>
                <el-col :offset="1" :span="4">{{ $t('risk.risk50') }}</el-col> <!-- 小时 -->
              </el-row>
            </el-form-item>

            <el-form-item label=" ">
              <el-button size="small" type="primary" @click="submit">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openUpdateDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { updateAiCallConfig } from '@/api/aiCallManage'
import { mapState } from 'vuex'

export default {
  name: 'UpdateConfig',
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
      // 审核
      updateForm: {
        companyId: null,
        level: null,
        daysOverdue: null,
        daysOverdueStart: null,
        daysOverdueEnd: null,
        time: [],
        retryInterval: null,
        retryCount: null
      },

      updateSuccess: false,

      openUpdateDrawer: false
    }
  },
  computed: {
    ...mapState({
      collectionLevelOptions: state => state.options.collectionLevelOptions
    }),
    companyIdOptions() {
      return [
        { value: 10, label: 'ONCE' }
      ]
    },
    updateRules() {
      const daysOverdueValid = (rule, value, callback) => {
        const reg = /^[0-9]\d*$/g
        if (this.updateForm.level === 'T0') {
          callback()
        } else if (!reg.test(this.updateForm.daysOverdueStart * 1) && !reg.test(this.updateForm.daysOverdueEnd * 1)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else if (!this.updateForm.daysOverdueStart && !this.updateForm.daysOverdueEnd) {
          callback(new Error(this.$t('risk.risk51'))) /* 请输入逾期天数 */
        } else if (!this.updateForm.daysOverdueStart) {
          callback(new Error(this.$t('risk.risk40'))) /* 请输入开始天数 */
        } else if (!this.updateForm.daysOverdueEnd) {
          callback(new Error(this.$t('risk.risk41'))) /* 请输入结束天数 */
        } else if (parseInt(this.updateForm.daysOverdueEnd) <= parseInt(this.updateForm.daysOverdueStart)) {
          callback(new Error(this.$t('risk.risk53'))) /* 开始天数不能大于结束天数 */
        } else {
          callback()
        }
      }
      const validateInt = (rule, value, callback) => {
        const reg = /^[1-9]\d*$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else {
          callback()
        }
      }
      const validateNum = (rule, value, callback) => {
        if (parseFloat(value) === 0) return callback(new Error(this.$t('risk.risk49'))) /* 请输入重试间隔时间 */
        const reg = /^[0-9]\d*([.][0-9]{1,2})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('collector.collector17'))) /* 请输入数字值 */
        } else {
          callback()
        }
      }
      return {
        companyId: [{ required: true, message: this.$t('risk.risk30'), trigger: 'change' }], /* 请选择服务商 */
        level: [{ required: true, message: this.$t('risk.risk21'), trigger: 'change' }], /* 请选择催收等级 */
        daysOverdue: [{ validator: daysOverdueValid, trigger: 'blur' }],
        time: [{ required: true, message: this.$t('risk.risk52'), trigger: 'change' }], /* 请选择拨打时间 */
        retryCount: [
          { required: true, message: this.$t('risk.risk47'), trigger: 'blur' }, /* 请输入重试次数 */
          { required: true, trigger: 'blur', validator: validateInt }
        ],
        retryInterval: [
          { required: true, message: this.$t('risk.risk49'), trigger: 'blur' }, /* 请输入重试间隔时间 */
          { required: true, trigger: 'blur', validator: validateNum }
        ]
      }
    }
  },

  watch: {
    openUpdateDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeUpdateDrawer', this.updateSuccess)
        }, 200)
      }
    }
  },
  mounted() {
    this.updateForm.id = this.currentRow.id || ''
    this.updateForm.companyId = this.currentRow.companyId || ''
    this.updateForm.level = this.currentRow.level || ''
    this.updateForm.retryCount = this.currentRow.retryCount || ''
    this.updateForm.retryInterval = this.currentRow.retryInterval || ''
    this.updateForm.daysOverdueStart = this.currentRow.daysOverdueStart || ''
    this.updateForm.daysOverdueEnd = this.currentRow.daysOverdueEnd || ''
    this.updateForm.time.push(this.currentRow.callTimeStart, this.currentRow.callTimeEnd)
    this.openUpdateDrawer = true
  },

  methods: {
    // 修改策略
    submit() {
      this.$refs['updateRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.updateForm) {
            if (k === 'time') {
              tmp.callTimeStart = this.updateForm[k][0]
              tmp.callTimeEnd = this.updateForm[k][1]
            } else if (k === 'daysOverdue') {
              tmp.daysOverdueStart = this.updateForm.daysOverdueStart
              tmp.daysOverdueEnd = this.updateForm.daysOverdueEnd
            } else {
              tmp[k] = this.updateForm[k]
            }
          }
          const res = await updateAiCallConfig(tmp)
          if (res.code !== 0 && !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage78')) /* 修改成功 */
          this.updateSuccess = true
          this.openUpdateDrawer = false
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
