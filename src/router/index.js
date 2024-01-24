import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
      // 路由守卫 当有token的时候 先判断 要重定向去 主页
    },
    {
      path: '/',
      name: '/',
      component: () => import('@/layout/layout.vue')
    },
    // 404 
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404/404.vue')
    },
    // 兜底路由
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/404/404.vue')
    }
  ],
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
})

// 全局路由守卫

export default router
