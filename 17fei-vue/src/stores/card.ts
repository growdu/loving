import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CardVersion {
  id: string
  name: string
  locked: boolean
  tasks: string[]
}

export const useCardStore = defineStore('card', () => {
  const currentVersionId = ref('lover0')
  const isFlipped = ref(false)
  const currentTask = ref('')

  const versions: CardVersion[] = [
    { id: 'lover0', name: '恋爱版', locked: false, tasks: ['牵手漫步', '深情对视', '互喂美食', '拥抱一分钟', '说出一件喜欢对方的事'] },
    { id: 'lover1', name: '热恋版', locked: false, tasks: ['壁咚对方', '公主抱', '亲吻额头', '一起跳舞', '为对方按摩'] },
    { id: 'sex0', name: '同居版', locked: true, tasks: ['睡衣派对', '深夜聊天', '一起看电影', '互诉心事', '制造惊喜'] },
    { id: 'sex1', name: '进阶版', locked: true, tasks: [] },
    { id: 'sex2', name: '私密版', locked: true, tasks: [] },
    { id: 'sm', name: 'SM版', locked: true, tasks: [] },
    { id: 'huwai', name: '户外版', locked: true, tasks: [] },
    { id: 'custom', name: '自定义', locked: true, tasks: [] }
  ]

  const currentVersion = computed(() =>
    versions.find(v => v.id === currentVersionId.value) || versions[0]
  )

  const currentTasks = computed(() => currentVersion.value.tasks)

  function selectVersion(id: string) {
    currentVersionId.value = id
    isFlipped.value = false
  }

  function flipCard(): string {
    isFlipped.value = !isFlipped.value
    if (isFlipped.value && currentTasks.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * currentTasks.value.length)
      currentTask.value = currentTasks.value[randomIndex]
    }
    return currentTask.value
  }

  function resetCard() {
    isFlipped.value = false
    currentTask.value = ''
  }

  return {
    currentVersionId,
    isFlipped,
    currentTask,
    versions,
    currentVersion,
    currentTasks,
    selectVersion,
    flipCard,
    resetCard
  }
})