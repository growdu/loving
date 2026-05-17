import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

// 路由白名单（无需登录可访问）
const whiteList = ['/', '/login', '/about', '/card', '/positions']

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/positions',
    name: 'Positions',
    component: () => import('@/pages/PositionsPage.vue')
  },
  {
    path: '/card',
    name: 'Card',
    component: () => import('@/pages/CardPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('@/pages/AIPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/pages/MemberPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue')
  },
  {
    path: '/game/fxq',
    name: 'Fxq',
    component: () => import('@/pages/FxqPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const themeStore = useThemeStore()

  // 初始化状态（从 localStorage 恢复）
  userStore.loadState()
  themeStore.loadState()

  const requiresAuth = to.meta.requiresAuth !== false
  const isLoggedIn = userStore.isLoggedIn

  // 登录页特殊处理：已登录则跳转首页
  if (to.path === '/login' && isLoggedIn) {
    next('/')
    return
  }

  // 需要认证但未登录
  if (requiresAuth && !isLoggedIn) {
    next('/login')
    return
  }

  // 白名单页面或已登录，直接通过
  next()
})

export default router