import { getMarketList } from '@/api/loanSupermarket'
import { getCompanyName } from '@/api/sysManage'
import { getCollectionPeriodRuleAll } from '@/api/aiCallManage'
import i18n from '@/lang'
import { Message } from 'element-ui'

const state = {
  // 所有公司名
  companyNameOptions: [],
  // 所有公司名 -- 催收
  companyNameCollectOptions: [],
  // 所有公司名 -- 预提醒
  companyNameRemindOptions: [],
  // 所有催收等级
  collectionLevelOptions: [],
  // 账户状态
  isValidOptions: [],
  // 用户类型
  userTypeOptions: [],
  // 模型类型
  modelTypeOptions: [],
  // 期单位类型
  periodUnitOptions: [],
  // 标签
  flagOptions: [],
  // 订单状态
  borrowStatusOptions: [],
  // 订单状态 -- 贷款订单表和人工入账页面
  borrowStatusOptions1: [],
  // 贷款类型
  loanTypeOptions: [],
  // 风控结果
  modelResultTypeOptions: [],
  // 是否存在
  whetherOptions: [],
  // 性别
  sexOptions: [],
  // 婚姻状况
  maritalStatusOptions: [],
  // 客户类型
  oldOptions: [],
  // 黑名单
  blackCustomerOptions: [],
  // 减免状态
  discountStatusOptions: [],
  // 还款状态
  repayStatusOptions: [],
  // 还款途径
  repayWayOptions: [],
  // 模型分对比方法
  compareTypeOptions: [],
  // 市场类型
  marketTypeOptions: [],
  // KYC状态
  kycStatusOptions: [],
  // KYC类型
  itemTypeOptions: [],
  // 外呼场景
  callStatsCountOptions: [],
  // 黑名单列表页面 - 类型
  blackTypeOptions: [],
  // 催收类型
  collectionTypeOptions: []
}

const mutations = {
  COMPANY_NAME_OPTIONS: (state, data) => {
    state.companyNameOptions = data
  },
  COMPANY_NAME_COLLECT_OPTIONS: (state, data) => {
    state.companyNameCollectOptions = data
  },
  COMPANY_NAME_REMIND_OPTIONS: (state, data) => {
    state.companyNameRemindOptions = data
  },
  COLLECTION_LEVEL_OPTIONS: (state, data) => {
    state.collectionLevelOptions = data
  },
  IS_VALID_OPTIONS: (state, data) => {
    state.isValidOptions = data
  },
  USER_TYPE_OPTIONS: (state, data) => {
    state.userTypeOptions = data
  },
  MODEL_TYPE_OPTIONS: (state, data) => {
    state.modelTypeOptions = data
  },
  PERIOD_UNIT_OPTIONS: (state, data) => {
    state.periodUnitOptions = data
  },
  STATUS_OPTIONS: (state, data) => {
    state.flagOptions = data
  },
  BORROW_STATUS_OPTIONS: (state, data) => {
    state.borrowStatusOptions = data
  },
  BORROW_STATUS_OPTIONS1: (state, data) => {
    state.borrowStatusOptions1 = data
  },
  LOAN_TYPE_OPTIONS: (state, data) => {
    state.loanTypeOptions = data
  },
  MODEL_RESULT_TYPE_OPTIONS: (state, data) => {
    state.modelResultTypeOptions = data
  },
  WHETHER_OPTIONS: (state, data) => {
    state.whetherOptions = data
  },
  SEX_OPTIONS: (state, data) => {
    state.sexOptions = data
  },
  MARITAL_STATUS_OPTIONS: (state, data) => {
    state.maritalStatusOptions = data
  },
  OLD_OPTIONS: (state, data) => {
    state.oldOptions = data
  },
  BLACK_CUSTOMER_OPTIONS: (state, data) => {
    state.blackCustomerOptions = data
  },
  DISCOUNT_STATUS_OPTIONS: (state, data) => {
    state.discountStatusOptions = data
  },
  REPAY_STATUS_OPTIONS: (state, data) => {
    state.repayStatusOptions = data
  },
  REPAY_WAY_OPTIONS: (state, data) => {
    state.repayWayOptions = data
  },
  COMPARE_TYPE_OPTIONS: (state, data) => {
    state.compareTypeOptions = data
  },
  MARKET_TYPE_OPTIONS: (state, data) => {
    state.marketTypeOptions = data
  },
  KYC_STATUS_OPTIONS: (state, data) => {
    state.kycStatusOptions = data
  },
  ITEM_TYPE_OPTIONS: (state, data) => {
    state.itemTypeOptions = data
  },
  CALL_STATS_COUNT_OPTIONS: (state, data) => {
    state.callStatsCountOptions = data
  },
  BLACK_TYPE_OPTIONS: (state, data) => {
    state.blackTypeOptions = data
  },
  COLLECTION_TYPE_OPTIONS: (state, data) => {
    state.collectionTypeOptions = data
  }
}

const actions = {
  async getCompanyNameOptions({ commit }) {
    // 获取所有公司名 -- 催收
    const res = await getCompanyName({ collectionType: 10 })
    if (res.code !== '0') return Message.error(res.message || 'Error')
    commit('COMPANY_NAME_COLLECT_OPTIONS', res.data || [])

    // 获取所有公司名 -- 预提醒
    const item = await getCompanyName({ collectionType: 20 })
    if (item.code !== '0') return Message.error(item.message || 'Error')
    commit('COMPANY_NAME_REMIND_OPTIONS', item.data || [])

    // 获取所有公司名
    const companyNameCollectList = res.data.concat(item.data) || []
    commit('COMPANY_NAME_OPTIONS', companyNameCollectList)
  },

  async getMarketTypeOptions({ commit }) {
    // 获取所有市场类型
    const res = await getMarketList({ page: 1, size: 100 })
    if (res.code !== '0') return Message.error(res.message || 'Error')
    const tmp = []
    res.data.list.forEach(item => {
      tmp.push({
        value: item.id,
        label: item.marketName
      })
    })
    commit('MARKET_TYPE_OPTIONS', tmp)
  },

  async getCollectionLevelOptions({ commit }) {
    // 获取所有催收等级
    const res = await getCollectionPeriodRuleAll()
    if (res.code !== 0) return Message.error(res.message || 'Error')
    const tmp = []
    res.data.forEach(item => {
      tmp.push({
        value: item.sort,
        label: item.value
      })
    })
    commit('COLLECTION_LEVEL_OPTIONS', tmp || [])
  },
  getIsValidOptions({ commit }) {
    // 账户状态
    commit('IS_VALID_OPTIONS', [
      { value: 1, label: i18n.tc('sysManage.sysManage28') }, /* 启用 */
      { value: 0, label: i18n.tc('sysManage.sysManage27') } /* 禁用 */
    ])
    // 标签
    commit('STATUS_OPTIONS', [
      { value: 1, label: i18n.tc('financial.financial11') }, /* 有人接听 */
      { value: 2, label: i18n.tc('financial.financial12') }, /* WhatsApp可联 */
      { value: 3, label: i18n.tc('financial.financial13') }, /* whatsAPP未回复 */
      { value: 4, label: i18n.tc('financial.financial14') }, /* 无人接听 */
      { value: 5, label: i18n.tc('financial.financial15') }, /* 电话占线 */
      { value: 6, label: i18n.tc('financial.financial16') }, /* 关机 */
      { value: 7, label: i18n.tc('financial.financial17') }, /* 其他方式可联 */
      { value: 8, label: i18n.tc('financial.financial18') }, /* 没有whatsap账号 */
      { value: 9, label: i18n.tc('financial.financial19') }, /* 空号错号 */
      { value: 10, label: i18n.tc('financial.financial20') }, /* 停机 */
      { value: 11, label: i18n.tc('financial.financial21') }, /* 特殊【中介黑产催收】 */
      { value: 12, label: i18n.tc('financial.financial22') } /* 其他 */
    ])
    // 订单状态
    commit('BORROW_STATUS_OPTIONS', [
      { value: 0, label: i18n.tc('collect.collect25') }, /* 推送中 */
      { value: 10, label: i18n.tc('collect.collect26') }, /* 风控中 */
      { value: 20, label: i18n.tc('collect.collect240') }, /* 人审中 */
      { value: 30, label: i18n.tc('collect.collect241') }, /* 待提现 */
      { value: 40, label: i18n.tc('collect.collect29') }, /* 放款中 */
      { value: 50, label: i18n.tc('collect.collect30') }, /* 借贷中 */
      { value: 60, label: i18n.tc('collect.collect31') }, /* 还款中 */
      { value: 70, label: i18n.tc('collect.collect32') }, /* 逾期中 */
      { value: 1000, label: i18n.tc('collect.collect33') }, /* 正常完成 */
      { value: 1010, label: i18n.tc('collect.collect34') }, /* 逾期完成 */
      { value: 1020, label: i18n.tc('collect.collect35') } /* 放款前失败 */
    ])
    // 订单状态 -- 人工入账和贷款订单表页面
    commit('BORROW_STATUS_OPTIONS1', [
      { value: 50, label: i18n.tc('collect.collect30') }, /* 借贷中 */
      { value: 60, label: i18n.tc('collect.collect31') }, /* 还款中 */
      { value: 70, label: i18n.tc('collect.collect32') } /* 逾期中 */
    ])
    // 贷款类型
    commit('LOAN_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('collect.collect36') }, /* 首贷 */
      { value: 20, label: i18n.tc('collect.collect37') } /* 复贷 */
    ])
    // 风控结果
    commit('MODEL_RESULT_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('borrow.borrow7') }, /* 通过 */
      { value: 20, label: i18n.tc('borrow.borrow8') }, /* 永久拒绝 */
      { value: 30, label: i18n.tc('borrow.borrow9') }, /* 有限拒绝 */
      { value: 40, label: i18n.tc('borrow.borrow70') } /* 风控分异常 */
    ])
    // 是否存在
    commit('WHETHER_OPTIONS', [
      { value: true, label: i18n.tc('common.common34') }, /* 是 */
      { value: false, label: i18n.tc('common.common33') } /* 否 */
    ])
    // 性别
    commit('SEX_OPTIONS', [
      { value: 0, label: i18n.tc('common.common6') }, /* 未知 */
      { value: 10, label: i18n.tc('common.common7') }, /* 男 */
      { value: 20, label: i18n.tc('common.common8') } /* 女 */
    ])
    // 婚姻状况
    commit('MARITAL_STATUS_OPTIONS', [
      { value: 10, label: i18n.tc('userManage.userManage12') }, /* 未婚 */
      { value: 20, label: i18n.tc('userManage.userManage13') }, /* 已婚 */
      { value: 30, label: i18n.tc('userManage.userManage14') } /* 离异 */
    ])
    // 客户类型
    commit('OLD_OPTIONS', [
      { value: true, label: i18n.tc('borrow.borrow21') }, /* 老客 */
      { value: false, label: i18n.tc('borrow.borrow22') } /* 新客 */
    ])
    // 黑名单
    commit('BLACK_CUSTOMER_OPTIONS', [
      { value: true, label: i18n.tc('common.common34') }, /* 是 */
      { value: false, label: i18n.tc('common.common33') } /* 否 */
    ])
    // 减免状态
    commit('DISCOUNT_STATUS_OPTIONS', [
      { value: 0, label: i18n.tc('collect.collect77') }, /* 待审核 */
      { value: 10, label: i18n.tc('borrow.borrow7') }, /* 通过 */
      { value: 20, label: i18n.tc('collect.collect78') } /* 驳回 */
    ])
    // 还款状态
    commit('REPAY_STATUS_OPTIONS', [
      { value: 0, label: i18n.tc('collect.collect223') }, /* 等待还款 */
      { value: 10, label: i18n.tc('collect.collect224') }, /* 还款成功 */
      { value: 20, label: i18n.tc('collect.collect225') } /* 还款失败 */
    ])
    // 还款途径
    commit('REPAY_WAY_OPTIONS', [
      // { value: 10, label: i18n.tc('collect.collect228') }, /* 主动 */
      // { value: 20, label: i18n.tc('collect.collect229') }, /* 被动 */
      // { value: 30, label: i18n.tc('collect.collect230') } /* 线下 */

      { value: 10, label: i18n.tc('risk.risk61') }, /* 银行线上 */
      { value: 20, label: i18n.tc('risk.risk62') } /* oxxo线下便利店 */
    ])
    // 模型分对比方法
    commit('COMPARE_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('risk.risk2') }, /* 大于上限值直过，小于下限值直拒。介于中间值人审 */
      { value: 20, label: i18n.tc('risk.risk3') } /* 小于下限值直过，大于上限值直拒。介于中间值人审 */
    ])
    // 市场类型
    // commit('MARKET_TYPE_OPTIONS', [
    //   { value: 10000, label: 'CactusCash' },
    //   { value: 10001, label: 'CtuscshJoke1' }
    // ])
    // KYC状态
    commit('KYC_STATUS_OPTIONS', [
      { value: 0, label: i18n.tc('collect.collect237') }, /* 待验证 */
      { value: 10, label: i18n.tc('borrow.borrow7') }, /* 通过 */
      { value: 20, label: i18n.tc('collect.collect238') } /* 未通过 */
    ])
    // KYC类型
    commit('ITEM_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('collector.collector56') }, /* 身份证前ocr */
      { value: 11, label: i18n.tc('collector.collector57') }, /* 身份证后ocr */
      { value: 20, label: i18n.tc('collector.collector58') }, /* 身份证号认证 */
      { value: 30, label: i18n.tc('collector.collector59') }, /* 税号认证 */
      { value: 40, label: i18n.tc('collector.collector60') }, /* 活体检测 */
      { value: 50, label: i18n.tc('collector.collector61') }, /* 人脸对比 */
      { value: 60, label: i18n.tc('collector.collector62') }, /* 银行卡认证 */
      { value: 70, label: i18n.tc('collector.collector63') }, /* 扩展信息录入 */
      { value: 80, label: i18n.tc('collector.collector64') }, /* 手机号认证 */
      { value: 90, label: i18n.tc('collector.collector65') } /* 紧急联系人认证 */
    ])
    // 外呼场景
    commit('CALL_STATS_COUNT_OPTIONS', [
      { value: 0, label: i18n.tc('risk.risk18') }, /* 首催 */
      { value: 1, label: i18n.tc('risk.risk19') } /* 复催 */
    ])
    // 黑名单列表页面 - 类型
    commit('BLACK_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('borrow.borrow1') }, /* 身份证号 */
      { value: 20, label: i18n.tc('common.common28') }, /* 手机号 */
      { value: 30, label: i18n.tc('loanOrders.loanOrders26') }, /* 银行卡号 */
      { value: 40, label: i18n.tc('common.common13') } /* 姓名 */
    ])
    // 催收类型
    commit('COLLECTION_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('loanMarket.loanMarket62') }, /* 催收逾期 */
      { value: 20, label: i18n.tc('loanMarket.loanMarket63') } /* 预提醒 */
    ])
  },

  getUserTypeOptions({ commit }) {
    commit('USER_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('common.common1') }, /* 管理账户 */
      { value: 20, label: i18n.tc('common.common2') } /* 催收账户 */
    ])
  },
  getModelTypeOptions({ commit }) {
    commit('MODEL_TYPE_OPTIONS', [
      { value: 10, label: i18n.tc('risk.risk75') }, /* 海贝风控 */
      { value: 20, label: 'newbee' }
    ])
  },
  getPeriodUnitOptions({ commit }) {
    commit('PERIOD_UNIT_OPTIONS', [
      { value: 10, label: i18n.tc('common.common23') }, /* 天 */
      { value: 20, label: i18n.tc('common.common24') }, /* 周 */
      { value: 30, label: i18n.tc('common.common25') }, /* 月 */
      { value: 40, label: i18n.tc('common.common26') }, /* 季 */
      { value: 50, label: i18n.tc('common.common27') } /* 年 */
    ])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

