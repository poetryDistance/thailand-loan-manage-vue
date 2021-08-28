<template>
  <div class="message-tip">
    <el-badge :value="humanReviewCount" class="message-item">
      <el-popover
        placement="bottom"
        title="消息"
        width="200"
        trigger="hover"
      >
        <div class="message-line" />
        <div v-if="humanReviewCount > 0" class="remind-box transition-box">
          {{ $t('loanMarket.loanMarket52') }} <!-- 您有 -->
          <el-button type="text" size="medium " @click="toHumanReview">{{ humanReviewCount }}</el-button>
          {{ $t('loanMarket.loanMarket53') }} <!-- 笔待人审订单 -->
          <!-- <el-button type="text" size="medium " @click="toHumanReview">{{ $t('loanMarket.loanMarket54') }}</el-button> 点击这里
          {{ $t('loanMarket.loanMarket55') }} 前往审核 -->
        </div>
        <div v-else>{{ $t('common.common94') }}</div> <!-- 无 -->
        <svg-icon slot="reference" class-name="message-icon" icon-class="tongzhi" />
      </el-popover>
    </el-badge>

  </div>
</template>

<script>
import { profileData } from '@/api/theDataCenter'

export default {
  name: 'MessageTip',
  data() {
    return {
      humanReviewCount: 0,

      isHumanReview: false
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    // 判断是否有待人审页面
    this.isHumanReview = this.isView('humanReview')

    if (this.isHumanReview) {
      this.getMessageInfo()
      setInterval(async() => {
        this.getMessageInfo()
      }, 60000)
    }
  },
  methods: {
    // 跳转待人审订单
    toHumanReview() {
      if (this.isHumanReview) {
        this.$router.push({
          path: '/borrowManage/humanReview'
        })
      }
    },

    // 获取消息
    async getMessageInfo() {
      const res = await profileData()
      if (res.code !== '0') return this.$message.error(res.message || 'Error')
      this.humanReviewCount = parseInt(res.data.humanReviewCount) || 0
    }
  }
}
</script>

<style lang="scss" scoped>
.message-tip {
  ::v-deep .el-badge__content.is-fixed {
    top: 14px;
    right: 12px;
  }
  .message-icon {
    cursor: pointer;
    font-size: 20px;
    vertical-align: middle;
  }
}

.message-line {
  width: 100%;
  height: 1px;
  margin: 0 0 5px;
  background-color: #DCDFE6;
}
</style>
