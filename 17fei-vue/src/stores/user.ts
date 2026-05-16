import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  phone?: string
  nickname: string
  avatar?: string
  isVip: boolean
  vipExpireAt?: string
  role?: 'male' | 'female'
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)
  const isVip = computed(() => user.value?.isVip ?? false)

  function login(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function loadState() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  function updateVipStatus(status: boolean) {
    if (user.value) {
      user.value.isVip = status
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('vip_status', status.toString())
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isVip,
    login,
    logout,
    loadState,
    updateVipStatus
  }
})