// 导入parseTime、formatTime并设置为筛选器
export { parseTime, formatTime } from '@/utils'
import i18n from '@/lang' // internationalization
export {
  companyTypeFilter,
  customerLangFilter,
  eduStatusFilter,
  loanPurposeFilter,
  positionTypeFilter,
  professionTypeFilter,
  religionTypeFilter,
  residenceTypeFilter,
  statusFilter,
  repayStatusFilter,
  repayWayFilter,
  payCompanyFilter,
  payChannelFilter,
  changeTypeFilter,
  compareTypeFilter,
  principalAmountFilter,
  customerTypeFilter,
  monthlyIncomeFilter,
  incomeTypeFilter,
  accountTypeFilter,
  itemTypeFilter,
  workingServiceYearsFilter
} from './userBaseInfoFilter'

export {
  marketTypeFilter,
  billChangeTypeFilter,
  companyIdFilter,
  connectStatusFilter,
  releaseResultSucceedFilter,
  blackTypeFilter,
  reviewingStatusFilter,
  collectionTypeFilter
} from './loanMarket'

/**
 * 如果时间是复数，则显示复数标签
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * 数字格式
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 大写第一个字符
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 秒 转为 分:秒
 */
export function durationFilter(data) {
  return [
    parseInt(data / 60) + ' ',
    ' ' + parseInt(data % 60)
  ].join(i18n.tc('risk.risk80')).replace(/\b(\d)\b/g, '0$1') + ' ' + i18n.tc('risk.risk81') /* 分 秒 */
}

/**
 * 时间戳转日期格式
 * @param {Number} timestamp  时间戳
 */
export function formatterTimeYMDHMS(timestamp) {
  if (!timestamp) return ''
  var date = new Date(timestamp)
  var year = date.getFullYear()
  var mon = date.getMonth() + 1
  var day = date.getDate()
  var hours = date.getHours()
  var minu = date.getMinutes()
  var sec = date.getSeconds()

  return year + '-' + mon + '-' + day + ' ' + hours + ':' + minu + ':' + sec
}

/**
 * 时间戳转日期格式
 * @param {Number} timestamp  时间戳
 */
export function formatterTimeYMDHM(timestamp) {
  if (!timestamp) return ''
  var date = new Date(timestamp)
  var year = date.getFullYear()
  var mon = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minu = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  return year + '-' + mon + '-' + day + ' ' + hours + ':' + minu
}

/**
 * 数组转日期 -- [] -> 'yyyy-MM-dd hh:mm:ss'
 * @param {Number} arr  数组： [2020, 12, 3, 1, 20, 30]
 */
export function ArrayToDateFormat(arr) {
  const tmp = []
  if (!arr || !Array.isArray(arr)) return ''
  arr.forEach(item => {
    if (item < 10) {
      item = '0' + item
      tmp.push(item)
    } else {
      tmp.push(item)
    }
  })
  if (!tmp[3]) tmp[3] = '00'
  if (!tmp[4]) tmp[4] = '00'
  if (!tmp[5]) tmp[5] = '00'
  return tmp[0] + '-' + tmp[1] + '-' + tmp[2] + ' ' + tmp[3] + ':' + tmp[4] + ':' + tmp[5]
}

/**
 * 数组转日期 -- [] -> 'yyyy-MM-dd
 * @param {Number} arr  数组： [2020, 12, 3]
 */
export function ArrayToDateFormat2(arr) {
  const tmp = []
  if (!arr || !Array.isArray(arr)) return ''
  arr.forEach(item => {
    if (item < 10) {
      item = '0' + item
      tmp.push(item)
    } else {
      tmp.push(item)
    }
  })
  return tmp[0] + '-' + tmp[1] + '-' + tmp[2]
}

/**
 * 用户类型
 * @param {Number} userType
 */
export function userTypeFilter(userType) {
  switch (userType * 1) {
    case 10:
      return i18n.tc('common.common1') /* 管理账户 */
    case 20:
      return i18n.tc('common.common2') /* 催收账户 */
    default:
      return ''
  }
}

/**
 * 账户状态
 * @param {Number} timeState
 */
export function merchantStateFilter(timeState) {
  switch (timeState * 1) {
    case 0:
      return i18n.tc('common.common3') /* 生效中 */
    case 1:
      return i18n.tc('common.common4') /* 已到期 */
    case 2:
      return i18n.tc('common.common5') /* 待生效 */
    default:
      return ''
  }
}

/**
 * 性别
 * @param {Number} userSex
 */
export function userSexFilter(userSex) {
  if (userSex === null) return ''
  switch (userSex * 1) {
    case 0:
      return i18n.tc('common.common6') /* 未知 */
    case 10:
      return i18n.tc('common.common7') /* 男 */
    case 20:
      return i18n.tc('common.common8') /* 女 */
    default:
      return ''
  }
}

/**
 * 模型分类型
 * @param {Number} modelType
 */
export function modelTypeFilter(modelType) {
  switch (modelType * 1) {
    case 10:
      return i18n.tc('risk.risk75') /* 海贝风控 */
    case 20:
      return 'newbee'
    case 30:
      return 'luca'
    default:
      return ''
  }
}

/**
 * 期单位
 * @param {Number} periodUnit
 */
export function periodUnitFilter(periodUnit) {
  switch (periodUnit * 1) {
    case 10:
      return i18n.tc('common.common23') /* 天 */
    case 20:
      return i18n.tc('common.common24') /* 周 */
    case 30:
      return i18n.tc('common.common25') /* 月 */
    case 40:
      return i18n.tc('common.common26') /* 季 */
    case 50:
      return i18n.tc('common.common27') /* 年 */
    default:
      return ''
  }
}

/**
 * 标签
 * @param {Number} flag
 */
export function flagFilter(data) {
  switch (data * 1) {
    case 1:
      return i18n.tc('financial.financial11') /* 有人接听 */
    case 2:
      return i18n.tc('financial.financial12') /* WhatsApp可联 */
    case 3:
      return i18n.tc('financial.financial13') /* whatsAPP未回复 */
    case 4:
      return i18n.tc('financial.financial14') /* 无人接听 */
    case 5:
      return i18n.tc('financial.financial15') /* 电话占线 */
    case 6:
      return i18n.tc('financial.financial16') /* 关机 */
    case 7:
      return i18n.tc('financial.financial17') /* 其他方式可联 */
    case 8:
      return i18n.tc('financial.financial18') /* 没有whatsap账号 */
    case 9:
      return i18n.tc('financial.financial19') /* 空号错号 */
    case 10:
      return i18n.tc('financial.financial20') /* 停机 */
    case 11:
      return i18n.tc('financial.financial21') /* 特殊【中介黑产催收】 */
    case 12:
      return i18n.tc('financial.financial22') /* 其他 */
    default:
      return ''
  }
}

/**
 * 订单状态
 * @param {Number} borrowStatus
 */
export function borrowStatusFilter(borrowStatus) {
  if (borrowStatus === null) return ''

  switch (borrowStatus * 1) {
    case 0:
      return i18n.tc('collect.collect25') /* 推送中 */
    case 10:
      return i18n.tc('collect.collect26') /* 风控中 */
    case 20:
      return i18n.tc('collect.collect240') /* 人审中 */
    case 30:
      return i18n.tc('collect.collect241') /* 待提现 */
    case 40:
      return i18n.tc('collect.collect29') /* 放款中 */
    case 50:
      return i18n.tc('collect.collect30') /* 借贷中 */
    case 60:
      return i18n.tc('collect.collect31') /* 还款中 */
    case 70:
      return i18n.tc('collect.collect32') /* 逾期中 */
    case 1000:
      return i18n.tc('collect.collect33') /* 正常完成 */
    case 1010:
      return i18n.tc('collect.collect34') /* 逾期完成 */
    case 1020:
      return i18n.tc('collect.collect35') /* 放款前失败 */
    default:
      return ''
  }
}

/**
 * 贷款类型
 * @param {Number} loanType
 */
export function loanTypeFilter(loanType) {
  switch (loanType * 1) {
    case 10:
      return i18n.tc('collect.collect36') /* 首贷 */
    case 20:
      return i18n.tc('collect.collect37') /* 复贷 */
    default:
      return ''
  }
}

/**
 * 模型分
 * @param {Number} modelResultScore
 */
export function modelResultScoreFilter(modelResultScore) {
  switch (modelResultScore * 1) {
    case 10:
      return i18n.tc('collect.collect38') /* 西瓜分 */
    case 20:
      return i18n.tc('collect.collect39') /* zelda模型分 */
    case 30:
      return i18n.tc('collect.collect40') /* 内部模型分 */
    case 40:
      return i18n.tc('collect.collect41') /* 基础模型分 */
    default:
      return ''
  }
}

/**
 * 风控结果
 * @param {Number} modelResultType
 */
export function modelResultTypeFilter(modelResultType) {
  switch (modelResultType * 1) {
    case 10:
      return i18n.tc('borrow.borrow7') /* 通过 */
    case 20:
      return i18n.tc('borrow.borrow8') /* 永久拒绝 */
    case 30:
      return i18n.tc('borrow.borrow9') /* 有限拒绝 */
    case 40:
      return i18n.tc('borrow.borrow70') /* 风控分异常 */
    case 11:
      return i18n.tc('loanMarket.loanMarket50') /* 人审 */
    default:
      return ''
  }
}

/**
 * 是否接通
 * @param {Number} answer
 */
export function answerFilter(answer) {
  switch (answer) {
    case 0:
    case false:
      return i18n.tc('common.common33') /* 否 */
    case 1:
    case true:
      return i18n.tc('common.common34') /* 是 */
    default:
      return ''
  }
}

/**
 * 联系人与债主的关系
 * @param {Number} relation
 */
export function relationFilter(relation) {
  switch (parseInt(relation)) {
    case 10:
      return i18n.tc('collect.collect54') /* 配偶 */
    case 20:
      return i18n.tc('collect.collect55') /* 父母 */
    case 40:
      return i18n.tc('collect.collect57') /* 子女 */
    case 60:
      return i18n.tc('collect.collect59') /* 亲人 */
    case 80:
      return i18n.tc('collect.collect231') /* 本人 */
    case 100:
      return i18n.tc('collect.collect61') /* 同事 */
    case 110:
      return i18n.tc('collect.collect60') /* 朋友 */
    case 1000:
      return i18n.tc('collect.collect62') /* 其他 */
    default:
      return ''
  }
}

/**
 * 紧急联系人关系
 * @param {Number} relation
 */
export function contactRelationFilter(relation) {
  switch (parseInt(relation)) {
    case 10:
      return i18n.tc('risk.risk76') /* 父亲/母亲 */
    case 20:
      return i18n.tc('risk.risk77') /* 丈夫/妻子 */
    case 30:
      return i18n.tc('risk.risk78') /* 儿子/女儿 */
    case 40:
      return i18n.tc('risk.risk79') /* 朋友 */
    default:
      return ''
  }
}

/**
 * 是否愿意转告 本人还款意愿 0否 1是 2 不详
 * @param {Number} data
 */
export function wishFilter(data) {
  switch (data * 1) {
    case 0:
      return i18n.tc('common.common33') /* 否 */
    case 1:
      return i18n.tc('common.common34') /* 是 */
    case 2:
      return i18n.tc('common.common35') /* 不详 */
    default:
      return ''
  }
}

/**
 * 本人还款意愿
 * @param {Number} data
 */
export function repayWishFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('financial.financial23') /* 有能力有意愿还款 */
    case 20:
      return i18n.tc('financial.financial24') /* 有能力无意愿还款 */
    case 30:
      return i18n.tc('financial.financial25') /* 无能力有意愿还款 */
    case 40:
      return i18n.tc('financial.financial26') /* 无意愿无能力还款 */
    case 50:
      return i18n.tc('financial.financial22') /* 其他 */
    default:
      return ''
  }
}

/**
 * 类型
 * @param {Number} type
 */
export function typeFilter(type) {
  switch (type * 1) {
    case 0:
      return i18n.tc('common.common36') /* 催收 */
    case 1:
      return i18n.tc('common.common37') /* 客服 */
    default:
      return ''
  }
}

/**
 * 客户类型
 * @param {Number} old
 */
export function oldFilter(old) {
  switch (old) {
    case true:
      return i18n.tc('borrow.borrow21') /* 老客 */
    case false:
      return i18n.tc('borrow.borrow22') /* 新客 */
    default:
      return ''
  }
}

/**
 * 是否存在
 * @param {Number} whether
 */
export function whetherFilter(whether) {
  switch (whether) {
    case true:
      return i18n.tc('common.common34') /* 是 */
    case false:
      return i18n.tc('common.common33') /* 否 */
    default:
      return ''
  }
}

/**
 * 婚姻状况
 * @param {Number} maritalStatus
 */
export function maritalStatusFilter(maritalStatus) {
  switch (maritalStatus * 1) {
    case 10:
      return i18n.tc('userManage.userManage12') /* 未婚 */
    case 20:
      return i18n.tc('userManage.userManage13') /* 已婚 */
    case 30:
      return i18n.tc('userManage.userManage14') /* 离异 */
    case 50:
      return i18n.tc('common.common6') /* 未知 */
    default:
      return ''
  }
}

/**
 * 黑名单
 * @param {Number} blackCustomer
 */
export function blackCustomerFilter(blackCustomer) {
  switch (blackCustomer) {
    case false:
      return i18n.tc('common.common33') /* 否 */
    case true:
      return i18n.tc('common.common34') /* 是 */
    default:
      return ''
  }
}

/**
 * 减免状态
 * @param {Number} status
 */
export function discountStatusFilter(status) {
  switch (status * 1) {
    case 0:
      return i18n.tc('collect.collect77') /* 待审核 */
    case 10:
      return i18n.tc('borrow.borrow7') /* 通过 */
    case 20:
      return i18n.tc('collect.collect78') /* 驳回 */
    default:
      return ''
  }
}
