import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Theme {
  id: string
  name: string
  preview: string
  description: string
}

export const useThemeStore = defineStore('theme', () => {
  const current = ref('romantic')
  const isVip = ref(false)
  const trialCount = ref(3)
  const maxTrial = 3

  const themes: Theme[] = [
    {
      id: 'romantic',
      name: '浪漫梦幻',
      preview: 'linear-gradient(135deg, #ff6b9d, #c44569)',
      description: '粉色渐变、爱心粒子、星空背景'
    },
    {
      id: 'minimal',
      name: '简约现代',
      preview: 'linear-gradient(135deg, #5c7cfa, #4c6ef5)',
      description: '扁平化设计、柔和配色、清新线条'
    },
    {
      id: 'playful',
      name: '活泼可爱',
      preview: 'linear-gradient(135deg, #ff922b, #ff7b00)',
      description: '明快橙黄、圆润元素、趣味动画'
    },
    {
      id: 'premium',
      name: '高端私密',
      preview: 'linear-gradient(135deg, #9775fa, #845ef7)',
      description: '深紫黑金、精致纹理、商务质感'
    }
  ]

  const isThemeLocked = computed(() => !isVip.value && trialCount.value <= 0)

  function switchTheme(id: string): boolean {
    if (isThemeLocked.value) return false
    current.value = id
    document.body.className = `theme-${id}`
    localStorage.setItem('current_theme', id)
    if (!isVip.value) {
      trialCount.value--
      saveTrialData()
    }
    return true
  }

  function saveTrialData() {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`theme_trial_${today}`, JSON.stringify({
      date: today,
      count: maxTrial - trialCount.value
    }))
  }

  function loadState() {
    const saved = localStorage.getItem('current_theme')
    if (saved) {
      current.value = saved
      document.body.className = `theme-${saved}`
    }
    const vipStatus = localStorage.getItem('vip_status')
    isVip.value = vipStatus === 'true'

    const today = new Date().toISOString().split('T')[0]
    const trialData = localStorage.getItem(`theme_trial_${today}`)
    if (trialData) {
      const data = JSON.parse(trialData)
      if (data.date === today) {
        trialCount.value = Math.max(0, maxTrial - data.count)
      }
    }
  }

  function updateVipStatus(status: boolean) {
    isVip.value = status
    if (status) {
      localStorage.setItem('vip_status', 'true')
    } else {
      localStorage.removeItem('vip_status')
    }
  }

  return {
    current,
    isVip,
    trialCount,
    themes,
    isThemeLocked,
    switchTheme,
    loadState,
    updateVipStatus
  }
})