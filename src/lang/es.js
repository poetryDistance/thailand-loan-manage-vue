import route from './es/route'
import common from './es/common'
import sysManage from './es/sysManage'
import collector from './es/collector'
import collect from './es/collect'
import borrow from './es/borrow'
import userManage from './es/userManage'
import financial from './es/financial'
import risk from './es/risk'
import loanMarket from './es/loanMarket'
import theData from './es/theData'

export default {
  route,
  login: {
    title: 'Inicio de sesión del sistema', /* 系统登录 */
    logIn: 'Iniciar sesión', /* 登录 */
    userName: 'Número de cuenta', /* 账号 */
    password: 'Contraseña', /* 密码 */
    validateCode: 'Código de verificación', /* 验证码 */
    iptUserName: 'Introduzca un nombre de usuario', /* 请输入用户名 */
    pwdNumber: 'La contraseña no tener menos de 6 dígitos', /* 密码不能少于6位 */
    iptVaildateCode: 'Introduzca el Código de verificación' /* 请输入验证码 */
  },
  navbar: {
    home: 'Inicio', /* 首页 */
    logOut: 'cerrar sesión', /* 退出登录 */
    profile: 'Perfil', /* 个人中心 */
    sidebarLogo: 'Sistema de gestión de antecedentes', /* 后台管理系统 */
    langSelect: 'Elige un idioma', /* 选择语言 */
    currentTimeMillis: '', /* 服务器时间 */
    getServerTime: '', /* 点击获取服务器时间 */
    getSuccess: '', /* 获取成功 */

  },
  tagsView: {
    refresh: 'Actualizar', /* 刷新 */
    close: 'Cerrar', /* 关闭 */
    closeOthers: 'Cerrar otro', /* 关闭其它 */
    closeAll: 'Cerrar todo' /* 关闭所有 */
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
