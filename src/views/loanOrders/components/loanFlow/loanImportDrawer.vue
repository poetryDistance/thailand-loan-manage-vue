<template>
  <div>
    <!-- 导入放款结果 -->
    <el-drawer
      :title="$t('loanOrders.loanOrders4')"
      width="40%"
      :visible.sync="openDrawer"
    >
      <div style="height: 100vh">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-form
            ref="loanImportRef"
            :model="loanImportForm"
            :rules="loanImportRules"
            class="login-form"
            auto-complete="on"
            label-position="right"
          >
            <el-form-item prop="releaseResultSucceed">
              <el-upload
                ref="upload"
                accept=".xls"
                drag
                class="upload-demo"
                action="thailand-manage/export/financialUpload"
                :limit="1"
                :on-exceed="exceedFile"
                :on-change="fileChange"
                :file-list="fileList"
                :auto-upload="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">{{ $t('loanOrders.loanOrders7') }}<em>{{ $t('loanOrders.loanOrders8') }}</em></div> <!-- 将文件拖到此处，或 点击上传 -->
                <div slot="tip" class="el-upload__tip">{{ $t('loanOrders.loanOrders6') }}</div> <!-- 请上传已经放款完成的Excel表格 -->
              </el-upload>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="small" @click="submitUpload">{{
                $t('common.common10')
              }}</el-button>
              <!-- 确定 -->
              <el-button size="small" @click="handleClose">{{
                $t('common.common11')
              }}</el-button>
              <!-- 取消 -->
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { financialUpload } from '@/api/loanOrders'

export default {
  name: 'LoanImportDrawer',
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
      // 放款
      loanImportForm: {},

      fileList: [],
      fileName: '',

      openDrawer: false,
      success: false
    }
  },

  computed: {
    loanImportRules() {
      return {}
    }
  },

  watch: {
    openDrawer(newVal, oldVal) {
      if (oldVal) {
        setTimeout(() => {
          this.$emit('loanImportClose', this.success)
        }, 200)
      }
    }
  },
  mounted() {
    this.openDrawer = true
  },

  methods: {
    // 文件超出个数时的钩子
    exceedFile(files, fileList) {
      this.$message.error(this.$t('loanOrders.loanOrders9')) /* 只能选择 1 个文件 */
    },
    fileChange(file, fileList) {
      const extension = file.name.split('.')[1] === 'xls'
      if (!extension) {
        this.$message.warning(this.$t('loanOrders.loanOrders11')) /* 上传文件只能是xls格式! */
        this.fileList = []
        return
      }
      this.files = file.raw
      this.fileName = file.name
    },
    submitUpload() {
      // 确认上传
      this.$refs['loanImportRef'].validate(async(valid) => {
        // 是否通过 表单验证
        if (valid) {
          if (this.fileName === '') {
            // 请选择要上传的文件！
            this.$message.error(this.$t('loanOrders.loanOrders10'))
            return false
          }
          const fileFormData = new FormData()
          fileFormData.append('file', this.files, this.fileName) // 上传的文件
          fileFormData.append('fileName', this.fileName) // 文件名

          const res = await financialUpload(fileFormData)
          if (res.code !== '0') {
            this.fileName = ''
            this.fileList = []
            return this.$message.error(res.message || 'Error')
          }
          this.handleClose()
        }
      })
    },

    handleClose() {
      this.fileName = ''
      this.openDrawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
