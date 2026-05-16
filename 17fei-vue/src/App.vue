<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  themeStore.loadState()
  userStore.loadState()
})
</script>

<style>
@import '@/assets/styles/base.css';

#app {
  min-height: 100vh;
}
</style>