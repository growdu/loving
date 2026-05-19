<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
      <Home :size="20" :stroke-width="route.path === '/' ? 2.5 : 1.5" />
      <span>首页</span>
    </router-link>
    <router-link to="/positions" class="nav-item" :class="{ active: route.path === '/positions' }">
      <Heart :size="20" :stroke-width="route.path === '/positions' ? 2.5 : 1.5" />
      <span>姿势</span>
    </router-link>
    <router-link to="/card" class="nav-item" :class="{ active: route.path === '/card' }">
      <CreditCard :size="20" :stroke-width="route.path === '/card' ? 2.5 : 1.5" />
      <span>卡牌</span>
    </router-link>
    <router-link to="/member" class="nav-item" :class="{ active: route.path === '/member' }">
      <User :size="20" :stroke-width="route.path === '/member' ? 2.5 : 1.5" />
      <span>我的</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, Heart, CreditCard, User } from 'lucide-vue-next'

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
  display: flex;
}
</style>