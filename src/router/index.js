import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/index'),
    children: [
      // 商品管理
      {
        path: '/product/list',
        component: ()=> import('@/views/product/List')
      },
      // 分类管理
      {
        path: '/category/list',
        component: ()=> import('@/views/product/List')
      },
      // 商品推荐
      {
        path: '/recommend/list',
        component: ()=> import('@/views/product/List')
      },
      // 广告管理
      {
        path: '/banner/list',
        component: ()=> import('@/views/product/List')
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
