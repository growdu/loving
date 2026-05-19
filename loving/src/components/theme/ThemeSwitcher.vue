<template>
  <div class="theme-switcher">
    <button @click="showPicker = !showPicker" class="theme-btn">
      <span class="theme-icon">{{ currentThemeIcon }}</span>
      <span class="theme-label">{{ currentThemeName }}</span>
    </button>

    <div v-if="showPicker" class="theme-picker">
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="switchTo(theme.id)"
        class="theme-option"
        :class="{ active: currentTheme === theme.id }"
      >
        <span class="theme-option-icon">{{ theme.icon }}</span>
        <span>{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const store = useThemeStore()
const showPicker = ref(false)

const themes = [
  { id: 'romantic', name: '浪漫', icon: '🌹' },
  { id: 'minimal', name: '简约', icon: '🌿' },
  { id: 'playful', name: '活泼', icon: '🌈' },
  { id: 'premium', name: '高级', icon: '💎' }
]

const currentTheme = computed(() => store.currentTheme)
const currentThemeName = computed(() => themes.find(t => t.id === currentTheme.value)?.name || '浪漫')
const currentThemeIcon = computed(() => themes.find(t => t.id === currentTheme.value)?.icon || '🌹')

function switchTo(themeId: string) {
  store.switchTheme(themeId)
  showPicker.value = false
}
</script>

<style scoped>
.theme-switcher {
  position: relative;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--background-secondary);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text);
}

.theme-btn:hover {
  background: var(--card-bg);
  border-color: var(--primary);
}

.theme-icon {
  font-size: 1.1rem;
}

.theme-label {
  font-size: 0.85rem;
  font-weight: 500;
}

.theme-picker {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--theme-border-radius);
  box-shadow: var(--theme-shadow);
  padding: 8px;
  z-index: 200;
  min-width: 140px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: none;
  border-radius: var(--theme-border-radius-sm);
  cursor: pointer;
  color: var(--text);
  font-size: 0.9rem;
  transition: background 0.2s;
}

.theme-option:hover {
  background: var(--background-secondary);
}

.theme-option.active {
  background: var(--theme-gradient);
  color: white;
}

.theme-option-icon {
  font-size: 1rem;
}
</style>