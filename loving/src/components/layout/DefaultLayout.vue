<template>
  <div class="default-layout">
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
    <VipModal :show="showVipModal" @close="showVipModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppBottomNav from '@/components/common/AppBottomNav.vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'
import VipModal from '@/components/theme/VipModal.vue'

const showVipModal = ref(false)
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px;
  padding-bottom: 80px;
}

@media (min-width: 769px) {
  .main-content {
    padding-bottom: 40px;
  }
}
</style>