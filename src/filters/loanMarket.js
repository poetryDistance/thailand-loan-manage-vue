import i18n from '@/lang' // internationalization

/**
 * 市场类型
 * @param {Number} marketType
 */
export function marketTypeFilter(data) {
  switch (data * 1) {
    case 10000:
      return 'CactusCash'
    case 10001:
      return 'CtuscshJoke1'
    default:
      return ''
  }
}

/**
 * 费用变更类型
 * @param {Number} changeType
 */
export function billChangeTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('borrow.borrow47') /* 创建 */
    case 20:
      return i18n.tc('borrow.borrow48') /* 逾期增加 */
    case 30:
      return i18n.tc('borrow.borrow49') /* 线上还款扣减 */
    case 40:
      return i18n.tc('borrow.borrow50') /* 减免 */
    case 50:
      return i18n.tc('borrow.borrow51') /* 管理员增加 */
    case 60:
      return i18n.tc('borrow.borrow55') /* 线下还款扣减（人工入账） */
    default:
      return ''
  }
}

/**
 * 语音记录 -- 服务商
 * @param {Number} companyId
 */
export function companyIdFilter(data) {
  switch (data * 1) {
    case 10:
      return 'ONCE'
    default:
      return ''
  }
}

/**
 * 语音记录 -- 是否接通
 * @param {Number} status
 */
export function connectStatusFilter(data) {
  switch (parseFloat(data)) {
    case 0:
      return i18n.tc('risk.risk31') /* 呼叫执行中 */
    case 10:
      return i18n.tc('risk.risk32') /* 未接通 */
    case 20:
      return i18n.tc('risk.risk33') /* 接通 */
    case 30:
      return i18n.tc('risk.risk34') /* 异常状态 */
    default:
      return ''
  }
}

/**
 * 放款结果是否成功
 * @param {Number} releaseResultSucceed
 */
export function releaseResultSucceedFilter(data) {
  switch (data) {
    case true:
      return i18n.tc('collect.collect224') /* 成功 */
    case false:
      return i18n.tc('collect.collect225') /* 失败 */
    default:
      return ''
  }
}

/**
 * 黑名单列表 -- 类型
 * @param {Number} type
 */
export function blackTypeFilter(data) {
  switch (data) {
    case 10:
      return i18n.tc('borrow.borrow1') /* 身份证号 */
    case 20:
      return i18n.tc('common.common28') /* 手机号 */
    case 30:
      return i18n.tc('loanOrders.loanOrders26') /* 银行卡号 */
    case 40:
      return i18n.tc('common.common13') /* 姓名 */
    default:
      return ''
  }
}

/**
 * 详情页 -- 人审结果
 * @param {Number} reviewingStatus
 */
export function reviewingStatusFilter(data) {
  if (!data) return ''
  switch (parseInt(data)) {
    case 10:
      return i18n.tc('borrow.borrow7') /* 通过 */
    case 20:
      return i18n.tc('collect.collect98') /* 拒绝 */
    default:
      return ''
  }
}

/**
 * 逾期阶段设置 -- 催收类型
 * @param {Number} collectionType
 */
export function collectionTypeFilter(data) {
  switch (parseInt(data)) {
    case 10:
      return i18n.tc('loanMarket.loanMarket62') /* 催收逾期 */
    case 20:
      return i18n.tc('loanMarket.loanMarket63') /* 预提醒 */
    default:
      return ''
  }
}
