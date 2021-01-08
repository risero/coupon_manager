import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/index'),
    redirect: '/product/list',
    children: [
      // 商品列表
      {
        path: '/product/list',
        component: ()=> import('@/views/product/List')
      },
      // 商品编辑
      {
        path: '/product/edit',
        component: ()=> import('@/views/product/Edit')
      },
      // 分类列表
      {
        path: '/category/list',
        component: ()=> import('@/views/category/List')
      },
      // 商品推荐
      {
        path: '/recommend/list',
        component: ()=> import('@/views/product/List')
      },
      // 广告管理
      {
        path: '/banner/list',
        component: ()=> import('@/views/ad/List')
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
