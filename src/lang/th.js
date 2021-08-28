import route from './th/route'
import common from './th/common'
import sysManage from './th/sysManage'
import collector from './th/collector'
import collect from './th/collect'
import borrow from './th/borrow'
import userManage from './th/userManage'
import financial from './th/financial'
import risk from './th/risk'
import loanMarket from './th/loanMarket'
import theData from './th/theData'

export default {
  route,
  login: {
    title: 'ล็อกอินระบบ', /* 系统登录 */
    logIn: 'ล็อกอิน', /* 登录 */
    userName: 'หมายเลขบัญชี', /* 账号 */
    password: 'รหัสผ่าน', /* 密码 */
    validateCode: 'ตรวจสอบรหัส', /* 验证码 */
    iptUserName: 'โปรดป้อนชื่อผู้ใช้', /* 请输入用户名 */
    pwdNumber: 'รหัสผ่านไม่สามารถน้อยกว่า 6', /* 密码不能少于6位 */
    iptVaildateCode: 'โปรดป้อนรหัสการตรวจสอบ' /* 请输入验证码 */
  },
  navbar: {
    home: 'หน้าแรก', /* 首页 */
    logOut: 'เช็คเอาท์', /* 退出登录 */
    profile: 'ศูนย์กลางส่วนตัว', /* 个人中心 */
    sidebarLogo: 'ระบบจัดการเบื้องหลัง', /* 后台管理系统 */
    langSelect: 'เลือกภาษา', /* 选择语言 */
    currentTimeMillis: 'เวลาเซิร์ฟเวอร์', /* 服务器时间 */
    getServerTime: 'คลิกเพื่อรับเวลาของเซิร์ฟเวอร์', /* 点击获取服务器时间 */
    getSuccess: 'ดึงข้อมูลสำเร็จ' /* 获取成功 */

  },
  tagsView: {
    refresh: 'ปรับปรุงใหม่', /* 刷新 */
    close: 'ปิด', /* 关闭 */
    closeOthers: 'ปิด ที่เหลือ', /* 关闭其它 */
    closeAll: 'ปิดทั้งหมด' /* 关闭所有 */
  },
  common,
  sysManage,
  collector,
  collect,
  borrow,
  userManage,
  financial,
  risk,
  loanMarket,
  theData
}
