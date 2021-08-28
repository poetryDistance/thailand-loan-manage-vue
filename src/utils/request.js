import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress 配置

// create an axios instance
const service = axios.create({
  baseURL: '/', // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 20000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    NProgress.start()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如头或状态
   * Please return  response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 您还可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      NProgress.done()
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if (res.code === '1003' || res.code === '2004') {
        Vue.prototype.$clearAllCaches()
        setTimeout(() => {
          location.reload()
        }, 500)
      }
      NProgress.done()
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    NProgress.done()
    return { message: error.message, code: '-1' }
  }
)

export default service
