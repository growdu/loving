<template>
  <div class="fxq-game">
    <!-- 顶部标题 -->
    <div class="game-title">
      <span class="title-icon">🎮</span>
      <span>飞行棋</span>
    </div>

    <!-- 第一步：选择主题 -->
    <div v-if="!currentTheme" class="step-section">
      <div class="step-header">
        <span class="step-badge">1</span>
        <span class="step-label">选择主题</span>
      </div>
      <div class="theme-grid">
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="theme-btn"
          :class="{ active: currentTheme === theme.id }"
        >
          <span class="theme-emoji">{{ theme.icon }}</span>
          <span class="theme-text">{{ theme.name }}</span>
        </button>
      </div>
    </div>

    <!-- 第二步：选择模式 -->
    <div v-if="currentTheme && !currentMode" class="step-section">
      <div class="step-header">
        <span class="step-badge">2</span>
        <span class="step-label">选择模式</span>
      </div>
      <div class="mode-grid">
        <button
          v-for="mode in modes"
          :key="mode.id"
          @click="selectMode(mode.id)"
          class="mode-btn"
          :class="{ active: currentMode === mode.id }"
        >
          <span class="mode-emoji">{{ mode.icon }}</span>
          <span class="mode-text">{{ mode.name }}</span>
        </button>
      </div>
    </div>

    <!-- 第三步：开始游戏 -->
    <div v-if="currentTheme && currentMode && !gameStarted" class="step-section">
      <button @click="startGame" class="start-btn">
        🎮 开始游戏
      </button>
    </div>

    <!-- 游戏区域 -->
    <div v-if="gameStarted" class="game-area">
      <!-- 当前玩家指示器 -->
      <div class="current-player" :class="'player-' + currentPlayer">
        <span class="player-icon">{{ currentPlayer === 1 ? '👨' : '👩' }}</span>
        <span class="player-name">{{ currentPlayer === 1 ? '男方' : '女方' }}</span>
        <span class="turn-hint">的回合</span>
      </div>

      <!-- 骰子显示 -->
      <div class="dice-container">
        <transition name="dice-pop">
          <div v-if="lastRoll" class="dice-result" :class="'dice-' + lastRoll">
            <div class="dice-body">
              <span v-for="n in lastRoll" :key="n" class="dice-dot"></span>
            </div>
          </div>
        </transition>
      </div>

      <!-- 棋盘 -->
      <div class="board-container">
        <div class="board">
          <!-- 格子 -->
          <div
            v-for="(cell, index) in currentCells"
            :key="index"
            class="cell"
            :class="{
              active: getPlayerPos(1) === index + 1,
              player1: getPlayerPos(1) === index + 1,
              player2: getPlayerPos(2) === index + 1,
              both: getPlayerPos(1) === index + 1 && getPlayerPos(2) === index + 1,
              vip: cell.vipOnly
            }"
          >
            <span class="cell-num">{{ index + 1 }}</span>
            <span v-if="cell.vipOnly" class="vip-flag">🔥</span>
          </div>

          <!-- 起点 -->
          <div class="special-cell start">
            <span class="special-icon">🏁</span>
            <span class="special-label">起点</span>
          </div>

          <!-- 终点 -->
          <div class="special-cell end">
            <span class="special-icon">🏆</span>
            <span class="special-label">终点</span>
          </div>

          <!-- 玩家1棋子 -->
          <div
            v-if="getPlayerPos(1) > 0"
            class="piece piece1"
            :style="getPieceStyle(1)"
          >
            <span class="piece-icon">👨</span>
          </div>

          <!-- 玩家2棋子 -->
          <div
            v-if="getPlayerPos(2) > 0"
            class="piece piece2"
            :style="getPieceStyle(2)"
          >
            <span class="piece-icon">👩</span>
          </div>
        </div>
      </div>

      <!-- 任务卡片 -->
      <transition name="task-slide">
        <div v-if="currentTask && showTask" class="task-panel">
          <div class="task-icon" v-html="currentTask.icon"></div>
          <p class="task-desc">{{ currentTask.text }}</p>
          <span v-if="currentTask.vipOnly" class="task-vip">私密任务</span>
        </div>
      </transition>

      <!-- 当前状态 -->
      <div class="status-bar">
        <div class="player-score" :class="{ active: currentPlayer === 1 }">
          <span class="score-icon">👨</span>
          <span class="score-label">男方</span>
          <span class="score-pos">{{ getPlayerPos(1) === 0 ? '起点' : '第' + getPlayerPos(1) + '格' }}</span>
        </div>
        <div class="vs-badge">VS</div>
        <div class="player-score" :class="{ active: currentPlayer === 2 }">
          <span class="score-icon">👩</span>
          <span class="score-label">女方</span>
          <span class="score-pos">{{ getPlayerPos(2) === 0 ? '起点' : '第' + getPlayerPos(2) + '格' }}</span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-area">
        <button
          v-if="waitingTask"
          @click="completeTask"
          class="control-btn complete"
        >
          ✅ 完成
        </button>
        <button
          v-else-if="!gameOver"
          @click="rollDice"
          :disabled="rolling"
          class="control-btn roll"
        >
          {{ rolling ? '🎲 投掷中...' : '🎲 投骰子' }}
        </button>

        <!-- 游戏结束 -->
        <div v-if="gameOver" class="game-over">
          <span class="winner-icon">🎉</span>
          <span class="winner-name">{{ winner === 1 ? '男方' : '女方' }}获胜!</span>
          <button @click="resetGame" class="restart-btn">🔄 再来一局</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const totalCells = 16

// 主题
const themes = [
  { id: 'heart', name: '甜蜜', icon: '💕' },
  { id: 'moon', name: '浪漫', icon: '🌙' },
  { id: 'fire', name: '热情', icon: '🔥' },
  { id: 'star', name: '星光', icon: '⭐' }
]

// 模式
const modes = [
  { id: 'normal', name: '普通', icon: '💫' },
  { id: 'love', name: '恋爱', icon: '💑' },
  { id: 'hot', name: '热恋', icon: '🔥' },
  { id: 'cohabit', name: '同居', icon: '🏠' },
  { id: 'married', name: '夫妻', icon: '💍' }
]

// SVG图标
const icons = {
  heart: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e74c3c"/></svg>',
  fire: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="#ff9f43"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#feca57"/></svg>',
  lips: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2C8 2 4.5 5.5 4.5 9c0 1.5.5 3 1.5 4l-1 5.5h3l.8-2.5c.6.8 1.5 1.5 2.5 1.5h1.4c1 0 1.9-.7 2.5-1.5L15.2 18.5h3l-1-5.5c1-1 1.5-2.5 1.5-4C19.5 5.5 16 2 12 2z" fill="#ff6b8a"/></svg>',
  hug: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M2 22h20v-2H2v2zm2-4h16v-2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2zm11-8c0-2.5-2-4.5-4.5-4.5S6 7.5 6 10c0 1.5.7 2.8 1.8 3.6L7 22h2l.5-2c.5.2 1 .3 1.5.3h2c.5 0 1-.1 1.5-.3L14 22h2l-.8-8.4c1.1-.8 1.8-2.1 1.8-3.6z" fill="#a55eea"/></svg>',
  kiss: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2C9 2 6.5 5 6.5 8.5c0 1.2.3 2.3.8 3.2L6 18h3l1-3c.8.5 1.8.8 2.8.8h1.4c1 0 2-.3 2.8-.8l1 3h3l-1.3-6.3c.5-.9.8-2 .8-3.2C17.5 5 15 2 12 2z" fill="#ff6b8a"/></svg>',
  ring: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="6" fill="none" stroke="#e74c3c" stroke-width="2.5"/><circle cx="12" cy="6" r="2.5" fill="#e74c3c"/></svg>',
  rose: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 2c-1.5 0-3 1-3.5 2.5C8 3.5 7 4.5 7 6c0 .5.2 1 .5 1.5-.5-.2-1.2-.3-1.5-.3-.5 0-1 .2-1.3.6-.3.4-.3.9-.1 1.4.2.5.7.9 1.2 1.1L5 12l-1 3c-.1.3 0 .6.2.9.2.2.5.3.8.3h.5l.8-2.5c.6.9 1.6 1.5 2.7 1.8l.5 2.5h.8l.5-2.5c1.1-.3 2.1-.9 2.7-1.8l.8 2.5h.5c.3 0 .6-.1.8-.3.2-.2.3-.6.2-.9L17 12l-1.2-3c.5-.2 1-.6 1.2-1.1.2-.5.2-1-.1-1.4-.3-.4-.8-.6-1.3-.6-.3 0-1 .1-1.5.3.3-.5.5-1 .5-1.5 0-1.5-1-2.5-2.5-3-.5-1.5-2-2.5-3.5-2.5z" fill="#e74c3c"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.5a6 6 0 0 1-4.4 4.4c-.5-.1-1-.1-1.5-.1a9 9 0 0 1-3-12z" fill="#a55eea"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="5" fill="#feca57"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#feca57" stroke-width="2" stroke-linecap="round"/></svg>'
}

// 模式任务
const modeCells = {
  normal: [
    { name: '牵手', icon: icons.heart, text: '牵手漫步1分钟', vipOnly: false },
    { name: '对视', icon: icons.heart, text: '深情对视10秒', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '给对方一个拥抱', vipOnly: false },
    { name: '情话', icon: icons.star, text: '说一句情话', vipOnly: false },
    { name: '亲吻', icon: icons.lips, text: '亲吻对方脸颊', vipOnly: false },
    { name: '撒娇', icon: icons.star, text: '对对方撒娇一次', vipOnly: false },
    { name: '按摩', icon: icons.fire, text: '给对方按摩手部', vipOnly: false },
    { name: '跳舞', icon: icons.star, text: '和对方跳一支舞', vipOnly: false },
    { name: '情书', icon: icons.star, text: '说一句土味情话', vipOnly: false },
    { name: '对视', icon: icons.heart, text: '对视看谁先笑', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '拥抱10秒不松手', vipOnly: false },
    { name: '亲吻', icon: icons.lips, text: '亲吻对方额头', vipOnly: false },
    { name: '撒娇', icon: icons.star, text: '让对方脸红一次', vipOnly: true },
    { name: '情话', icon: icons.heart, text: '说出三个喜欢对方的地方', vipOnly: true },
    { name: '按摩', icon: icons.fire, text: '给对方按摩肩膀2分钟', vipOnly: true },
    { name: '表白', icon: icons.rose, text: '说一句"我爱你"', vipOnly: false }
  ],
  love: [
    { name: '牵手', icon: icons.heart, text: '十指紧扣1分钟', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '轻轻亲吻3秒', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '从背后拥抱对方', vipOnly: false },
    { name: '情话', icon: icons.heart, text: '说一句让对方心动的话', vipOnly: false },
    { name: '对视', icon: icons.heart, text: '眼对眼说"我爱你"', vipOnly: false },
    { name: '抚摸', icon: icons.fire, text: '轻轻抚摸对方的脸', vipOnly: false },
    { name: '依偎', icon: icons.hug, text: '依偎在对方怀里', vipOnly: false },
    { name: '撒娇', icon: icons.star, text: '对对方撒娇一次', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '亲吻对方鼻尖', vipOnly: true },
    { name: '牵手', icon: icons.heart, text: '手牵手走10步', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '公主抱30秒', vipOnly: true },
    { name: '情话', icon: icons.heart, text: '说出最喜欢对方的瞬间', vipOnly: true },
    { name: '抚摸', icon: icons.fire, text: '按摩对方太阳穴1分钟', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '法式亲吻5秒', vipOnly: true },
    { name: '心跳', icon: icons.heart, text: '把头靠在对方心口听心跳', vipOnly: false },
    { name: '永远', icon: icons.rose, text: '一起说"永远在一起"', vipOnly: false }
  ],
  hot: [
    { name: '热吻', icon: icons.fire, text: '激吻10秒', vipOnly: false },
    { name: '挑逗', icon: icons.fire, text: '轻轻咬对方耳朵', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '用力拥抱对方', vipOnly: false },
    { name: '亲吻', icon: icons.lips, text: '亲吻对方脖子', vipOnly: true },
    { name: '抚摸', icon: icons.fire, text: '慢慢抚摸对方的手臂', vipOnly: false },
    { name: '情趣', icon: icons.lips, text: '说一句情欲的话', vipOnly: true },
    { name: '拥抱', icon: icons.hug, text: '贴面拥抱30秒', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '亲吻对方锁骨', vipOnly: true },
    { name: '情趣', icon: icons.fire, text: '模仿一个亲密动作', vipOnly: false },
    { name: '抚摸', icon: icons.fire, text: '给对方捶背2分钟', vipOnly: false },
    { name: '热吻', icon: icons.lips, text: '轻轻咬对方下唇', vipOnly: true },
    { name: '拥抱', icon: icons.hug, text: '拥抱并轻声说情话', vipOnly: false },
    { name: '情趣', icon: icons.star, text: '做一个亲密的小动作', vipOnly: true },
    { name: '亲吻', icon: icons.kiss, text: '深情舌吻10秒', vipOnly: true },
    { name: '抚摸', icon: icons.fire, text: '抚摸对方的脸颊', vipOnly: false },
    { name: '永远', icon: icons.rose, text: '说出对方的三个优点', vipOnly: false }
  ],
  cohabit: [
    { name: '早餐', icon: icons.sun, text: '为对方准备早餐', vipOnly: false },
    { name: '打扫', icon: icons.star, text: '一起打扫房间', vipOnly: false },
    { name: '烹饪', icon: icons.fire, text: '一起做一顿晚餐', vipOnly: false },
    { name: '电影', icon: icons.star, text: '依偎在一起看电影', vipOnly: false },
    { name: '散步', icon: icons.heart, text: '牵手散步30分钟', vipOnly: false },
    { name: '按摩', icon: icons.fire, text: '给对方按摩10分钟', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '出门前亲吻告别', vipOnly: false },
    { name: '撒娇', icon: icons.star, text: '对对方撒娇一次', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '回家后拥抱5分钟', vipOnly: false },
    { name: '情话', icon: icons.heart, text: '睡前说晚安情话', vipOnly: false },
    { name: '按摩', icon: icons.fire, text: '给对方洗脚按摩', vipOnly: true },
    { name: '烹饪', icon: icons.sun, text: '为对方做最爱吃的菜', vipOnly: true },
    { name: '惊喜', icon: icons.star, text: '准备一个小惊喜', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '拥抱说"我爱你"', vipOnly: false },
    { name: '永远', icon: icons.ring, text: '一起计划未来', vipOnly: true },
    { name: '幸福', icon: icons.rose, text: '一起说"我们很幸福"', vipOnly: false }
  ],
  married: [
    { name: '亲密', icon: icons.ring, text: '亲吻并叫对方宝贝', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '给对方一个深情的拥抱', vipOnly: false },
    { name: '回忆', icon: icons.heart, text: '回忆第一次见面的场景', vipOnly: false },
    { name: '亲吻', icon: icons.lips, text: '亲吻对方额头', vipOnly: false },
    { name: '感激', icon: icons.star, text: '说出感谢对方的一件事', vipOnly: false },
    { name: '情趣', icon: icons.fire, text: '说一句甜蜜的情话', vipOnly: true },
    { name: '拥抱', icon: icons.hug, text: '从背后环抱对方', vipOnly: false },
    { name: '亲吻', icon: icons.kiss, text: '亲吻对方手背', vipOnly: false },
    { name: '情趣', icon: icons.fire, text: '为对方按摩头部3分钟', vipOnly: true },
    { name: '亲密', icon: icons.ring, text: '凝视对方1分钟', vipOnly: false },
    { name: '拥抱', icon: icons.hug, text: '拥抱并说"我爱你"', vipOnly: false },
    { name: '亲密', icon: icons.rose, text: '送上一个飞吻', vipOnly: false },
    { name: '情趣', icon: icons.fire, text: '一起回忆蜜月时光', vipOnly: true },
    { name: '亲吻', icon: icons.kiss, text: '法式亲吻8秒', vipOnly: true },
    { name: '感激', icon: icons.star, text: '说出对方最让你感动的事', vipOnly: false },
    { name: '永远', icon: icons.ring, text: '一起说"永远在一起"', vipOnly: false }
  ]
}

// 状态
const currentTheme = ref('')
const currentMode = ref('')
const gameStarted = ref(false)
const pos1 = ref(0)
const pos2 = ref(0)
const currentPlayer = ref(1)
const rolling = ref(false)
const lastRoll = ref<number | null>(null)
const waitingTask = ref(false)
const showTask = ref(false)
const gameOver = ref(false)
const winner = ref<number | null>(null)

const currentCells = computed(() => {
  const mode = currentMode.value as keyof typeof modeCells
  return modeCells[mode] || modeCells.normal
})

const currentTask = computed(() => {
  const pos = currentPlayer.value === 1 ? pos1.value : pos2.value
  if (pos > 0 && pos <= totalCells) {
    return currentCells.value[pos - 1]
  }
  return null
})

function getPlayerPos(player: number) {
  return player === 1 ? pos1.value : pos2.value
}

function getPieceStyle(player: number) {
  const pos = player === 1 ? pos1.value : pos2.value
  if (pos <= 0) return { display: 'none' }
  const row = Math.floor((pos - 1) / 4)
  const col = (pos - 1) % 4
  const offset = player === 1 ? '5px' : '35px'
  return {
    top: `${15 + row * 72}px`,
    left: `${15 + col * 72 + (player === 2 ? 20 : 0)}px`
  }
}

function selectTheme(themeId: string) {
  currentTheme.value = themeId
  currentMode.value = ''
}

function selectMode(modeId: string) {
  currentMode.value = modeId
}

function startGame() {
  gameStarted.value = true
  pos1.value = 0
  pos2.value = 0
  currentPlayer.value = 1
}

function rollDice() {
  if (waitingTask.value) return

  rolling.value = true
  lastRoll.value = null

  let count = 0
  const interval = setInterval(() => {
    lastRoll.value = Math.floor(Math.random() * 6) + 1
    count++
    if (count > 10) {
      clearInterval(interval)
      finishRoll()
    }
  }, 80)
}

function finishRoll() {
  rolling.value = false
  const roll = lastRoll.value!

  if (currentPlayer.value === 1) {
    pos1.value = Math.min(pos1.value + roll, totalCells + 1)
  } else {
    pos2.value = Math.min(pos2.value + roll, totalCells + 1)
  }

  const pos = currentPlayer.value === 1 ? pos1.value : pos2.value

  if (pos >= totalCells + 1) {
    gameOver.value = true
    winner.value = currentPlayer.value
  } else if (pos > 0) {
    waitingTask.value = true
    showTask.value = true
  } else {
    switchPlayer()
  }
}

function completeTask() {
  waitingTask.value = false
  showTask.value = false
  switchPlayer()
}

function switchPlayer() {
  currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
}

function resetGame() {
  pos1.value = 0
  pos2.value = 0
  currentPlayer.value = 1
  rolling.value = false
  lastRoll.value = null
  waitingTask.value = false
  showTask.value = false
  gameOver.value = false
  winner.value = null
}

defineExpose({ completeTask, isWaitingTask })
function isWaitingTask() {
  return waitingTask.value
}
</script>

<style scoped>
.fxq-game {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.title-icon {
  font-size: 2rem;
}

.step-section {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.step-badge {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-weight: bold;
  font-size: 0.9rem;
}

.step-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.theme-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.theme-btn.active {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
}

.theme-emoji {
  font-size: 2.5rem;
}

.theme-text {
  font-size: 1rem;
  font-weight: 600;
}

.mode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-btn:hover {
  transform: scale(1.05);
}

.mode-btn.active {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
}

.mode-emoji {
  font-size: 1.3rem;
}

.mode-text {
  font-size: 0.95rem;
  font-weight: 600;
}

.start-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
}

.start-btn:hover {
  transform: scale(1.02);
}

.game-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.current-player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255,255,255,0.95);
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.current-player.player-1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.current-player.player-2 {
  background: linear-gradient(135deg, #e91e63, #c2185b);
  color: white;
}

.player-icon {
  font-size: 1.8rem;
}

.player-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.turn-hint {
  font-size: 0.9rem;
  opacity: 0.9;
}

.dice-container {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice-result {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice-body {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  box-shadow: 0 6px 25px rgba(0,0,0,0.2);
}

.dice-dot {
  width: 12px;
  height: 12px;
  background: #e74c3c;
  border-radius: 50%;
  align-self: center;
  justify-self: center;
}

.dice-1 .dice-dot:nth-child(1) { grid-area: 2 / 2; }
.dice-2 .dice-dot:nth-child(1) { grid-area: 1 / 1; }
.dice-2 .dice-dot:nth-child(2) { grid-area: 3 / 3; }
.dice-3 .dice-dot:nth-child(1) { grid-area: 1 / 1; }
.dice-3 .dice-dot:nth-child(2) { grid-area: 2 / 2; }
.dice-3 .dice-dot:nth-child(3) { grid-area: 3 / 3; }
.dice-4 .dice-dot:nth-child(1) { grid-area: 1 / 1; }
.dice-4 .dice-dot:nth-child(2) { grid-area: 1 / 3; }
.dice-4 .dice-dot:nth-child(3) { grid-area: 3 / 1; }
.dice-4 .dice-dot:nth-child(4) { grid-area: 3 / 3; }
.dice-5 .dice-dot:nth-child(1) { grid-area: 1 / 1; }
.dice-5 .dice-dot:nth-child(2) { grid-area: 1 / 3; }
.dice-5 .dice-dot:nth-child(3) { grid-area: 2 / 2; }
.dice-5 .dice-dot:nth-child(4) { grid-area: 3 / 1; }
.dice-5 .dice-dot:nth-child(5) { grid-area: 3 / 3; }
.dice-6 .dice-dot:nth-child(1) { grid-area: 1 / 1; }
.dice-6 .dice-dot:nth-child(2) { grid-area: 1 / 3; }
.dice-6 .dice-dot:nth-child(3) { grid-area: 2 / 1; }
.dice-6 .dice-dot:nth-child(4) { grid-area: 2 / 3; }
.dice-6 .dice-dot:nth-child(5) { grid-area: 3 / 1; }
.dice-6 .dice-dot:nth-child(6) { grid-area: 3 / 3; }

.dice-pop-enter-active {
  animation: dice-pop 0.4s ease;
}

@keyframes dice-pop {
  0% { transform: scale(0) rotate(-180deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.board-container {
  padding: 15px;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.board {
  width: 320px;
  height: 320px;
  background: linear-gradient(135deg, #fff5f5, #fff0f5);
  border-radius: 16px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 4px;
  padding: 8px;
}

.cell {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.cell-num {
  font-size: 0.8rem;
  font-weight: bold;
  color: #666;
}

.cell.player1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.cell.player1 .cell-num {
  color: white;
}

.cell.player2 {
  background: linear-gradient(135deg, #e91e63, #c2185b);
}

.cell.player2 .cell-num {
  color: white;
}

.cell.both {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.cell.both .cell-num {
  color: white;
}

.cell.vip {
  border: 2px solid #ff6b6b;
}

.vip-flag {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.6rem;
}

.special-cell {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.special-cell.start {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.special-cell.end {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.special-icon {
  font-size: 1.3rem;
}

.special-label {
  font-size: 0.6rem;
  font-weight: bold;
}

.piece {
  position: absolute;
  z-index: 10;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.piece1 {
  z-index: 15;
}

.piece2 {
  z-index: 11;
}

.piece-icon {
  font-size: 1.8rem;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.task-panel {
  background: white;
  border-radius: 20px;
  padding: 20px 30px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  max-width: 300px;
}

.task-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
}

.task-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.task-desc {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.task-vip {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ff6b6b, #ee2952);
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.task-slide-enter-active,
.task-slide-leave-active {
  transition: all 0.3s ease;
}

.task-slide-enter-from,
.task-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 25px;
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  border-radius: 15px;
  transition: all 0.3s;
}

.player-score.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.score-icon {
  font-size: 1.5rem;
}

.score-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.score-pos {
  font-size: 0.8rem;
  opacity: 0.8;
}

.vs-badge {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.control-btn {
  padding: 16px 50px;
  border: none;
  border-radius: 35px;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.control-btn.roll {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
}

.control-btn.roll:hover:not(:disabled) {
  transform: scale(1.05);
}

.control-btn.roll:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-btn.complete {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  animation: pulse-btn 1.5s infinite;
}

@keyframes pulse-btn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.control-btn.complete:hover {
  transform: scale(1.05);
}

.game-over {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 25px 40px;
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  border-radius: 20px;
  animation: celebrate 0.5s ease;
}

@keyframes celebrate {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.winner-icon {
  font-size: 3rem;
}

.winner-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
}

.restart-btn {
  padding: 12px 30px;
  background: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: #f39c12;
}
</style>