<template>
  <div>
    <!-- 批量派单 -->
    <el-drawer
      :title="$t('collect.collect18')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="batchRef"
            :model="batchForm"
            :rules="batchRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="orders" :label="$t('collect.collect21') + ':'"> <!-- 订单数 -->
              <div style="font-size: 16px;">
                {{ batchForm.orders }}
                <span>&nbsp;MXN</span>
              </div>
            </el-form-item>
            <el-form-item prop="principal" :label="$t('collect.collect22') + ':'"> <!-- 总待还本金 -->
              <div style="font-size: 16px;">
                {{ batchForm.principal }}
                <span>&nbsp;MXN</span>
              </div>
            </el-form-item>
            <el-form-item prop="collectionUserIds" :label="$t('collect.collect20') + ':'"> <!-- 派案到人 -->
              <el-cascader
                v-model="batchForm.collectionUserIds"
                :options="options"
                :props="{ multiple: true, emitPath: false }"
                filterable
                clearable
                style="width: 100%;"
                @change="nodeChange"
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
import { batchCollection, getSimilarPeriod } from '@/api/collectionManagement'
import { batchRemindCollection } from '@/api/remindController'
import { mapState } from 'vuex'

export default {
  name: 'BatchCollection',
  props: {
    currentRow: {
      type: Array,
      default: () => {
        return []
      }
    },
    batchTeamId: {
      type: Number,
      default: null
    },
    isRemind: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      // 新增组
      batchForm: {
        orders: 0,
        principal: 0,
        collectionUserIds: [],
        periodIds: []
      },

      openDrawer: false,
      success: false
    }
  },

  computed: {
    ...mapState({
      permission: state => state.permission.permission,
      ids: state => state.permission.ids
    }),
    batchRules() {
      const numValid = (rule, value, callback) => {
        const reg = /^[1-9]\d*$/g
        if (!reg.test(value)) {
          callback(new Error(this.$t('sysManage.sysManage116'))) /* 请输入正整数 */
        } else {
          callback()
        }
      }
      return {
        companyId: [{ required: true, message: this.$t('sysManage.sysManage55'), trigger: 'change' }], /* 请选择公司名称 */
        groupId: [{ required: true, message: this.$t('collector.collector16'), trigger: 'change' }], /* 请选择组 */
        maxDay: [
          { required: true, message: this.$t('collector.collector18'), trigger: 'blur' }, /* 请输入逾期最大天数 */
          { validator: numValid, trigger: 'blur' }
        ],
        minDay: [
          { required: true, message: this.$t('collector.collector19'), trigger: 'blur' }, /* 请输入逾期最小天数 */
          { validator: numValid, trigger: 'blur' }
        ],
        enable: [
          { required: true, message: this.$t('collector.collector21'), trigger: 'change' } /* 请选择是否自动派单 */
        ]
      }
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeBatch', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.getSimilarPeriod()
    this.batchForm.orders = this.currentRow.length
    this.batchForm.collectionGroupId = this.ids.collectionGroupId
    this.currentRow.forEach(item => {
      if (!isNaN(item.principal)) this.batchForm.principal += item.principal * 1
      this.batchForm.periodIds.push(item.periodId)
    })
    this.openDrawer = true
  },

  methods: {
    // 获取相同周期的组
    async getSimilarPeriod() {
      const res = await getSimilarPeriod({ collectionGroupId: this.batchTeamId, collectionType: this.isRemind ? 20 : 10 })
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.options = res.data
    },

    // 选中节点变化
    nodeChange(value) {
      console.log(value)
      value.forEach(item => {

      })
    },

    // 提交批量派单
    submit() {
      this.$refs['batchRef'].validate(async(valid) => {
        if (valid) {
          let res = null
          if (this.isRemind) {
            res = await batchRemindCollection({
              collectionUserIds: this.batchForm.collectionUserIds,
              periodIds: this.batchForm.periodIds
            })
          } else {
            res = await batchCollection({
              collectionUserIds: this.batchForm.collectionUserIds,
              periodIds: this.batchForm.periodIds
            })
          }
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('collect.collect23')) /* 派单成功 */
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
