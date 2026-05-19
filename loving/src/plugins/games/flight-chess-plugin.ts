import type {
  IGamePlugin,
  GameConfig,
  GameSession,
  GameTheme,
  GameMode,
  GameBoard,
  PlayerState,
  TaskRecord
} from '@/plugins/core/types'

// Theme icons as strings for plugin interface
const gameThemes: GameTheme[] = [
  { id: 'heart', name: '甜蜜', color: '#e74c3c', icon: 'Heart' },
  { id: 'moon', name: '浪漫', color: '#9b59b6', icon: 'Moon' },
  { id: 'fire', name: '热情', color: '#e67e22', icon: 'Flame' },
  { id: 'star', name: '星光', color: '#f1c40f', icon: 'Star' }
]

const gameModes: { id: GameMode; name: string; color: string; icon: string }[] = [
  { id: 'normal', name: '普通', color: '#3498db', icon: 'Circle' },
  { id: 'love', name: '恋爱', color: '#e91e63', icon: 'Heart' },
  { id: 'hot', name: '热恋', color: '#e74c3c', icon: 'Flame' },
  { id: 'cohabit', name: '同居', color: '#27ae60', icon: 'Home' },
  { id: 'married', name: '夫妻', color: '#8e44ad', icon: 'Users' }
]

// Tasks for each mode (pulled from card system in real implementation)
const modeTasks: Record<GameMode, { name: string; task: string; vipOnly: boolean }[]> = {
  normal: [
    { name: '牵手', task: '牵手漫步1分钟', vipOnly: false },
    { name: '对视', task: '深情对视10秒', vipOnly: false },
    { name: '拥抱', task: '给对方一个拥抱', vipOnly: false },
    { name: '情话', task: '说一句情话', vipOnly: false },
    { name: '亲吻', task: '亲吻对方脸颊', vipOnly: false },
    { name: '撒娇', task: '对对方撒娇一次', vipOnly: false },
    { name: '按摩', task: '给对方按摩手部', vipOnly: false },
    { name: '跳舞', task: '和对方跳一支舞', vipOnly: false },
    { name: '情书', task: '说一句土味情话', vipOnly: false },
    { name: '对视', task: '对视看谁先笑', vipOnly: false },
    { name: '拥抱', task: '拥抱10秒不松手', vipOnly: false },
    { name: '亲吻', task: '亲吻对方额头', vipOnly: false },
    { name: '撒娇', task: '让对方脸红一次', vipOnly: true },
    { name: '情话', task: '说出三个喜欢对方的地方', vipOnly: true },
    { name: '按摩', task: '给对方按摩肩膀2分钟', vipOnly: true },
    { name: '表白', task: '说一句"我爱你"', vipOnly: false }
  ],
  love: [
    { name: '牵手', task: '十指紧扣1分钟', vipOnly: false },
    { name: '亲吻', task: '轻轻亲吻3秒', vipOnly: false },
    { name: '拥抱', task: '从背后拥抱对方', vipOnly: false },
    { name: '情话', task: '说一句让对方心动的话', vipOnly: false },
    { name: '对视', task: '眼对眼说"我爱你"', vipOnly: false },
    { name: '抚摸', task: '轻轻抚摸对方的脸', vipOnly: false },
    { name: '依偎', task: '依偎在对方怀里', vipOnly: false },
    { name: '撒娇', task: '对对方撒娇一次', vipOnly: false },
    { name: '亲吻', task: '亲吻对方鼻尖', vipOnly: true },
    { name: '牵手', task: '手牵手走10步', vipOnly: false },
    { name: '拥抱', task: '公主抱30秒', vipOnly: true },
    { name: '情话', task: '说出最喜欢对方的瞬间', vipOnly: true },
    { name: '抚摸', task: '按摩对方太阳穴1分钟', vipOnly: false },
    { name: '亲吻', task: '法式亲吻5秒', vipOnly: true },
    { name: '心跳', task: '把头靠在对方心口听心跳', vipOnly: false },
    { name: '永远', task: '一起说"永远在一起"', vipOnly: false }
  ],
  hot: [
    { name: '热吻', task: '激吻10秒', vipOnly: false },
    { name: '挑逗', task: '轻轻咬对方耳朵', vipOnly: false },
    { name: '拥抱', task: '用力拥抱对方', vipOnly: false },
    { name: '亲吻', task: '亲吻对方脖子', vipOnly: true },
    { name: '抚摸', task: '慢慢抚摸对方的手臂', vipOnly: false },
    { name: '情趣', task: '说一句情欲的话', vipOnly: true },
    { name: '拥抱', task: '贴面拥抱30秒', vipOnly: false },
    { name: '亲吻', task: '亲吻对方锁骨', vipOnly: true },
    { name: '情趣', task: '模仿一个亲密动作', vipOnly: false },
    { name: '抚摸', task: '给对方捶背2分钟', vipOnly: false },
    { name: '热吻', task: '轻轻咬对方下唇', vipOnly: true },
    { name: '拥抱', task: '拥抱并轻声说情话', vipOnly: false },
    { name: '情趣', task: '做一个亲密的小动作', vipOnly: true },
    { name: '亲吻', task: '深情舌吻10秒', vipOnly: true },
    { name: '抚摸', task: '抚摸对方的脸颊', vipOnly: false },
    { name: '永远', task: '说出对方的三个优点', vipOnly: false }
  ],
  cohabit: [
    { name: '牵手', task: '一起做早餐', vipOnly: false },
    { name: '亲吻', task: '出门前亲吻告别', vipOnly: false },
    { name: '拥抱', task: '下班回家拥抱', vipOnly: false },
    { name: '情话', task: '一起看剧说情话', vipOnly: false },
    { name: '对视', task: '一起做饭对视', vipOnly: false },
    { name: '按摩', task: '一起做家务', vipOnly: false },
    { name: '依偎', task: '一起沙发上依偎', vipOnly: false },
    { name: '撒娇', task: '一起玩游戏撒娇', vipOnly: false },
    { name: '亲吻', task: '睡前亲吻', vipOnly: true },
    { name: '牵手', task: '一起散步牵手', vipOnly: false },
    { name: '拥抱', task: '周末赖床拥抱', vipOnly: false },
    { name: '情话', task: '睡前说晚安情话', vipOnly: true },
    { name: '抚摸', task: '一起按摩放松', vipOnly: false },
    { name: '亲吻', task: '深夜亲吻', vipOnly: true },
    { name: '心跳', task: '一起听心跳', vipOnly: false },
    { name: '永远', task: '讨论未来计划', vipOnly: false }
  ],
  married: [
    { name: '牵手', task: '结婚纪念日牵手', vipOnly: false },
    { name: '亲吻', task: '早晨亲吻问候', vipOnly: false },
    { name: '拥抱', task: '回家第一件事拥抱', vipOnly: false },
    { name: '情话', task: '感谢对方的付出', vipOnly: false },
    { name: '对视', task: '感恩节对视说谢谢', vipOnly: false },
    { name: '按摩', task: '给对方按摩放松', vipOnly: false },
    { name: '依偎', task: '一起看电影依偎', vipOnly: false },
    { name: '撒娇', task: '甜蜜撒娇', vipOnly: false },
    { name: '亲吻', task: '烛光晚餐亲吻', vipOnly: true },
    { name: '牵手', task: '周年纪念旅行牵手', vipOnly: false },
    { name: '拥抱', task: '拥抱感谢对方', vipOnly: false },
    { name: '情话', task: '说出婚后最喜欢的地方', vipOnly: true },
    { name: '抚摸', task: '一起做SPA', vipOnly: false },
    { name: '亲吻', task: '浪漫晚餐后亲吻', vipOnly: true },
    { name: '心跳', task: '一起回忆婚礼心跳', vipOnly: false },
    { name: '永远', task: '一起许愿永远', vipOnly: false }
  ]
}

const TOTAL_CELLS = 16

// Build board from mode tasks
function buildBoard(mode: GameMode): GameBoard {
  const tasks = modeTasks[mode]
  return {
    totalCells: TOTAL_CELLS,
    startCell: 0,
    endCell: TOTAL_CELLS,
    cells: tasks.map((t, i) => ({
      index: i + 1,
      name: t.name,
      icon: 'Heart',
      task: t.task,
      vipOnly: t.vipOnly
    }))
  }
}

// Flight Chess Plugin
export const flightChessPlugin: IGamePlugin = {
  id: 'flight-chess',
  name: '飞行棋',
  version: '1.0.0',
  dependencies: ['core-cards'],
  board: buildBoard('normal'),
  themes: gameThemes,
  modes: gameModes,

  initialize() {},
  dispose() {},

  createSession(config: GameConfig): GameSession {
    const board = buildBoard(config.selectedMode || 'normal')

    return {
      id: `session-${Date.now()}`,
      gameId: this.id,
      players: [
        { id: 1, position: 0, completedTasks: 0 },
        { id: 2, position: 0, completedTasks: 0 }
      ],
      currentPlayer: 1,
      status: 'waiting',
      startedAt: new Date(),
      tasks: [],
      board
    }
  }
}