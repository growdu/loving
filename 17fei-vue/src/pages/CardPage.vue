<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>亲密卡牌</h1>
        <p>考验默契的时刻到了</p>
      </div>
    </section>

    <section class="card-section">
      <div class="container">
        <div class="version-selector">
          <div class="version-scroll">
            <button
              v-for="ver in versions"
              :key="ver.id"
              @click="selectVersion(ver.id)"
              class="version-chip"
              :class="{
                active: currentVersionId === ver.id,
                locked: ver.locked && !isVip
              }"
              :disabled="ver.locked && !isVip"
            >
              {{ ver.name }}
              <span v-if="ver.locked && !isVip">🔒</span>
            </button>
          </div>
        </div>

        <div class="card-area">
          <div
            class="flip-card"
            :class="{ flipped: isFlipped }"
            @click="flipCard"
          >
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="flip-card-front-icon">💕</div>
                <div class="flip-card-front-text">点击抽取任务</div>
              </div>
              <div class="flip-card-back">
                <div class="flip-card-back-content">{{ currentTask }}</div>
                <div class="card-id">#{{ cardIndex }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn action-btn-secondary" @click="resetCard">
            重置
          </button>
          <button class="action-btn action-btn-primary" @click="flipCard">
            {{ isFlipped ? '再抽一张' : '翻转' }}
          </button>
        </div>
      </div>
    </section>

    <section class="rules-section">
      <div class="container">
        <div class="rules-title">基本玩法</div>
        <p class="rules-text">
          轮流抽卡完成任务<br>
          无法完成认输受惩罚
        </p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/card'
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const store = useCardStore()
const { isVip } = useAuth()

const isFlipped = ref(false)
const cardIndex = ref(1)

const versions = [
  { id: 'lover0', name: '恋爱版', locked: false },
  { id: 'lover1', name: '热恋版', locked: false },
  { id: 'sex0', name: '同居版', locked: true },
  { id: 'sex1', name: '进阶版', locked: true },
  { id: 'sex2', name: '私密版', locked: true }
]

const currentVersionId = ref('lover0')

const tasks = {
  lover0: ['牵手漫步', '深情对视', '互喂美食', '拥抱一分钟', '说出一件喜欢对方的事', '十指紧扣', '眉目传情'],
  lover1: ['壁咚对方', '公主抱', '亲吻额头', '一起跳舞', '为对方按摩', '法式热吻', '情感对话'],
  sex0: ['睡衣派对', '深夜聊天', '一起看电影', '互诉心事', '制造惊喜']
}

const currentTask = computed(() => {
  const versionTasks = tasks[currentVersionId.value as keyof typeof tasks] || tasks.lover0
  const index = Math.floor(Math.random() * versionTasks.length)
  return versionTasks[index]
})

function flipCard() {
  isFlipped.value = !isFlipped.value
  if (isFlipped.value) {
    cardIndex.value = Math.floor(Math.random() * 100) + 1
  }
}

function resetCard() {
  isFlipped.value = false
}

function selectVersion(id: string) {
  const ver = versions.find(v => v.id === id)
  if (ver?.locked && !isVip) {
    return
  }
  currentVersionId.value = id
  isFlipped.value = false
}
</script>

<style scoped>
.page-header {
  padding: 40px 20px;
  text-align: center;
  background: var(--theme-gradient);
  color: white;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-header p {
  opacity: 0.9;
}

.card-section {
  padding: 40px 20px;
}

.version-selector {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 32px;
}

.version-scroll {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.version-chip {
  flex-shrink: 0;
  padding: 10px 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
}

.version-chip:hover:not(:disabled) {
  border-color: var(--primary);
}

.version-chip.active {
  background: var(--theme-gradient);
  color: white;
  border-color: transparent;
}

.version-chip.locked {
  opacity: 0.6;
}

.version-chip.locked::after {
  content: '🔒';
  margin-left: 6px;
}

.card-area {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

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

.flip-card-front-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.flip-card-front-text {
  font-size: 1.2rem;
  font-weight: 600;
}

.flip-card-back {
  background: var(--card-bg);
  transform: rotateY(180deg);
  border: 2px solid var(--card-border);
}

.flip-card-back-content {
  writing-mode: vertical-rl;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 4px;
}

.card-id {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 0.8rem;
  color: var(--text-light);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: var(--theme-border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.action-btn-primary {
  background: var(--theme-gradient);
  color: white;
  box-shadow: var(--theme-shadow);
}

.action-btn-primary:hover {
  transform: scale(1.05);
  box-shadow: var(--theme-shadow-hover);
}

.action-btn-secondary {
  background: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--card-border);
}

.action-btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.rules-section {
  padding: 24px 20px;
  background: var(--background-secondary);
}

.rules-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
  text-align: center;
}

.rules-text {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.8;
  text-align: center;
}

@media (max-width: 480px) {
  .flip-card {
    width: 240px;
    height: 340px;
  }

  .flip-card-back-content {
    font-size: 1.4rem;
  }
}
</style>