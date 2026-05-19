<template>
  <DefaultLayout>
    <section class="page-header">
      <div class="container">
        <h1>亲密卡牌</h1>
        <p>抽取属于你们的甜蜜任务</p>
      </div>
    </section>

    <section class="card-section">
      <div class="container">
        <div class="version-selector">
          <div class="version-scroll">
            <button
              v-for="ver in allVersions"
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
              <span v-if="ver.locked && !isVip" class="lock-icon">
                <Lock :size="12" />
              </span>
            </button>
          </div>
        </div>

        <div class="card-area">
          <div
            class="flip-card"
            :class="{ flipped: isFlipped }"
            @click="handleCardClick"
          >
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="card-bg-image" :style="{ backgroundImage: `url(${currentImage})` }"></div>
                <div class="flip-card-front-content">
                  <div class="flip-card-front-icon">
                    <Heart :size="48" fill="currentColor" />
                  </div>
                  <div class="flip-card-front-text">点击抽取任务</div>
                  <div class="version-badge">{{ currentVersion?.name }}</div>
                </div>
              </div>
              <div class="flip-card-back">
                <div class="card-bg-image blur" :style="{ backgroundImage: `url(${currentImage})` }"></div>
                <div class="flip-card-back-content">
                  <div class="task-text">{{ currentTask }}</div>
                </div>
                <div class="card-footer">
                  <div class="card-id">#{{ String(currentCardIndex + 1).padStart(2, '0') }}</div>
                  <div v-if="currentVersion?.locked" class="vip-tag">
                    <Star :size="12" fill="currentColor" />
                    私密
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn action-btn-secondary" @click="resetCard">
            <RotateCcw :size="18" />
            重置
          </button>
          <button class="action-btn action-btn-primary" @click="nextCard">
            <Shuffle :size="18" />
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
import { computed } from 'vue'
import { Heart, Lock, Star, RotateCcw, Shuffle } from 'lucide-vue-next'
import { useCardSystem } from '@/composables/useCardSystem'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const {
  allVersions,
  currentVersion,
  currentVersionId,
  currentTasks,
  currentTask,
  currentCardIndex,
  isFlipped,
  isVip,
  selectVersion,
  flipCard,
  nextCard,
  resetCard
} = useCardSystem()

// Card images by category (romantic/intimate couple images from unsplash)
const cardImages: Record<string, string[]> = {
  lover: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce24e?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544723795-3fb1671e6d7e?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518199266791-5375a85190c7?w=600&h=800&fit=crop'
  ],
  sex: [
    'https://images.unsplash.com/photo-1552374196-c4e7ff6e1d0a?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1582725703362-c1f8983b6b86?w=600&h=800&fit=crop'
  ],
  sm: [
    'https://images.unsplash.com/photo-1573446784990-6a1ae8c0ab9d?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544161515d1-c1e6e4c1b4e1?w=600&h=800&fit=crop'
  ],
  default: [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop'
  ]
}

const currentImage = computed(() => {
  const category = currentVersion.value?.category || 'lover'
  const images = cardImages[category] || cardImages.default
  const index = currentCardIndex.value % images.length
  return images[index]
})

function handleCardClick() {
  if (!isFlipped.value) {
    flipCard()
  } else {
    nextCard()
  }
}
</script>

<style scoped>
.page-header {
  padding: 40px 20px 20px;
  text-align: center;
  background: linear-gradient(180deg, var(--background-secondary) 0%, var(--background) 100%);
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 900;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-light);
  font-size: 1rem;
}

.card-section {
  padding: 20px;
}

.version-selector {
  margin-bottom: 30px;
}

.version-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
}

.version-scroll::-webkit-scrollbar {
  display: none;
}

.version-chip {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 30px;
  border: 2px solid var(--card-border);
  background: var(--card-bg);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.version-chip:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.version-chip.active {
  background: var(--theme-gradient);
  border-color: transparent;
  color: white;
}

.version-chip.locked {
  opacity: 0.6;
}

.version-chip .lock-icon {
  display: flex;
  color: var(--text-light);
}

.card-area {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.flip-card {
  width: 300px;
  height: 420px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
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
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--theme-shadow);
}

.flip-card-front {
  background: linear-gradient(145deg, rgba(45, 20, 20, 0.95) 0%, rgba(30, 10, 10, 0.98) 100%);
  border: 2px solid var(--card-border);
}

.flip-card-front-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
}

.flip-card-front-icon {
  color: var(--primary);
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.flip-card-front-text {
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.version-badge {
  position: absolute;
  bottom: 20px;
  padding: 6px 16px;
  background: var(--theme-gradient);
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.flip-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(145deg, rgba(45, 20, 20, 0.98) 0%, rgba(20, 10, 10, 0.99) 100%);
  border: 2px solid var(--primary);
  display: flex;
  flex-direction: column;
}

.flip-card-back-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  position: relative;
  z-index: 1;
}

.task-text {
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.card-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.4);
  border-top: 1px solid rgba(255,255,255,0.1);
}

.card-id {
  color: var(--text-light);
  font-size: 0.85rem;
  font-weight: 600;
}

.vip-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffd700;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.4;
}

.card-bg-image.blur {
  filter: blur(20px);
  transform: scale(1.1);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.action-btn-secondary {
  background: var(--card-bg);
  color: var(--text);
  border: 2px solid var(--card-border);
}

.action-btn-secondary:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.action-btn-primary {
  background: var(--theme-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
}

.action-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
}

.rules-section {
  padding: 40px 20px;
  text-align: center;
  background: var(--background-secondary);
  margin-top: 40px;
}

.rules-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.rules-text {
  color: var(--text-light);
  line-height: 1.8;
}
</style>