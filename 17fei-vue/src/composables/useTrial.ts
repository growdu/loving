import { ref, onMounted } from 'vue'

export function useTrial(maxTrial: number = 3) {
  const count = ref(maxTrial)

  onMounted(() => {
    const today = new Date().toISOString().split('T')[0]
    const key = `theme_trial_${today}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        count.value = Math.max(0, maxTrial - data.count)
      }
    }
  })

  function consume(): number {
    count.value = Math.max(0, count.value - 1)
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`theme_trial_${today}`, JSON.stringify({
      date: today,
      count: maxTrial - count.value
    }))
    return count.value
  }

  function reset() {
    count.value = maxTrial
  }

  return { count, consume, reset }
}