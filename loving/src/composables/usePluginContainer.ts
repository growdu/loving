import { pluginContainer } from '@/plugins/core/container'
import { computed } from 'vue'

export function usePluginContainer() {
  return {
    container: pluginContainer,
    themes: pluginContainer.themes,
    cards: pluginContainer.cards,
    games: pluginContainer.games
  }
}

export function useVipStatus() {
  const isVip = computed(() => pluginContainer.isVip)

  function setVip(status: boolean) {
    pluginContainer.setVip(status)
    localStorage.setItem('is_vip', String(status))
  }

  function onVipChange(callback: (isVip: boolean) => void) {
    return pluginContainer.onVipChange(callback)
  }

  return {
    isVip,
    setVip,
    onVipChange
  }
}
