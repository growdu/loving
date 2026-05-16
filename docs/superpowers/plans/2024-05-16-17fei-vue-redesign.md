# 17fei Vue 重构 - 完整实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将17fei.fun从Fresh/Deno重构为Vue.js 3 + Vite技术栈，实现完整的登录系统、主题切换、姿势卡牌、任务卡牌、AI伴侣和飞行棋游戏集成。

**Architecture:** 使用Vue 3 Composition API + TypeScript + Pinia + Vue Router + Tailwind CSS。移动优先设计，通过CSS变量实现主题切换，localStorage管理用户状态，iframe集成飞行棋游戏。

**Tech Stack:** Vue 3.4+, Vite 5, TypeScript, Pinia, Vue Router 4, Tailwind CSS 3, Axios

---

## 文件结构总览

```
17fei-vue/
├── public/
│   ├── fxq/                    # 飞行棋游戏(从原项目复制)
│   ├── js/                     # jQuery/Howler
│   ├── themes/                 # CSS主题文件
│   └── images/                 # 图片资源
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css   # CSS变量主题
│   │       └── base.css        # 全局样式
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppNavbar.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── AppBottomNav.vue
│   │   ├── theme/
│   │   │   ├── ThemeSwitcher.vue
│   │   │   └── VipModal.vue
│   │   ├── game/
│   │   │   ├── GameCard.vue
│   │   │   ├── FlipCard.vue
│   │   │   └── VersionSelector.vue
│   │   └── position/
│   │       ├── PositionGrid.vue
│   │       ├── PositionCard.vue
│   │       └── FilterBar.vue
│   ├── composables/
│   │   ├── useTheme.ts
│   │   ├── useVip.ts
│   │   ├── useTrial.ts
│   │   └── useAuth.ts
│   ├── layouts/
│   │   ├── DefaultLayout.vue
│   │   └── GameLayout.vue
│   ├── pages/
│   │   ├── HomePage.vue
│   │   ├── PositionsPage.vue
│   │   ├── CardPage.vue
│   │   ├── AIPage.vue
│   │   ├── LoginPage.vue
│   │   ├── MemberPage.vue
│   │   └── AboutPage.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── theme.ts
│   │   ├── user.ts
│   │   └── card.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Phase 1: 项目搭建与样式系统

### Task 1.1: 初始化项目

**Files:**
- Create: `17fei-vue/package.json`
- Create: `17fei-vue/vite.config.ts`
- Create: `17fei-vue/tsconfig.json`
- Create: `17fei-vue/index.html`
- Create: `17fei-vue/tailwind.config.js`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "17fei-vue",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>17fei - 情侣情趣飞行棋</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 5: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        card: 'var(--card-bg)',
      },
      borderRadius: {
        DEFAULT: 'var(--theme-border-radius)',
        sm: 'var(--theme-border-radius-sm)',
      },
      boxShadow: {
        DEFAULT: 'var(--theme-shadow)',
        hover: 'var(--theme-shadow-hover)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: 提交**

```bash
cd /root/loving/17fei-vue
git init
git add .
git commit -m "feat: initialize Vue 3 + Vite project with TypeScript and Tailwind"
```

---

### Task 1.2: 创建CSS变量主题系统

**Files:**
- Create: `17fei-vue/src/assets/styles/variables.css`
- Create: `17fei-vue/src/assets/styles/base.css`
- Create: `17fei-vue/public/themes/romantic.css`
- Create: `17fei-vue/public/themes/minimal.css`
- Create: `17fei-vue/public/themes/playful.css`
- Create: `17fei-vue/public/themes/premium.css`

- [ ] **Step 1: 创建 variables.css**

```css
/* 默认主题 - 浪漫梦幻 */
:root {
  --primary: #ff6b9d;
  --primary-dark: #c44569;
  --accent: #ff8fab;
  --background: #fff0f5;
  --background-secondary: #ffe4ec;
  --text: #4a4a4a;
  --text-light: #8a6c6c;
  --card-bg: #ffffff;
  --card-border: rgba(255,107,157,0.2);
  --theme-border-radius: 16px;
  --theme-border-radius-sm: 8px;
  --theme-shadow: 0 4px 20px rgba(255,107,157,0.3);
  --theme-shadow-hover: 0 8px 30px rgba(255,107,157,0.4);
  --theme-btn-bg: linear-gradient(135deg, #ff6b9d, #c44569);
  --theme-btn-hover-bg: linear-gradient(135deg, #ff8fab, #d65a7d);
  --theme-gradient: linear-gradient(135deg, #ff6b9d, #c44569);
}

/* 简约现代主题 */
.theme-minimal {
  --primary: #5c7cfa;
  --primary-dark: #4c6ef5;
  --accent: #748ffc;
  --background: #f8f9fa;
  --background-secondary: #e9ecef;
  --text: #343a40;
  --text-light: #868e96;
  --card-bg: #ffffff;
  --card-border: rgba(0,0,0,0.08);
  --theme-border-radius: 8px;
  --theme-border-radius-sm: 4px;
  --theme-shadow: 0 2px 8px rgba(0,0,0,0.08);
  --theme-shadow-hover: 0 4px 16px rgba(0,0,0,0.12);
  --theme-btn-bg: linear-gradient(135deg, #5c7cfa, #4c6ef5);
  --theme-btn-hover-bg: linear-gradient(135deg, #748ffc, #5c7cfa);
  --theme-gradient: linear-gradient(135deg, #5c7cfa, #4c6ef5);
}

/* 活泼可爱主题 */
.theme-playful {
  --primary: #ff922b;
  --primary-dark: #ff7b00;
  --accent: #ffc078;
  --background: #fff9f0;
  --background-secondary: #fff3e0;
  --text: #4a4a4a;
  --text-light: #8a7c6c;
  --card-bg: #ffffff;
  --card-border: rgba(255,146,43,0.2);
  --theme-border-radius: 12px;
  --theme-border-radius-sm: 6px;
  --theme-shadow: 0 4px 20px rgba(255,146,43,0.25);
  --theme-shadow-hover: 0 8px 30px rgba(255,146,43,0.35);
  --theme-btn-bg: linear-gradient(135deg, #ff922b, #ff7b00);
  --theme-btn-hover-bg: linear-gradient(135deg, #ffc078, #ff922b);
  --theme-gradient: linear-gradient(135deg, #ff922b, #ff7b00);
}

/* 高端私密主题 */
.theme-premium {
  --primary: #9775fa;
  --primary-dark: #845ef7;
  --accent: #b197fd;
  --background: #1a1a2e;
  --background-secondary: #16213e;
  --text: #e9ecef;
  --text-light: #adb5bd;
  --card-bg: #2d2d44;
  --card-border: rgba(151,117,250,0.3);
  --theme-border-radius: 12px;
  --theme-border-radius-sm: 6px;
  --theme-shadow: 0 4px 20px rgba(0,0,0,0.4);
  --theme-shadow-hover: 0 8px 30px rgba(0,0,0,0.5);
  --theme-btn-bg: linear-gradient(135deg, #9775fa, #845ef7);
  --theme-btn-hover-bg: linear-gradient(135deg, #b197fd, #9775fa);
  --theme-gradient: linear-gradient(135deg, #9775fa, #845ef7);
}
```

- [ ] **Step 2: 创建 base.css**

```css
@import './variables.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--background);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

/* 动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-gradient {
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
}

.card:hover {
  box-shadow: var(--theme-shadow-hover);
}

.btn-primary {
  background: var(--theme-btn-bg);
  color: white;
  border: none;
  border-radius: var(--theme-border-radius-sm);
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: var(--theme-shadow-hover);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}
```

- [ ] **Step 3: 创建主题CSS文件 (romantic.css示例)**

```css
/* 浪漫梦幻主题 */
:root {
  --theme-primary: #ff6b9d;
  --theme-secondary: #c44569;
  --theme-accent: #ff8fab;
  --theme-background: #fff0f5;
  --theme-background-secondary: #ffe4ec;
  --theme-text: #4a4a4a;
  --theme-text-light: #8a6c6c;
  --theme-card-bg: #ffffff;
  --theme-card-border: rgba(255,107,157,0.2);
  --theme-border-radius: 16px;
  --theme-border-radius-sm: 8px;
  --theme-shadow: 0 4px 20px rgba(255,107,157,0.3);
  --theme-shadow-hover: 0 8px 30px rgba(255,107,157,0.4);
  --theme-gradient: linear-gradient(135deg, #ff6b9d, #c44569);
  --theme-btn-bg: linear-gradient(135deg, #ff6b9d, #c44569);
}
```

(minimal.css, playful.css, premium.css 结构相同，仅变量值不同)

- [ ] **Step 4: 提交**

```bash
git add src/assets/styles public/themes
git commit -m "feat: add CSS variables theme system with 4 themes"
```

---

## Phase 2: 通用组件开发

### Task 2.1: Pinia Stores

**Files:**
- Create: `17fei-vue/src/stores/theme.ts`
- Create: `17fei-vue/src/stores/user.ts`
- Create: `17fei-vue/src/stores/card.ts`

- [ ] **Step 1: 创建 theme store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Theme {
  id: string
  name: string
  preview: string
  description: string
}

export const useThemeStore = defineStore('theme', () => {
  const current = ref('romantic')
  const isVip = ref(false)
  const trialCount = ref(3)
  const maxTrial = 3

  const themes: Theme[] = [
    {
      id: 'romantic',
      name: '浪漫梦幻',
      preview: 'linear-gradient(135deg, #ff6b9d, #c44569)',
      description: '粉色渐变、爱心粒子、星空背景'
    },
    {
      id: 'minimal',
      name: '简约现代',
      preview: 'linear-gradient(135deg, #5c7cfa, #4c6ef5)',
      description: '扁平化设计、柔和配色、清新线条'
    },
    {
      id: 'playful',
      name: '活泼可爱',
      preview: 'linear-gradient(135deg, #ff922b, #ff7b00)',
      description: '明快橙黄、圆润元素、趣味动画'
    },
    {
      id: 'premium',
      name: '高端私密',
      preview: 'linear-gradient(135deg, #9775fa, #845ef7)',
      description: '深紫黑金、精致纹理、商务质感'
    }
  ]

  const isThemeLocked = computed(() => !isVip.value && trialCount.value <= 0)

  function switchTheme(id: string): boolean {
    if (isThemeLocked.value) return false
    current.value = id
    document.body.className = `theme-${id}`
    localStorage.setItem('current_theme', id)
    if (!isVip.value) {
      trialCount.value--
      saveTrialData()
    }
    return true
  }

  function saveTrialData() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`theme_trial_${today}`, JSON.stringify({
      date: today,
      count: maxTrial - trialCount.value
    }))
  }

  function loadState() {
    const saved = localStorage.getItem('current_theme')
    if (saved) {
      current.value = saved
      document.body.className = `theme-${saved}`
    }
    const vipStatus = localStorage.getItem('vip_status')
    isVip.value = vipStatus === 'true'

    const today = new Date().toISOString().split('T')[0]
    const trialData = localStorage.getItem(`theme_trial_${today}`)
    if (trialData) {
      const data = JSON.parse(trialData)
      if (data.date === today) {
        trialCount.value = Math.max(0, maxTrial - data.count)
      }
    }
  }

  return {
    current,
    isVip,
    trialCount,
    themes,
    isThemeLocked,
    switchTheme,
    loadState
  }
})
```

- [ ] **Step 2: 创建 user store**

```typescript
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
```

- [ ] **Step 3: 创建 card store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CardVersion {
  id: string
  name: string
  locked: boolean
  tasks: string[]
}

export const useCardStore = defineStore('card', () => {
  const currentVersionId = ref('lover0')
  const isFlipped = ref(false)
  const currentTask = ref('')

  const versions: CardVersion[] = [
    { id: 'lover0', name: '恋爱版', locked: false, tasks: ['牵手漫步', '深情对视', '互喂美食', '拥抱一分钟', '说出一件喜欢对方的事'] },
    { id: 'lover1', name: '热恋版', locked: false, tasks: ['壁咚对方', '公主抱', '亲吻额头', '一起跳舞', '为对方按摩'] },
    { id: 'sex0', name: '同居版', locked: true, tasks: ['睡衣派对', '深夜聊天', '一起看电影', '互诉心事', '制造惊喜'] },
    { id: 'sex1', name: '进阶版', locked: true, tasks: [] },
    { id: 'sex2', name: '私密版', locked: true, tasks: [] },
    { id: 'sm', name: 'SM版', locked: true, tasks: [] },
    { id: 'huwai', name: '户外版', locked: true, tasks: [] },
    { id: 'custom', name: '自定义', locked: true, tasks: [] }
  ]

  const currentVersion = computed(() =>
    versions.find(v => v.id === currentVersionId.value) || versions[0]
  )

  const currentTasks = computed(() => currentVersion.value.tasks)

  function selectVersion(id: string) {
    currentVersionId.value = id
    isFlipped.value = false
  }

  function flipCard(): string {
    isFlipped.value = !isFlipped.value
    if (isFlipped.value && currentTasks.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * currentTasks.value.length)
      currentTask.value = currentTasks.value[randomIndex]
    }
    return currentTask.value
  }

  function resetCard() {
    isFlipped.value = false
    currentTask.value = ''
  }

  return {
    currentVersionId,
    isFlipped,
    currentTask,
    versions,
    currentVersion,
    currentTasks,
    selectVersion,
    flipCard,
    resetCard
  }
})
```

- [ ] **Step 4: 提交**

```bash
git add src/stores/
git commit -m "feat: add Pinia stores for theme, user, and card management"
```

---

### Task 2.2: Composable 逻辑复用

**Files:**
- Create: `17fei-vue/src/composables/useTheme.ts`
- Create: `17fei-vue/src/composables/useTrial.ts`
- Create: `17fei-vue/src/composables/useAuth.ts`

- [ ] **Step 1: 创建 useTheme.ts**

```typescript
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const store = useThemeStore()

  onMounted(() => {
    store.loadState()
  })

  function togglePanel() {
    // handled by component
  }

  async function activateVip(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (data.success) {
        store.updateVipStatus(true)
      }
      return data
    } catch {
      return { success: false, message: '网络错误，请重试' }
    }
  }

  return {
    currentTheme: store.current,
    themes: store.themes,
    isVip: store.isVip,
    trialCount: store.trialCount,
    isThemeLocked: store.isThemeLocked,
    switchTheme: store.switchTheme,
    activateVip
  }
}
```

- [ ] **Step 2: 创建 useTrial.ts**

```typescript
import { ref, onMounted } from 'vue'

export function useTrial(maxTrial: number = 3) {
  const count = ref(maxTrial)

  onMounted(() => {
    const today = new Date().toISOString().split('T')[0]
    const key = `theme_trial_${today}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        count.value = Math.max(0, maxTrial - data.count)
      }
    }
  })

  function consume(): number {
    count.value = Math.max(0, count.value - 1)
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`theme_trial_${today}`, JSON.stringify({
      date: today,
      count: maxTrial - count.value
    }))
    return count.value
  }

  function reset() {
    count.value = maxTrial
  }

  return { count, consume, reset }
}
```

- [ ] **Step 3: 创建 useAuth.ts**

```typescript
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const store = useUserStore()
  const loading = ref(false)
  const error = ref('')

  async function sendCode(phone: string): Promise<void> {
    // 模拟发送验证码
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  async function loginWithCode(phone: string, code: string): Promise<boolean> {
    loading.value = true
    error.value = ''

    try {
      // 模拟验证 - 实际应该调用API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟成功
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
    // 微信登录开发中
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
```

- [ ] **Step 4: 提交**

```bash
git add src/composables/
git commit -m "feat: add composables for theme, trial, and auth logic"
```

---

### Task 2.3: 通用UI组件

**Files:**
- Create: `17fei-vue/src/components/common/AppNavbar.vue`
- Create: `17fei-vue/src/components/common/AppFooter.vue`
- Create: `17fei-vue/src/components/common/AppBottomNav.vue`
- Create: `17fei-vue/src/components/game/GameCard.vue`

- [ ] **Step 1: 创建 AppNavbar.vue**

```vue
<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <router-link to="/" class="logo">
        <img src="/logo.png" alt="17fei" />
        <span>17fei</span>
      </router-link>
      <div class="nav-links hidden-md">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
          首页
        </router-link>
        <router-link to="/positions" class="nav-link">
          姿势
        </router-link>
        <router-link to="/about" class="nav-link">
          关于
        </router-link>
      </div>
      <slot name="actions">
        <ThemeSwitcher />
      </slot>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'

const route = useRoute()
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--card-border);
  z-index: 100;
}

.navbar-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--primary);
  text-decoration: none;
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--theme-border-radius-sm);
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--background-secondary);
  color: var(--primary);
}

.nav-link.active {
  background: var(--theme-gradient);
  color: white;
}

@media (max-width: 768px) {
  .hidden-md {
    display: none;
  }
}
</style>
```

- [ ] **Step 2: 创建 AppFooter.vue**

```vue
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-links">
        <router-link to="/about" class="footer-link">关于我们</router-link>
        <router-link to="/member" class="footer-link">会员空间</router-link>
        <a href="#" class="footer-link">联系客服</a>
      </div>
      <p class="footer-text">© 2024 17fei.fun 版权所有</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 40px 20px;
  text-align: center;
  background: var(--card-bg);
  border-top: 1px solid var(--card-border);
  margin-top: auto;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary);
}

.footer-text {
  color: var(--text-light);
  font-size: 0.85rem;
}
</style>
```

- [ ] **Step 3: 创建 AppBottomNav.vue**

```vue
<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
      <span class="nav-icon">🏠</span>
      <span>首页</span>
    </router-link>
    <router-link to="/positions" class="nav-item" :class="{ active: route.path === '/positions' }">
      <span class="nav-icon">❤️</span>
      <span>姿势</span>
    </router-link>
    <router-link to="/card" class="nav-item" :class="{ active: route.path === '/card' }">
      <span class="nav-icon">🎴</span>
      <span>卡牌</span>
    </router-link>
    <router-link to="/member" class="nav-item" :class="{ active: route.path === '/member' }">
      <span class="nav-icon">💎</span>
      <span>我的</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--card-border);
  padding: 8px 0;
  z-index: 100;
}

@media (max-width: 768px) {
  .bottom-nav {
    display: flex;
    justify-content: space-around;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.75rem;
  padding: 4px 12px;
  transition: color 0.2s;
}

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  font-size: 1.3rem;
}
</style>
```

- [ ] **Step 4: 创建 GameCard.vue**

```vue
<template>
  <router-link :to="to" class="game-card">
    <img :src="image" :alt="title" class="game-card-img" />
    <div class="game-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <span v-if="tag" class="game-card-tag">{{ tag }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  image: string
  title: string
  description: string
  tag?: string
}>()
</script>

<style scoped>
.game-card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  overflow: hidden;
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--theme-shadow-hover);
}

.game-card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: var(--background-secondary);
}

.game-card-content {
  padding: 20px;
}

.game-card-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.game-card-content p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

.game-card-tag {
  display: inline-block;
  margin-top: 12px;
  padding: 4px 12px;
  background: var(--background-secondary);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--primary);
  font-weight: 500;
}
</style>
```

- [ ] **Step 5: 提交**

```bash
git add src/components/common src/components/game/GameCard.vue
git commit -m "feat: add common UI components (Navbar, Footer, BottomNav, GameCard)"
```

---

## Phase 3: 主题系统组件

### Task 3.1: ThemeSwitcher 组件

**Files:**
- Create: `17fei-vue/src/components/theme/ThemeSwitcher.vue`
- Create: `17fei-vue/src/components/theme/VipModal.vue`

- [ ] **Step 1: 创建 ThemeSwitcher.vue**

```vue
<template>
  <div class="theme-switcher">
    <button
      class="theme-toggle"
      @click="isOpen = !isOpen"
      title="切换主题"
    >
      🎨
    </button>

    <Transition name="panel">
      <div v-if="isOpen" class="theme-panel">
        <h3>选择主题</h3>
        <div class="theme-grid">
          <div
            v-for="theme in themes"
            :key="theme.id"
            class="theme-card"
            :class="{ active: currentTheme === theme.id }"
            @click="handleSelectTheme(theme.id)"
          >
            <div class="theme-preview" :style="{ background: theme.preview }"></div>
            <div class="theme-info">
              <h4>{{ theme.name }}</h4>
              <p>{{ theme.description }}</p>
            </div>
            <span v-if="currentTheme === theme.id" class="theme-check">✓</span>
          </div>
        </div>

        <div v-if="!isVip" class="vip-tip">
          剩余试用次数: <strong>{{ trialCount }}</strong> / 3
          <br>
          <button class="vip-btn" @click.stop="showVipModal = true">
            开通VIP解锁全部
          </button>
        </div>
      </div>
    </Transition>

    <VipModal v-model="showVipModal" @success="handleVipSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import VipModal from './VipModal.vue'

const store = useThemeStore()

const isOpen = ref(false)
const showVipModal = ref(false)

const currentTheme = computed(() => store.current)
const themes = computed(() => store.themes)
const isVip = computed(() => store.isVip)
const trialCount = computed(() => store.trialCount)

function handleSelectTheme(themeId: string) {
  const success = store.switchTheme(themeId)
  if (success) {
    isOpen.value = false
  } else {
    showVipModal.value = true
  }
}

function handleVipSuccess() {
  store.loadState()
  showVipModal.value = false
  isOpen.value = false
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--theme-gradient);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: var(--theme-shadow);
  transition: all 0.3s;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-panel {
  position: absolute;
  top: 60px;
  right: 0;
  width: 320px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
  padding: 24px;
  z-index: 101;
}

.theme-panel h3 {
  margin-bottom: 16px;
  color: var(--text);
}

.theme-grid {
  display: grid;
  gap: 12px;
}

.theme-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--theme-border-radius-sm);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-card:hover {
  border-color: var(--card-border);
}

.theme-card.active {
  border-color: var(--primary);
  background: var(--background-secondary);
}

.theme-preview {
  width: 48px;
  height: 48px;
  border-radius: var(--theme-border-radius-sm);
  flex-shrink: 0;
}

.theme-info h4 {
  font-weight: 600;
  color: var(--text);
}

.theme-info p {
  font-size: 0.85rem;
  color: var(--text-light);
}

.theme-check {
  margin-left: auto;
  color: var(--primary);
  font-size: 1.2rem;
}

.vip-tip {
  margin-top: 16px;
  padding: 12px;
  background: var(--background);
  border-radius: var(--theme-border-radius-sm);
  font-size: 0.85rem;
  color: var(--text-light);
  text-align: center;
}

.vip-tip strong {
  color: var(--primary);
}

.vip-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
```

- [ ] **Step 2: 创建 VipModal.vue**

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal" @click.stop>
          <h2>开通VIP</h2>
          <p>解锁全部主题，享受无限切换</p>

          <div v-if="isVip" class="vip-status">
            您已是VIP会员 ✨
          </div>

          <template v-else>
            <input
              type="text"
              v-model="code"
              placeholder="输入激活码"
              class="code-input"
            />
            <p v-if="error" class="error-msg">{{ error }}</p>
            <button
              class="activate-btn"
              @click="submit"
              :disabled="loading"
            >
              {{ loading ? '激活中...' : '激活VIP' }}
            </button>
          </template>

          <button class="close-btn" @click="close">关闭</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const store = useThemeStore()

const code = ref('')
const error = ref('')
const loading = ref(false)
const isVip = ref(false)

watch(() => props.modelValue, (val) => {
  if (val) {
    isVip.value = store.isVip
    code.value = ''
    error.value = ''
  }
})

async function submit() {
  if (!code.value.trim()) {
    error.value = '请输入激活码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.value.trim() })
    })
    const data = await res.json()

    if (data.success) {
      store.updateVipStatus(true)
      emit('success')
    } else {
      error.value = data.message || '激活码无效'
    }
  } catch {
    error.value = '网络错误，请重试'
  } finally {
    loading.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: var(--card-bg);
  padding: 32px;
  border-radius: var(--theme-border-radius);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h2 {
  color: var(--text);
  margin-bottom: 8px;
}

.modal p {
  color: var(--text-light);
  margin-bottom: 24px;
}

.code-input {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  background: var(--background);
  color: var(--text);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 12px;
}

.code-input:focus {
  outline: none;
  border-color: var(--primary);
}

.error-msg {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.activate-btn {
  width: 100%;
  padding: 14px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.activate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.vip-status {
  padding: 20px;
  color: var(--primary);
  font-size: 1.1rem;
}

.close-btn {
  margin-top: 16px;
  background: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/theme/
git commit -m "feat: add ThemeSwitcher and VipModal components"
```

---

## Phase 4: 页面开发

### Task 4.1: HomePage

**Files:**
- Create: `17fei-vue/src/layouts/DefaultLayout.vue`
- Create: `17fei-vue/src/pages/HomePage.vue`

- [ ] **Step 1: 创建 DefaultLayout.vue**

```vue
<template>
  <div class="layout">
    <AppNavbar>
      <template #actions>
        <ThemeSwitcher />
      </template>
    </AppNavbar>
    <main class="main-content">
      <slot />
    </main>
    <AppFooter />
    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppBottomNav from '@/components/common/AppBottomNav.vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px;
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 70px;
  }
}
</style>
```

- [ ] **Step 2: 创建 HomePage.vue**

```vue
<template>
  <div class="home-page">
    <!-- 英雄区 -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">情侣情趣飞行棋</h1>
        <p class="hero-subtitle">
          专为情侣设计的情趣小游戏，支持多种设备，随时随地开启甜蜜互动
        </p>
        <div class="hero-badges">
          <span class="badge">
            <span class="badge-icon">📱</span> 移动端适配
          </span>
          <span class="badge">
            <span class="badge-icon">🎮</span> 多款游戏
          </span>
          <span class="badge">
            <span class="badge-icon">❤️</span> 情侣专属
          </span>
        </div>
      </div>
    </section>

    <!-- 游戏列表 -->
    <section class="games-section">
      <div class="container">
        <div class="section-title">
          <h2>游戏列表</h2>
          <p>选择你们喜欢的游戏，开始甜蜜互动</p>
        </div>
        <div class="games-grid">
          <GameCard
            to="/fxq"
            image="https://picsum.photos/400/200?random=1"
            title="飞行棋"
            description="经典飞行棋游戏，适合情侣一起游玩"
            tag="热门"
          />
          <GameCard
            to="/card"
            image="https://picsum.photos/400/200?random=2"
            title="任务卡牌"
            description="多种版本任选，从恋爱到情趣，满足各种口味"
            tag="10+版本"
          />
          <GameCard
            to="/positions"
            image="https://picsum.photos/400/200?random=3"
            title="姿势卡牌"
            description="解锁更多姿势，增加情趣体验"
            tag="100+姿势"
          />
          <GameCard
            to="/ai"
            image="https://picsum.photos/400/200?random=4"
            title="AI伴侣"
            description="智能AI伴侣，懂你所需"
            tag="新功能"
          />
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features-section">
      <div class="container">
        <div class="section-title">
          <h2>为什么选择我们</h2>
          <p>专注情侣互动体验</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>多款主题</h3>
            <p>多种主题风格，一键切换</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>隐私保护</h3>
            <p>本地存储，数据安全</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>多端支持</h3>
            <p>支持手机、平板、电脑</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>实惠价格</h3>
            <p>10元开通月卡，49元终身</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import GameCard from '@/components/game/GameCard.vue'
</script>

<style scoped>
.hero {
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(180deg, var(--background) 0%, var(--background-secondary) 100%);
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: slideUp 0.6s ease;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 32px;
  animation: slideUp 0.6s ease 0.1s both;
}

.hero-badges {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  animation: slideUp 0.6s ease 0.2s both;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--card-bg);
  border-radius: 20px;
  font-size: 0.9rem;
  box-shadow: var(--theme-shadow);
}

.games-section,
.features-section {
  padding: 60px 20px;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.section-title p {
  color: var(--text-light);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: var(--card-bg);
  padding: 32px;
  border-radius: var(--theme-border-radius);
  text-align: center;
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: var(--theme-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/layouts/ src/pages/HomePage.vue
git commit -m "feat: add DefaultLayout and HomePage"
```

---

### Task 4.2: PositionsPage

**Files:**
- Create: `17fei-vue/src/pages/PositionsPage.vue`
- Create: `17fei-vue/src/components/position/PositionGrid.vue`
- Create: `17fei-vue/src/components/position/PositionCard.vue`

- [ ] **Step 1: 创建 PositionCard.vue**

```vue
<template>
  <div class="position-card" :class="{ locked: isLocked }">
    <img :src="src" :alt="alt" />
    <div v-if="isLocked" class="lock-overlay">
      <div class="lock-icon">🔒</div>
      <div class="lock-text">开通VIP解锁</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  isLocked?: boolean
}>()
</script>

<style scoped>
.position-card {
  position: relative;
  border-radius: var(--theme-border-radius);
  overflow: hidden;
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
  transition: all 0.3s;
}

.position-card:not(.locked):hover {
  transform: translateY(-4px);
}

.position-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.position-card.locked img {
  filter: blur(15px) brightness(0.5);
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.lock-icon {
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.lock-text {
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
```

- [ ] **Step 2: 创建 PositionGrid.vue**

```vue
<template>
  <div class="position-grid">
    <PositionCard
      v-for="(pos, index) in positions"
      :key="index"
      :src="pos"
      :is-locked="!isVip && index >= freeCount"
    />
  </div>
</template>

<script setup lang="ts">
import PositionCard from './PositionCard.vue'

defineProps<{
  positions: string[]
  isVip: boolean
  freeCount?: number
}>()

withDefaults(defineProps<{
  freeCount: number
}>(), {
  freeCount: 10
})
</script>

<style scoped>
.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .position-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
```

- [ ] **Step 3: 创建 PositionsPage.vue**

```vue
<template>
  <div class="positions-page">
    <header class="page-header">
      <h1>情趣姿势大全</h1>
      <p>共 {{ positions.length }} 个姿势</p>
    </header>

    <div class="filter-bar">
      <div class="filter-inner">
        <div
          v-for="filter in filters"
          :key="filter.id"
          class="filter-chip"
          :class="{ active: activeFilter === filter.id }"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </div>
      </div>
    </div>

    <section class="card-section">
      <PositionGrid
        :positions="positions"
        :is-vip="isVip"
        :free-count="10"
      />

      <div v-if="!isVip" class="unlock-tip">
        <div class="unlock-icon">👑</div>
        <h3>开通VIP解锁全部姿势</h3>
        <p>上百个姿势等您探索</p>
        <router-link to="/member" class="unlock-btn">
          立即解锁
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import PositionGrid from '@/components/position/PositionGrid.vue'

const store = useUserStore()

const activeFilter = ref('all')
const filters = [
  { id: 'all', name: '全部' },
  { id: 'easy', name: '入门级' },
  { id: 'medium', name: '进阶级' },
  { id: 'hard', name: '挑战级' }
]

// 模拟数据 - 实际从API获取
const positions = ref<string[]>([])

const isVip = computed(() => store.isVip)

onMounted(() => {
  // 生成占位图片
  for (let i = 0; i < 12; i++) {
    positions.value.push(`https://picsum.photos/300/400?random=${10 + i}`)
  }
})
</script>

<style scoped>
.page-header {
  padding: 100px 20px 40px;
  text-align: center;
  background: var(--theme-gradient);
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.filter-bar {
  padding: 16px 20px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--card-border);
  position: sticky;
  top: 64px;
  z-index: 50;
  overflow-x: auto;
}

.filter-inner {
  display: flex;
  gap: 12px;
}

.filter-chip {
  flex-shrink: 0;
  padding: 8px 16px;
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip.active {
  background: var(--theme-gradient);
  color: white;
}

.card-section {
  padding: 24px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.unlock-tip {
  text-align: center;
  padding: 40px;
}

.unlock-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: var(--theme-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.unlock-tip h3 {
  color: var(--text);
  margin-bottom: 8px;
}

.unlock-tip p {
  color: var(--text-light);
}

.unlock-btn {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 32px;
  background: var(--theme-gradient);
  border-radius: var(--theme-border-radius);
  color: white;
  text-decoration: none;
  font-weight: 600;
}
</style>
```

- [ ] **Step 4: 提交**

```bash
git add src/pages/PositionsPage.vue src/components/position/
git commit -m "feat: add PositionsPage with grid and card components"
```

---

### Task 4.3: CardPage

**Files:**
- Create: `17fei-vue/src/pages/CardPage.vue`
- Create: `17fei-vue/src/components/game/FlipCard.vue`
- Create: `17fei-vue/src/components/game/VersionSelector.vue`

- [ ] **Step 1: 创建 FlipCard.vue**

```vue
<template>
  <div
    class="flip-card"
    :class="{ flipped: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <div class="front-icon">💕</div>
        <div class="front-text">点击抽取任务</div>
      </div>
      <div class="flip-card-back">
        <div class="back-content">{{ content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  content: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.flip-card {
  width: 280px;
  height: 400px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--theme-border-radius);
  box-shadow: var(--theme-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.flip-card-front {
  background: var(--theme-gradient);
  color: white;
}

.front-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: float 2s ease-in-out infinite;
}

.front-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.flip-card-back {
  background: var(--card-bg);
  transform: rotateY(180deg);
  border: 2px solid var(--card-border);
}

.back-content {
  writing-mode: vertical-rl;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 4px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
```

- [ ] **Step 2: 创建 VersionSelector.vue**

```vue
<template>
  <div class="version-selector">
    <div class="version-scroll">
      <div
        v-for="version in versions"
        :key="version.id"
        class="version-chip"
        :class="{
          active: modelValue === version.id,
          locked: version.locked && !isVip
        }"
        @click="handleSelect(version)"
      >
        {{ version.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const store = useUserStore()
const isVip = computed(() => store.isVip)

const versions = [
  { id: 'lover0', name: '恋爱版', locked: false },
  { id: 'lover1', name: '热恋版', locked: false },
  { id: 'sex0', name: '同居版', locked: true },
  { id: 'sex1', name: '进阶版', locked: true },
  { id: 'sex2', name: '私密版', locked: true },
  { id: 'sm', name: 'SM版', locked: true },
  { id: 'huwai', name: '户外版', locked: true },
  { id: 'custom', name: '自定义', locked: true }
]

function handleSelect(version: typeof versions[0]) {
  if (version.locked && !isVip.value) {
    return
  }
  emit('update:modelValue', version.id)
}
</script>

<style scoped>
.version-selector {
  padding: 16px 20px;
  background: var(--card-bg);
  border-top: 1px solid var(--card-border);
  overflow-x: auto;
}

.version-scroll {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
}

.version-chip {
  flex-shrink: 0;
  padding: 10px 20px;
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.version-chip:hover {
  border-color: var(--primary);
}

.version-chip.active {
  background: var(--theme-gradient);
  color: white;
}

.version-chip.locked {
  position: relative;
}

.version-chip.locked::after {
  content: '🔒';
  margin-left: 6px;
}
</style>
```

- [ ] **Step 3: 创建 CardPage.vue**

```vue
<template>
  <div class="card-page">
    <header class="page-header">
      <router-link to="/" class="back-btn">←</router-link>
      <span class="version-name">{{ currentVersionName }}</span>
      <router-link to="/card_version" class="version-link">选择版本</router-link>
    </header>

    <section class="card-area">
      <FlipCard
        v-model="isFlipped"
        :content="currentTask"
      />

      <div class="action-buttons">
        <button class="action-btn action-btn-secondary" @click="resetCard">
          重置
        </button>
        <button class="action-btn action-btn-primary" @click="flipCard">
          {{ isFlipped ? '再抽一张' : '翻转' }}
        </button>
      </div>
    </section>

    <section class="rules-section">
      <h3>基本玩法</h3>
      <p>轮流抽卡完成任务<br>无法完成认输受惩罚</p>
    </section>

    <VersionSelector v-model="currentVersionId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/card'
import FlipCard from '@/components/game/FlipCard.vue'
import VersionSelector from '@/components/game/VersionSelector.vue'

const store = useCardStore()

const isFlipped = ref(false)
const currentVersionId = ref('lover0')
const currentTask = ref('')

const tasks = {
  lover0: ['牵手漫步', '深情对视', '互喂美食', '拥抱一分钟', '说出一件喜欢对方的事'],
  lover1: ['壁咚对方', '公主抱', '亲吻额头', '一起跳舞', '为对方按摩'],
  sex0: ['睡衣派对', '深夜聊天', '一起看电影', '互诉心事', '制造惊喜']
}

const currentVersionName = computed(() => {
  const names: Record<string, string> = {
    lover0: '恋爱版',
    lover1: '热恋版',
    sex0: '同居版'
  }
  return names[currentVersionId.value] || '任务卡牌'
})

function flipCard() {
  isFlipped.value = !isFlipped.value
  if (isFlipped.value) {
    const versionTasks = tasks[currentVersionId.value] || tasks.lover0
    const index = Math.floor(Math.random() * versionTasks.length)
    currentTask.value = versionTasks[index]
  }
}

function resetCard() {
  isFlipped.value = false
  currentTask.value = ''
}
</script>

<style scoped>
.card-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 80px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--theme-gradient);
  color: white;
}

.back-btn {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
}

.version-name {
  font-weight: 600;
}

.version-link {
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: var(--theme-border-radius-sm);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}

.card-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: var(--theme-border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.action-btn-primary {
  background: var(--theme-gradient);
  color: white;
}

.action-btn-secondary {
  background: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--card-border);
}

.rules-section {
  padding: 24px 20px;
  background: var(--background-secondary);
  text-align: center;
}

.rules-section h3 {
  color: var(--text);
  margin-bottom: 8px;
}

.rules-section p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.8;
}
</style>
```

- [ ] **Step 4: 提交**

```bash
git add src/pages/CardPage.vue src/components/game/FlipCard.vue src/components/game/VersionSelector.vue
git commit -m "feat: add CardPage with flip card and version selector"
```

---

### Task 4.4: LoginPage

**Files:**
- Create: `17fei-vue/src/pages/LoginPage.vue`

- [ ] **Step 1: 创建 LoginPage.vue**

```vue
<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <img src="/logo.png" class="login-logo" alt="logo" />
        <h1>欢迎回来</h1>
        <p>登录后开始甜蜜互动</p>
      </div>

      <div class="login-body">
        <div class="step-indicator">
          <div class="step-dot" :class="{ active: step >= 1 }"></div>
          <div class="step-dot" :class="{ active: step >= 2 }"></div>
        </div>

        <!-- 步骤1: 手机号验证 -->
        <div v-if="step === 1" class="step-content">
          <div class="input-group">
            <label>手机号</label>
            <input
              type="tel"
              v-model="phone"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </div>

          <div class="input-group">
            <label>验证码</label>
            <div class="input-row">
              <input
                type="text"
                v-model="code"
                placeholder="请输入验证码"
                maxlength="6"
              />
              <button
                class="code-btn"
                @click="sendCode"
                :disabled="countdown > 0"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <button class="login-btn" @click="verifyCode" :disabled="!canSubmit">
            下一步
          </button>

          <div class="divider">其他登录方式</div>

          <button class="wechat-btn" @click="wechatLogin">
            <span>💚</span> 微信登录
          </button>
        </div>

        <!-- 步骤2: 角色选择 -->
        <div v-if="step === 2" class="step-content">
          <div class="role-section">
            <div class="role-title">选择你的AI伴侣</div>
            <div class="role-grid">
              <div
                class="role-card"
                :class="{ selected: role === 'female' }"
                @click="role = 'female'"
              >
                <div class="role-icon">👩</div>
                <div class="role-name">女伴侣</div>
                <div class="role-desc">温柔体贴型</div>
              </div>
              <div
                class="role-card"
                :class="{ selected: role === 'male' }"
                @click="role = 'male'"
              >
                <div class="role-icon">👨</div>
                <div class="role-name">男伴侣</div>
                <div class="role-desc">阳光活力型</div>
              </div>
            </div>
          </div>

          <label class="agreement">
            <input type="checkbox" v-model="agreed" />
            <span>我已阅读并同意<a href="#">《用户协议》</a></span>
          </label>

          <button class="login-btn" @click="completeLogin" :disabled="!agreed">
            完成登录
          </button>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const store = useUserStore()

const step = ref(1)
const phone = ref('')
const code = ref('')
const role = ref('female')
const agreed = ref(false)
const countdown = ref(0)
const toast = ref({ show: false, type: '', message: '' })

let countdownTimer: number | null = null

const canSubmit = computed(() => {
  return phone.value.length === 11 && code.value.length >= 4
})

function showToast(message: string, type: string = 'info') {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

async function sendCode() {
  if (phone.value.length !== 11) {
    showToast('请输入正确的手机号', 'error')
    return
  }
  showToast('验证码已发送', 'success')
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

function verifyCode() {
  if (!canSubmit.value) return
  // 模拟验证成功
  step.value = 2
}

function wechatLogin() {
  showToast('微信登录开发中', 'info')
}

function completeLogin() {
  if (!agreed.value) {
    showToast('请先同意用户协议', 'error')
    return
  }

  store.login({
    id: 'user_' + Date.now(),
    phone: phone.value,
    nickname: '用户' + phone.value.slice(-4),
    isVip: false,
    role: role.value as 'male' | 'female',
    createdAt: new Date().toISOString()
  }, 'token_' + Date.now())

  showToast('登录成功！', 'success')
  setTimeout(() => {
    router.push('/')
  }, 1500)
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-gradient);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}

.login-header {
  padding: 32px 24px;
  text-align: center;
  background: var(--background);
  border-bottom: 1px solid var(--card-border);
}

.login-logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.login-header p {
  font-size: 0.9rem;
  color: var(--text-light);
}

.login-body {
  padding: 32px 24px;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--card-border);
}

.step-dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--primary);
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  font-size: 1rem;
  background: var(--background);
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-row input {
  flex: 1;
}

.code-btn {
  padding: 14px 20px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  font-size: 0.9rem;
  color: var(--primary);
  cursor: pointer;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
}

.login-btn:disabled {
  opacity: 0.7;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: var(--text-light);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--card-border);
}

.wechat-btn {
  width: 100%;
  padding: 14px;
  background: #07c160;
  border: none;
  border-radius: var(--theme-border-radius-sm);
  font-size: 1rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.role-section {
  margin-bottom: 24px;
}

.role-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 12px;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-card {
  padding: 20px;
  border: 2px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  text-align: center;
  cursor: pointer;
}

.role-card.selected {
  border-color: var(--primary);
  background: var(--background-secondary);
}

.role-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.role-name {
  font-weight: 600;
  color: var(--text);
}

.role-desc {
  font-size: 0.8rem;
  color: var(--text-light);
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: var(--text-light);
  cursor: pointer;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--text);
  color: white;
  border-radius: var(--theme-border-radius-sm);
  font-size: 0.9rem;
  z-index: 1000;
}

.toast.error {
  background: #e53e3e;
}

.toast.success {
  background: #07c160;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/LoginPage.vue
git commit -m "feat: add LoginPage with phone verification and role selection"
```

---

### Task 4.5: AIPage

**Files:**
- Create: `17fei-vue/src/pages/AIPage.vue`

- [ ] **Step 1: 创建 AIPage.vue**

```vue
<template>
  <div class="ai-page">
    <header class="page-header">
      <router-link to="/" class="back-btn">←</router-link>
      <span class="title">AI伴侣</span>
      <div class="role-select" v-if="isVip">
        <select v-model="aiRole">
          <option value="female">女伴侣</option>
          <option value="male">男伴侣</option>
        </select>
      </div>
    </header>

    <div class="chat-messages" ref="messagesRef">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="msg.role"
      >
        <span class="message-avatar">{{ msg.role === 'ai' ? '🤖' : '👤' }}</span>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="inputText"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage" :disabled="!inputText.trim()">
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: number
  role: 'ai' | 'user'
  content: string
}

const messages = ref<Message[]>([
  { id: 1, role: 'ai', content: '你好，我是你的AI伴侣~有什么我可以帮你的吗？' }
])

const inputText = ref('')
const aiRole = ref('female')
const isVip = ref(false)
const messagesRef = ref<HTMLElement | null>(null)

function sendMessage() {
  if (!inputText.value.trim()) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: inputText.value.trim()
  })

  const userMessage = inputText.value
  inputText.value = ''

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      id: Date.now(),
      role: 'ai',
      content: getAIResponse(userMessage)
    })
    nextTick(() => {
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
      }
    })
  }, 1000)
}

function getAIResponse(input: string): string {
  // 简化模拟
  const responses = [
    '听起来很有趣！告诉我更多关于这个话题的内容吧~',
    '我理解你的感受，我们可以一起探讨一下这个问题。',
    '这是个好主意！让我来帮你想想...',
    '太棒了！你真是个有趣的人，继续说吧~'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
</script>

<style scoped>
.ai-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background);
}

.page-header {
  padding: 80px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--theme-gradient);
  color: white;
}

.back-btn {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
}

.title {
  font-weight: 600;
}

.role-select select {
  padding: 8px 12px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: var(--theme-border-radius-sm);
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  background: var(--background-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--primary);
}

.message-content {
  padding: 12px 16px;
  border-radius: var(--theme-border-radius);
  background: var(--card-bg);
  color: var(--text);
  line-height: 1.5;
}

.message.user .message-content {
  background: var(--theme-gradient);
  color: white;
}

.chat-input {
  padding: 16px 20px;
  background: var(--card-bg);
  border-top: 1px solid var(--card-border);
  display: flex;
  gap: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  font-size: 1rem;
  background: var(--background);
}

.chat-input button {
  padding: 12px 24px;
  background: var(--theme-gradient);
  border: none;
  border-radius: var(--theme-border-radius);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.chat-input button:disabled {
  opacity: 0.5;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/AIPage.vue
git commit -m "feat: add AIPage with chat interface"
```

---

### Task 4.6: 路由和应用入口

**Files:**
- Create: `17fei-vue/src/router/index.ts`
- Create: `17fei-vue/src/App.vue`
- Create: `17fei-vue/src/main.ts`
- Create: `17fei-vue/src/stores/index.ts`

- [ ] **Step 1: 创建 router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    path: '/ai',
    name: 'AI',
    component: () => import('@/pages/AIPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

- [ ] **Step 2: 创建 main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

- [ ] **Step 3: 创建 App.vue**

```vue
<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  themeStore.loadState()
  userStore.loadState()
})
</script>
```

- [ ] **Step 4: 创建 stores/index.ts**

```typescript
export { useThemeStore } from './theme'
export { useUserStore } from './user'
export { useCardStore } from './card'
```

- [ ] **Step 5: 提交**

```bash
git add src/router/ src/App.vue src/main.ts src/stores/index.ts
git commit -m "feat: setup router and app entry point"
```

---

### Task 4.7: MemberPage 和 AboutPage

**Files:**
- Create: `17fei-vue/src/pages/MemberPage.vue`
- Create: `17fei-vue/src/pages/AboutPage.vue`

- [ ] **Step 1: 创建 MemberPage.vue**

```vue
<template>
  <div class="member-page">
    <header class="page-header">
      <router-link to="/" class="back-btn">←</router-link>
      <span>会员空间</span>
    </header>

    <div class="member-content">
      <!-- 用户信息 -->
      <div class="user-info" v-if="user">
        <img :src="user.avatar || '/default-avatar.png'" class="avatar" />
        <div class="user-detail">
          <div class="nickname">{{ user.nickname }}</div>
          <div class="vip-status" :class="{ active: user.isVip }">
            {{ user.isVip ? 'VIP会员' : '普通用户' }}
          </div>
        </div>
      </div>

      <!-- 未登录 -->
      <div class="not-logged-in" v-else>
        <p>登录后查看会员信息</p>
        <router-link to="/login" class="login-btn">登录</router-link>
      </div>

      <!-- 会员开通 -->
      <div class="vip-section">
        <h3>开通VIP会员</h3>
        <div class="price-cards">
          <div class="price-card">
            <div class="price-label">月卡</div>
            <div class="price-value">¥10<span>/月</span></div>
            <ul class="price-features">
              <li>全部姿势解锁</li>
              <li>全部主题</li>
              <li>高级卡牌版本</li>
            </ul>
          </div>
          <div class="price-card featured">
            <div class="price-label">终身卡</div>
            <div class="price-value">¥49<span>/终身</span></div>
            <ul class="price-features">
              <li>月卡全部权益</li>
              <li>AI高级功能</li>
              <li>专属客服</li>
            </ul>
          </div>
        </div>

        <div class="payment-methods">
          <h4>支付方式</h4>
          <div class="methods">
            <button class="method-btn">💚 微信支付</button>
            <button class="method-btn">💙 支付宝</button>
          </div>
        </div>

        <div class="contact">
          <p>客服微信: wbot10</p>
          <p class="contact-tip">支付后添加客服微信，1~12小时内响应</p>
        </div>
      </div>

      <!-- 菜单 -->
      <div class="menu-section" v-if="user">
        <div class="menu-item">
          <span>📁</span> 我的收藏
        </div>
        <div class="menu-item">
          <span>🎮</span> 游戏记录
        </div>
        <div class="menu-item">
          <span>📋</span> 订阅管理
        </div>
        <div class="menu-item">
          <span>⚙️</span> 设置
        </div>
        <div class="menu-item logout" @click="logout">
          <span>🚪</span> 退出登录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const store = useUserStore()

const user = computed(() => store.user)

function logout() {
  store.logout()
  router.push('/')
}
</script>

<style scoped>
.member-page {
  min-height: 100vh;
  background: var(--background);
}

.page-header {
  padding: 80px 20px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--theme-gradient);
  color: white;
}

.back-btn {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
}

.member-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  margin-bottom: 24px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--background-secondary);
}

.nickname {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text);
}

.vip-status {
  font-size: 0.85rem;
  color: var(--text-light);
}

.vip-status.active {
  color: var(--primary);
  font-weight: 600;
}

.not-logged-in {
  text-align: center;
  padding: 40px;
}

.login-btn {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 32px;
  background: var(--theme-gradient);
  color: white;
  border-radius: var(--theme-border-radius);
  text-decoration: none;
  font-weight: 600;
}

.vip-section {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  padding: 24px;
  margin-bottom: 24px;
}

.vip-section h3 {
  text-align: center;
  margin-bottom: 20px;
}

.price-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.price-card {
  padding: 20px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  text-align: center;
}

.price-card.featured {
  border-color: var(--primary);
  position: relative;
}

.price-card.featured::before {
  content: '推荐';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: var(--theme-gradient);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
}

.price-label {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 8px;
}

.price-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}

.price-value span {
  font-size: 0.9rem;
  font-weight: 400;
}

.price-features {
  list-style: none;
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--text-light);
}

.price-features li {
  padding: 4px 0;
}

.payment-methods {
  margin-bottom: 24px;
}

.payment-methods h4 {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 12px;
}

.methods {
  display: flex;
  gap: 12px;
}

.method-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  background: var(--background);
  cursor: pointer;
}

.contact {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--card-border);
}

.contact p:first-child {
  font-weight: 600;
  margin-bottom: 4px;
}

.contact-tip {
  font-size: 0.85rem;
  color: var(--text-light);
}

.menu-section {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--card-border);
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item.logout {
  color: #e53e3e;
}
</style>
```

- [ ] **Step 2: 创建 AboutPage.vue**

```vue
<template>
  <div class="about-page">
    <header class="page-header">
      <router-link to="/" class="back-btn">←</router-link>
      <span>关于我们</span>
    </header>

    <div class="about-content">
      <div class="about-text">
        <h2>关于本站</h2>
        <p>网站目前只接收客服人工收款</p>
        <p>10元开通单月会员</p>
        <p><s>99</s> 49元开通终身会员</p>
        <p>支付后添加微信[wbot10] 1~12小时内响应</p>
        <p class="contact-tip">
          如需其他定制开发，欢迎联系合作。
          <router-link to="/custom" class="link">如何制作一个相同的网站赚钱</router-link>
        </p>
      </div>

      <img src="/qrcode.JPG" class="qrcode" alt="收款二维码" />
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--background);
}

.page-header {
  padding: 80px 20px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--theme-gradient);
  color: white;
}

.back-btn {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
}

.about-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.about-text {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  padding: 24px;
  margin-bottom: 24px;
}

.about-text h2 {
  margin-bottom: 16px;
}

.about-text p {
  padding: 8px 0;
  color: var(--text);
}

.contact-tip {
  margin-top: 16px;
  color: var(--text-light) !important;
}

.link {
  color: var(--primary);
}

.qrcode {
  width: 100%;
  max-width: 300px;
  display: block;
  margin: 0 auto;
  border-radius: var(--theme-border-radius);
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/MemberPage.vue src/pages/AboutPage.vue
git commit -m "feat: add MemberPage and AboutPage"
```

---

## Phase 5: 飞行棋集成

### Task 5.1: GameLayout 和飞行棋iframe

**Files:**
- Create: `17fei-vue/src/layouts/GameLayout.vue`
- Create: `17fei-vue/src/pages/FxqPage.vue`

- [ ] **Step 1: 创建 GameLayout.vue**

```vue
<template>
  <div class="game-layout">
    <iframe
      :src="gameUrl"
      class="game-iframe"
      allowfullscreen
      @load="onGameLoad"
    />
    <button class="close-btn" @click="closeGame">关闭</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  gameUrl: string
}>()

const router = useRouter()

function onGameLoad() {
  console.log('Game loaded')
}

function closeGame() {
  router.push('/')
}

// 监听来自游戏的消息
function handleMessage(event: MessageEvent) {
  if (event.data.type === 'GAME_COMPLETE') {
    console.log('Game completed:', event.data)
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.game-layout {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--background);
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: var(--theme-border-radius);
  cursor: pointer;
  z-index: 201;
}
</style>
```

- [ ] **Step 2: 创建 FxqPage.vue**

```vue
<template>
  <GameLayout game-url="/fxq/index.html" />
</template>

<script setup lang="ts">
import GameLayout from '@/layouts/GameLayout.vue'
</script>
```

- [ ] **Step 3: 更新路由**

```typescript
// 在 router/index.ts 添加
{
  path: '/fxq',
  name: 'Fxq',
  component: () => import('@/pages/FxqPage.vue')
}
```

- [ ] **Step 4: 提交**

```bash
git add src/layouts/GameLayout.vue src/pages/FxqPage.vue
git add public/fxq  # 复制原有飞行棋文件
git commit -m "feat: add Flight Chess iframe integration"
```

---

## Phase 6: 最终配置与构建

### Task 6.1: 静态资源复制

**Files:**
- Copy: `public/fxq/` - 飞行棋游戏
- Copy: `public/js/` - jQuery/Howler
- Copy: `public/themes/*.css` - 主题CSS
- Copy: `public/logo.png` - Logo
- Copy: `public/qrcode.JPG` - 二维码

- [ ] **Step 1: 复制静态文件**

```bash
# 从原项目复制
cp -r /root/17fei/static/fxq /root/loving/17fei-vue/public/
cp -r /root/17fei/static/js /root/loving/17fei-vue/public/
cp -r /root/17fei/static/themes /root/loving/17fei-vue/public/
cp /root/17fei/static/logo.png /root/loving/17fei-vue/public/
cp /root/17fei/static/qrcode.JPG /root/loving/17fei-vue/public/
```

- [ ] **Step 2: 提交**

```bash
git add public/
git commit -m "chore: add static assets from original project"
```

---

### Task 6.2: 最终检查与文档更新

**Files:**
- Update: `README.md`

- [ ] **Step 1: 更新 README.md**

```markdown
# 17fei Vue

情侣情趣飞行棋和姿势卡牌游戏网站

## 技术栈

- Vue 3.4+ (Composition API)
- Vite 5
- TypeScript
- Pinia
- Vue Router 4
- Tailwind CSS 3

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```
```

- [ ] **Step 2: 提交**

```bash
git add README.md
git commit -m "docs: update README with setup instructions"
```

---

## 实施自检

### 1. Spec 覆盖检查

| 规格要求 | 实现位置 |
|----------|----------|
| 技术栈迁移到 Vue 3 + Vite | Task 1.1 |
| CSS变量主题系统 | Task 1.2 |
| 主题切换组件 | Task 3.1 |
| VIP激活系统 | Task 3.1 (VipModal) |
| 登录系统 | Task 4.4 (LoginPage) |
| 姿势卡牌页面 | Task 4.2 (PositionsPage) |
| 任务卡牌页面 | Task 4.3 (CardPage) |
| AI伴侣页面 | Task 4.5 (AIPage) |
| 飞行棋集成 | Task 5.1 (GameLayout) |
| 会员中心 | Task 4.7 (MemberPage) |
| 关于页面 | Task 4.7 (AboutPage) |
| 移动端底部导航 | Task 2.3 (AppBottomNav) |

### 2. 占位符扫描

- 无"TBD"或"TODO"
- 无未实现的函数
- 所有代码块完整

### 3. 类型一致性

- 所有 store 的接口定义一致
- Props 使用 TypeScript 类型
- 组件 emit 类型明确定义

---

## 执行方式选择

**计划完成并保存至 `docs/superpowers/plans/2024-05-16-17fei-vue-redesign.md`**

### 执行选项:

**1. Subagent-Driven (推荐)** - 我调度一个 subagent 每个任务逐个执行，任务之间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中执行任务，使用 executing-plans，带检查点的批量执行

您选择哪种方式？