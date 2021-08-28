import i18n from '@/lang' // internationalization

/**
 * 公司类型
 * @param {Number} companyType
 */
export function companyTypeFilter(companyType) {
  switch (companyType * 1) {
    case 10:
      return i18n.tc('common.common40') /* 股份有限公司 */
    case 20:
      return i18n.tc('common.common41') /* 有限责任公司 */
    case 30:
      return i18n.tc('common.common42') /* 一般合伙公司 */
    case 40:
      return i18n.tc('common.common43') /* 有限合伙公司 */
    case 50:
      return i18n.tc('common.common44') /* 合资公司和投资促进公司 */
    case 60:
      return i18n.tc('common.common45') /* 外资公司 */
    case 70:
      return i18n.tc('common.common51') /* 其它 */
    default:
      return ''
  }
}

/**
 * 使用语言
 * @param {Number} customerLang
 */
export function customerLangFilter(customerLang) {
  switch (customerLang * 1) {
    case 10:
      return i18n.tc('common.common52') /* 英语 */
    case 20:
      return i18n.tc('common.common53') /* 印地语 */
    case 30:
      return i18n.tc('common.common54') /* 马拉地语 */
    case 40:
      return i18n.tc('common.common55') /* 孟加拉语 */
    case 50:
      return i18n.tc('common.common56') /* 泰卢固语 */
    case 60:
      return i18n.tc('common.common57') /* 泰米尔语 */
    case 70:
      return i18n.tc('common.common58') /* 古吉拉特语 */
    case 80:
      return i18n.tc('common.common59') /* 坎纳达语 */
    case 90:
      return i18n.tc('common.common60') /* 乌尔都语 */
    case 100:
      return i18n.tc('common.common61') /* 马拉雅拉姆语 */
    case 110:
      return i18n.tc('common.common62') /* 奥迪亚 */
    case 1000:
      return i18n.tc('common.common63') /* 其它语言 */
    default:
      return ''
  }
}

/**
 *  教育程度
 * @param {Number} eduStatus
 */
export function eduStatusFilter(eduStatus) {
  switch (eduStatus * 1) {
    case 0:
      return i18n.tc('common.common111') /* 未受过教育 */
    case 10:
      return i18n.tc('common.common64') /* 初等教育 */
    case 20:
      return i18n.tc('common.common65') /* 中学教育 */
    case 30:
      return i18n.tc('common.common66') /* 技术/专业学士 */
    case 40:
      return i18n.tc('common.common67') /* 大学/技术学院 */
    case 50:
      return i18n.tc('common.common68') /* 专业/硕士/博士 */
    default:
      return ''
  }
}

/**
 *  借款用途
 * @param {Number} loanPurpose
 */
export function loanPurposeFilter(data) {
  switch (parseInt(data)) {
    case 0:
      return i18n.tc('collector.collector78') /* 紧急现金需求 */
    case 1:
      return i18n.tc('collector.collector79') /* 支付房租、水电费 */
    case 2:
      return i18n.tc('collector.collector80') /* 家庭和朋友聚餐的费用 */
    case 3:
      return i18n.tc('collector.collector81') /* 买新家具 */
    case 4:
      return i18n.tc('collector.collector82') /* 医疗费用 */
    case 5:
      return i18n.tc('collector.collector83') /* 网络教育学习 */
    case 6:
      return i18n.tc('collector.collector84') /* 朋友结婚礼物 */
    case 7:
      return i18n.tc('collector.collector85') /* 差旅费用 */
    case 8:
      return i18n.tc('collector.collector86') /* 网购 */
    case 9:
      return i18n.tc('common.common79') /* 其它 */
    default:
      return ''
  }
}

/**
 * 客户类型
 * @param {Number} customerType
 */
export function customerTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('common.common116') /* 工人 */
    case 20:
      return i18n.tc('common.common86') /* 学生 */
    case 30:
      return i18n.tc('common.common79') /* 其他 */
    default:
      return ''
  }
}

/**
 *  工作类型
 * @param {Number} positionType
 */
export function positionTypeFilter(data) {
  switch (parseInt(data)) {
    case 0:
      return i18n.tc('collector.collector75') /* 全职 */
    case 10:
      return i18n.tc('collector.collector76') /* 兼职 */
    case 20:
      return i18n.tc('collector.collector77') /* 创业者 */
    case 30:
      return i18n.tc('common.common90') /* 自由职业 */
    case 40:
      return i18n.tc('common.common79') /* 其它 */
    default:
      return ''
  }
}

/**
 *  职务
 * @param {Number} professionType
 */
export function professionTypeFilter(data) {
  switch (parseInt(data)) {
    case 10:
      return i18n.tc('collector.collector68') /* 老板 */
    case 20:
      return i18n.tc('collector.collector69') /* 合伙人 */
    case 30:
      return i18n.tc('collector.collector70') /* 总经理 */
    case 40:
      return i18n.tc('collector.collector71') /* 总监 */
    case 50:
      return i18n.tc('collector.collector72') /* 经理 */
    case 60:
      return i18n.tc('collector.collector73') /* 主管 */
    case 70:
      return i18n.tc('collector.collector74') /* 职工 */
    case 80:
      return i18n.tc('common.common79') /* 其它 */
    default:
      return ''
  }
}

/**
 *  宗教信仰
 * @param {Number} religionType
 */
export function religionTypeFilter(data) {
  switch (data * 1) {
    case 0:
      return i18n.tc('common.common94') /* 无 */
    case 10:
      return i18n.tc('common.common95') /* 佛教 */
    case 20:
      return i18n.tc('common.common96') /* 天主教 */
    case 30:
      return i18n.tc('common.common97') /* 基督教 */
    case 40:
      return i18n.tc('common.common98') /* 伊斯兰教 */
    case 50:
      return i18n.tc('common.common99') /* 道教 */
    case 60:
      return i18n.tc('common.common100') /* 印度教 */
    case 70:
      return i18n.tc('common.common112') /* 穆斯林 */
    case 80:
      return i18n.tc('common.common113') /* 儒学 */
    case 1000:
      return i18n.tc('common.common79') /* 其它 */
    default:
      return ''
  }
}

/**
 *  居住方式
 * @param {Number} residenceType
 */
export function residenceTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('common.common101') /* 租房 */
    case 20:
      return i18n.tc('common.common102') /* 自有住房 */
    case 30:
      return i18n.tc('common.common103') /* 和亲人共住 */
    case 40:
      return i18n.tc('common.common104') /* 单位提供 */
    case 100:
      return i18n.tc('common.common79') /* 其他 */
    default:
      return ''
  }
}

/**
 * 催收状态
 * @param {Number} status
 */
export function statusFilter(data) {
  switch (data * 1) {
    case 1:
      return i18n.tc('common.common105') /* 催收状态 */
    default:
      return ''
  }
}

/**
 * 还款状态
 * @param {Number} repayStatus
 */
export function repayStatusFilter(data) {
  switch (data * 1) {
    case 0:
      return i18n.tc('collect.collect223') /* 等待还款 */
    case 10:
      return i18n.tc('collect.collect224') /* 还款成功 */
    case 20:
      return i18n.tc('collect.collect225') /* 还款失败 */
    default:
      return ''
  }
}

/**
 * 还款途径
 * @param {Number} repayWay
 */
export function repayWayFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('collect.collect228') /* 主动 */
    case 20:
      return i18n.tc('collect.collect229') /* 被动 */
    case 30:
      return i18n.tc('collect.collect230') /* 线下 */
    default:
      return ''
  }
}

/**
 * 还款途径
 * @param {Number} payChannel
 */
export function payChannelFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('risk.risk61') /* 银行线上 */
    case 20:
      return i18n.tc('risk.risk62') /* oxxo线下便利店 */
    default:
      return ''
  }
}

/**
 * 支付公司
 * @param {Number} payCompany
 */
export function payCompanyFilter(data) {
  switch (parseInt(data)) {
    case 10:
      return 'banan pay'
    case 20:
      return 'fish pay'
    default:
      return ''
  }
}

/**
 * 变更类型
 * @param {Number} changeType
 */
export function changeTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('collector.collector39') /* 系统分案 */
    case 20:
      return i18n.tc('collector.collector40') /* 手工调案 */
    case 30:
      return i18n.tc('collect.collect83') /* 提交减免 */
    case 40:
      return i18n.tc('collector.collector41') /* 减免审核通过 */
    case 50:
      return i18n.tc('collector.collector42') /* 减免审核驳回 */
    case 60:
      return i18n.tc('collector.collector43') /* 催收（新增催记） */
    case 70:
      return i18n.tc('collector.collector44') /* 入账 */
    default:
      return ''
  }
}

/**
 * 模型分对比方法
 * @param {Number} compareType
 */
export function compareTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('risk.risk2') /* 大于上限值直过，小于下限值直拒。介于中间值人审 */
    case 20:
      return i18n.tc('risk.risk3') /* 小于下限值直过，大于上限值直拒。介于中间值人审 */
    default:
      return ''
  }
}

/**
 * 工作年限 工龄
 * @param {Number} workingServiceYears
 */
export function workingServiceYearsFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('common.common135') /* 1年以下 */
    case 20:
      return i18n.tc('common.common136') /* 1-2年 */
    case 30:
      return i18n.tc('common.common137') /* 2-3年 */
    case 40:
      return i18n.tc('common.common138') /* 3-5年 */
    case 50:
      return i18n.tc('common.common139') /* 5年以上 */
    default:
      return ''
  }
}

/**
 * 月收入范围
 * @param {Number} monthlyIncome
 */
export function monthlyIncomeFilter(data) {
  switch (data * 1) {
    case 10:
      return '3000'
    case 20:
      return '3000-6000MXN'
    case 30:
      return '6000-10000MXN'
    case 40:
      return '10000MXN-15000MXN'
    case 50:
      return '15000MXN-20000MXN'
    case 60:
      return '20000MXN-30000MXN'
    default:
      return ''
  }
}

/**
 * 收入类型
 * @param {Number} incomeType
 */
export function incomeTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('common.common140') /* 现金 */
    case 20:
      return i18n.tc('common.common141') /* 支票 */
    case 30:
      return i18n.tc('common.common142') /* 银行转账 */
    default:
      return ''
  }
}

/**
 * 账号类型
 * @param {Number} accountType
 */
export function accountTypeFilter(data) {
  switch (data * 1) {
    case 3:
      return 'DebitCard'
    case 10:
      return 'Cellphone number'
    case 40:
      return 'CLABE'
    default:
      return ''
  }
}

/**
 * KYC类型
 * @param {Number} accountType
 */
export function itemTypeFilter(data) {
  switch (data * 1) {
    case 10:
      return i18n.tc('collector.collector56') /* 身份证前ocr */
    case 11:
      return i18n.tc('collector.collector57') /* 身份证后ocr */
    case 20:
      return i18n.tc('collector.collector58') /* 身份证号认证 */
    case 30:
      return i18n.tc('collector.collector59') /* 税号认证 */
    case 40:
      return i18n.tc('collector.collector60') /* 活体检测 */
    case 50:
      return i18n.tc('collector.collector61') /* 人脸对比 */
    case 51:
      return i18n.tc('collector.collector87') /* 人脸-身份证号验证 */
    case 60:
      return i18n.tc('collector.collector62') /* 银行卡认证 */
    case 70:
      return i18n.tc('collector.collector63') /* 扩展信息录入 */
    case 80:
      return i18n.tc('collector.collector64') /* 手机号认证 */
    case 90:
      return i18n.tc('collector.collector65') /* 紧急联系人认证 */
    default:
      return ''
  }
}

/**
 * 模型分对比方法
 * @param {Number} principalAmount
 */
export function principalAmountFilter(data) {
  if (data === 0) return 0
  data = data || ''
  data = data.toString().split('.') // 分隔小数点
  var arr = data[0].split('').reverse() // 转换成字符数组并且倒序排列
  var res = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') // 添加分隔符
    }
    res.push(arr[i])
  }
  res.reverse() // 再次倒序成为正确的顺序
  if (data[1]) { // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + data[1])
  } else {
    res = res.join('')
  }
  return res
}
