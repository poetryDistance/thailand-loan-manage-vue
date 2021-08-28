<template>
  <div>
    <el-row :gutter="10" class="panel-group">
      <!-- :lg="{span: '4-8'}" -->
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('userQuery') ? 'pointer' : ''}"
          @click="toView('userManagement/userQuery')"
        >
          <div class="card-panel-text">{{ $t('theData.theData21') }}</div> <!-- 注册人数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.userCount) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('repaymentOrder') ? 'pointer' : ''}"
          @click="toView('paymentManagement/repaymentOrder')"
        >
          <div class="card-panel-text">{{ $t('theData.theData16') }}</div> <!-- 通过笔数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.applyPass) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('loanApplication') ? 'pointer' : ''}"
          @click="toView('borrowManage/loanApplication')"
        >
          <div class="card-panel-text">{{ $t('theData.theData15') }}</div> <!-- 申请笔数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.apply) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('artificialBooked') ? 'pointer' : ''}"
          @click="toView('financialManage/artificialBooked')"
        >
          <div class="card-panel-text">{{ $t('theData.theData18') }}</div> <!-- 放款笔数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.loanPass) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('repaymentHistory') ? 'pointer' : ''}"
          @click="toView('paymentManagement/repaymentHistory')"
        >
          <div class="card-panel-text">{{ $t('theData.theData28') }}</div> <!-- 还款笔数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.repayCount) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div class="card-panel-col">
          <div class="card-panel-text">{{ $t('theData.theData17') }}</div> <!-- 放款金额 -->
          <count-to :start-val="0" :decimals="2" :end-val="parseFloat(homeData.loanAmount) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div class="card-panel-col">
          <div class="card-panel-text">{{ $t('collect.collect12') }}</div> <!-- 还款金额 -->
          <count-to :start-val="0" :decimals="2" :end-val="parseFloat(homeData.repayAmount) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div
          class="card-panel-col"
          :style="{cursor: isView('humanReview') ? 'pointer' : ''}"
          @click="toView('borrowManage/humanReview')"
        >
          <div class="card-panel-text">{{ $t('loanMarket.loanMarket49') }}</div> <!-- 待人审订单数 -->
          <count-to :start-val="0" :end-val="parseFloat(homeData.humanReviewCount) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <!-- <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div class="card-panel-col">
          <div class="card-panel-text">{{ $t('theData.theData29') }}</div> 入催率
          <count-to :start-val="0" :end-val="parseFloat(homeData.t2) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6" style="margin-bottom: 10px;">
        <div class="card-panel-col">
          <div class="card-panel-text">{{ $t('theData.theData30') }}</div> 出催率
          <count-to :start-val="0" :end-val="parseFloat(homeData.t7) || 0" :duration="duration" class="card-panel-num" />
        </div>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'PanelGroup',
  components: {
    CountTo
  },
  props: {
    homeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      duration: 500
    }
  },
  mounted() {
  },
  methods: {
    toView(url) {
      const isOk = url.split('/')[1]
      if (this.isView(isOk)) {
        this.$router.push({
          path: '/' + url
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    height: 112px;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-radius: 5px;
    padding-top: 26px;
    text-align: center;
    // border-top: 5px solid red;

    .card-panel-text {
      margin: 6px 0 10px;
    }
    .card-panel-num {
      font-weight: bold;
      font-size: 26px;
    }
    &:hover {
      box-shadow: 0 4px 12px 0 rgba(0,0,0,.1);
    }
  }

  :nth-child(1) {
    .card-panel-col {
      border-left: 5px solid rgb(127, 169, 224);
    }
  }
  :nth-child(2) {
    .card-panel-col {
      border-left: 5px solid rgb(43, 32, 197);
    }
  }
  :nth-child(3) {
    .card-panel-col {
      border-left: 5px solid rgb(122, 34, 204);
    }
  }
  :nth-child(4) {
    .card-panel-col {
      border-left: 5px solid rgb(218, 30, 202);
    }
  }
  :nth-child(5) {
    .card-panel-col {
      border-left: 5px solid rgb(214, 49, 178);
    }
  }
  :nth-child(6) {
    .card-panel-col {
      border-left: 5px solid rgb(126, 38, 107);
    }
  }
  :nth-child(7) {
    .card-panel-col {
      border-left: 5px solid rgb(82, 74, 80);
    }
  }
  :nth-child(8) {
    .card-panel-col {
      border-left: 5px solid rgb(68, 44, 63);
    }
  }
  :nth-child(9) {
    .card-panel-col {
      border-left: 5px solid rgb(68, 11, 56);
    }
  }

  .el-col-lg-4-8 {
    width: 20%;
  }

  @media screen and (max-width: 768px) {
    .el-col-xs-12 {
      width: 50%;
    }
  }
}
</style>
