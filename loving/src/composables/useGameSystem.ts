import { computed, ref, reactive } from 'vue'
import { pluginContainer } from '@/plugins/core/container'
import type {
  GameConfig,
  GameSession,
  GameTheme,
  GameMode,
  TaskRecord
} from '@/plugins/core/types'

export function useGameSystem(gameId: string = 'flight-chess') {
  const plugin = computed(() => pluginContainer.games.get(gameId))

  const selectedThemeId = ref<string>('')
  const selectedModeId = ref<GameMode>('normal')
  const gameStarted = ref(false)
  const session = ref<GameSession | null>(null)

  const rolling = ref(false)
  const lastRoll = ref<number | null>(null)
  const waitingTask = ref(false)
  const showTask = ref(false)
  const gameOver = ref(false)
  const winner = ref<number | null>(null)

  const themes = computed(() => plugin.value?.themes || [])
  const modes = computed(() => plugin.value?.modes || [])
  const board = computed(() => plugin.value?.board)

  const currentCells = computed(() => board.value?.cells || [])
  const totalCells = computed(() => board.value?.totalCells || 16)

  const pos1 = ref(0)
  const pos2 = ref(0)
  const currentPlayer = ref(1)

  const currentTask = computed(() => {
    if (!session.value) return null
    const pos = currentPlayer.value === 1 ? pos1.value : pos2.value
    if (pos > 0 && pos <= totalCells.value) {
      return currentCells.value[pos - 1]
    }
    return null
  })

  function selectTheme(themeId: string) {
    selectedThemeId.value = themeId
  }

  function selectMode(modeId: GameMode) {
    selectedModeId.value = modeId
  }

  function startGame() {
    if (!plugin.value) return

    const config: GameConfig = {
      gameId,
      playerCount: 2,
      selectedTheme: selectedThemeId.value,
      selectedMode: selectedModeId.value
    }

    session.value = plugin.value.createSession(config)
    gameStarted.value = true
    pos1.value = 0
    pos2.value = 0
    currentPlayer.value = 1
    lastRoll.value = null
    waitingTask.value = false
    showTask.value = false
    gameOver.value = false
    winner.value = null
  }

  async function rollDice() {
    if (rolling.value || gameOver.value) return

    rolling.value = true
    lastRoll.value = null

    // Animation
    for (let i = 0; i < 10; i++) {
      lastRoll.value = Math.floor(Math.random() * 6) + 1
      await new Promise(r => setTimeout(r, 80))
    }

    rolling.value = false
    await finishRoll()
  }

  async function finishRoll() {
    if (!lastRoll.value) return

    const roll = lastRoll.value
    const currentPos = currentPlayer.value === 1 ? pos1.value : pos2.value
    const newPos = currentPos + roll

    if (currentPlayer.value === 1) {
      pos1.value = newPos
    } else {
      pos2.value = newPos
    }

    // Check win
    if (newPos > totalCells.value) {
      gameOver.value = true
      winner.value = currentPlayer.value
      return
    }

    // Show task
    if (newPos > 0 && newPos <= totalCells.value) {
      waitingTask.value = true
      showTask.value = true
    } else {
      switchPlayer()
    }
  }

  function completeTask() {
    if (!currentTask.value) return

    // Record task completion
    if (session.value) {
      session.value.tasks.push({
        playerId: currentPlayer.value,
        cellIndex: currentPlayer.value === 1 ? pos1.value : pos2.value,
        task: currentTask.value.task,
        completed: true,
        timestamp: new Date()
      })
    }

    waitingTask.value = false
    showTask.value = false
    switchPlayer()
  }

  function switchPlayer() {
    currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
    lastRoll.value = null
  }

  function resetGame() {
    gameStarted.value = false
    session.value = null
    pos1.value = 0
    pos2.value = 0
    currentPlayer.value = 1
    lastRoll.value = null
    waitingTask.value = false
    showTask.value = false
    gameOver.value = false
    winner.value = null
  }

  function getPlayerPos(player: number): number {
    return player === 1 ? pos1.value : pos2.value
  }

  return {
    // State
    selectedThemeId,
    selectedModeId,
    gameStarted,
    rolling,
    lastRoll,
    waitingTask,
    showTask,
    gameOver,
    winner,
    currentPlayer,
    pos1,
    pos2,

    // Computed
    themes,
    modes,
    board,
    currentCells,
    totalCells,
    currentTask,

    // Actions
    selectTheme,
    selectMode,
    startGame,
    rollDice,
    completeTask,
    resetGame,
    getPlayerPos
  }
}
