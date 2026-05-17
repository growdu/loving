<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()

// 应用启动时恢复状态
onMounted(() => {
  userStore.loadState()
  themeStore.loadState()
})
</script>

<template>
  <RouterView />
</template>