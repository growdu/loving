<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>会员中心</h1>
        <p>管理您的会员状态</p>
      </div>
    </section>

    <section class="member-section">
      <div class="container">
        <div class="member-card" :class="{ vip: isVip }">
          <div class="member-info">
            <span class="member-avatar">{{ user?.nickname?.[0] || '用' }}</span>
            <div class="member-details">
              <h2>{{ user?.nickname || '游客' }}</h2>
              <p>{{ isVip ? 'VIP会员' : '普通用户' }}</p>
            </div>
          </div>

          <div v-if="!isVip" class="vip-badge">
            <span>💎</span>
            <span>开通VIP解锁全部功能</span>
          </div>

          <div v-else class="vip-status">
            <span>✨</span>
            <span>VIP有效期至永久</span>
          </div>
        </div>

        <div class="member-menu">
          <router-link to="/positions" class="menu-item">
            <span class="menu-icon">📚</span>
            <span class="menu-text">我的姿势</span>
            <span class="menu-arrow">→</span>
          </router-link>
          <router-link to="/card" class="menu-item">
            <span class="menu-icon">🎴</span>
            <span class="menu-text">我的卡牌</span>
            <span class="menu-arrow">→</span>
          </router-link>
          <router-link to="/ai" class="menu-item">
            <span class="menu-icon">🤖</span>
            <span class="menu-text">AI伴侣</span>
            <span class="menu-arrow">→</span>
          </router-link>
          <router-link to="/about" class="menu-item">
            <span class="menu-icon">ℹ️</span>
            <span class="menu-text">关于我们</span>
            <span class="menu-arrow">→</span>
          </router-link>
        </div>

        <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
          退出登录
        </button>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { isLoggedIn, isVip, user, logout } = useAuth()

function handleLogout() {
  logout()
}
</script>

<style scoped>
.page-header {
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.member-section {
  padding: 40px 20px;
}

.member-card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  padding: 24px;
  margin-bottom: 24px;
}

.member-card.vip {
  background: linear-gradient(135deg, rgba(233, 84, 131, 0.1) 0%, rgba(233, 84, 131, 0.05) 100%);
  border-color: var(--primary);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--theme-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.member-details h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
}

.member-details p {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

.vip-badge,
.vip-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: var(--theme-border-radius-sm);
  font-size: 0.9rem;
}

.vip-badge {
  background: var(--background-secondary);
  color: var(--text-light);
}

.vip-status {
  background: rgba(233, 84, 131, 0.1);
  color: var(--primary);
}

.member-menu {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  overflow: hidden;
  margin-bottom: 24px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: var(--text);
  border-bottom: 1px solid var(--card-border);
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: var(--background-secondary);
}

.menu-icon {
  font-size: 1.3rem;
}

.menu-text {
  flex: 1;
  font-size: 0.95rem;
}

.menu-arrow {
  color: var(--text-light);
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  color: var(--text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fee;
  border-color: #e74c3c;
  color: #e74c3c;
}
</style>