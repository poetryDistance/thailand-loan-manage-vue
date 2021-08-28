<template>
  <div>
    <!-- 添加策略 -->
    <el-drawer
      :title="$t('risk.risk35')"
      width="40%"
      :visible.sync="openAddDrawer"
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
            <el-form-item prop="companyId" :label="$t('risk.risk23') + ': '"> <!-- 服务商 -->
              <el-select
                v-model="addForm.companyId"
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
                v-model="addForm.level"
                filterable
                clearable
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
              <el-input v-model="addForm.daysOverdueStart" :placeholder="$t('risk.risk40')" style="width: 169px;" /> <!-- 请输入开始天数 -->
              -
              <el-input v-model="addForm.daysOverdueEnd" :placeholder="$t('risk.risk41')" style="width: 169px;" /> <!-- 请输入结束天数 -->
            </el-form-item>
            <el-form-item prop="time" :label="$t('risk.risk36') + ':'"> <!-- 拨打时间 -->
              <el-time-picker
                v-model="addForm.time"
                is-range
                value-format="HH:mm"
                :range-separator="$t('risk.risk42')"
                :start-placeholder="$t('risk.risk43')"
                :end-placeholder="$t('risk.risk44')"
                :placeholder="$t('risk.risk45')"
              />  <!-- 至  开始时间 结束时间 选择时间范围 -->
            </el-form-item>
            <el-form-item prop="retryCount" :label="$t('risk.risk46') + ':'"> <!-- 重试次数 -->
              <el-input v-model.number="addForm.retryCount" :placeholder="$t('risk.risk47')" /> <!-- 请输入重试次数 -->
            </el-form-item>
            <!-- <el-form-item prop="retryInterval" :label="$t('risk.risk48') + ':'"> 重试间隔时间
              <el-row>
                <el-col :span="19">
                  <el-input v-model.number="addForm.retryInterval" :placeholder="$t('risk.risk49')" /> 请输入重试间隔时间
                </el-col>
                <el-col :offset="1" :span="4">{{ $t('risk.risk50') }}</el-col> 小时
              </el-row>
            </el-form-item> -->

            <el-form-item label=" ">
              <el-button size="small" type="primary" @click="submit">{{ $t('common.common10') }}</el-button> <!-- 确定 -->
              <el-button size="small" @click="openAddDrawer = false">{{ $t('common.common11') }}</el-button> <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addAiCallConfig } from '@/api/aiCallManage'
import { mapState } from 'vuex'

export default {
  name: 'AddConfig',
  data() {
    return {
      // 审核
      addForm: {
        companyId: null,
        level: null,
        daysOverdue: null,
        time: null,
        retryCount: null
      },

      addSuccess: false,

      openAddDrawer: false
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
    addRules() {
      const daysOverdueValid = (rule, value, callback) => {
        const reg = /^[0-9]\d*$/g
        if (!reg.test(this.addForm.daysOverdueStart * 1) && !reg.test(this.addForm.daysOverdueEnd * 1)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else if (!this.addForm.daysOverdueStart && !this.addForm.daysOverdueEnd) {
          callback(new Error(this.$t('risk.risk51'))) /* 请输入逾期天数 */
        } else if (!this.addForm.daysOverdueStart) {
          callback(new Error(this.$t('risk.risk40'))) /* 请输入开始天数 */
        } else if (!this.addForm.daysOverdueEnd) {
          callback(new Error(this.$t('risk.risk41'))) /* 请输入结束天数 */
        } else if (parseInt(this.addForm.daysOverdueEnd) < parseInt(this.addForm.daysOverdueStart)) {
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
      /* const validateNum = (rule, value, callback) => {
        if (parseFloat(value) === 0) return callback(new Error(this.$t('risk.risk49'))) 请输入重试间隔时间
        const reg = /^[0-9]\d*([.][0-9]{1,2})?$/g
        if (!reg.test(value * 1)) {
          callback(new Error(this.$t('collector.collector17'))) 请输入数字值
        } else {
          callback()
        }
      } */
      return {
        companyId: [{ required: true, message: this.$t('risk.risk30'), trigger: 'change' }], /* 请选择服务商 */
        level: [{ required: true, message: this.$t('risk.risk21'), trigger: 'change' }], /* 请选择催收等级 */
        daysOverdue: [{ validator: daysOverdueValid, trigger: 'blur' }],
        time: [{ required: true, message: this.$t('risk.risk52'), trigger: 'change' }], /* 请选择拨打时间 */
        retryCount: [
          { required: true, message: this.$t('risk.risk47'), trigger: 'blur' }, /* 请输入重试次数 */
          { required: true, trigger: 'blur', validator: validateInt }
        ]
        /* retryInterval: [
          { required: true, message: this.$t('risk.risk49'), trigger: 'blur' }, 请输入重试间隔时间
          { required: true, trigger: 'blur', validator: validateNum }
        ] */
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
    this.openAddDrawer = true
  },

  methods: {
    // 添加策略
    submit() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addForm) {
            if (k === 'time') {
              tmp.callTimeStart = this.addForm[k][0]
              tmp.callTimeEnd = this.addForm[k][1]
            } else if (k === 'daysOverdue') {
              tmp.daysOverdueStart = this.addForm.daysOverdueStart
              tmp.daysOverdueEnd = this.addForm.daysOverdueEnd
            } else {
              tmp[k] = this.addForm[k]
            }
          }
          const res = await addAiCallConfig(tmp)
          if (res.code !== 0 && !res.data) return this.$message.error(res.message || 'Error')
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
