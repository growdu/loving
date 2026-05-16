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
        <div class="position-grid">
          <div
            v-for="(position, index) in positions"
            :key="index"
            class="position-card"
            :class="{ locked: !canView(position.level) }"
            @click="handleClick(position)"
          >
            <div class="position-image">
              <img :src="position.image" :alt="position.name" />
              <span v-if="!canView(position.level)" class="lock-overlay">🔒</span>
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
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useTrial } from '@/composables/useTrial'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { canView } = useTrial(3)

const positions = [
  { name: '经典传教士', level: 1, image: '/images/positions/1.jpg' },
  { name: '后背式', level: 2, image: '/images/positions/2.jpg' },
  { name: '侧卧式', level: 2, image: '/images/positions/3.jpg' },
  { name: '站立式', level: 3, image: '/images/positions/4.jpg' },
  { name: '女上位', level: 2, image: '/images/positions/5.jpg' },
  { name: '后入式', level: 3, image: '/images/positions/6.jpg' }
]

function levelLabel(level: number): string {
  const labels = { 1: '入门', 2: '进阶', 3: '高级' }
  return labels[level] || '入门'
}

function handleClick(position: { level: number }) {
  if (!canView(position.level)) {
    // TODO: Show VIP modal
  }
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

.page-header p {
  opacity: 0.9;
}

.positions-section {
  padding: 40px 20px;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
  opacity: 0.7;
}

.position-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.position-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  font-size: 2rem;
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
</style>