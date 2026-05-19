import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const store = useThemeStore()

  onMounted(() => {
    store.loadState()
  })

  async function activateVip(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      if (data.success) {
        store.updateVipStatus(true)
      }
      return data
    } catch {
      return { success: false, message: '网络错误，请重试' }
    }
  }

  return {
    currentTheme: store.current,
    themes: store.themes,
    isVip: store.isVip,
    trialCount: store.trialCount,
    isThemeLocked: store.isThemeLocked,
    switchTheme: store.switchTheme,
    activateVip
  }
}