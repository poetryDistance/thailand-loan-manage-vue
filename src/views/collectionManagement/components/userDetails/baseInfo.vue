<template>
  <div class="user-info-box">
    <!-- 客户信息 -->
    <ul class="base-box">
      <li>
        <div>{{ $t('borrow.borrow20') + ': ' }}</div> <!-- 客户类型 -->
        <div>{{ customers.old | oldFilter }}</div>
      </li>
      <li v-if="permission.isAdmin">
        <div>{{ $t('collect.collect116') + ': ' }}</div> <!-- 是否黑名单 -->
        <!-- 点击移出黑名单 点击设为黑名单 -->
        <el-tooltip class="current-time-millis" effect="dark" :content="customers.blackCustomer ? $t('userManage.userManage29') : $t('userManage.userManage30')" placement="top">
          <el-switch
            v-model="customers.blackCustomer"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="addBlack"
          />
        </el-tooltip>
      </li>

      <li>
        <div>{{ $t('common.common117') + ': ' }}</div> <!-- 是否删除 -->
        <div>{{ customers.deleted | blackCustomerFilter }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect112') + ': ' }}</div> <!-- 是否存在申请中的贷款 -->
        <div>{{ customers.applyingCustomer | whetherFilter }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect113') + ': ' }}</div> <!-- 是否存在贷款中的贷款 -->
        <div>{{ customers.loaningCustomer | whetherFilter }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect115') + ': ' }}</div> <!-- 是否存在已还款的贷款 -->
        <div>{{ customers.repaidCustomer | whetherFilter }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect114') + ': ' }}</div> <!-- 是否有过逾期行为 -->
        <div>{{ customers.overdueCustomer | whetherFilter }}</div>
      </li>

      <li>
        <div>{{ $t('borrow.borrow14') + ': ' }}</div> <!-- 客户名 -->
        <div>{{ customers.customerName }}</div>
      </li>
      <li>
        <div>{{ $t('common.common119') + ': ' }}</div> <!-- 客户名字 -->
        <div>{{ customers.fullName }}</div>
      </li>

      <li>
        <div>{{ $t('loanMarket.loanMarket36') + ': ' }}</div> <!-- 英文字符姓 -->
        <div>{{ customers.lastName }}</div>
      </li>
      <li>
        <div>{{ $t('loanMarket.loanMarket37') + ': ' }}</div> <!-- 英文字符名 -->
        <div>{{ customers.firstName }}</div>
      </li>

      <li>
        <div>{{ $t('borrow.borrow1') + ': ' }}</div> <!-- 身份证号 -->
        <div>{{ customers.idCardNo }}</div>
      </li>
      <li>
        <div>{{ $t('common.common122') + ': ' }}</div> <!-- 身份证过期年份 -->
        <div>{{ customers.idCardExpiryYear }}</div>
      </li>
      <li>
        <div>{{ $t('common.common123') + ': ' }}</div> <!-- 卡的注册年份和月份 -->
        <div>{{ customers.idCardRegisterTime }}</div>
      </li>

      <li>
        <div>{{ $t('common.common124') + ': ' }}</div> <!-- 卡的发行年份 -->
        <div>{{ customers.idCardIssueYear }}</div>
      </li>
      <li>
        <div>{{ $t('common.common125') + ': ' }}</div> <!-- 地点编号 -->
        <div>{{ customers.placeNumber }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect242') + ': ' }}</div> <!-- 街道 -->
        <div>{{ customers.inputIdCardAddress }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect108') + ': ' }}</div> <!-- 身份证邮编 -->
        <div>{{ customers.inputIdCardPinCode }}</div>
      </li>
      <li>
        <div>{{ $t('common.common126') + ': ' }}</div> <!-- 身份证状态编号 -->
        <div>{{ customers.stateNumber }}</div>
      </li>

      <li>
        <div>{{ $t('common.common129') + ': ' }}</div> <!-- 城市 -->
        <div>{{ customers.district }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect105') + ': ' }}</div> <!-- 客户性别 -->
        <div>{{ customers.customerSex | userSexFilter }}</div>
      </li>
      <li>
        <div>{{ $t('userManage.userManage3') + ': ' }}</div> <!-- 客户生日 -->
        <div>{{ customers.customerBirthday | ArrayToDateFormat2 }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect104') + ': ' }}</div> <!-- 客户手机 -->
        <div>{{ customers.customerMobile }}</div>
      </li>

      <li>
        <div>{{ $t('loanMarket.loanMarket38') + ': ' }}</div> <!-- 英语身份证过期时间 -->
        <div>{{ customers.engDateOfExpiry }}</div>
      </li>
      <li>
        <div>{{ $t('loanMarket.loanMarket39') + ': ' }}</div> <!-- 英语身份证签发日期 -->
        <div>{{ customers.engDateOfIssue }}</div>
      </li>
      <li>
        <div>{{ $t('loanMarket.loanMarket40') + ': ' }}</div> <!-- 英语（公历）出生日期 -->
        <div>{{ customers.engDateOfBirth }}</div>
      </li>

      <li>
        <div>{{ $t('userManage.userManage2') + ': ' }}</div> <!-- 身份证地址 -->
        <div>{{ customers.customerAddress }}</div>
      </li>
      <li>
        <div>{{ $t('userManage.userManage4') + ': ' }}</div> <!-- 现居邮编 -->
        <div>{{ customers.customerPostcode }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect106') + ': ' }}</div> <!-- 客户邮箱 -->
        <div>{{ customers.customerEmail }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect131') + ': ' }}</div> <!-- whatsapp账号 -->
        <div>{{ customers.customerWhatsapp }}</div>
      </li>
      <li>
        <div>{{ $t('userManage.userManage8') + ': ' }}</div> <!-- 婚姻状况 -->
        <div>{{ customers.maritalStatus | maritalStatusFilter }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect119') + ': ' }}</div> <!-- 紧急联系人1名称 -->
        <div>{{ customers.contact1Name }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect118') + ': ' }}</div> <!-- 紧急联系人1电话 -->
        <div>
          {{ customers.contact1Mobile }}
          <el-button
            v-if="isUserDetails === '1' && !permission.isAdmin && recordData.principal"
            type="primary"
            size="mini"
            style="margin-left: 20px;"
            @click="openAdd(customers.contact1Name, customers.contact1Mobile, customers.contact1Relation)"
          >{{ recordData.isRemind ? $t('loanMarket.loanMarket73') : $t('collect.collect42') }}</el-button> <!-- 新增提醒 : 新增催记 -->
        </div>
      </li>
      <li>
        <div>{{ $t('collect.collect120') + ': ' }}</div> <!-- 紧急联系人1关系 -->
        <div>{{ customers.contact1Relation | contactRelationFilter }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect122') + ': ' }}</div> <!-- 紧急联系人2名称 -->
        <div>{{ customers.contact2Name }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect121') + ': ' }}</div> <!-- 紧急联系人2电话 -->
        <div>
          {{ customers.contact2Mobile }}
          <el-button
            v-if="isUserDetails === '1' && !permission.isAdmin && recordData.principal"
            type="primary"
            size="mini"
            style="margin-left: 20px;"
            @click="openAdd(customers.contact2Name, customers.contact2Mobile, customers.contact2Relation)"
          >{{ recordData.isRemind ? $t('loanMarket.loanMarket73') : $t('collect.collect42') }}</el-button> <!-- 新增提醒 : 新增催记 -->
        </div>
      </li>
      <li>
        <div>{{ $t('collect.collect123') + ': ' }}</div> <!-- 紧急联系人2关系 -->
        <div>{{ customers.contact2Relation | contactRelationFilter }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect132') + ': ' }}</div> <!-- 教育程度 -->
        <div>{{ customers.eduStatus | eduStatusFilter }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect143') + ': ' }}</div> <!-- 工作类型 -->
        <div>{{ customers.professionType | positionTypeFilter }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect144') + ': ' }}</div> <!-- 职务 -->
        <div>{{ customers.positionType | professionTypeFilter }}</div>
      </li>

      <li>
        <div>{{ $t('common.common133') + ': ' }}</div> <!-- 月收入范围 -->
        <div>{{ customers.monthlyIncome | monthlyIncomeFilter }}</div>
      </li>
      <li>
        <div>{{ $t('common.common134') + ': ' }}</div> <!-- 收入类型 -->
        <div>{{ customers.incomeType | incomeTypeFilter }}</div>
      </li>
      <li>
        <div>{{ $t('common.common143') + ': ' }}</div> <!-- 工龄 -->
        <div>{{ customers.workingServiceYears | workingServiceYearsFilter }}</div>
      </li>

      <li>
        <div>{{ $t('sysManage.sysManage54') + ': ' }}</div> <!-- 公司名称 -->
        <div>{{ customers.companyName }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect124') + ': ' }}</div> <!-- 公司电话 -->
        <div>{{ customers.companyPhone }}</div>
      </li>

      <li>
        <div>{{ $t('collect.collect128') + ': ' }}</div> <!-- 公司类型 -->
        <div>{{ customers.companyType | companyTypeFilter }}</div>
      </li>
      <li>
        <div>{{ $t('collect.collect126') + ': ' }}</div> <!-- 公司地址 -->
        <div>{{ customers.companyAddress }}</div>
      </li>
    </ul>

    <ul class="img-box">
      <li class="img-box">
        <el-image
          :src="customers.inputIdCardFrontPhotoUrl"
          :preview-src-list="[customers.inputIdCardFrontPhotoUrl]"
          @click.stop="handleClickItem"
        >
          <div slot="error" class="image-slot">
            <span>{{ customers.inputIdCardFrontPhotoUrl ? $t('collect.collect212') : $t('collect.collect213') }}</span>     <!-- 加载失败  图片未上传 -->
          </div>
        </el-image>
        <div class="img-bottom">{{ $t('collect.collect154') }}</div> <!-- 身份证正面照片 -->
      </li>

      <li>
        <el-image
          :src="customers.faceImages"
          :preview-src-list="[customers.faceImages]"
          @click.stop="handleClickItem"
        >
          <div slot="error" class="image-slot">
            <span>
              {{ customers.faceImages ? $t('collect.collect212') : $t('collect.collect213') }}
            </span>     <!-- 加载失败  图片未上传 -->    <!-- 图片未上传 -->
          </div>
        </el-image>
        <div class="img-bottom">{{ $t('collect.collect150') }}</div> <!-- 活体检测照片 -->
      </li>

      <li class="img-box">
        <el-image
          :src="customers.inputIdCardHandPhotoUrl"
          :preview-src-list="[customers.inputIdCardHandPhotoUrl]"
          @click.stop="handleClickItem"
        >
          <div slot="error" class="image-slot">
            <span>{{ customers.inputIdCardHandPhotoUrl ? $t('collect.collect212') : $t('collect.collect213') }}</span>     <!-- 加载失败  图片未上传 -->
          </div>
        </el-image>
        <div class="img-bottom">{{ $t('collect.collect234') }}</div> <!-- 手持身份证照片地址 -->
      </li>
    </ul>

    <add-push-down v-if="openAddDrawer" :current-row="currentRow" @closeAdd="closeAdd" />
  </div>
</template>

<script>
import addPushDown from './addPushDown'
import { mapState } from 'vuex'

export default {
  name: 'BaseInfo',
  components: {
    addPushDown
  },
  props: {
    customers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    recordData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 新增催记
      openAddDrawer: false,
      currentRow: {},

      isUserDetails: ''
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  mounted() {
    setTimeout(() => {
      const obj = this.sessionData('get', 'isUserDetails') || {}
      this.isUserDetails = obj[this.recordData.userId]
    }, 10)
  },
  methods: {
    // 点击遮罩关闭预览图片
    handleClickItem() {
      // 获取遮罩层dom
      setTimeout(() => {
        const domImageMask = document.querySelector('.el-image-viewer__mask')
        if (!domImageMask) {
          return
        }
        domImageMask.addEventListener('click', () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector('.el-image-viewer__close').click()
        })
      }, 10)
    },
    // 添加为黑名单
    addBlack(e) {
      const tips = e ? this.$t('userManage.userManage26') : this.$t('userManage.userManage27') /* 是否确认将用户设为黑名单？ 是否确认将用户移出黑名单？ */
      this.$confirm(tips, this.$t('common.common145'), { /* 提示 */
        confirmButtonText: this.$t('common.common10'), /* 确定 */
        cancelButtonText: this.$t('common.common11'), /* 取消 */
        type: 'warning'
      }).then(async() => {
        this.$emit('addBlack', e)
      }).catch(() => {
        this.customers.blackCustomer = !e
        this.$message({
          type: 'info',
          message: this.$t('common.common17') /* 已取消 */
        })
      })
    },
    // 增加催记
    openAdd(name, mobile, relation) {
      // if (!(this.isUserDetails === '1' && !this.permission.isAdmin && this.recordData.principal)) return false
      this.currentRow = {
        userId: this.recordData.userId,
        orderId: this.recordData.orderId,
        periodId: this.recordData.periodId,
        borrowId: this.recordData.borrowId,
        collectionOrderId: this.recordData.orderId,
        customerName: this.customers.customerName,
        customerMobile: this.customers.customerMobile,
        overDueDays: this.customers.overDueDays,
        relationName: name,
        relationMobile: mobile
      }
      this.openAddDrawer = true
    },
    closeAdd(item) {
      this.openAddDrawer = false
      if (item) {
        this.$emit('addRecordSuccess')
      }
    }
  }
}
</script>

<style lang="scss">
  .user-info-box {
    width: 100%;
    .base-box {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        display: flex;
        justify-content: flex-start;
        width: 30%;
        margin-bottom: 20px;
        @media screen and (max-width: 1620px) {
          width: 50%;
        }
        @media screen and (max-width: 916px) {
          width: 100%;
        }
        div {
          width: 200px;
          padding: 5px 6px;
          box-sizing: border-box;
        }
        div:nth-child(1) {
          // width: 30%;
          text-align: right;
        }
        div:nth-child(2) {
          width: 260px;
          // width: 50%;
          text-align: left;
          border: 1px solid #eee;
          border-radius: 3px;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
        }
        .el-tooltip {
          height: 26px;
        }
      }
    }
    .img-box {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 25%;
        display: flex;
        position: relative;
        padding-bottom: 40px;
        margin-bottom: 20px;
        .el-image {
          width: 80%;
          height: 200px;
          margin: 0 auto;
          @media screen and (max-width: 550px) {
            width: 100%;
          }
        }
        .image-slot {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f5f7fa;
          color: #909399;
          font-size: 14px;
        }
        .img-bottom {
          width: 60%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #eee;
        }
        @media screen and (max-width: 1620px) {
          width: 50%;
        }
        @media screen and (max-width: 916px) {
          width: 100%;
        }
      }
    }
  }
  .add-black {
    color: red;
    cursor: pointer;
  }
</style>
