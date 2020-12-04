import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/index'
import '@/assets/font/iconfont.css'

// 引入全局通用样式
import '@/assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
