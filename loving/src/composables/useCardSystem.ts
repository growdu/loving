import { computed, ref } from 'vue'
import { pluginContainer } from '@/plugins/core/container'
import { useVipStatus } from './usePluginContainer'
import type { Card, CardVersion } from '@/plugins/core/types'

export function useCardSystem() {
  const { isVip } = useVipStatus()

  const currentVersionId = ref<string>('lover0')
  const currentCardIndex = ref(0)
  const isFlipped = ref(false)

  const allVersions = computed(() => pluginContainer.cards.getAllVersions())

  const currentVersion = computed<CardVersion | undefined>(() => {
    return allVersions.value.find(v => v.id === currentVersionId.value)
  })

  const currentTasks = computed<string[]>(() => {
    return currentVersion.value?.tasks || []
  })

  const currentTask = computed<string>(() => {
    const tasks = currentTasks.value
    if (tasks.length === 0) return ''
    return tasks[currentCardIndex.value % tasks.length]
  })

  function getVersion(versionId: string): CardVersion | undefined {
    return allVersions.value.find(v => v.id === versionId)
  }

  function isVersionLocked(versionId: string): boolean {
    const version = getVersion(versionId)
    return version?.locked && !isVip.value
  }

  function selectVersion(versionId: string): boolean {
    if (isVersionLocked(versionId)) return false
    currentVersionId.value = versionId
    currentCardIndex.value = Math.floor(Math.random() * currentTasks.value.length)
    isFlipped.value = false
    return true
  }

  function flipCard(): void {
    isFlipped.value = !isFlipped.value
  }

  function nextCard(): void {
    currentCardIndex.value = Math.floor(Math.random() * currentTasks.value.length)
    isFlipped.value = false
  }

  function resetCard(): void {
    currentCardIndex.value = 0
    isFlipped.value = false
  }

  function getRandomCard(versionId: string): Card | undefined {
    const pluginId = findPluginForVersion(versionId)
    if (!pluginId) return undefined
    const plugin = pluginContainer.cards.get(pluginId)
    return plugin?.getRandomCard(versionId)
  }

  function findPluginForVersion(versionId: string): string | undefined {
    for (const plugin of pluginContainer.cards.getAll()) {
      if (plugin.getVersion(versionId)) {
        return plugin.id
      }
    }
    return undefined
  }

  return {
    allVersions,
    currentVersion,
    currentVersionId,
    currentTasks,
    currentTask,
    currentCardIndex,
    isFlipped,
    isVip,
    getVersion,
    isVersionLocked,
    selectVersion,
    flipCard,
    nextCard,
    resetCard,
    getRandomCard
  }
}
