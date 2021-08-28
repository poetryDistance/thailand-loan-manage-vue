<template>
  <div>
    <!-- 添加市场 -->
    <el-drawer
      :title="$t('loanMarket.loanMarket13')"
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
            size="small"
            label-position="right"
            label-width="auto"
          >
            <el-form-item prop="marketName" :label="$t('loanMarket.loanMarket1') + ': '"> <!-- 市场名称 -->
              <el-input v-model="addForm.marketName" :placeholder="$t('loanMarket.loanMarket2')" /> <!-- 请输入市场名称 -->
            </el-form-item>
            <el-form-item prop="marketPhone" :label="$t('loanMarket.loanMarket4') + ': '"> <!-- 市场电话 -->
              <el-input v-model="addForm.marketPhone" :placeholder="$t('loanMarket.loanMarket5')" /> <!-- 请输入市场电话 -->
            </el-form-item>
            <el-form-item prop="contactsName" :label="$t('loanMarket.loanMarket16') + ': '"> <!-- 市场联系人名称 -->
              <el-input v-model="addForm.contactsName" :placeholder="$t('loanMarket.loanMarket21')" /> <!-- 请输入联系人名称 -->
            </el-form-item>
            <el-form-item prop="contactsMobile" :label="$t('loanMarket.loanMarket17') + ': '"> <!-- 市场联系人手机 -->
              <el-input v-model="addForm.contactsMobile" :placeholder="$t('loanMarket.loanMarket22')" /> <!-- 请输入联系人手机 -->
            </el-form-item>
            <el-form-item prop="givenId" :label="$t('loanMarket.loanMarket18') + ': '"> <!-- 市场分配给我方的唯一ID -->
              <el-input v-model="addForm.givenId" :placeholder="$t('loanMarket.loanMarket23')" /> <!-- 请输入唯一ID -->
            </el-form-item>
            <el-form-item prop="marketType" :label="$t('loanMarket.loanMarket8') + ': '"> <!-- 市场类型 -->
              <el-select
                v-model="addForm.marketType"
                filterable
                clearable
                style="width: 100%;"
                :placeholder="$t('loanMarket.loanMarket9')"
              > <!-- 请选择市场类型 -->
                <el-option
                  v-for="item in marketTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="marketAddress" :label="$t('loanMarket.loanMarket20') + ': '"> <!-- 市场地址 -->
              <el-input v-model="addForm.marketAddress" :placeholder="$t('loanMarket.loanMarket24')" /> <!-- 请输入市场地址 -->
            </el-form-item>
            <el-form-item :label="$t('loanMarket.loanMarket19') + ':'"> <!-- 白名单IP -->
              <div v-for="item in whitelistIps" :key="item.value" class="whitelist-ips">
                <div class="ip-input">
                  <el-input v-model="item.label" :placeholder="$t('loanMarket.loanMarket25')" /> <!-- 请输入白名单IP -->
                </div>
                <el-button
                  :icon="item.isAdd ? 'el-icon-plus' : 'el-icon-minus'"
                  @click="addWhitelistIp(item)"
                />
              </div>
            </el-form-item>
            <el-form-item prop="marketRemark" :label="$t('common.common12') + ':'"> <!-- 备注 -->
              <el-input
                v-model="addForm.marketRemark"
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
import { addMarket } from '@/api/loanSupermarket'

export default {
  name: 'AddProductDrawer',
  data() {
    return {
      // 添加用户
      addForm: {},
      whitelistIps: [
        { value: 0, label: '', isAdd: true }
      ],

      openAddDrawer: false,
      success: false
    }
  },

  computed: {
    marketTypeOptions() {
      return [
        { value: 10, label: this.$t('loanMarket.loanMarket12') } /* CactusCash   */
      ]
    },
    addRules() {
      return {
        marketName: [{ required: true, message: this.$t('loanMarket.loanMarket2'), trigger: 'blur' }], /* 请输入市场名称 */
        marketPhone: [{ required: true, message: this.$t('loanMarket.loanMarket5'), trigger: 'blur' }], /* 请输入市场电话 */
        contactsName: [{ required: true, message: this.$t('loanMarket.loanMarket21'), trigger: 'blur' }], /* 请输入联系人名称 */
        contactsMobile: [{ required: true, message: this.$t('loanMarket.loanMarket22'), trigger: 'blur' }], /* 请输入联系人手机 */
        givenId: [{ required: true, message: this.$t('loanMarket.loanMarket23'), trigger: 'blur' }], /* 请输入唯一ID */
        marketType: [{ required: true, message: this.$t('loanMarket.loanMarket9'), trigger: 'change' }], /* 请选择市场类型 */
        marketAddress: [{ required: true, message: this.$t('loanMarket.loanMarket24'), trigger: 'blur' }] /* 请输入市场地址 */
      }
    }
  },

  watch: {
    openAddDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('closeAdd', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.openAddDrawer = true
  },

  methods: {
    // 添加白名单
    addWhitelistIp(item) {
      if (item.isAdd) {
        this.whitelistIps.push({ value: this.whitelistIps[this.whitelistIps.length], label: '', isAdd: false })
      } else {
        const delIpt = this.whitelistIps.findIndex(val => val.value === item.value)
        if (delIpt !== -1) this.whitelistIps.splice(delIpt, 1)
      }
    },
    // 添加产品
    submitAdd() {
      this.$refs['addRef'].validate(async(valid) => {
        if (valid) {
          const tmp = {}
          for (const k in this.addForm) {
            if (this.addForm[k]) {
              tmp[k] = this.addForm[k]
            }
          }
          let str = ''
          this.whitelistIps.forEach(item => {
            str += item.label + ';'
          })
          tmp.whitelistIps = str
          const res = await addMarket(tmp)
          if (res.code !== '0' || !res.data) return this.$message.error(res.message || 'Error')
          this.$message.success(this.$t('sysManage.sysManage75')) /* 添加成功 */
          this.success = true
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
.whitelist-ips {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  .ip-input {
    width: 78%;
  }
}
</style>
