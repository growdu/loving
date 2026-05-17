<template>
  <DefaultLayout>
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">情侣情趣飞行棋</h1>
        <p class="hero-subtitle">专为情侣设计的情趣小游戏，支持多种设备，随时随地开启甜蜜互动</p>

        <div class="hero-badges">
          <span class="badge"><span class="badge-icon">📱</span> 移动端适配</span>
          <span class="badge"><span class="badge-icon">🎮</span> 多款游戏</span>
          <span class="badge"><span class="badge-icon">❤️</span> 情侣专属</span>
        </div>

        <div class="hero-actions" v-if="!isLoggedIn">
          <router-link to="/login" class="btn-primary">开始探索</router-link>
          <router-link to="/positions" class="btn-secondary">免费姿势</router-link>
        </div>
      </div>
    </section>

    <section class="games-section">
      <div class="container">
        <h2 class="section-title">游戏列表</h2>
        <p class="section-subtitle">选择你们喜欢的游戏，开始甜蜜互动</p>

        <div class="games-grid">
          <GameCard
            v-for="game in games"
            :key="game.id"
            :to="game.to"
            :image="game.image"
            :title="game.title"
            :description="game.description"
            :tag="game.tag"
            :tag-type="game.tagType"
            :emoji="game.emoji"
          />
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>

        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <h3>多款主题</h3>
            <p>多种主题风格，一键切换</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔒</span>
            <h3>隐私保护</h3>
            <p>本地存储，数据安全</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <h3>多端支持</h3>
            <p>支持手机、平板、电脑</p>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💰</span>
            <h3>实惠价格</h3>
            <p>10元开通月卡，49元终身</p>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import GameCard from '@/components/game/GameCard.vue'

const { isLoggedIn } = useAuth()

const games = [
  {
    id: 'fxq',
    to: '/game/fxq',
    emoji: '🎲',
    title: '飞行棋',
    description: '经典飞行棋游戏，适合情侣一起游玩',
    tag: '热门',
    tagType: 'hot' as const
  },
  {
    id: 'card',
    to: '/card',
    emoji: '🃏',
    title: '亲密卡牌',
    description: '多种版本任选，从恋爱到情趣，满足各种口味',
    tag: '10+版本',
    tagType: 'new' as const
  },
  {
    id: 'positions',
    to: '/positions',
    emoji: '💑',
    title: '姿势卡牌',
    description: '解锁更多姿势，增加情趣体验',
    tag: '100+姿势',
    tagType: 'default' as const
  },
  {
    id: 'ai',
    to: '/ai',
    emoji: '🤖',
    title: 'AI伴侣',
    description: '智能AI伴侣，懂你所需',
    tag: '新功能',
    tagType: 'new' as const
  }
]
</script>

<style scoped>
.hero {
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(180deg, var(--background) 0%, var(--background-secondary) 100%);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 32px;
}

.hero-badges {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--card-bg);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text);
  box-shadow: var(--theme-shadow);
}

.badge-icon {
  font-size: 1.1rem;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 14px 32px;
  background: var(--theme-gradient);
  color: white;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-shadow-hover);
}

.btn-secondary {
  padding: 14px 32px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: var(--background-secondary);
}

.games-section {
  padding: 60px 20px;
  background: var(--background-secondary);
}

.features-section {
  padding: 60px 20px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  text-align: center;
}

.section-subtitle {
  color: var(--text-light);
  text-align: center;
  margin-bottom: 40px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.feature-item {
  text-align: center;
  padding: 32px 24px;
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  border: 1px solid var(--card-border);
  box-shadow: var(--theme-shadow);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: var(--theme-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
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

  .section-title {
    font-size: 1.5rem;
  }
}
</style>