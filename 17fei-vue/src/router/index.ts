import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('@/pages/AIPage.vue')
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('@/pages/MemberPage.vue')
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

export default router