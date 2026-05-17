<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <span class="logo-icon">💕</span>
        <h1>17fei</h1>
        <p>让爱更有趣</p>
      </div>

      <!-- 步骤1: 手机号登录 -->
      <div v-if="step === 'phone'" class="login-step">
        <h2>手机号登录</h2>
        <p class="step-hint">未注册的手机号将自动创建账号</p>

        <div class="form-group">
          <input
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            maxlength="11"
            class="input"
            :class="{ error: phoneError }"
            @input="phoneError = ''"
          />
        </div>

        <div class="form-group">
          <input
            v-model="code"
            type="text"
            placeholder="验证码"
            maxlength="6"
            class="input"
            :class="{ error: codeError }"
            @input="codeError = ''"
          />
          <button
            @click="handleSendCode"
            :disabled="countdown > 0 || loading"
            class="code-btn"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>

        <p v-if="globalError" class="error-msg">{{ globalError }}</p>

        <button @click="handleLogin" :disabled="loading" class="login-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <button @click="step = 'role'" class="text-btn">
          已有账号？选择角色 →
        </button>
      </div>

      <!-- 步骤2: 角色选择 -->
      <div v-else class="login-step">
        <h2>选择您的角色</h2>
        <p class="step-hint">选择一个最能代表您的身份</p>

        <div class="role-grid">
          <button
            v-for="role in roles"
            :key="role.id"
            @click="handleSelectRole(role.id)"
            class="role-card"
            :class="{ active: selectedRole === role.id }"
            :disabled="roleLoading"
          >
            <span class="role-icon">{{ role.icon }}</span>
            <span class="role-name">{{ role.name }}</span>
            <span class="role-desc">{{ role.desc }}</span>
          </button>
        </div>

        <button @click="step = 'phone'; selectedRole = ''" class="text-btn">
          ← 返回手机登录
        </button>

        <button v-if="selectedRole" @click="handleSkipRole" class="skip-btn">
          跳过 →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const {
  loading,
  error: globalError,
  countdown,
  sendCode,
  loginWithCode,
  updateRole,
  user,
  isLoggedIn
} = useAuth()

const step = ref<'phone' | 'role'>('phone')
const phone = ref('')
const code = ref('')
const phoneError = ref('')
const codeError = ref('')
const selectedRole = ref('')
const roleLoading = ref(false)

const roles = [
  { id: 'male', icon: '♂', name: '男性', desc: '我是男生' },
  { id: 'female', icon: '♀', name: '女性', desc: '我是女生' },
  { id: 'couple', icon: '💑', name: '情侣', desc: '我们是情侣' }
]

// 如果已登录，直接跳转
onMounted(() => {
  if (isLoggedIn.value) {
    router.push('/')
  }
})

async function handleSendCode() {
  phoneError.value = ''

  if (phone.value.length !== 11) {
    phoneError.value = '请输入11位手机号'
    return
  }

  const result = await sendCode(phone.value)
  if (!result.success && result.message.includes('手机号')) {
    phoneError.value = result.message
  } else if (!result.success) {
    globalError.value = result.message
  }
}

async function handleLogin() {
  phoneError.value = ''
  codeError.value = ''

  if (phone.value.length !== 11) {
    phoneError.value = '请输入11位手机号'
    return
  }

  if (code.value.length !== 6) {
    codeError.value = '请输入6位验证码'
    return
  }

  const result = await loginWithCode(phone.value, code.value)

  if (result.success) {
    // 登录成功，检查是否已有角色
    if (user.value?.role) {
      router.push('/')
    } else {
      step.value = 'role'
    }
  } else {
    if (result.message.includes('手机号')) {
      phoneError.value = result.message
    } else if (result.message.includes('验证码')) {
      codeError.value = result.message
    } else {
      globalError.value = result.message
    }
  }
}

async function handleSelectRole(roleId: string) {
  selectedRole.value = roleId
  roleLoading.value = true

  try {
    await updateRole(roleId as 'male' | 'female' | 'couple')
    router.push('/')
  } finally {
    roleLoading.value = false
  }
}

function handleSkipRole() {
  router.push('/')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  padding: 40px;
  box-shadow: var(--theme-shadow-hover);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 8px;
}

.login-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.login-header p {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-top: 4px;
}

.login-step h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text);
  text-align: center;
  margin-bottom: 8px;
}

.step-hint {
  text-align: center;
  color: var(--text-light);
  font-size: 0.85rem;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.input {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  font-size: 1rem;
  background: var(--background);
  color: var(--text);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.input.error {
  border-color: #e74c3c;
}

.code-btn {
  padding: 0 16px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  color: var(--text);
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #e74c3c;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.text-btn {
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.skip-btn {
  width: 100%;
  padding: 12px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  color: var(--text-light);
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 12px;
}

.role-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.role-card:hover {
  border-color: var(--primary);
}

.role-card.active {
  border-color: var(--primary);
  background: rgba(233, 84, 131, 0.05);
}

.role-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.role-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.role-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.role-desc {
  font-size: 0.85rem;
  color: var(--text-light);
}
</style>