# Loving - 情侣情趣互动平台

<div align="center">

![版本](https://img.shields.io/badge/version-1.0.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.4-green)
![Vite](https://img.shields.io/badge/Vite-5.0-yellow)
![许可证](https://img.shields.io/badge/license-MIT-orange)

**让爱更有趣 - 专为情侣设计的亲密互动游戏平台**

</div>

---

## 📖 项目简介

Loving 是一个情侣情趣互动平台，提供飞行棋、亲密卡牌、姿势大全等多种互动游戏。平台支持多主题切换，为情侣提供私密、有趣的互动体验。

### 🎮 功能特色

| 功能 | 描述 |
|------|------|
| **飞行棋** | 支持普通版、情侣版、热恋版、夫妻版四种模式，投掷骰子完成任务 |
| **亲密卡牌** | 多种版本任选，从入门到进阶，翻转卡片抽取任务 |
| **姿势大全** | 探索各种姿势，分为入门、进阶、高级难度 |
| **AI伴侣** | 智能互动助手，随时陪伴（开发中） |
| **多主题** | 浪漫梦幻、简约现代、活泼可爱、高端私密 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装运行

```bash
# 进入项目目录
cd 17fei-vue

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview
```

访问 http://localhost:5173 查看应用。

---

## 📁 项目结构

```
17fei-vue/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── variables.css    # 主题变量
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppBottomNav.vue # 底部导航
│   │   │   ├── AppFooter.vue    # 页脚
│   │   │   └── AppNavbar.vue    # 导航栏
│   │   ├── game/
│   │   │   ├── FlightChessGame.vue  # 飞行棋游戏组件
│   │   │   └── GameCard.vue     # 游戏卡片
│   │   ├── layout/
│   │   │   └── DefaultLayout.vue   # 默认布局
│   │   └── theme/
│   │       ├── ThemeSwitcher.vue   # 主题切换器
│   │       └── VipModal.vue     # VIP弹窗
│   ├── composables/
│   │   ├── useAuth.ts          # 认证逻辑
│   │   ├── useTheme.ts         # 主题逻辑
│   │   └── useTrial.ts         # 试用逻辑
│   ├── pages/
│   │   ├── HomePage.vue        # 首页
│   │   ├── LoginPage.vue       # 登录页
│   │   ├── CardPage.vue       # 卡牌页
│   │   ├── FxqPage.vue        # 飞行棋页
│   │   ├── PositionsPage.vue   # 姿势页
│   │   ├── AIPage.vue          # AI页
│   │   ├── MemberPage.vue      # 会员页
│   │   └── AboutPage.vue       # 关于页
│   ├── stores/
│   │   ├── user.ts             # 用户状态
│   │   ├── card.ts             # 卡牌状态
│   │   ├── theme.ts            # 主题状态
│   │   └── index.ts            # store导出
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 主题系统

项目支持四种主题，通过 `ThemeSwitcher` 组件切换：

| 主题 | 描述 | 预览色 |
|------|------|--------|
| 🌹 浪漫梦幻 | 粉色渐变、爱心粒子 | `#ff6b9d` → `#c44569` |
| 🌿 简约现代 | 扁平化设计、柔和配色 | `#5c7cfa` → `#4c6ef5` |
| 🌈 活泼可爱 | 明快橙黄、圆润元素 | `#ff922b` → `#ff7b00` |
| 💎 高端私密 | 深紫黑金、精致纹理 | `#9775fa` → `#845ef7` |

### 切换主题

主题切换会自动保存到 localStorage，下次访问时恢复上次选择。

---

## 🔐 内置账户

项目提供内置管理员账户用于测试：

| 账户类型 | 手机号 | 权限 |
|----------|--------|------|
| 管理员 | `13800138000` | VIP用户，可访问所有功能 |

登录页面点击"内置账户登录"即可快速登录。

---

## 🎮 游戏说明

### 飞行棋

1. 选择版本（普通版/情侣版/热恋版/夫妻版）
2. 轮流投掷骰子，移动棋子
3. 落在格子上需完成对应的亲密任务
4. 完成任务后点击"完成任务"继续
5. 最先到达终点者获胜

### 亲密卡牌

1. 选择版本（恋爱版/热恋版/同居版等）
2. 点击卡片翻转抽取任务
3. 双方轮流完成任务
4. 无法完成可认输受惩罚

### 姿势大全

1. 浏览不同版本的姿势
2. 入门姿势免费解锁
3. 进阶/高级姿势需要VIP

---

## 📱 页面路由

| 路径 | 页面 | 需登录 |
|------|------|--------|
| `/` | 首页 | 否 |
| `/login` | 登录页 | 否 |
| `/card` | 亲密卡牌 | 是 |
| `/game/fxq` | 飞行棋 | 否 |
| `/positions` | 姿势大全 | 否 |
| `/ai` | AI伴侣 | 是 |
| `/member` | 会员中心 | 是 |
| `/about` | 关于我们 | 否 |

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 渐进式前端框架 |
| TypeScript | 5.3+ | 类型安全 |
| Vite | 5.0+ | 快速构建工具 |
| Vue Router | 4.2+ | SPA路由 |
| Pinia | 2.1+ | 状态管理 |
| Axios | 1.6+ | HTTP请求 |
| Tailwind CSS | 3.4+ | 原子化CSS |

---

## 📝 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建新组件
2. 在 `src/router/index.ts` 中添加路由配置

```typescript
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/pages/NewPage.vue')
}
```

### 添加新主题

在 `src/assets/styles/variables.css` 中添加新主题变量：

```css
.theme-newtheme {
  --primary: #your-color;
  /* ... 其他变量 */
}
```

---

## 📄 许可证

本项目仅供学习交流使用，不可用于商业用途。

---

## 📧 联系

- 网站：https://loving.fun
- 邮箱：contact@loving.fun

---

<div align="center">

**Made with ❤️ for couples everywhere**

</div>