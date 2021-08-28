泰国小贷后台

运营管理
借款日报
运营日报
应用市场报表
API转换

放款管理
待审核订单
拒绝放款订单
待放款订单
放款记录
放款失败订单

还款管理
代还款订单
还款记录

财务管理
人工入账
人工入账流水
还款流水
待放款订单

借款管理
借款申请
历史借款订单

催收管理
催收订单列表
我的催收订单
线下还款订单
减免订单
我的减免订单
催收业绩

催收员管理
分组设置
催收员列表
自动派单

风控管理
风控配置

用户管理
用户认证信息
用户查询
黑名单列表

系统管理
账号管理
角色管理
系统设置
产品管理
催收公司管理

myDesk: '我的工作台',
  profileData: '数据概况',

theDataCenter: '运营管理',
  borrowingDaily: '借款日报',
  dailyOperations: '运营日报',
  applicationMarketReport: '应用市场报表',
  postLoanPerformance: 'API转换',

loanManagement: '放款管理',
  orderToBeReviewed: '待审核订单',
  rejectLoanOrder: '拒绝放款订单',
  pendingOrder: '待放款订单',
  recordLending: '放款记录',
  loanFailureOrder: '放款失败订单',

paymentManagement: '还款管理',
  repaymentOrder: '还款分期表',
  repaymentHistory: '还款记录',

collectionManagement: '催收管理',
  collectionOrderList: '催收订单列表',
  myOrderCollection: '我的催收订单',
  offlineRepaymentOrder: '线下还款订单',
  breaksTheOrder: '减免订单',
  myCancellationOrder: '我的减免订单',
  collectionPerformance: '催收业绩',

collectionAgentManagement: '催收员管理',
  groupSetUp: '分组设置',
  listOfCollectors: '催收员列表',
  automaticallySendASingle: '自动派单',

borrowManage: '借款管理',
  loanApplication: '贷款订单表',
  historicalLoanOrder: '历史借款订单',

riskControlManagement: '风控管理',
  riskControlConfiguration: '风控产品配置',

userManagement: '用户管理',
  userAuthenticationInformation: '用户认证信息',
  userQuery: '用户查询',
  blacklist: '黑名单列表',

systemSettings: '系统设置',
  accountManagement: '账号管理',
  roleManagement: '角色管理',
  productManagement: '产品管理',
  collectionsCompany: '催收公司管理',

financialManage: '财务管理'
  artificialBooked: '人工入账'
  artificialBookedRunning: '人工入账流水'


@ApiModelProperty("英文字符姓")
private String lastName;
@ApiModelProperty("英文字符名")
private String firstName;
@ApiModelProperty("英语身份证过期时间")
private String engDateOfExpiry;
@ApiModelProperty("英语身份证签发日期")
private String engDateOfIssue;
@ApiModelProperty("英语语（公历）出生日期")
private String engDateOfBirth;



id (integer, optional),
overDate (string, optional): 到期时间 ,
marketId (integer, optional): 订单来源贷超号 ,

dueNeedRepayCount (integer, optional): 总到期笔数 ,
dueNeedRepayAmount (number, optional): 总到期金额 ,
inCollectionCount (integer, optional): 总入催笔数 ,
inCollectionAmount (number, optional): 总入催金额 ,
overDueNewAmount (number, optional): 总在逾金额 ,
firstOverDueRate (number, optional): 总首逾率 ,
overDueRate (number, optional): 总在逾率 ,
overDueOneDay (number, optional): 逾期一天率(DPD1天) ,
overDueThreeDay (number, optional): 逾期三天率(DPD3) ,
overDueSevenDay (number, optional): 逾期七天率(DPD7) ,
overDueThreeDayRepay (number, optional): 3+催回率
overDueSevenDayRepay (number, optional): 7+催回率 ,
overDueNowDayRepay (number, optional): 目前催回率 ,

newDueNeedRepayCount (integer, optional): 新客到期笔数 ,
newDueNeedRepayAmount (number, optional): 新客到期金额 ,
newInCollectionCount (integer, optional): 新客入催笔数 ,
newInCollectionAmount (number, optional): 新客入催金额 ,
newOverDueNewAmount (number, optional): 新客在逾金额 ,
newFirstOverDueRate (number, optional): 新客首逾率 ,
newOverDueRate (number, optional): 新客在逾率 ,
newOverDueOneDay (number, optional): 新客逾期一天率  DPD1 ,
newOverDueThreeDay (number, optional): 新客逾期三天率 DPD3,
newOverDueSevenDay (number, optional): 新客逾期七天率 DPD7,
newOverDueThreeDayRepay (number, optional): 新客3+催回率 ,
newOverDueSevenDayRepay (number, optional): 新客7+催回率 ,
newOverDueNowDayRepay (number, optional): 新客目前摧回率 ,

oldDueNeedRepayCount (integer, optional): 老客到期笔数 ,
oldDueNeedRepayAmount (number, optional): 老客到期金额 ,
oldInCollectionCount (integer, optional): 老客入催笔数 ,
oldInCollectionAmount (number, optional): 老客入催金额 ,
oldOverDueNewAmount (number, optional): 老客在逾金额 ,
oldFirstOverDueRate (number, optional): 老客首逾率 ,
oldOverDueRate (number, optional): 老客在逾率 ,
oldOverDueOneDay (number, optional): 老客逾期一天率 DPD1,
oldOverDueThreeDay (number, optional): 老客逾期三天率 DPD3,
oldOverDueSevenDay (number, optional): 老客逾期七天率 DPD7,
oldOverDueThreeDayRepay (number, optional): 老客3+催回率 ,
oldOverDueSevenDayRepay (number, optional): 老客7+催回率 ,
oldOverDueNowDayRepay (number, optional): 老客目前摧回率 ,


@ApiModelProperty("风控分数")
private BigDecimal score;
@ApiModelProperty("使用的模型类型（10：epoch；20：zelda；30：内部；40：基础,50:cashcash）")
private Integer modeType;
@ApiModelProperty("风控结果类型（10：通过；20：永久拒绝；30：有限拒绝；40：风控获取异常（如果是有限拒绝，要写入下次准入期））")
private Integer modelResult;