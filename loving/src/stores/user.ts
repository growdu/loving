import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThemeStore } from './theme'

export interface User {
  id: string
  phone?: string
  nickname: string
  avatar?: string
  isVip: boolean
  vipExpireAt?: string
  role?: 'male' | 'female' | 'couple'
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)
  const isVip = computed(() => user.value?.isVip ?? false)

  // 登录
  function login(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 登出
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 加载持久化状态
  function loadState() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch {
        logout()
      }
    }
  }

  // 更新用户信息（部分更新）
  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // 更新VIP状态
  function updateVipStatus(status: boolean) {
    if (user.value) {
      user.value = { ...user.value, isVip: status }
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('vip_status', status.toString())
    }
    // 同时更新 theme store 的 VIP 状态
    const themeStore = useThemeStore()
    themeStore.updateVipStatus(status)
  }

  // 检查 token 是否有效
  function validateToken(): boolean {
    if (!token.value) return false
    // Mock 场景始终返回 true
    return true
  }

  return {
    user,
    token,
    isLoggedIn,
    isVip,
    login,
    logout,
    loadState,
    updateUser,
    updateVipStatus,
    validateToken
  }
})
