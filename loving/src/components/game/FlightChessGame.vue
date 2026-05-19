<template>
  <div class="fxq-game">
    <!-- 顶部标题 -->
    <div class="title">
      <Dice5 :size="32" style="color: #667eea;" />
      <span>飞行棋</span>
    </div>

    <!-- 第一步：选择主题 -->
    <transition name="step-fade">
      <div v-if="!currentTheme" class="step-section">
        <div class="step-header">
          <div class="step-num">1</div>
          <span class="step-label">选择主题</span>
        </div>
        <div class="theme-grid">
          <button
            v-for="theme in themes"
            :key="theme.id"
            @click="selectTheme(theme.id)"
            class="theme-btn"
            :class="{ active: currentTheme === theme.id }"
            :style="{ '--theme-color': theme.color }"
          >
            <div class="theme-icon">
              <component :is="theme.icon" :size="48" :style="{ color: theme.color }" />
            </div>
            <span class="theme-text">{{ theme.name }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 第二步：选择模式 -->
    <transition name="step-fade">
      <div v-if="currentTheme && !currentMode" class="step-section">
        <div class="step-header">
          <div class="step-num">2</div>
          <span class="step-label">选择模式</span>
        </div>
        <div class="mode-grid">
          <button
            v-for="mode in modes"
            :key="mode.id"
            @click="selectMode(mode.id)"
            class="mode-btn"
            :class="{ active: currentMode === mode.id }"
            :style="{ '--mode-color': mode.color }"
          >
            <span class="mode-icon">
              <component :is="mode.icon" :size="20" :style="{ color: mode.color }" />
            </span>
            <span class="mode-text">{{ mode.name }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- 第三步：开始游戏 -->
    <transition name="step-fade">
      <div v-if="currentTheme && currentMode && !gameStarted" class="step-section">
        <button @click="startGame" class="start-btn">
          <Play :size="24" />
          开始游戏
        </button>
      </div>
    </transition>

    <!-- 游戏区域 -->
    <div v-if="gameStarted" class="game-area">
      <!-- 当前玩家指示器 -->
      <div class="current-player" :class="'player-' + currentPlayer">
        <div class="player-avatar">
          <User :size="32" :style="{ color: currentPlayer === 1 ? '#3498db' : '#e91e63' }" />
        </div>
        <div class="player-info">
          <span class="player-name">{{ currentPlayer === 1 ? '男方' : '女方' }}</span>
          <span class="turn-hint">回合</span>
        </div>
      </div>

      <!-- 骰子显示 -->
      <div class="dice-container">
        <transition name="dice-flip">
          <div v-if="lastRoll" class="dice" :class="'dice-' + lastRoll">
            <div class="dice-face">
              <div v-for="i in getDiceDots(lastRoll)" :key="i" class="dice-dot"></div>
            </div>
          </div>
          <div v-else-if="rolling" class="dice rolling-dice">
            <div class="dice-face">
              <div class="dice-dot"></div>
              <div class="dice-dot"></div>
              <div class="dice-dot"></div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 棋盘 -->
      <div class="board-wrapper">
        <div class="board">
          <!-- 格子 -->
          <div
            v-for="(cell, index) in currentCells"
            :key="index"
            class="cell"
            :class="{
              'player1': getPlayerPos(1) === index + 1,
              'player2': getPlayerPos(2) === index + 1,
              'both': getPlayerPos(1) === index + 1 && getPlayerPos(2) === index + 1,
              'vip': cell.vipOnly
            }"
          >
            <span class="cell-num">{{ index + 1 }}</span>
            <div v-if="cell.vipOnly" class="vip-badge">
              <Star :size="12" fill="#f1c40f" style="color: #f1c40f;" />
            </div>
          </div>

          <!-- 玩家1棋子 -->
          <div
            v-if="getPlayerPos(1) > 0"
            class="piece piece1"
            :style="getPieceStyle(1)"
          >
            <svg viewBox="0 0 24 24" width="28" height="28">
              <circle cx="12" cy="8" r="5" fill="#3498db"/>
              <path d="M12 13c-5 0-9 3-9 7h18c0-4-4-7-9-7z" fill="#3498db"/>
            </svg>
          </div>

          <!-- 玩家2棋子 -->
          <div
            v-if="getPlayerPos(2) > 0"
            class="piece piece2"
            :style="getPieceStyle(2)"
          >
            <svg viewBox="0 0 24 24" width="28" height="28">
              <circle cx="12" cy="8" r="5" fill="#e91e63"/>
              <path d="M12 13c-5 0-9 3-9 7h18c0-4-4-7-9-7z" fill="#e91e63"/>
            </svg>
          </div>
        </div>

        <!-- 起点终点标记 -->
        <div class="corner-label start-label">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#2ecc71"/>
            <path d="M14 2v6h6" fill="#27ae60"/>
          </svg>
          起点
        </div>
        <div class="corner-label end-label">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#f1c40f"/>
          </svg>
          终点
        </div>
      </div>

      <!-- 任务卡片 -->
      <transition name="task-bounce">
        <div v-if="currentTask && showTask" class="task-panel">
          <div class="task-icon" v-html="currentTask.icon"></div>
          <p class="task-desc">{{ currentTask.text }}</p>
          <span v-if="currentTask.vipOnly" class="task-vip">
            <Star :size="14" fill="currentColor" />
            私密任务
          </span>
        </div>
      </transition>

      <!-- 当前状态 -->
      <div class="status-bar">
        <div class="player-score" :class="{ active: currentPlayer === 1 }">
          <User :size="24" style="color: #3498db;" />
          <span class="score-label">男方</span>
          <span class="score-pos">{{ getPlayerPos(1) === 0 ? '起点' : '第' + getPlayerPos(1) + '格' }}</span>
        </div>
        <div class="vs-badge">VS</div>
        <div class="player-score" :class="{ active: currentPlayer === 2 }">
          <User :size="24" style="color: #e91e63;" />
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
          <CheckCircle :size="20" />
          完成
        </button>
        <button
          v-else-if="!gameOver"
          @click="rollDice"
          :disabled="rolling"
          class="control-btn roll"
        >
          <Dice5 :size="22" />
          {{ rolling ? '投掷中...' : '投骰子' }}
        </button>

        <!-- 游戏结束 -->
        <div v-if="gameOver" class="game-over">
          <div class="winner-crown">
            <Crown :size="48" fill="#f1c40f" style="color: #f1c40f;" />
          </div>
          <span class="winner-name">{{ winner === 1 ? '男方' : '女方' }}获胜!</span>
          <button @click="resetGame" class="restart-btn">
            <RotateCcw :size="18" />
            再来一局
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Heart, Moon, Flame, Star, Circle, Home, Users, Crown, Sparkles, Dice5, Play, RotateCcw, CheckCircle, XCircle, User } from 'lucide-vue-next'

const totalCells = 16

// 主题 - 使用Lucide图标
const themes = [
  { id: 'heart', name: '甜蜜', color: '#e74c3c', icon: Heart },
  { id: 'moon', name: '浪漫', color: '#9b59b6', icon: Moon },
  { id: 'fire', name: '热情', color: '#e67e22', icon: Flame },
  { id: 'star', name: '星光', color: '#f1c40f', icon: Star }
]

// 模式
const modes = [
  { id: 'normal', name: '普通', color: '#3498db', icon: Circle },
  { id: 'love', name: '恋爱', color: '#e91e63', icon: Heart },
  { id: 'hot', name: '热恋', color: '#e74c3c', icon: Flame },
  { id: 'cohabit', name: '同居', color: '#27ae60', icon: Home },
  { id: 'married', name: '夫妻', color: '#8e44ad', icon: Users }
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

function getDiceDots(n: number): number[] {
  const patterns: Record<number, number[]> = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    4: [1, 2, 3, 4],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6]
  }
  return patterns[n] || []
}

function getPlayerPos(player: number) {
  return player === 1 ? pos1.value : pos2.value
}

function getPieceStyle(player: number) {
  const pos = player === 1 ? pos1.value : pos2.value
  if (pos <= 0) return { display: 'none' }
  const row = Math.floor((pos - 1) / 4)
  const col = (pos - 1) % 4
  return {
    top: `${20 + row * 70}px`,
    left: `${20 + col * 70 + (player === 2 ? 22 : 0)}px`
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
  padding: 24px;
  box-sizing: border-box;
}

/* 标题 */
.game-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 28px;
  text-shadow: 0 2px 15px rgba(0,0,0,0.2);
}

.title-icon {
  display: flex;
  align-items: center;
}

.title-decoration {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  border-radius: 2px;
}

/* 步骤区域 */
.step-section {
  width: 100%;
  max-width: 480px;
  margin-bottom: 24px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #fff, #f0f0f0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.step-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

/* 主题选择 */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 20px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.theme-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.theme-btn.active {
  background: linear-gradient(135deg, var(--theme-color), color-mix(in srgb, var(--theme-color) 80%, black));
  color: white;
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.theme-btn:hover .theme-icon {
  transform: scale(1.1);
}

.theme-text {
  font-size: 1.05rem;
  font-weight: 600;
}

/* 模式选择 */
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
  padding: 14px 22px;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.mode-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.mode-btn.active {
  background: linear-gradient(135deg, var(--mode-color), color-mix(in srgb, var(--mode-color) 80%, black));
  color: white;
}

.mode-icon {
  display: flex;
  align-items: center;
}

.mode-text {
  font-size: 0.95rem;
  font-weight: 600;
}

/* 开始按钮 */
.start-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border: none;
  border-radius: 18px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.start-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 35px rgba(46, 204, 113, 0.5);
}

.btn-icon {
  display: flex;
  align-items: center;
}

/* 游戏区域 */
.game-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 当前玩家指示器 */
.current-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(255,255,255,0.95);
  border-radius: 40px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.current-player.player-1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.current-player.player-2 {
  background: linear-gradient(135deg, #e91e63, #c2185b);
  color: white;
}

.player-avatar {
  display: flex;
  align-items: center;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.turn-hint {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* 骰子 */
.dice-container {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice {
  perspective: 200px;
}

.dice-face {
  width: 64px;
  height: 64px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  padding: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
}

.dice-dot {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50%;
  align-self: center;
  justify-self: center;
  box-shadow: inset 0 -2px 4px rgba(0,0,0,0.2);
}

/* 骰子点数位置 */
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

.rolling-dice {
  animation: dice-roll 0.15s infinite alternate;
}

@keyframes dice-roll {
  0% { transform: rotate(-5deg) scale(0.95); }
  100% { transform: rotate(5deg) scale(1.05); }
}

.dice-flip-enter-active {
  animation: dice-flip 0.5s ease-out;
}

@keyframes dice-flip {
  0% { transform: rotateY(180deg) scale(0.5); opacity: 0; }
  100% { transform: rotateY(0) scale(1); opacity: 1; }
}

/* 棋盘 */
.board-wrapper {
  position: relative;
  padding: 20px;
  padding-top: 35px;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

.corner-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.start-label {
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #27ae60;
}

.end-label {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #f39c12;
}

.board {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #fff9f9, #fff5f5);
  border-radius: 18px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 6px;
  padding: 8px;
}

.cell {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cell:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cell-num {
  font-size: 0.85rem;
  font-weight: bold;
  color: #999;
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
  border: 2px solid #f1c40f;
}

.vip-badge {
  position: absolute;
  top: 4px;
  right: 4px;
}

/* 棋子 */
.piece {
  position: absolute;
  z-index: 10;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
}

.piece1 {
  z-index: 15;
}

.piece2 {
  z-index: 11;
}

/* 任务卡片 */
.task-panel {
  background: white;
  border-radius: 24px;
  padding: 24px 32px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  max-width: 320px;
}

.task-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.task-desc {
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
}

.task-vip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  color: white;
  border-radius: 18px;
  font-size: 0.8rem;
  font-weight: bold;
}

.task-bounce-enter-active {
  animation: task-bounce 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes task-bounce {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* 状态栏 */
.status-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 28px;
  background: rgba(255,255,255,0.95);
  border-radius: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 22px;
  border-radius: 16px;
  transition: all 0.3s;
}

.player-score.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
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
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
}

/* 控制按钮 */
.control-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 48px;
  border: none;
  border-radius: 40px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 25px rgba(0,0,0,0.2);
}

.control-btn.roll {
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
}

.control-btn.roll:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 10px 35px rgba(231, 76, 60, 0.4);
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

/* 游戏结束 */
.game-over {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 45px;
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  border-radius: 24px;
  animation: celebrate 0.6s ease;
}

@keyframes celebrate {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.winner-crown {
  animation: crown-bounce 1s ease infinite;
}

@keyframes crown-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.winner-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}

.restart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 32px;
  background: white;
  border: none;
  border-radius: 28px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: #f39c12;
  transition: all 0.3s;
}

.restart-btn:hover {
  transform: scale(1.05);
}

/* 过渡动画 */
.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s ease;
}

.step-fade-enter-from,
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>