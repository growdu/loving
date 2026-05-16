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
          <button
            v-for="version in versions"
            :key="version.id"
            @click="selectVersion(version.id)"
            class="version-btn"
            :class="{ active: currentVersion === version.id }"
          >
            {{ version.name }}
          </button>
        </div>

        <div class="card-area">
          <div class="flip-card" :class="{ flipped: isFlipped }" @click="flipCard">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <span class="card-icon">🎴</span>
                <span class="card-hint">点击翻转</span>
              </div>
              <div class="flip-card-back">
                <p class="card-content">{{ currentCard.content }}</p>
                <span v-if="currentCard.isVipOnly" class="vip-badge">VIP</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-controls">
          <button @click="resetCard" class="control-btn">
            🔄 重新开始
          </button>
          <button @click="nextCard" class="control-btn primary">
            ➡️ 下一张
          </button>
        </div>

        <p v-if="!isVip" class="vip-hint">
          解锁全部卡牌，享受更多乐趣
          <router-link to="/login">开通VIP</router-link>
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

const currentVersion = computed(() => store.currentVersion)
const isFlipped = computed(() => store.isFlipped)

const versions = [
  { id: 'soft', name: '温柔版' },
  { id: 'spicy', name: '刺激版' }
]

const cards = {
  soft: [
    { content: '选择一个部位让对方按摩2分钟', isVipOnly: false },
    { content: '说一句让对方心动的话', isVipOnly: false },
    { content: '对视30秒，看谁先笑', isVipOnly: false },
    { content: '给对方一个拥抱并说"我爱你"', isVipOnly: true }
  ],
  spicy: [
    { content: '选择一个姿势尝试', isVipOnly: true },
    { content: '说出对方最让你心动的一个瞬间', isVipOnly: true },
    { content: '让对方做5个俯卧撑', isVipOnly: false },
    { content: '尝试一个新的亲吻方式', isVipOnly: true }
  ]
}

const currentCard = computed(() => {
  const versionCards = cards[currentVersion.value as keyof typeof cards]
  return versionCards[store.currentCardIndex % versionCards.length]
})

function flipCard() {
  store.flipCard()
}

function selectVersion(versionId: string) {
  store.selectVersion(versionId as 'soft' | 'spicy')
}

function nextCard() {
  store.flipCard()
  setTimeout(() => store.nextCard(), 300)
}

function resetCard() {
  store.reset()
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

.card-section {
  padding: 40px 20px;
}

.version-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.version-btn {
  padding: 10px 24px;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  border-radius: 25px;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.version-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.card-area {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.flip-card {
  width: 300px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--theme-border-radius);
  box-shadow: var(--theme-shadow-hover);
}

.flip-card-front {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.card-hint {
  font-size: 0.9rem;
  opacity: 0.8;
}

.flip-card-back {
  background: var(--card-bg);
  transform: rotateY(180deg);
  padding: 32px;
  border: 2px solid var(--card-border);
}

.card-content {
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: center;
  color: var(--text);
}

.vip-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  background: var(--theme-gradient);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.control-btn {
  padding: 12px 24px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: var(--background-secondary);
}

.control-btn.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.vip-hint {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
}

.vip-hint a {
  color: var(--primary);
  text-decoration: none;
}
</style>