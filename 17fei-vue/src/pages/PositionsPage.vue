<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>姿势大全</h1>
        <p>探索属于你们的专属姿势</p>
      </div>
    </section>

    <section class="positions-section">
      <div class="container">
        <div class="version-tabs">
          <button
            v-for="ver in versions"
            :key="ver.id"
            @click="selectVersion(ver.id)"
            class="version-tab"
            :class="{ active: currentVersion === ver.id }"
          >
            {{ ver.name }}
            <span v-if="ver.locked && !isVip" class="lock-icon">🔒</span>
          </button>
        </div>

        <div class="position-grid">
          <div
            v-for="(position, index) in currentPositions"
            :key="index"
            class="position-card"
            :class="{ locked: position.locked && !isVip }"
            @click="handleClick(position)"
          >
            <div class="position-image">
              <span class="position-emoji">{{ position.emoji }}</span>
              <span v-if="position.locked && !isVip" class="lock-overlay">
                <span class="lock-icon">🔒</span>
                <span class="lock-text">VIP专享</span>
              </span>
            </div>
            <div class="position-info">
              <h3>{{ position.name }}</h3>
              <span class="position-level" :class="'level-' + position.level">
                {{ levelLabel(position.level) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rules-section">
      <div class="container">
        <h3 class="rules-title">基本玩法</h3>
        <p class="rules-text">
          轮流抽取姿势卡片完成任务<br>
          无法完成认输受惩罚
        </p>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { isVip } = useAuth()

const versions = [
  { id: 'lover', name: '恋爱版' },
  { id: 'hot', name: '热恋版' },
  { id: '同居', name: '同居版', locked: true },
  { id: '进阶', name: '进阶版', locked: true },
  { id: '私密', name: '私密版', locked: true }
]

const currentVersion = ref('lover')

const positionsByVersion = {
  lover: [
    { name: '经典传教士', level: 1, emoji: '😇', locked: false },
    { name: '后背式', level: 1, emoji: '💑', locked: false },
    { name: '侧卧式', level: 1, emoji: '🌙', locked: false },
    { name: '女上位', level: 2, emoji: '👑', locked: false },
    { name: '面对面', level: 1, emoji: '😊', locked: false },
    { name: '汤勺式', level: 1, emoji: '🥄', locked: false }
  ],
  hot: [
    { name: '站立式', level: 3, emoji: '🔥', locked: true },
    { name: '后入式', level: 3, emoji: '💋', locked: true },
    { name: '反坐式', level: 3, emoji: '🦋', locked: true },
    { name: '火车便式', level: 2, emoji: '🚂', locked: false },
    { name: '推车式', level: 3, emoji: '🛒', locked: true },
    { name: '小狗式', level: 2, emoji: '🐶', locked: false }
  ],
  同居: [
    { name: '晨起式', level: 2, emoji: '☀️', locked: true },
    { name: '沙发式', level: 2, emoji: '🛋️', locked: true },
    { name: '厨房式', level: 3, emoji: '🍳', locked: true }
  ],
  进阶: [
    { name: '一字马', level: 3, emoji: '🤸', locked: true },
    { name: '倒立式', level: 3, emoji: '🧘', locked: true }
  ],
  私密: [
    { name: '高级体位', level: 3, emoji: '✨', locked: true },
    { name: '探索体位', level: 3, emoji: '🌟', locked: true }
  ]
}

const currentPositions = computed(() => {
  return positionsByVersion[currentVersion.value as keyof typeof positionsByVersion] || positionsByVersion.lover
})

function selectVersion(id: string) {
  const ver = versions.find(v => v.id === id)
  if (ver?.locked && !isVip.value) {
    return
  }
  currentVersion.value = id
}

function levelLabel(level: number): string {
  const labels = { 1: '入门', 2: '进阶', 3: '高级' }
  return labels[level] || '入门'
}

function handleClick(position: { locked: boolean; level: number }) {
  if (position.locked && !isVip.value) {
    // Show VIP modal or alert
    return
  }
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

.positions-section {
  padding: 40px 20px;
}

.version-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 20px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.version-tab {
  padding: 10px 20px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.version-tab:hover {
  border-color: var(--primary);
}

.version-tab.active {
  background: var(--theme-gradient);
  color: white;
  border-color: transparent;
}

.version-tab .lock-icon {
  margin-left: 4px;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.position-card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.position-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--theme-shadow-hover);
}

.position-card.locked {
  opacity: 0.8;
}

.position-image {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 100%);
}

.position-emoji {
  font-size: 4rem;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.lock-overlay .lock-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.lock-overlay .lock-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.position-info {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.position-level {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.level-1 {
  background: var(--background-secondary);
  color: var(--text-light);
}

.level-2 {
  background: rgba(233, 84, 131, 0.1);
  color: var(--primary);
}

.level-3 {
  background: var(--theme-gradient);
  color: white;
}

.rules-section {
  padding: 24px 20px;
  background: var(--background-secondary);
  text-align: center;
}

.rules-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 12px;
}

.rules-text {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.8;
}
</style>