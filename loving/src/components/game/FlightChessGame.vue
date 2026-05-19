<template>
  <div class="fxq-game">
    <!-- 装饰粒子 -->
    <div class="particles">
      <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- 顶部标题 -->
    <div class="title">
      <div class="title-icon">
        <Dice5 :size="36" style="color: var(--primary);" />
      </div>
      <span>飞行棋</span>
      <button v-if="gameStarted" @click="confirmExit" class="back-btn">
        <ArrowLeft :size="18" />
      </button>
    </div>

    <!-- 选择区域 -->
    <div v-if="!gameStarted" class="select-area">
      <!-- 模式选择 - 合并到一个界面 -->
      <div class="section mode-section">
        <div class="section-label">选择主题与模式</div>
        <div class="mode-grid">
          <button
            v-for="theme in gameThemes"
            :key="theme.id"
            @click="selectTheme(theme.id)"
            class="mode-theme-btn"
            :class="{ active: selectedTheme === theme.id }"
            :style="{ '--c': theme.color }"
          >
            <component :is="theme.icon" :size="32" />
            <span>{{ theme.name }}</span>
          </button>
        </div>

        <div class="mode-list">
          <button
            v-for="mode in gameModes"
            :key="mode.id"
            @click="selectMode(mode.id)"
            class="mode-item"
            :class="{ active: selectedMode === mode.id }"
            :style="{ '--c': mode.color }"
          >
            <component :is="mode.icon" :size="22" />
            <span>{{ mode.name }}</span>
            <CheckCircle v-if="selectedMode === mode.id" :size="18" class="check-icon" />
          </button>
        </div>
      </div>

      <!-- 预览区 -->
      <transition name="fade">
        <div v-if="selectedTheme && selectedMode" class="preview-section">
          <div class="preview-card">
            <div class="preview-header">
              <component :is="getThemeIcon(selectedTheme)" :size="28" :style="{ color: getThemeColor(selectedTheme) }" />
              <span>{{ getThemeName(selectedTheme) }} · {{ getModeName(selectedMode) }}</span>
            </div>
            <div class="preview-tasks">
              <div v-for="(task, i) in currentCells.slice(0, 4)" :key="i" class="preview-task">
                <component :is="getIcon(task.icon)" :size="14" :style="{ color: task.color }" />
                <span>{{ task.name }}</span>
              </div>
              <div class="preview-more">...</div>
            </div>
          </div>
        </div>
      </transition>

      <button
        @click="startGame"
        :disabled="!selectedTheme || !selectedMode"
        class="start-btn"
        :class="{ ready: selectedTheme && selectedMode }"
      >
        <div class="btn-shine"></div>
        <Play :size="28" fill="currentColor" />
        <span>开始游戏</span>
      </button>

      <!-- 游戏规则 -->
      <div class="rules-hint">
        <Info :size="16" />
        <span>16格飞行棋，轮流投骰子，完成任务到达终点</span>
      </div>
    </div>

    <!-- 游戏区域 -->
    <div v-else class="game-area">
      <!-- 玩家状态条 -->
      <div class="players-bar">
        <div
          v-for="p in [1, 2]"
          :key="p"
          class="player-card"
          :class="{ active: currentPlayer === p, winner: gameOver && winner === p }"
        >
          <div class="player-avatar" :style="{ background: p === 1 ? '#3498db' : '#e91e63' }">
            <User :size="24" fill="white" />
          </div>
          <div class="player-info">
            <span class="player-name">{{ p === 1 ? '男方' : '女方' }}</span>
            <span class="player-pos">{{ getPos(p) === 0 ? '起点' : '第' + getPos(p) + '格' }}</span>
          </div>
          <div class="player-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (getPos(p) / totalCells * 100) + '%', background: p === 1 ? '#3498db' : '#e91e63' }"
              ></div>
            </div>
            <span class="progress-text">{{ getPos(p) }}/{{ totalCells }}</span>
          </div>
          <Crown v-if="gameOver && winner === p" :size="24" fill="#f1c40f" style="color: #f1c40f;" class="winner-crown" />
        </div>
      </div>

      <!-- 骰子与操作 -->
      <div class="action-zone">
        <div class="dice-wrap">
          <div class="dice-3d" :class="diceClass">
            <div class="dice-face front"><span v-for="i in getDots(1)" :key="i" class="dot"></span></div>
            <div class="dice-face back"><span v-for="i in getDots(2)" :key="i" class="dot"></span></div>
            <div class="dice-face right"><span v-for="i in getDots(3)" :key="i" class="dot"></span></div>
            <div class="dice-face left"><span v-for="i in getDots(4)" :key="i" class="dot"></span></div>
            <div class="dice-face top"><span v-for="i in getDots(5)" :key="i" class="dot"></span></div>
            <div class="dice-face bottom"><span v-for="i in getDots(6)" :key="i" class="dot"></span></div>
          </div>
        </div>

        <div class="action-btns">
          <button v-if="showTask" @click="completeTask" class="action-btn complete">
            <CheckCircle :size="22" fill="currentColor" />
            <span>完成任务</span>
          </button>
          <button v-else-if="!gameOver" @click="rollDice" :disabled="rolling" class="action-btn roll">
            <Dice5 :size="22" />
            <span>{{ rolling ? '投掷中...' : '投骰子' }}</span>
          </button>
          <button v-if="gameOver" @click="resetGame" class="action-btn restart">
            <RotateCcw :size="20" />
            <span>再来一局</span>
          </button>
        </div>
      </div>

      <!-- 棋盘 -->
      <div class="board-section">
        <div class="board-grid">
          <div
            v-for="(cell, i) in currentCells"
            :key="i"
            class="card-cell"
            :class="{
              p1: getPos(1) === i + 1,
              p2: getPos(2) === i + 1,
              both: getPos(1) === i + 1 && getPos(2) === i + 1,
              current: currentCell === i + 1 && showTask,
              start: i === 0,
              end: i === totalCells - 1
            }"
            :style="{ '--delay': i * 0.025 + 's' }"
          >
            <div class="cell-bg"></div>
            <div class="cell-content">
              <span class="cell-num">{{ i + 1 }}</span>
              <component :is="getIcon(cell.icon)" :size="24" :style="{ color: cell.color }" class="cell-icon" />
              <span class="cell-task">{{ cell.name }}</span>
            </div>
            <div class="cell-players" v-if="getPos(1) === i + 1 || getPos(2) === i + 1">
              <div v-if="getPos(1) === i + 1" class="marker p1">
                <User :size="12" fill="white" />
              </div>
              <div v-if="getPos(2) === i + 1" class="marker p2">
                <User :size="12" fill="white" />
              </div>
            </div>
            <div v-if="i === 0" class="cell-tag start">
              <Home :size="12" />
            </div>
            <div v-if="i === totalCells - 1" class="cell-tag end">
              <Star :size="12" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <!-- 任务卡片 -->
      <transition name="task-anim">
        <div v-if="showTask && currentTaskData" class="task-float-card">
          <div class="task-glow"></div>
          <div class="task-icon-wrap">
            <component :is="currentTaskData.icon" :size="40" :style="{ color: currentTaskData.color }" />
          </div>
          <div class="task-body">
            <div class="task-turn">{{ currentPlayer === 1 ? '男方' : '女方' }}的任务</div>
            <div class="task-name">{{ currentTaskData.name }}</div>
            <div class="task-desc">{{ currentTaskData.text }}</div>
          </div>
        </div>
      </transition>

      <!-- 回合提示 -->
      <transition name="toast-anim">
        <div v-if="toastMsg" class="toast-msg">
          <component :is="toastIcon" :size="18" />
          <span>{{ toastMsg }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  Heart, Moon, Flame, Star, Circle, Home, Users, Crown,
  Dice5, Play, RotateCcw, CheckCircle, User, Info, ArrowLeft, Sparkles
} from 'lucide-vue-next'

const totalCells = 16

const gameThemes = [
  { id: 'heart', name: '甜蜜', color: '#e74c3c', icon: Heart },
  { id: 'moon', name: '浪漫', color: '#9b59b6', icon: Moon },
  { id: 'fire', name: '热情', color: '#e67e22', icon: Flame },
  { id: 'star', name: '星光', color: '#f1c40f', icon: Star }
]

const gameModes = [
  { id: 'normal', name: '普通', color: '#3498db', icon: Circle },
  { id: 'love', name: '恋爱', color: '#e91e63', icon: Heart },
  { id: 'hot', name: '热恋', color: '#e74c3c', icon: Flame },
  { id: 'cohabit', name: '同居', color: '#27ae60', icon: Home },
  { id: 'married', name: '夫妻', color: '#8e44ad', icon: Users }
]

const iconMap: Record<string, any> = {
  heart: Heart, fire: Flame, star: Star, hug: Users,
  lips: Heart, kiss: Heart, sun: Sparkles, rose: Heart
}

const modeTasks: Record<string, { name: string; icon: string; text: string; color: string }[]> = {
  normal: [
    { name: '牵手', icon: 'heart', text: '牵手漫步1分钟', color: '#e74c3c' },
    { name: '对视', icon: 'heart', text: '深情对视10秒', color: '#e74c3c' },
    { name: '拥抱', icon: 'hug', text: '给对方一个拥抱', color: '#9b59b6' },
    { name: '情话', icon: 'star', text: '说一句情话', color: '#f1c40f' },
    { name: '亲吻', icon: 'heart', text: '亲吻对方脸颊', color: '#e74c3c' },
    { name: '撒娇', icon: 'star', text: '对对方撒娇一次', color: '#f1c40f' },
    { name: '按摩', icon: 'fire', text: '给对方按摩手部', color: '#e67e22' },
    { name: '跳舞', icon: 'star', text: '和对方跳一支舞', color: '#f1c40f' },
    { name: '情书', icon: 'star', text: '说一句土味情话', color: '#f1c40f' },
    { name: '对视', icon: 'heart', text: '对视看谁先笑', color: '#e74c3c' },
    { name: '拥抱', icon: 'hug', text: '拥抱10秒不松手', color: '#9b59b6' },
    { name: '亲吻', icon: 'heart', text: '亲吻对方额头', color: '#e74c3c' },
    { name: '撒娇', icon: 'star', text: '让对方脸红一次', color: '#f1c40f' },
    { name: '情话', icon: 'heart', text: '说出三个喜欢对方的地方', color: '#e74c3c' },
    { name: '按摩', icon: 'fire', text: '给对方按摩肩膀2分钟', color: '#e67e22' },
    { name: '表白', icon: 'heart', text: '说一句"我爱你"', color: '#e74c3c' }
  ],
  love: [
    { name: '牵手', icon: 'heart', text: '十指紧扣1分钟', color: '#e91e63' },
    { name: '亲吻', icon: 'heart', text: '轻轻亲吻3秒', color: '#e91e63' },
    { name: '拥抱', icon: 'hug', text: '从背后拥抱对方', color: '#9b59b6' },
    { name: '情话', icon: 'heart', text: '说一句让对方心动的话', color: '#e91e63' },
    { name: '对视', icon: 'heart', text: '眼对眼说"我爱你"', color: '#e91e63' },
    { name: '抚摸', icon: 'fire', text: '轻轻抚摸对方的脸', color: '#e67e22' },
    { name: '依偎', icon: 'hug', text: '依偎在对方怀里', color: '#9b59b6' },
    { name: '撒娇', icon: 'star', text: '对对方撒娇一次', color: '#f1c40f' },
    { name: '亲吻', icon: 'heart', text: '亲吻对方鼻尖', color: '#e91e63' },
    { name: '牵手', icon: 'heart', text: '手牵手走10步', color: '#e91e63' },
    { name: '拥抱', icon: 'hug', text: '公主抱30秒', color: '#9b59b6' },
    { name: '情话', icon: 'heart', text: '说出最喜欢对方的瞬间', color: '#e91e63' },
    { name: '抚摸', icon: 'fire', text: '按摩对方太阳穴1分钟', color: '#e67e22' },
    { name: '亲吻', icon: 'heart', text: '法式亲吻5秒', color: '#e91e63' },
    { name: '心跳', icon: 'heart', text: '把头靠在对方心口听心跳', color: '#e91e63' },
    { name: '永远', icon: 'heart', text: '一起说"永远在一起"', color: '#e91e63' }
  ],
  hot: [
    { name: '热吻', icon: 'fire', text: '激吻10秒', color: '#e74c3c' },
    { name: '挑逗', icon: 'fire', text: '轻轻咬对方耳朵', color: '#e67e22' },
    { name: '拥抱', icon: 'hug', text: '用力拥抱对方', color: '#9b59b6' },
    { name: '亲吻', icon: 'lips', text: '亲吻对方脖子', color: '#e74c3c' },
    { name: '抚摸', icon: 'fire', text: '慢慢抚摸对方的手臂', color: '#e67e22' },
    { name: '情趣', icon: 'lips', text: '说一句情欲的话', color: '#e74c3c' },
    { name: '拥抱', icon: 'hug', text: '贴面拥抱30秒', color: '#9b59b6' },
    { name: '亲吻', icon: 'lips', text: '亲吻对方锁骨', color: '#e74c3c' },
    { name: '情趣', icon: 'fire', text: '模仿一个亲密动作', color: '#e67e22' },
    { name: '抚摸', icon: 'fire', text: '给对方捶背2分钟', color: '#e67e22' },
    { name: '热吻', icon: 'lips', text: '轻轻咬对方下唇', color: '#e74c3c' },
    { name: '拥抱', icon: 'hug', text: '拥抱并轻声说情话', color: '#9b59b6' },
    { name: '情趣', icon: 'star', text: '做一个亲密的小动作', color: '#f1c40f' },
    { name: '亲吻', icon: 'heart', text: '深情舌吻10秒', color: '#e91e63' },
    { name: '抚摸', icon: 'fire', text: '抚摸对方的脸颊', color: '#e67e22' },
    { name: '永远', icon: 'star', text: '说出对方的三个优点', color: '#f1c40f' }
  ],
  cohabit: [
    { name: '早餐', icon: 'sun', text: '为对方准备早餐', color: '#f1c40f' },
    { name: '打扫', icon: 'star', text: '一起打扫房间', color: '#f1c40f' },
    { name: '烹饪', icon: 'fire', text: '一起做一顿晚餐', color: '#e67e22' },
    { name: '电影', icon: 'star', text: '依偎在一起看电影', color: '#f1c40f' },
    { name: '散步', icon: 'heart', text: '牵手散步30分钟', color: '#e91e63' },
    { name: '按摩', icon: 'fire', text: '给对方按摩10分钟', color: '#e67e22' },
    { name: '亲吻', icon: 'heart', text: '出门前亲吻告别', color: '#e91e63' },
    { name: '撒娇', icon: 'star', text: '对对方撒娇一次', color: '#f1c40f' },
    { name: '拥抱', icon: 'hug', text: '回家后拥抱5分钟', color: '#9b59b6' },
    { name: '情话', icon: 'heart', text: '睡前说晚安情话', color: '#e91e63' },
    { name: '按摩', icon: 'fire', text: '给对方洗脚按摩', color: '#e67e22' },
    { name: '烹饪', icon: 'sun', text: '为对方做最爱吃的菜', color: '#f1c40f' },
    { name: '惊喜', icon: 'star', text: '准备一个小惊喜', color: '#f1c40f' },
    { name: '拥抱', icon: 'hug', text: '拥抱说"我爱你"', color: '#9b59b6' },
    { name: '永远', icon: 'heart', text: '一起计划未来', color: '#e91e63' },
    { name: '幸福', icon: 'heart', text: '一起说"我们很幸福"', color: '#e91e63' }
  ],
  married: [
    { name: '亲密', icon: 'heart', text: '亲吻并叫对方宝贝', color: '#e91e63' },
    { name: '拥抱', icon: 'hug', text: '给对方一个深情的拥抱', color: '#9b59b6' },
    { name: '回忆', icon: 'heart', text: '回忆第一次见面的场景', color: '#e91e63' },
    { name: '亲吻', icon: 'heart', text: '亲吻对方额头', color: '#e91e63' },
    { name: '感激', icon: 'star', text: '说出感谢对方的一件事', color: '#f1c40f' },
    { name: '情趣', icon: 'fire', text: '说一句甜蜜的情话', color: '#e67e22' },
    { name: '拥抱', icon: 'hug', text: '从背后环抱对方', color: '#9b59b6' },
    { name: '亲吻', icon: 'heart', text: '亲吻对方手背', color: '#e91e63' },
    { name: '情趣', icon: 'fire', text: '为对方按摩头部3分钟', color: '#e67e22' },
    { name: '亲密', icon: 'heart', text: '凝视对方1分钟', color: '#e91e63' },
    { name: '拥抱', icon: 'hug', text: '拥抱并说"我爱你"', color: '#9b59b6' },
    { name: '亲密', icon: 'heart', text: '送上一个飞吻', color: '#e91e63' },
    { name: '情趣', icon: 'fire', text: '一起回忆蜜月时光', color: '#e67e22' },
    { name: '永远', icon: 'heart', text: '一起许下爱的誓言', color: '#e91e63' },
    { name: '幸福', icon: 'star', text: '感谢对方一直陪伴', color: '#f1c40f' },
    { name: '甜蜜', icon: 'heart', text: '一起做喜欢的事', color: '#e91e63' }
  ]
}

const selectedTheme = ref('')
const selectedMode = ref('')
const gameStarted = ref(false)
const pos1 = ref(0)
const pos2 = ref(0)
const currentPlayer = ref(1)
const rolling = ref(false)
const lastRoll = ref<number | null>(null)
const showTask = ref(false)
const gameOver = ref(false)
const winner = ref<number | null>(null)
const toastMsg = ref('')
const toastIcon = ref(Heart)

const currentCells = computed(() => modeTasks[selectedMode.value] || modeTasks.normal)

const currentCell = computed(() => {
  return currentPlayer.value === 1 ? pos1.value : pos2.value
})

const currentTaskData = computed(() => {
  if (!showTask.value) return null
  const pos = currentCell.value
  if (pos > 0 && pos <= totalCells) {
    const task = currentCells.value[pos - 1]
    return { ...task, icon: iconMap[task.icon] || Heart }
  }
  return null
})

const diceClass = computed(() => {
  if (rolling.value) return { rolling: true }
  if (lastRoll.value) return { rolling: false, ['d' + lastRoll.value]: true }
  return {}
})

function particleStyle(i: number) {
  const size = Math.random() * 4 + 2
  const x = Math.random() * 100
  const delay = Math.random() * 15
  const duration = Math.random() * 12 + 15
  return {
    width: size + 'px',
    height: size + 'px',
    left: x + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's'
  }
}

function getIcon(name: string) {
  return iconMap[name] || Heart
}

function getThemeColor(id: string) {
  return gameThemes.find(t => t.id === id)?.color || '#e74c3c'
}

function getThemeIcon(id: string) {
  const theme = gameThemes.find(t => t.id === id)
  return theme?.icon || Heart
}

function getThemeName(id: string) {
  return gameThemes.find(t => t.id === id)?.name || ''
}

function getModeName(id: string) {
  return gameModes.find(m => m.id === id)?.name || ''
}

function getDots(n: number) {
  const map: Record<number, number[]> = {
    1: [1], 2: [1, 2], 3: [1, 2, 3], 4: [1, 2, 3, 4], 5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6]
  }
  return map[n] || [1]
}

function showToast(msg: string, icon: any = Heart) {
  toastMsg.value = msg
  toastIcon.value = icon
  setTimeout(() => {
    toastMsg.value = ''
  }, 2000)
}

function selectTheme(id: string) {
  selectedTheme.value = id
}

function selectMode(id: string) {
  selectedMode.value = id
}

function confirmExit() {
  if (confirm('确定要退出游戏吗？')) {
    resetGame()
  }
}

function startGame() {
  gameStarted.value = true
  pos1.value = 0
  pos2.value = 0
  currentPlayer.value = 1
  lastRoll.value = null
  showTask.value = false
  gameOver.value = false
  winner.value = null
  showToast('游戏开始！', Sparkles)
}

async function rollDice() {
  if (rolling.value || gameOver.value) return

  rolling.value = true
  lastRoll.value = null

  for (let i = 0; i < 15; i++) {
    lastRoll.value = Math.floor(Math.random() * 6) + 1
    await new Promise(r => setTimeout(r, 50))
  }

  rolling.value = false
  await finishRoll()
}

async function finishRoll() {
  if (!lastRoll.value) return

  const roll = lastRoll.value
  showToast('🎲 ' + roll + '点！')

  await new Promise(r => setTimeout(r, 500))

  const currentPos = currentPlayer.value === 1 ? pos1.value : pos2.value
  const newPos = currentPos + roll

  if (currentPlayer.value === 1) pos1.value = newPos
  else pos2.value = newPos

  if (newPos > totalCells) {
    gameOver.value = true
    winner.value = currentPlayer.value
    showToast((currentPlayer.value === 1 ? '男方' : '女方') + '获胜！', Crown)
    return
  }

  if (newPos > 0) {
    showTask.value = true
    await new Promise(r => setTimeout(r, 300))
  } else {
    showToast('需要6点才能出发！', Star)
    switchPlayer()
  }
}

function completeTask() {
  showTask.value = false
  showToast('任务完成！', CheckCircle)
  setTimeout(() => {
    switchPlayer()
  }, 500)
}

function switchPlayer() {
  currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
  lastRoll.value = null
  showToast((currentPlayer.value === 1 ? '男方' : '女方') + '回合', User)
}

function resetGame() {
  gameStarted.value = false
  selectedTheme.value = ''
  selectedMode.value = ''
  pos1.value = 0
  pos2.value = 0
  currentPlayer.value = 1
  lastRoll.value = null
  showTask.value = false
  gameOver.value = false
  winner.value = null
}

function getPos(player: number): number {
  return player === 1 ? pos1.value : pos2.value
}
</script>

<style scoped>
.fxq-game {
  min-height: 100vh;
  background: var(--background);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
}

/* 粒子 */
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.2;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 0.2; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-100vh) scale(1); opacity: 0; }
}

/* 标题 */
.title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 1;
}

.title-icon {
  animation: titleBounce 2s ease-in-out infinite;
}

@keyframes titleBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-4px) rotate(5deg); }
}

.title span {
  font-size: 1.8rem;
  font-weight: 900;
  background: var(--theme-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.back-btn {
  position: absolute;
  right: -60px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--primary);
}

/* 选择区域 */
.select-area {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.section {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.mode-theme-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: var(--text);
  overflow: hidden;
}

.mode-theme-btn:hover {
  transform: translateY(-5px) scale(1.05);
  border-color: var(--c);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2), 0 0 30px var(--c);
}

.mode-theme-btn.active {
  background: var(--c);
  border-color: var(--c);
  color: white;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25), 0 0 50px var(--c);
}

.mode-theme-btn span {
  font-size: 0.85rem;
  font-weight: 700;
}

.mode-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.mode-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: var(--text);
}

.mode-item:hover {
  transform: translateY(-4px) scale(1.06);
  border-color: var(--c);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 25px var(--c);
}

.mode-item.active {
  background: var(--c);
  border-color: var(--c);
  color: white;
  transform: translateY(-4px) scale(1.06);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 0 40px var(--c);
}

.mode-item span {
  font-size: 0.8rem;
  font-weight: 700;
}

.check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: white;
  animation: checkPop 0.3s;
}

@keyframes checkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 预览卡片 */
.preview-section {
  margin-top: -8px;
}

.preview-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-header span {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.preview-tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-task {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light);
}

.preview-more {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: var(--text-light);
  opacity: 0.6;
}

/* 开始按钮 */
.start-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 36px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  border-radius: 20px;
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
  transform: rotate(45deg) translateX(-100%);
  transition: transform 0.6s;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 60px rgba(var(--primary-rgb), 0.4);
}

.start-btn:hover:not(:disabled) .btn-shine {
  transform: rotate(45deg) translateX(100%);
}

.start-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.start-btn.ready {
  animation: readyPulse 2s infinite;
}

@keyframes readyPulse {
  0%, 100% { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(var(--primary-rgb), 0.3); }
  50% { box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25), 0 0 60px rgba(var(--primary-rgb), 0.6); }
}

/* 规则提示 */
.rules-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  font-size: 0.85rem;
  color: var(--text-light);
}

/* 游戏区域 */
.game-area {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

/* 玩家状态 */
.players-bar {
  display: flex;
  gap: 16px;
  width: 100%;
}

.player-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 2px solid transparent;
  transition: all 0.4s;
  position: relative;
}

.player-card.active {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.player-card.p1.active { border-color: #3498db; box-shadow: 0 0 30px rgba(52, 152, 219, 0.3); }
.player-card.p2.active { border-color: #e91e63; box-shadow: 0 0 30px rgba(233, 30, 99, 0.3); }

.player-card.winner {
  animation: winnerGlow 1s infinite;
}

@keyframes winnerGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(241, 196, 15, 0.4); }
  50% { box-shadow: 0 0 50px rgba(241, 196, 15, 0.7); }
}

.player-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.player-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.player-pos {
  font-size: 0.75rem;
  color: var(--text-light);
}

.player-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.progress-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-light);
  text-align: right;
}

.winner-crown {
  position: absolute;
  top: -12px;
  right: 12px;
  animation: crownBounce 1s infinite;
}

@keyframes crownBounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

/* 操作区域 */
.action-zone {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.dice-wrap {
  perspective: 350px;
  width: 80px;
  height: 80px;
}

.dice-3d {
  width: 70px;
  height: 70px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dice-face {
  position: absolute;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
  backface-visibility: hidden;
  padding: 10px;
  gap: 4px;
}

.dice-face .dot {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

.front { transform: translateZ(35px); }
.back { transform: rotateY(180deg) translateZ(35px); }
.right { transform: rotateY(90deg) translateZ(35px); }
.left { transform: rotateY(-90deg) translateZ(35px); }
.top { transform: rotateX(90deg) translateZ(35px); }
.bottom { transform: rotateX(-90deg) translateZ(35px); }

.dice-face.top, .dice-face.bottom, .dice-face.front {
  justify-content: center;
  align-content: center;
}

.dice-3d.rolling {
  animation: diceRoll 0.5s ease-in-out infinite;
}

@keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
  50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
  75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
  100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
}

.dice-3d.d1 { transform: rotateX(-15deg) rotateY(-15deg); }
.dice-3d.d2 { transform: rotateX(-15deg) rotateY(40deg); }
.dice-3d.d3 { transform: rotateX(30deg) rotateY(-30deg); }
.dice-3d.d4 { transform: rotateX(-30deg) rotateY(30deg); }
.dice-3d.d5 { transform: rotateX(20deg) rotateY(60deg); }
.dice-3d.d6 { transform: rotateX(-40deg) rotateY(-40deg); }

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border: none;
  border-radius: 18px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.action-btn.roll {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 0 35px rgba(var(--primary-rgb), 0.25);
}

.action-btn.roll:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25), 0 0 55px rgba(var(--primary-rgb), 0.4);
}

.action-btn.roll:disabled { opacity: 0.6; cursor: not-allowed; }

.action-btn.complete {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.25);
  animation: completePulse 1.5s infinite;
}

@keyframes completePulse {
  0%, 100% { box-shadow: 0 8px 30px rgba(46, 204, 113, 0.25); }
  50% { box-shadow: 0 12px 40px rgba(46, 204, 113, 0.45); }
}

.action-btn.complete:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 45px rgba(46, 204, 113, 0.4);
}

.action-btn.restart {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.action-btn.restart:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 棋盘 */
.board-section {
  width: 100%;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.card-cell {
  aspect-ratio: 0.9;
  position: relative;
  perspective: 500px;
  animation: cellIn 0.5s backwards;
  animation-delay: var(--delay);
}

@keyframes cellIn {
  from { transform: scale(0.7) rotateY(90deg); opacity: 0; }
  to { transform: scale(1) rotateY(0); opacity: 1; }
}

.cell-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(40, 25, 25, 0.95), rgba(25, 15, 15, 0.98));
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.4s;
}

.card-cell.start .cell-bg {
  background: linear-gradient(145deg, rgba(30, 55, 35, 0.95), rgba(20, 40, 25, 0.98));
  border-color: rgba(46, 204, 113, 0.3);
}

.card-cell.end .cell-bg {
  background: linear-gradient(145deg, rgba(55, 50, 25, 0.95), rgba(40, 35, 15, 0.98));
  border-color: rgba(241, 196, 15, 0.3);
}

.card-cell.p1 .cell-bg {
  background: linear-gradient(145deg, rgba(52, 152, 219, 0.3), rgba(25, 55, 85, 0.95));
  border-color: #3498db;
  box-shadow: 0 0 25px rgba(52, 152, 219, 0.4), inset 0 0 20px rgba(52, 152, 219, 0.15);
}

.card-cell.p2 .cell-bg {
  background: linear-gradient(145deg, rgba(233, 30, 99, 0.3), rgba(85, 25, 50, 0.95));
  border-color: #e91e63;
  box-shadow: 0 0 25px rgba(233, 30, 99, 0.4), inset 0 0 20px rgba(233, 30, 99, 0.15);
}

.card-cell.both .cell-bg {
  background: linear-gradient(145deg, rgba(52, 152, 219, 0.25), rgba(233, 30, 99, 0.25), rgba(25, 25, 50, 0.95));
  border-image: linear-gradient(135deg, #3498db, #e91e63) 1;
  box-shadow: 0 0 30px rgba(233, 30, 99, 0.35), 0 0 30px rgba(52, 152, 219, 0.35);
}

.card-cell.current .cell-bg {
  animation: cellPulse 1.2s infinite;
  border-color: var(--primary);
  box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.5), inset 0 0 25px rgba(var(--primary-rgb), 0.2);
}

@keyframes cellPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.cell-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
}

.cell-num {
  position: absolute;
  top: 5px;
  left: 6px;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--text-light);
  opacity: 0.5;
}

.cell-icon {
  margin-bottom: 2px;
}

.cell-task {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text);
  text-align: center;
  line-height: 1.2;
}

.cell-players {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 3px;
  z-index: 2;
}

.marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  animation: markerPop 0.3s;
}

@keyframes markerPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.marker.p1 { background: #3498db; }
.marker.p2 { background: #e91e63; }

.cell-tag {
  position: absolute;
  top: -8px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  background: var(--card-bg);
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.cell-tag.start { color: #2ecc71; }
.cell-tag.end { color: #f1c40f; }

/* 任务浮动卡片 */
.task-float-card {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 26px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(25px);
  border-radius: 22px;
  border: 2px solid var(--primary);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 50px rgba(var(--primary-rgb), 0.35), inset 0 0 60px rgba(var(--primary-rgb), 0.1);
  overflow: hidden;
}

.task-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.15), transparent 60%);
  pointer-events: none;
}

.task-icon-wrap {
  flex-shrink: 0;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.task-body {
  flex: 1;
}

.task-turn {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.task-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;
}

.task-desc {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-light);
}

/* Toast提示 */
.toast-msg {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.toast-anim-enter-active {
  animation: toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes toastIn {
  0% { transform: translateX(-50%) translateY(-30px) scale(0.8); opacity: 0; }
  100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
}

.toast-anim-leave-active {
  animation: toastIn 0.25s reverse;
}

/* 过渡 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.task-anim-enter-active {
  animation: taskFloatIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes taskFloatIn {
  0% { transform: translateY(30px) scale(0.9); opacity: 0; }
  50% { transform: scale(1.03); }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

.task-anim-leave-active {
  animation: taskFloatIn 0.3s reverse;
}
</style>