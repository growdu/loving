import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CardVersion {
  id: string
  name: string
  locked: boolean
  tasks: string[]
}

export const useCardStore = defineStore('card', () => {
  const currentVersionId = ref('soft')
  const isFlipped = ref(false)
  const currentCardIndex = ref(0)

  const versions: CardVersion[] = [
    { id: 'soft', name: '温柔版', locked: false, tasks: ['选择一个部位让对方按摩2分钟', '说一句让对方心动的话', '对视30秒看谁先笑', '给对方一个拥抱并说我爱你', '深情亲吻10秒'] },
    { id: 'spicy', name: '刺激版', locked: false, tasks: ['选择一个姿势尝试', '说出对方最让你心动的一个瞬间', '让对方做5个俯卧撑', '尝试一个新的亲吻方式', '互相探索对方的敏感带'] }
  ]

  const currentVersion = computed(() =>
    versions.find(v => v.id === currentVersionId.value) || versions[0]
  )

  const currentTasks = computed(() => currentVersion.value.tasks)

  const currentTask = computed(() => {
    const tasks = currentTasks.value
    if (tasks.length === 0) return ''
    return tasks[currentCardIndex.value % tasks.length]
  })

  function selectVersion(id: string) {
    currentVersionId.value = id
    isFlipped.value = false
    currentCardIndex.value = 0
  }

  function flipCard(): string {
    isFlipped.value = !isFlipped.value
    return currentTask.value
  }

  function nextCard() {
    currentCardIndex.value++
    isFlipped.value = false
  }

  function resetCard() {
    isFlipped.value = false
    currentCardIndex.value = 0
  }

  return {
    currentVersionId,
    isFlipped,
    currentCardIndex,
    currentTask,
    versions,
    currentVersion,
    currentTasks,
    selectVersion,
    flipCard,
    nextCard,
    resetCard
  }
})