<template>
  <div class="fxq-game">
    <!-- 版本选择 -->
    <div class="version-tabs">
      <button
        v-for="ver in versions"
        :key="ver.id"
        @click="selectVersion(ver.id)"
        class="version-tab"
        :class="{ active: currentVersion === ver.id }"
      >
        <span class="ver-icon">{{ ver.icon }}</span>
        <span class="ver-name">{{ ver.name }}</span>
      </button>
    </div>

    <div class="board-wrapper">
      <div class="board">
        <!-- 棋盘格子 -->
        <div
          v-for="(cell, index) in currentCells"
          :key="index"
          class="cell"
          :class="{
            active: currentPos === index + 1,
            player1: pos1 === index + 1,
            player2: pos2 === index + 1,
            vip: cell.vipOnly
          }"
        >
          <div class="cell-icon" v-html="cell.icon"></div>
          <span class="cell-label">{{ cell.name }}</span>
          <span v-if="cell.vipOnly" class="vip-tag">🔥</span>
        </div>

        <!-- 起点 -->
        <div class="cell start-cell">
          <svg viewBox="0 0 24 24" class="cell-icon-svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e74c3c"/></svg>
          <span class="cell-label">起点</span>
        </div>

        <!-- 终点 -->
        <div class="cell end-cell">
          <svg viewBox="0 0 24 24" class="cell-icon-svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#f1c40f"/></svg>
          <span class="cell-label">终点</span>
        </div>

        <!-- 玩家棋子 -->
        <div class="piece piece1" :style="piece1Style">
          <div class="avatar avatar1">👨</div>
        </div>
        <div class="piece piece2" :style="piece2Style">
          <div class="avatar avatar2">👩</div>
        </div>
      </div>
    </div>

    <!-- 当前任务 -->
    <transition name="slide">
      <div v-if="currentTask && showTask" class="task-card" :class="{ highlight: showTask }">
        <div class="task-icon" v-html="currentTask.icon"></div>
        <p class="task-text">{{ currentTask.text }}</p>
        <span v-if="currentTask.vipOnly" class="task-vip">🔥 私密任务</span>
      </div>
    </transition>

    <!-- 控制面板 -->
    <div class="controls">
      <div class="player-info">
        <div class="player player1" :class="{ active: currentPlayer === 1 }">
          <div class="player-avatar">👨</div>
          <span>男神</span>
          <span class="player-pos">第{{ pos1 }}格</span>
        </div>
        <div class="vs">VS</div>
        <div class="player player2" :class="{ active: currentPlayer === 2 }">
          <div class="player-avatar">👩</div>
          <span>女神</span>
          <span class="player-pos">第{{ pos2 }}格</span>
        </div>
      </div>

      <div class="dice-area">
        <transition name="bounce">
          <div v-if="lastRoll" class="dice-display">
            <div class="dice">
              <div class="dice-face dice-{{ lastRoll }}">
                <span v-for="n in lastRoll" :key="n" class="dice-dot"></span>
              </div>
            </div>
            <span class="dice-text">🎲 {{ lastRoll }} 点</span>
          </div>
        </transition>
        <button
          @click="rollDice"
          :disabled="rolling || gameOver || waitingTask"
          class="roll-btn"
        >
          {{ rolling ? '🎲 投掷中...' : waitingTask ? '✅ 完成任务' : '🎲 投掷骰子' }}
        </button>
      </div>

      <transition name="fade">
        <div v-if="gameOver" class="winner">
          <div class="winner-icon">🏆</div>
          <div class="winner-text">玩家{{ winner }}获胜!</div>
          <button @click="resetGame" class="restart-btn">🔄 再来一局</button>
        </div>
      </transition>
    </div>

    <!-- 游戏说明 -->
    <div class="game-info">
      <p v-if="waitingTask" class="hint">🎯 请完成上方任务后点击"完成任务"继续</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const totalCells = 16

// SVG图标库 - 浪漫精美风格
const icons = {
  heart: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ee5a5a"/></linearGradient></defs><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)"/></svg>',
  fire: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="fireGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#ff9f43"/><stop offset="100%" style="stop-color:#ee5a24"/></linearGradient></defs><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="url(#fireGrad)"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#feca57"/><stop offset="100%" style="stop-color:#ff9f43"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGrad)"/></svg>',
  lips: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="lipsGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b8a"/><stop offset="100%" style="stop-color:#ee2952"/></linearGradient></defs><path d="M12 2C8 2 4.5 5.5 4.5 9c0 1.5.5 3 1.5 4l-1 5.5h3l.8-2.5c.6.8 1.5 1.5 2.5 1.5h1.4c1 0 1.9-.7 2.5-1.5L15.2 18.5h3l-1-5.5c1-1 1.5-2.5 1.5-4C19.5 5.5 16 2 12 2zm0 2c1.4 0 2.5 1.1 2.5 2.5S13.4 9 12 9s-2.5-1.1-2.5-2.5S10.6 4 12 4z" fill="url(#lipsGrad)"/></svg>',
  hug: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="hugGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#a55eea"/><stop offset="100%" style="stop-color:#8854d0"/></linearGradient></defs><path d="M2 22h20v-2H2v2zm2-4h16v-2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2zm11-8c0-2.5-2-4.5-4.5-4.5S6 7.5 6 10c0 1.5.7 2.8 1.8 3.6L7 22h2l.5-2c.5.2 1 .3 1.5.3h2c.5 0 1-.1 1.5-.3L14 22h2l-.8-8.4c1.1-.8 1.8-2.1 1.8-3.6z" fill="url(#hugGrad)"/></svg>',
  kiss: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="kissGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b8a"/><stop offset="100%" style="stop-color:#ee2952"/></linearGradient></defs><path d="M12 2C9 2 6.5 5 6.5 8.5c0 1.2.3 2.3.8 3.2L6 18h3l1-3c.8.5 1.8.8 2.8.8h1.4c1 0 2-.3 2.8-.8l1 3h3l-1.3-6.3c.5-.9.8-2 .8-3.2C17.5 5 15 2 12 2z" fill="url(#kissGrad)"/></svg>',
  ring: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ee5a5a"/></linearGradient></defs><circle cx="12" cy="12" r="6" fill="none" stroke="url(#ringGrad)" stroke-width="2.5"/><circle cx="12" cy="6" r="2.5" fill="url(#ringGrad)"/></svg>',
  rose: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ee5a5a"/></linearGradient></defs><path d="M12 2c-1.5 0-3 1-3.5 2.5C8 3.5 7 4.5 7 6c0 .5.2 1 .5 1.5-.5-.2-1.2-.3-1.5-.3-.5 0-1 .2-1.3.6-.3.4-.3.9-.1 1.4.2.5.7.9 1.2 1.1L5 12l-1 3c-.1.3 0 .6.2.9.2.2.5.3.8.3h.5l.8-2.5c.6.9 1.6 1.5 2.7 1.8l.5 2.5h.8l.5-2.5c1.1-.3 2.1-.9 2.7-1.8l.8 2.5h.5c.3 0 .6-.1.8-.3.2-.2.3-.6.2-.9L17 12l-1.2-3c.5-.2 1-.6 1.2-1.1.2-.5.2-1-.1-1.4-.3-.4-.8-.6-1.3-.6-.3 0-1 .1-1.5.3.3-.5.5-1 .5-1.5 0-1.5-1-2.5-2.5-3-.5-1.5-2-2.5-3.5-2.5z" fill="url(#roseGrad)"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#a55eea"/><stop offset="100%" style="stop-color:#8854d0"/></linearGradient></defs><path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.5a6 6 0 0 1-4.4 4.4c-.5-.1-1-.1-1.5-.1a9 9 0 0 1-3-12z" fill="url(#moonGrad)"/></svg>',
  couple: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="coupleGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff6b6b"/><stop offset="100%" style="stop-color:#ff9ff3"/></linearGradient></defs><circle cx="8" cy="9" r="2.5" fill="url(#coupleGrad)"/><circle cx="16" cy="9" r="2.5" fill="url(#coupleGrad)"/><path d="M12 12c-2 0-3.5 1-3.5 2.5v1.5h7v-1.5c0-1.5-1.5-2.5-3.5-2.5z" fill="url(#coupleGrad)"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="100%" height="100%"><defs><linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#feca57"/><stop offset="100%" style="stop-color:#ff9f43"/></linearGradient></defs><circle cx="12" cy="12" r="5" fill="url(#sunGrad)"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="url(#sunGrad)" stroke-width="2.5" stroke-linecap="round"/></svg>'
}

const versions = [
  { id: 'normal', name: '普通版', icon: '💫' },
  { id: 'couple', name: '情侣版', icon: '💑' },
  { id: 'hot', name: '热恋版', icon: '🔥' },
  { id: 'married', name: '夫妻版', icon: '💍' }
]

// 各版本任务数据
const versionCells = {
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
  couple: [
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

const currentVersion = ref('couple')
const pos1 = ref(0)
const pos2 = ref(0)
const currentPlayer = ref(1)
const rolling = ref(false)
const lastRoll = ref<number | null>(null)
const waitingTask = ref(false)
const showTask = ref(false)
const gameOver = ref(false)
const winner = ref<number | null>(null)

const currentCells = computed(() => versionCells[currentVersion.value as keyof typeof versionCells] || versionCells.couple)

const currentTask = computed(() => {
  if (currentPlayer.value === 1) {
    const idx = pos1.value
    if (idx > 0 && idx <= totalCells) return currentCells.value[idx - 1]
  } else {
    const idx = pos2.value
    if (idx > 0 && idx <= totalCells) return currentCells.value[idx - 1]
  }
  return null
})

const piece1Style = computed(() => {
  const row = Math.floor(pos1.value / 4)
  const col = pos1.value % 4
  return { top: `${15 + row * 72}px`, left: `${15 + col * 72}px` }
})

const piece2Style = computed(() => {
  const row = Math.floor(pos2.value / 4)
  const col = pos2.value % 4
  return { top: `${45 + row * 72}px`, left: `${45 + col * 72}px` }
})

function selectVersion(id: string) {
  currentVersion.value = id
  resetGame()
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
    if (pos1.value >= totalCells + 1) {
      gameOver.value = true
      winner.value = 1
    } else if (pos1.value > 0) {
      waitingTask.value = true
      showTask.value = true
    }
  } else {
    pos2.value = Math.min(pos2.value + roll, totalCells + 1)
    if (pos2.value >= totalCells + 1) {
      gameOver.value = true
      winner.value = 2
    } else if (pos2.value > 0) {
      waitingTask.value = true
      showTask.value = true
    }
  }
}

function completeTask() {
  waitingTask.value = false
  showTask.value = false
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

function isWaitingTask() {
  return waitingTask.value
}

defineExpose({ completeTask, isWaitingTask })
</script>

<style scoped>
.fxq-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  color: var(--text);
  max-width: 500px;
  margin: 0 auto;
}

.version-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.version-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  background: var(--card-bg);
  border: 2px solid var(--card-border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.version-tab:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.version-tab.active {
  border-color: #e74c3c;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(255, 107, 107, 0.1));
}

.ver-icon {
  font-size: 2rem;
  margin-bottom: 4px;
}

.ver-name {
  font-size: 0.9rem;
  color: var(--text);
  font-weight: 600;
}

.board-wrapper {
  padding: 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffecd2 100%);
  border-radius: 24px;
  box-shadow: 0 15px 50px rgba(233, 84, 131, 0.3);
  margin-bottom: 20px;
}

.board {
  width: 320px;
  height: 320px;
  background: linear-gradient(135deg, #fff5f5, #fff0f5);
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 4px;
  padding: 8px;
}

.cell {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cell:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.cell.active {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(231, 76, 60, 0.6);
}

.cell.player1 {
  background: linear-gradient(135deg, #3498db, #5dade2);
  color: white;
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
}

.cell.player2 {
  background: linear-gradient(135deg, #9b59b6, #bb8fce);
  color: white;
  box-shadow: 0 0 20px rgba(155, 89, 182, 0.5);
}

.cell.vip {
  border: 2px solid #ff6b6b;
}

.cell-icon {
  width: 28px;
  height: 28px;
}

.cell-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.cell-label {
  font-size: 0.65rem;
  margin-top: 3px;
  font-weight: 500;
  color: inherit;
}

.vip-tag {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 0.6rem;
}

.start-cell, .end-cell {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
}

.start-cell {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.end-cell {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
}

.cell-icon-svg {
  width: 28px;
  height: 28px;
}

.piece {
  position: absolute;
  z-index: 20;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  border: 3px solid white;
}

.avatar1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.avatar2 {
  background: linear-gradient(135deg, #e91e63, #c2185b);
}

.task-card {
  background: linear-gradient(135deg, #fff, #fff5f7);
  border-radius: 24px;
  padding: 24px 36px;
  text-align: center;
  box-shadow: 0 12px 45px rgba(233, 84, 131, 0.35);
  margin-bottom: 20px;
  border: 3px solid transparent;
  min-width: 300px;
}

.task-card.highlight {
  border-color: #e74c3c;
  animation: glow 1.5s infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 12px 45px rgba(233, 84, 131, 0.35); }
  50% { box-shadow: 0 12px 60px rgba(233, 84, 131, 0.6); }
}

.task-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 14px;
}

.task-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.task-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px;
}

.task-vip {
  display: inline-block;
  padding: 6px 18px;
  background: linear-gradient(135deg, #ff6b6b, #ee2952);
  color: white;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 24px;
  background: var(--card-bg);
  border-radius: 20px;
  border: 2px solid var(--card-border);
  transition: all 0.3s;
}

.player.active {
  border-color: #e74c3c;
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.2);
}

.player-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 3px solid transparent;
}

.player1 .player-avatar {
  border-color: #3498db;
}

.player2 .player-avatar {
  border-color: #e91e63;
}

.player.active .player-avatar {
  animation: pulse-avatar 1s infinite;
}

@keyframes pulse-avatar {
  0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
}

.player span:not(.player-avatar) {
  font-weight: 600;
  color: var(--text);
}

.player-pos {
  font-size: 0.8rem;
  color: var(--text-light) !important;
}

.vs {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  text-shadow: 0 2px 10px rgba(231, 76, 60, 0.3);
}

.dice-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.dice-display {
  display: flex;
  align-items: center;
  gap: 16px;
  animation: bounce-in 0.5s ease;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.dice {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 25px rgba(0,0,0,0.15);
  border: 3px solid #e74c3c;
}

.dice-face {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  width: 44px;
  height: 44px;
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

.dice-dot {
  width: 10px;
  height: 10px;
  background: #e74c3c;
  border-radius: 50%;
}

.dice-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e74c3c;
}

.roll-btn {
  padding: 16px 44px;
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  border: none;
  border-radius: 35px;
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.4);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.roll-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 10px 35px rgba(231, 76, 60, 0.6);
}

.winner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 48px;
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  border-radius: 24px;
  font-size: 1.4rem;
  font-weight: bold;
  animation: celebrate 0.6s ease;
}

@keyframes celebrate {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.winner-icon {
  font-size: 3.5rem;
}

.winner-text {
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.restart-btn {
  padding: 14px 36px;
  background: white;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  color: #f39c12;
  font-size: 1rem;
}

.game-info {
  margin-top: 16px;
  text-align: center;
}

.hint {
  color: #e74c3c;
  font-weight: 600;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>