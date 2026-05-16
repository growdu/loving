<template>
  <DefaultLayout>
    <section class="game-page">
      <div class="game-container">
        <div class="game-header">
          <button @click="goBack" class="back-btn">← 返回</button>
          <h1>飞行棋</h1>
          <div class="game-status">
            <span v-if="!isVip" class="vip-hint">
              完整版需要VIP
              <router-link to="/login">开通</router-link>
            </span>
          </div>
        </div>

        <div class="game-frame">
          <iframe
            v-if="gameReady"
            src="https://fxq.17fei.fun"
            class="game-iframe"
            frameborder="0"
          ></iframe>
          <div v-else class="game-placeholder">
            <span class="loading-icon">🎮</span>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const router = useRouter()
const { isVip } = useAuth()

const gameReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    gameReady.value = true
  }, 500)
})

function goBack() {
  router.back()
}
</script>

<style scoped>
.game-page {
  min-height: calc(100vh - 64px);
  background: var(--background);
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-btn {
  padding: 8px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--background-secondary);
}

.game-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.vip-hint {
  font-size: 0.85rem;
  color: var(--text-light);
}

.vip-hint a {
  color: var(--primary);
  text-decoration: none;
  margin-left: 4px;
}

.game-frame {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  overflow: hidden;
  aspect-ratio: 16 / 10;
}

.game-iframe {
  width: 100%;
  height: 100%;
}

.game-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-light);
}

.loading-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
</style>