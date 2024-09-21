// createWebHashHistory
import { createRouter, createWebHistory } from 'vue-router'
import { GetToken } from '@/utils/HandlerToken.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
    },
    {
      path: '/',
      name: '/',
      component: () => import('@/layout/layout.vue'),
      redirect: '/chat',
      children: [
        {
          path: 'chat/:uuid?',
          name: 'chat',
          component: () => import('@/views/chat/chat.vue'),
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/components/Setting.vue'),
        },
        {
          path: 'maskplay',
          name: 'maskplay',
          component: () => import('@/components/MaskPlay.vue'),
        },
      ],
    },
    // 404
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404/404.vue'),
    },
    // 兜底路由
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/404/404.vue'),
    },
  ],
  // 当页面发生跳转的时候 新页面的top为0
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

// 全局路由守卫
router.beforeEach((to, from) => {
  let Token = GetToken('Token')
  if (!Token) {
    // 没有token 没有登陆过
    // 没有登录，去login 就会造成无限重定向 所以使用 to.name !== 'login' 避免无限重定向
    /*
      console.log(to.name !== 'login'); 第一次 true 跳到 login
      console.log(to.name !== 'login'); 第二次 false 说明你就是去的login 我就不管了 直接通行
    */
    if (to.name !== 'login') {
      return { name: 'login' }
    }
  } else {
    // 登陆过 有 token
    // 登录过后 不允许进入login
    if (to.name == 'login') {
      // 从哪来，回哪去
      return { name: from.name }
    }
  }
})

export default router
