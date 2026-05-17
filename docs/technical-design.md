# Loving 技术设计文档

> 版本：v1.0
> 日期：2026-05-17
> 状态：已完成

---

## 一、项目概述

### 1.1 项目背景

Loving 是一个情侣情趣互动平台，提供飞行棋、亲密卡牌、姿势大全等多种情侣互动游戏。项目采用 Vue 3 + Vite 技术栈构建，支持多主题切换和移动端适配。

### 1.2 技术目标

| 目标 | 描述 |
|------|------|
| 性能优化 | 首屏加载快，HMR 热更新 |
| 代码可维护 | 组件化设计，TypeScript 类型安全 |
| 用户体验 | 移动端优先，流畅动画 |
| 扩展性 | 多主题支持，易于添加新功能 |

---

## 二、技术架构

### 2.1 技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| **框架** | Vue 3.4+ | Composition API、TypeScript 支持好 |
| **构建工具** | Vite 5 | 极速 HMR、轻量配置 |
| **路由** | Vue Router 4 | SPA 标准路由 |
| **状态管理** | Pinia 2 | Vue 官方推荐、轻量级 |
| **样式** | Tailwind CSS 3 + CSS Variables | 原子化 CSS + 主题切换 |
| **HTTP** | Axios 1.6 | 支持拦截器、取消请求 |

### 2.2 项目结构

```
17fei-vue/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── variables.css    # 主题 CSS 变量
│   ├── components/
│   │   ├── common/            # 通用组件
│   │   ├── game/              # 游戏组件
│   │   ├── layout/            # 布局组件
│   │   └── theme/              # 主题组件
│   ├── composables/            # 组合式函数
│   ├── pages/                  # 页面组件
│   ├── stores/                 # Pinia 状态库
│   ├── router/                 # 路由配置
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── public/                     # 静态资源
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 三、核心模块设计

### 3.1 主题系统

主题系统基于 CSS Variables 实现，通过 `theme.ts` store 管理。

**CSS 变量结构：**
```css
:root {
  --primary: #ff6b9d;
  --primary-light: #ff8fab;
  --primary-dark: #c44569;
  --background: #fff0f5;
  --card-bg: #ffffff;
  /* ... */
}

.theme-minimal { /* 简约主题变量 */ }
.theme-playful { /* 活泼主题变量 */ }
.theme-premium { /* 高端主题变量 */ }
```

**主题切换流程：**
1. 用户点击主题切换器
2. 调用 `themeStore.switchTheme(themeId)`
3. 更新 `document.body.className`
4. 保存到 localStorage 持久化

### 3.2 认证系统

认证系统使用 `useAuth` composable 和 `user.ts` store。

**登录流程：**
1. 用户输入手机号
2. 发送验证码（模拟）
3. 输入验证码登录
4. 用户信息持久化到 localStorage

**内置账户：**
- 手机号：`13800138000`
- 权限：VIP 用户，可访问所有页面

### 3.3 路由守卫

使用 Vue Router 的 `beforeEach` 守卫：

```typescript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth === true
  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

### 3.4 游戏组件

#### FlightChessGame 飞行棋组件

**状态管理：**
```typescript
const pos1 = ref(0)           // 玩家1位置
const pos2 = ref(0)           // 玩家2位置
const currentPlayer = ref(1)   // 当前出手玩家
const waitingTask = ref(false) // 等待完成任务
```

**版本系统：**
- `normal`: 普通版
- `couple`: 情侣版
- `hot`: 热恋版
- `married`: 夫妻版

**游戏流程：**
1. 投掷骰子 → 动画效果
2. 移动棋子 → 落在格子
3. 显示任务 → 等待完成
4. 完成点击 → 切换玩家

#### CardPage 卡牌页面

**翻转动画：**
```css
.flip-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
```

---

## 四、状态管理

### 4.1 Pinia Store 列表

| Store | 用途 |
|-------|------|
| `user.ts` | 用户登录状态、VIP状态 |
| `theme.ts` | 主题切换、试用次数 |
| `card.ts` | 卡牌版本、翻转状态 |

### 4.2 状态持久化

使用 localStorage 进行状态持久化：

```typescript
// user.ts
function login(userData, authToken) {
  localStorage.setItem('token', authToken)
  localStorage.setItem('user', JSON.stringify(userData))
}

// theme.ts
function loadState() {
  const saved = localStorage.getItem('current_theme')
  if (saved) current.value = saved
}
```

---

## 五、组件设计

### 5.1 布局组件

**DefaultLayout**
- 包含 AppNavbar、main-content、AppFooter、AppBottomNav
- 内部使用 Vue Router 的 `<slot />` 渲染子页面

### 5.2 游戏组件

**GameCard**
- Props: `to`, `emoji`, `image`, `title`, `description`, `tag`, `tagType`
- 特性：悬停播放按钮、标签样式分类

**FlightChessGame**
- 4种版本切换
- SVG 渐变图标
- 真实骰子点数显示
- 玩家头像标识

### 5.3 主题组件

**ThemeSwitcher**
- 主题预览下拉选择
- 当前主题高亮

**VipModal**
- VIP 开通弹窗
- 激活码输入

---

## 六、样式系统

### 6.1 Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
      }
    }
  },
  plugins: []
}
```

### 6.2 CSS 变量主题

```css
/* variables.css */
:root {
  --primary: #ff6b9d;
  --card-bg: #ffffff;
  --theme-border-radius: 16px;
}

.theme-minimal {
  --primary: #5c7cfa;
  --card-bg: #ffffff;
}
```

---

## 七、路由配置

```typescript
// router/index.ts
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresAuth: false } },
  { path: '/card', name: 'Card', component: CardPage, meta: { requiresAuth: true } },
  { path: '/game/fxq', name: 'Fxq', component: FxqPage },
  // ...
]
```

---

## 八、VIP 系统

### 8.1 VIP 权限

| 功能 | 普通用户 | VIP 用户 |
|------|----------|----------|
| 基础主题 | ✓ | ✓ |
| 全部主题 | 试用3次 | ✓ |
| 热恋版卡牌 | - | ✓ |
| 进阶姿势 | - | ✓ |
| 私密姿势 | - | ✓ |

### 8.2 VIP 判定

```typescript
const isVip = computed(() => userStore.isVip)

// 页面中使用
<div v-if="isVip">VIP内容</div>
<div v-else class="locked">🔒</div>
```

---

## 九、动画设计

### 9.1 飞行棋骰子

```css
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

### 9.2 卡牌翻转

```css
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
```

### 9.3 任务卡片

```css
@keyframes glow {
  0%, 100% { box-shadow: 0 12px 45px rgba(233, 84, 131, 0.35); }
  50% { box-shadow: 0 12px 60px rgba(233, 84, 131, 0.6); }
}
.task-card.highlight {
  animation: glow 1.5s infinite;
}
```

---

## 十、待优化项

- [ ] AI伴侣页面功能实现
- [ ] 后端 API 对接
- [ ] 真实用户系统
- [ ] 支付功能集成
- [ ] 动画性能优化
- [ ] PWA 支持

---

*文档最后更新：2026-05-17*