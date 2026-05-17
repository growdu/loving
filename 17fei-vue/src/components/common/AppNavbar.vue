<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <router-link to="/" class="logo">
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>" alt="17fei" />
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