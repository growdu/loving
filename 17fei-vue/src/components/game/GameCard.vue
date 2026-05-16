<template>
  <router-link :to="to" class="game-card">
    <img :src="image" :alt="title" class="game-card-img" />
    <div class="game-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <span v-if="tag" class="game-card-tag">{{ tag }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  image: string
  title: string
  description: string
  tag?: string
}>()
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

.game-card-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: var(--background-secondary);
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
  background: var(--background-secondary);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--primary);
  font-weight: 500;
}
</style>