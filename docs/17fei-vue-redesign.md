# 17fei Vue 重构优化设计文档

> 版本：v1.1
> 日期：2024-05-16
> 状态：草稿

---

## 一、项目概述与目标

### 1.1 项目背景

17fei.fun 是一个情侣情趣飞行棋和姿势卡牌游戏网站，原有项目使用 **Fresh + Deno** 技术栈构建。本次重构旨在提升用户体验、代码可维护性和开发效率。

### 1.2 重构目标

| 目标 | 描述 |
|------|------|
| **技术栈升级** | 从 Fresh/Deno 迁移到 Vue.js 3 + Vite |
| **性能优化** | SSR → CSR，提升首屏加载速度 |
| **代码复用** | 组件化设计，提高复用性 |
| **主题系统** | 保留多主题切换，增强扩展性 |
| **移动优先** | 重新设计移动端交互体验 |

### 1.3 优化预期效果

- 首屏加载时间减少 50%
- 代码量减少 40%
- 组件复用率提升至 70%+
- 主题切换更流畅

---

## 二、技术架构设计

### 2.1 技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| **框架** | Vue.js 3.4+ | Composition API、TS 支持好、生态成熟 |
| **构建工具** | Vite 5 | 极速 HMR、轻量配置 |
| **路由** | Vue Router 4 | SPA 标准路由 |
| **状态管理** | Pinia | Vue 官方推荐、比 Vuex 更轻量 |
| **样式** | Tailwind CSS 3 | 原子化 CSS、开发效率高 |
| **HTTP** | Axios | 支持拦截器、取消请求 |

### 2.2 项目结构

```
17fei-vue/
├── public/
│   ├── fxq/              # 飞行棋游戏(保持原样)
│   ├── js/               # jQuery/Howler(第三方库)
│   └── themes/           # CSS主题文件
├── src/
│   ├── assets/           # 图片、字体等资源
│   ├── components/       # 通用组件
│   │   ├── AppNavbar.vue
│   │   ├── AppFooter.vue
│   │   ├── AppBottomNav.vue
│   │   ├── ThemeSwitcher.vue
│   │   ├── GameCard.vue
│   │   └── VipModal.vue
│   ├── composables/      # 可组合函数(逻辑复用)
│   │   ├── useTheme.ts
│   │   ├── useVip.ts
│   │   └── useTrial.ts
│   ├── layouts/          # 布局组件
│   │   ├── DefaultLayout.vue
│   │   └── GameLayout.vue
│   ├── pages/            # 页面
│   │   ├── HomePage.vue
│   │   ├── PositionsPage.vue
│   │   ├── CardPage.vue
│   │   ├── MemberPage.vue
│   │   └── AboutPage.vue
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── stores/           # Pinia stores
│   │   ├── theme.ts
│   │   ├── user.ts
│   │   └── card.ts
│   ├── styles/           # 全局样式
│   │   ├── variables.css
│   │   └── base.css
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2.3 组件架构

```
App.vue
├── DefaultLayout
│   ├── AppNavbar
│   │   └── ThemeSwitcher
│   │       └── VipModal
│   ├── <router-view>
│   │   ├── HomePage
│   │   │   └── GameCard[]
│   │   ├── PositionsPage
│   │   │   ├── FilterBar
│   │   │   └── PositionGrid → PositionCard
│   │   ├── CardPage
│   │   │   ├── FlipCard
│   │   │   ├── VersionSelector
│   │   │   └── RulesSection
│   │   └── AboutPage
│   ├── AppFooter
│   └── AppBottomNav (移动端)
```

---

## 三、界面设计

### 3.1 设计原则

1. **移动优先**: 优先设计移动端，再适配桌面
2. **卡片化布局**: 统一卡片风格，信息清晰
3. **渐变主色**: 保留粉色渐变主色调
4. **简洁留白**: 减少视觉噪音，突出内容

### 3.2 主题系统

#### CSS 变量主题

```css
/* 浪漫梦幻(默认) */
:root {
  --primary: #ff6b9d;
  --primary-dark: #c44569;
  --accent: #ff8fab;
  --bg: #fff0f5;
  --bg-secondary: #ffe4ec;
  --text: #4a4a4a;
  --text-light: #8a6c6c;
  --card: #ffffff;
  --border: rgba(255,107,157,0.2);
  --radius: 16px;
  --radius-sm: 8px;
  --shadow: 0 4px 20px rgba(255,107,157,0.3);
}

/* 简约现代 */
.theme-minimal {
  --primary: #5c7cfa;
  --primary-dark: #4c6ef5;
  --bg: #f8f9fa;
  --bg-secondary: #e9ecef;
  --text: #343a40;
  --border: rgba(0,0,0,0.08);
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

#### 主题切换实现

```ts
// composables/useTheme.ts
export function useTheme() {
  const currentTheme = ref('romantic');
  const themes = [
    { id: 'romantic', name: '浪漫梦幻' },
    { id: 'minimal', name: '简约现代' },
    { id: 'playful', name: '活泼可爱' },
    { id: 'premium', name: '高端私密' }
  ];

  const applyTheme = (themeId: string) => {
    document.body.className = `theme-${themeId}`;
    localStorage.setItem('current_theme', themeId);
  };

  return { currentTheme, themes, applyTheme };
}
```

### 3.3 页面设计

#### 首页 (HomePage)

```
┌─────────────────────────────────┐
│  Navbar: Logo + 导航 + 主题切换  │
├─────────────────────────────────┤
│                                 │
│         Hero Section            │
│    大标题 + 简介 + 徽章          │
│                                 │
├─────────────────────────────────┤
│                                 │
│        游戏卡片网格             │
│   ┌─────┐ ┌─────┐ ┌─────┐      │
│   │飞行棋│ │卡牌 │ │姿势 │      │
│   └─────┘ └─────┘ └─────┘      │
│                                 │
├─────────────────────────────────┤
│      功能特性 (4列图标)          │
├─────────────────────────────────┤
│           Footer                │
└─────────────────────────────────┘

移动端: 卡片单列，底部 TabBar
```

#### 姿势大全页 (PositionsPage)

```
┌─────────────────────────────────┐
│  Navbar: ← 返回  姿势大全       │
├─────────────────────────────────┤
│       Header: 标题 + 数量       │
├─────────────────────────────────┤
│  FilterBar: 全部|入门|进阶|挑战 │
├─────────────────────────────────┤
│                                 │
│    网格布局 (2-3列)              │
│   ┌────┐ ┌────┐ ┌────┐         │
│   │图片│ │图片│ │图片│         │
│   └────┘ └────┘ └────┘         │
│   locked 卡片显示模糊+锁图标     │
│                                 │
├─────────────────────────────────┤
│     解锁提示(非VIP显示)         │
├─────────────────────────────────┤
│        BottomNav                │
└─────────────────────────────────┘
```

#### 任务卡牌页 (CardPage)

```
┌─────────────────────────────────┐
│  Navbar: ← 版本名  选择版本     │
├─────────────────────────────────┤
│                                 │
│         翻转卡片                │
│      ┌─────────────┐           │
│      │             │           │
│      │   任务内容   │           │
│      │             │           │
│      └─────────────┘           │
│                                 │
│      [重置]    [翻转]          │
│                                 │
├─────────────────────────────────┤
│         玩法说明                │
├─────────────────────────────────┤
│   版本选择: 恋爱版 热恋版 ...   │
├─────────────────────────────────┤
│        BottomNav                │
└─────────────────────────────────┘
```

### 3.4 组件设计

#### GameCard 组件

```vue
<template>
  <router-link :to="to" class="game-card">
    <img :src="image" :alt="title" class="game-card-img">
    <div class="game-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <span class="game-card-tag">{{ tag }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string;
  image: string;
  title: string;
  description: string;
  tag?: string;
}>();
</script>
```

#### ThemeSwitcher 组件

- 状态: `isOpen`, `currentTheme`, `themes`, `trialCount`, `isVip`
- 方法: `toggle()`, `selectTheme()`, `openVipModal()`
- 交互: 点击切换按钮展开面板，选择主题

#### VipModal 组件

- 状态: `code`, `error`, `loading`
- 方法: `submit()`, `close()`
- 验证: 激活码格式、非空、API调用

---

## 四、功能模块设计

### 4.1 主题切换系统

| 功能 | 描述 |
|------|------|
| 主题存储 | localStorage: `current_theme` |
| VIP状态 | localStorage: `vip_status` |
| 试用限制 | 非VIP每天3次试用 |
| API | `/api/themes` 获取主题列表 |

**数据流:**
```
用户点击主题
  ↓
检查VIP状态 or 试用次数
  ↓
更新 currentTheme → localStorage
  ↓
document.body.className 切换
```

### 4.2 VIP激活系统

| 功能 | 描述 |
|------|------|
| 激活码验证 | POST `/api/activate` |
| 状态存储 | localStorage: `vip_status` |
| 解锁内容 | 全部姿势、所有主题、所有卡牌版本 |

**API 设计:**
```ts
// POST /api/activate
Request: { code: string }
Response: {
  success: boolean;
  message: string;
}
```

### 4.3 姿势卡牌

| 功能 | 描述 |
|------|------|
| 数据源 | Base64 编码图片路径数组 |
| 免费数量 | 前10张 |
| VIP解锁 | 全部100+张 |
| 筛选 | 全部/入门/进阶/挑战(预留) |

### 4.4 任务卡牌

| 版本 | 描述 | 访问控制 |
|------|------|----------|
| 恋爱版 | 甜蜜互动 | 免费 |
| 热恋版 | 热情亲密 | 免费 |
| 同居版 | 日常情趣 | VIP |
| 进阶版 | 深入探索 | VIP |
| 私密版 | 私人定制 | VIP |
| SM版 | 特殊玩法 | VIP |
| 户外版 | 户外场景 | VIP |
| 自定义 | 用户创建 | VIP |

---

## 五、数据流设计

### 5.1 状态管理 (Pinia)

```ts
// stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const current = ref('romantic');
  const isVip = ref(false);
  const trialCount = ref(3);

  const isThemeLocked = computed(() =>
    !isVip.value && trialCount.value <= 0
  );

  function switchTheme(id: string) {
    if (isThemeLocked.value) return false;
    current.value = id;
    if (!isVip.value) trialCount.value--;
    return true;
  }

  return { current, isVip, trialCount, isThemeLocked, switchTheme };
});
```

### 5.2 Composable 逻辑复用

```ts
// composables/useTrial.ts
export function useTrial(maxTrial: number = 3) {
  const count = ref(maxTrial);

  onMounted(() => {
    const today = new Date().toISOString().split('T')[0];
    const key = `theme_trial_${today}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) {
        count.value = Math.max(0, maxTrial - data.count);
      }
    }
  });

  const consume = () => {
    count.value = Math.max(0, count.value - 1);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`theme_trial_${today}`, JSON.stringify({
      date: today,
      count: maxTrial - count.value
    }));
  };

  return { count, consume };
}
```

---

## 六、API 设计(保留)

### 6.1 现有 API

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/activate` | POST | VIP激活码验证 |
| `/api/themes` | GET | 获取主题列表 |
| `/ai` | POST | AI伴侣订阅 |

### 6.2 前端代理

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
});
```

---

## 七、响应式设计

### 7.1 断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| sm | < 640px | 手机 |
| md | 640-768px | 大手机 |
| lg | 768-1024px | 平板 |
| xl | > 1024px | 桌面 |

### 7.2 布局适配

| 页面 | 手机 | 平板 | 桌面 |
|------|------|------|------|
| 首页 | 单列卡片 | 2列卡片 | 3-4列卡片 |
| 姿势 | 2列网格 | 3列网格 | 4列网格 |
| 卡牌 | 全屏卡片 | 全屏卡片 | 全屏卡片 |

### 7.3 移动端导航

- **桌面**: 顶部导航栏 + 页面链接
- **移动**: 底部 TabBar (首页/游戏/我的)

---

## 八、迁移计划

### 8.1 阶段划分

| 阶段 | 内容 | 工作量 |
|------|------|--------|
| **Phase 1** | 项目搭建、样式系统 | 1天 |
| **Phase 2** | 通用组件开发 | 1天 |
| **Phase 3** | 首页/姿势页重构 | 1天 |
| **Phase 4** | 卡牌页/会员页重构 | 1天 |
| **Phase 5** | 主题系统/VP系统 | 1天 |
| **Phase 6** | 测试/部署 | 1天 |

### 8.2 风险与对策

| 风险 | 对策 |
|------|------|
| 飞行棋游戏复用 | 保持 `/public/fxq/` 原样 |
| 第三方库依赖 | Howler/jQuery 保持使用 |
| API兼容 | 保留后端 API，或迁移至 Serverless |

---

## 九、原型预览

已在 `/web_test/` 目录创建静态 HTML 原型:

- `index.html` - 首页
- `positions.html` - 姿势大全页
- `card.html` - 任务卡牌页

---

## 十、附录

### 10.1 设计决策记录

| 决策 | 理由 |
|------|------|
| 使用 Tailwind CSS | 原子化、主题切换便捷、减少CSS代码 |
| 使用 Pinia | Vue官方推荐、比Vuex更现代轻量 |
| 保留 localStorage | 简单场景无需后端存储 |
| 移动优先 | 目标用户以手机访问为主 |

### 10.2 待确认事项

- [x] 飞行棋游戏是否需要完整保留? ✅ 保留
- [x] AI伴侣功能是否保留? ✅ 保留
- [x] 会员空间具体功能需求? 待补充
- [x] 是否需要登录系统? ✅ 需要登录系统

---

## 十一、登录系统设计

### 11.1 用户体系

| 角色 | 描述 | 权限 |
|------|------|------|
| **游客** | 未登录用户 | 浏览、基础功能、免费内容 |
| **普通用户** | 完成注册/登录 | 解锁基础内容、参与互动 |
| **VIP用户** | 付费会员 | 全部姿势、全部主题、高级卡牌版本 |

### 11.2 认证流程

```
┌─────────────────────────────────────────┐
│              用户操作                    │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────▼─────────┐
        │  检查登录状态      │
        │  (localStorage)    │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │ 已登录?            │
        └─────────┬─────────┘
                  │
         ┌───────┴───────┐
         │是             │否
         ▼               ▼
    正常访问         跳转登录页
```

### 11.3 登录方式

| 方式 | 描述 | 实现 |
|------|------|------|
| **微信扫码** | 快捷登录 | 接入微信开放平台 |
| **验证码登录** | 手机号+验证码 | 短信API |
| **账号密码** | 传统登录 | 密码加密存储 |

### 11.4 用户数据结构

```ts
interface User {
  id: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  isVip: boolean;
  vipExpireAt?: string;  // VIP到期时间
  createdAt: string;
  settings: {
    theme: string;
    lastGame?: string;
  };
}
```

### 11.5 登录状态管理

```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isLoggedIn = computed(() => !!user.value);
  const isVip = computed(() => user.value?.isVip ?? false);

  async function login(phone: string, code: string) {
    // 调用登录API
    const res = await api.post('/auth/login', { phone, code });
    user.value = res.data.user;
    token.value = res.data.token;
    localStorage.setItem('token', token.value);
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, isLoggedIn, isVip, login, logout };
});
```

---

## 十二、飞行棋游戏集成

### 12.1 概述

飞行棋游戏为独立小游戏，保持原有实现，通过 iframe 嵌入主应用。

### 12.2 集成方式

```vue
<!-- GameLayout.vue -->
<template>
  <div class="game-wrapper">
    <iframe
      :src="gameUrl"
      class="game-iframe"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  gameUrl: string;
}>();
</script>

<style scoped>
.game-wrapper {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
```

### 12.3 游戏数据传递

| 数据 | 方向 | 方式 |
|------|------|------|
| 游戏配置 | 主应用 → 游戏 | URL参数 |
| 游戏结果 | 游戏 → 主应用 | postMessage |
| 用户信息 | 主应用 → 游戏 | postMessage |

```ts
// 接收游戏结果
window.addEventListener('message', (event) => {
  if (event.data.type === 'GAME_COMPLETE') {
    const { score, duration } = event.data;
    // 处理游戏结果
  }
});
```

### 12.4 飞行棋文件保留

```
public/fxq/
├── index.html      # 游戏入口
├── game.js         # 游戏逻辑
├── game.css        # 游戏样式
└── assets/          # 游戏资源
```

---

## 十三、AI伴侣功能

### 13.1 功能概述

AI伴侣是一个智能对话助手，提供情感陪伴和互动服务。

### 13.2 功能设计

| 功能 | 描述 | 访问控制 |
|------|------|----------|
| **AI对话** | 与AI伴侣实时对话 | 普通用户 |
| **角色选择** | 选择男/女伴侣 | VIP |
| **记忆功能** | 记住对话历史 | VIP |
| **定制化** | 自定义AI性格 | VIP |

### 13.3 订阅流程

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ 填写邮箱 │ -> │ 选择性别 │ -> │ 提交成功 │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
              POST /ai 订阅接口
```

### 13.4 AI对话界面设计

```
┌─────────────────────────────────┐
│ Navbar: ← AI伴侣    角色选择 ▼   │
├─────────────────────────────────┤
│                                 │
│         对话区域                 │
│   ┌─────────────────────┐       │
│   │ 🤖 AI: 你好，我是... │       │
│   └─────────────────────┘       │
│   ┌─────────────────────┐       │
│   │ 👤 用户: 你叫什么    │       │
│   └─────────────────────┘       │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 输入消息...              发送 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 13.5 技术实现

```vue
<!-- AIPage.vue -->
<template>
  <div class="ai-chat">
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
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>
```

---

## 十四、会员系统完善

### 14.1 会员权益

| 权益 | 普通用户 | VIP用户 |
|------|----------|---------|
| 姿势卡牌 | 前10张 | 全部100+张 |
| 任务卡牌 | 2个版本 | 全部8个版本 |
| 主题切换 | 每天3次 | 无限 |
| AI伴侣 | 基础 | 高级功能 |
| 飞行棋 | ✅ | ✅ |

### 14.2 会员开通页面

```
┌─────────────────────────────────┐
│         成为VIP会员             │
├─────────────────────────────────┤
│                                 │
│    价格对比卡片                 │
│  ┌──────────┐ ┌──────────┐     │
│  │ 月卡     │ │ 终身卡    │     │
│  │ ¥10/月   │ │ ¥49      │     │
│  │          │ │ (推荐)    │     │
│  └──────────┘ └──────────┘     │
│                                 │
│    支付方式                     │
│    [微信支付] [支付宝]          │
│                                 │
│    客服联系                     │
│    微信号: wbot10               │
│                                 │
└─────────────────────────────────┘
```

### 14.3 用户中心

```
┌─────────────────────────────────┐
│        用户中心                 │
├─────────────────────────────────┤
│  头像 + 昵称                     │
│  VIP状态 / 普通用户              │
├─────────────────────────────────┤
│  [我的收藏]  [游戏记录]          │
│  [订阅管理]  [设置]             │
├─────────────────────────────────┤
│  [退出登录]                     │
└─────────────────────────────────┘
```

---

*文档版本: v1.1 | 最后更新: 2024-05-16*