import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const store = useUserStore()
  const loading = ref(false)
  const error = ref('')

  async function sendCode(phone: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  async function loginWithCode(phone: string, code: string): Promise<boolean> {
    loading.value = true
    error.value = ''

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      store.login({
        id: 'user_' + Date.now(),
        phone,
        nickname: '用户' + phone.slice(-4),
        isVip: false,
        role: 'female',
        createdAt: new Date().toISOString()
      }, 'mock_token_' + Date.now())

      return true
    } catch (e) {
      error.value = '验证码错误'
      return false
    } finally {
      loading.value = false
    }
  }

  async function wechatLogin(): Promise<void> {
    error.value = '微信登录开发中'
  }

  function logout() {
    store.logout()
  }

  return {
    loading,
    error,
    sendCode,
    loginWithCode,
    wechatLogin,
    logout,
    isLoggedIn: store.isLoggedIn,
    isVip: store.isVip,
    user: store.user
  }
}