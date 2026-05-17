<template>
  <router-link :to="to" class="game-card">
    <div class="game-card-img">
      <img v-if="image" :src="image" :alt="title" class="game-img" />
      <span v-else class="game-emoji">{{ emoji }}</span>
      <div class="game-overlay">
        <span class="play-icon">▶</span>
      </div>
    </div>
    <div class="game-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <span v-if="tag" class="game-card-tag" :class="'tag-' + tagColor">{{ tag }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  to: string
  emoji?: string
  image?: string
  title: string
  description: string
  tag?: string
  tagType?: 'hot' | 'new' | 'vip' | 'default'
}>()

const tagColor = computed(() => props.tagType || 'default')
</script>

<style scoped>
.game-card {
  background: var(--card-bg);
  border-radius: var(--theme-border-radius);
  overflow: hidden;
  box-shadow: var(--theme-shadow);
  border: 1px solid var(--card-border);
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--theme-shadow-hover);
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.game-card-img {
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  overflow: hidden;
}

.game-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-emoji {
  font-size: 4rem;
  transition: transform 0.3s;
}

.game-card:hover .game-emoji {
  transform: scale(1.1);
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.play-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--primary);
  padding-left: 4px;
}

.game-card-content {
  padding: 20px;
}

.game-card-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.game-card-content p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

.game-card-tag {
  display: inline-block;
  margin-top: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag-default {
  background: var(--background-secondary);
  color: var(--primary);
}

.tag-hot {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
}

.tag-new {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.tag-vip {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  color: white;
}
</style>