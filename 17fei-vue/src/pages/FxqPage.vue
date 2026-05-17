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
          <FlightChessGame ref="gameRef" />
          <button
            v-if="showCompleteBtn"
            @click="completeTask"
            class="complete-btn"
          >
            ✓ 完成任务
          </button>
        </div>

        <div class="game-rules">
          <h3>游戏规则</h3>
          <ul>
            <li>轮流投掷骰子，移动棋子</li>
            <li>落在格子上需完成对应的亲密任务</li>
            <li>完成后点击"完成任务"继续游戏</li>
            <li>最先到达终点者获胜</li>
          </ul>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import FlightChessGame from '@/components/game/FlightChessGame.vue'

const router = useRouter()
const { isVip } = useAuth()
const gameRef = ref()

const showCompleteBtn = computed(() => {
  return gameRef.value?.isWaitingTask?.() ?? false
})

function goBack() {
  router.back()
}

function completeTask() {
  gameRef.value?.completeTask()
}
</script>

<style scoped>
.game-page {
  min-height: calc(100vh - 64px);
  background: var(--background);
}

.game-container {
  max-width: 500px;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.complete-btn {
  padding: 12px 32px;
  background: #2ecc71;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.game-rules {
  margin-top: 24px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
}

.game-rules h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text);
}

.game-rules ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.8;
}
</style>

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