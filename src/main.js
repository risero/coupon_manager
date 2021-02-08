import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/index'
import '@/assets/font/iconfont.css'
import axios from 'axios'
import Qs from 'qs'

Vue.prototype.$http = axios

/**
 * 对请求的数据做处理
 */
Vue.prototype.$http.interceptors.request.use(function (config) {
  if (config.data) {
    config.data = Qs.stringify(config.data)
  }
  return config
})

/**
 * 对响应的数据做处理
 */
axios.interceptors.response.use(res=>{
  if (res && res.data) {
    return res.data
  }
})

// axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.baseURL = 'http://39.108.12.238:8080/coupon'
// 引入全局通用样式
import '@/assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
