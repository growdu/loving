import { ref, computed } from 'vue'
import { useUserStore, type User } from '@/stores/user'
import { useRouter } from 'vue-router'

// Mock验证码存储（生产环境应为后端）
let mockCode = ''
let mockCodeExpire = 0

export function useAuth() {
  const store = useUserStore()
  const router = useRouter()

  const loading = ref(false)
  const error = ref('')
  const countdown = ref(0)
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  const isLoggedIn = computed(() => store.isLoggedIn)
  const isVip = computed(() => store.isVip)
  const user = computed(() => store.user)

  // 发送验证码
  async function sendCode(phone: string): Promise<{ success: boolean; message: string }> {
    error.value = ''

    // 手机号格式验证
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { success: false, message: '手机号格式错误' }
    }

    loading.value = true

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 生成6位随机验证码
    mockCode = Math.floor(100000 + Math.random() * 900000).toString()
    mockCodeExpire = Date.now() + 5 * 60 * 1000 // 5分钟有效期

    loading.value = false

    // 测试用：打印验证码到控制台
    console.log(`[Mock] 验证码: ${mockCode}`)

    // 启动倒计时
    startCountdown()

    return { success: true, message: '验证码已发送' }
  }

  // 验证码登录
  async function loginWithCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    error.value = ''
    loading.value = true

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      loading.value = false
      return { success: false, message: '手机号格式错误' }
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(code)) {
      loading.value = false
      return { success: false, message: '验证码为6位数字' }
    }

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证码验证（支持固定验证码123456测试）
    const validCodes = [mockCode, '123456']
    const isExpired = Date.now() > mockCodeExpire

    if (isExpired) {
      loading.value = false
      return { success: false, message: '验证码已过期，请重新获取' }
    }

    if (!validCodes.includes(code)) {
      loading.value = false
      return { success: false, message: '验证码错误' }
    }

    // 登录成功，创建用户
    const userData: User = {
      id: `user_${Date.now()}`,
      phone,
      nickname: `用户${phone.slice(-4)}`,
      avatar: undefined,
      isVip: false,
      role: undefined,
      createdAt: new Date().toISOString()
    }

    // 生成mock token
    const token = `mock_token_${Date.now()}`

    store.login(userData, token)

    // 清除验证码
    mockCode = ''
    mockCodeExpire = 0

    loading.value = false
    return { success: true, message: '登录成功' }
  }

  // 更新用户角色
  async function updateRole(role: 'male' | 'female' | 'couple'): Promise<void> {
    if (store.user) {
      store.updateUser({ ...store.user, role })
    }
  }

  // 登出
  function logout() {
    store.logout()
    mockCode = ''
    mockCodeExpire = 0
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
    router.push('/login')
  }

  // 启动倒计时
  function startCountdown() {
    countdown.value = 60
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
  }

  // 微信登录（预留）
  async function wechatLogin(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: '微信登录开发中' }
  }

  return {
    loading,
    error,
    countdown,
    isLoggedIn,
    isVip,
    user,
    sendCode,
    loginWithCode,
    updateRole,
    logout,
    wechatLogin
  }
}