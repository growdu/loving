<template>
  <DefaultLayout>
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">让爱更有趣</h1>
        <p class="hero-subtitle">专为情侣设计的亲密互动游戏平台</p>

        <div class="hero-actions" v-if="!isLoggedIn">
          <router-link to="/login" class="btn-primary">开始探索</router-link>
          <router-link to="/positions" class="btn-secondary">免费姿势</router-link>
        </div>
      </div>
    </section>

    <section class="games-section">
      <div class="container">
        <h2 class="section-title">热门游戏</h2>

        <div class="games-grid">
          <GameCard
            v-for="game in games"
            :key="game.id"
            :to="game.to"
            :image="game.image"
            :title="game.title"
            :description="game.description"
            :tag="game.tag"
          />
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>

        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <h3>专注亲密</h3>
            <p>专为情侣设计的互动内容</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔒</span>
            <h3>隐私保护</h3>
            <p>端到端加密，仅限二人世界</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💕</span>
            <h3>增进感情</h3>
            <p>有趣的互动拉近彼此距离</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <h3>持续更新</h3>
            <p>每周上新，永远有惊喜</p>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import GameCard from '@/components/game/GameCard.vue'

const { isLoggedIn } = useAuth()

const games = [
  {
    id: 'fxq',
    to: '/game/fxq',
    image: '/images/games/flight-chess.jpg',
    title: '飞行棋',
    description: '经典双人飞行棋，和TA一起重温童年乐趣',
    tag: '经典'
  },
  {
    id: 'card',
    to: '/card',
    image: '/images/games/card.jpg',
    title: '亲密卡牌',
    description: '考验默契的时候到了，你们能猜对吗？',
    tag: '默契'
  },
  {
    id: 'ai',
    to: '/ai',
    image: '/images/games/ai.jpg',
    title: 'AI伴侣',
    description: '智能互动助手，随时陪伴你左右',
    tag: 'AI'
  }
]
</script>

<style scoped>
.hero {
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 14px 32px;
  background: white;
  color: var(--primary);
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  padding: 14px 32px;
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.games-section,
.features-section {
  padding: 60px 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 32px;
  text-align: center;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.feature-item {
  text-align: center;
  padding: 24px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.feature-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.feature-item p {
  font-size: 0.9rem;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 1.8rem;
  }
}
</style>