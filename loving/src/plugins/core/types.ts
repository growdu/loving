// ============ Base Plugin Contract ============
export interface IPlugin {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly dependencies: string[]
  initialize(): Promise<void> | void
  dispose(): void
}

// ============ Theme System (outermost layer) ============
export interface ThemeVariables {
  primary: string
  primaryLight: string
  primaryDark: string
  accent: string
  background: string
  backgroundSecondary: string
  text: string
  textLight: string
  cardBg: string
  cardBorder: string
  borderRadius: string
  borderRadiusSm: string
  shadow: string
  shadowHover: string
  btnBg: string
  btnHoverBg: string
  gradient: string
}

export interface IThemePlugin extends IPlugin {
  id: string
  name: string
  description?: string
  preview?: string
  variables: ThemeVariables
  apply(): void
  remove(): void
}

export interface ThemeRegistry {
  register(theme: IThemePlugin): void
  unregister(themeId: string): void
  get(themeId: string): IThemePlugin | undefined
  getAll(): IThemePlugin[]
  getActive(): IThemePlugin | undefined
  setActive(themeId: string): boolean
}

// ============ Card System ============
export type CardCategory = 'lover' | 'sex' | 'sm' | 'huwai' | 'nvpu' | 'nanpu'

export interface CardVersion {
  id: string
  name: string
  category: CardCategory
  locked: boolean
  tasks: string[]
  metadata?: {
    description?: string
    minPlayers?: number
    recommendedAge?: number
  }
}

export interface Card {
  id: string
  versionId: string
  index: number
  task: string
  vipOnly?: boolean
}

export interface ICardPlugin extends IPlugin {
  id: string
  name: string
  versions: CardVersion[]

  getVersions(): CardVersion[]
  getVersion(versionId: string): CardVersion | undefined
  getRandomCard(versionId: string): Card | undefined
  getCard(versionId: string, index: number): Card | undefined
  isVipRequired(versionId: string): boolean
}

export interface CardRegistry {
  register(plugin: ICardPlugin): void
  unregister(pluginId: string): void
  get(pluginId: string): ICardPlugin | undefined
  getAll(): ICardPlugin[]
  getAllVersions(): CardVersion[]
}

// ============ Game System ============
export interface GameCell {
  index: number
  name: string
  icon: string
  task: string
  vipOnly?: boolean
}

export interface GameBoard {
  cells: GameCell[]
  totalCells: number
  startCell: number
  endCell: number
}

export type GameMode = 'normal' | 'love' | 'hot' | 'cohabit' | 'married'

export interface GameTheme {
  id: string
  name: string
  color: string
  icon: string
}

export interface PlayerState {
  id: number
  position: number
  completedTasks: number
}

export interface GameSession {
  id: string
  gameId: string
  players: PlayerState[]
  currentPlayer: number
  status: 'waiting' | 'rolling' | 'moving' | 'task' | 'completed'
  winner?: number
  startedAt: Date
  tasks: TaskRecord[]
}

export interface TaskRecord {
  playerId: number
  cellIndex: number
  task: string
  completed: boolean
  timestamp: Date
}

export interface IGamePlugin extends IPlugin {
  id: string
  name: string
  board: GameBoard
  themes: GameTheme[]
  modes: { id: GameMode; name: string; color: string; icon: string }[]

  createSession(config: GameConfig): GameSession
}

export interface GameConfig {
  gameId: string
  playerCount: number
  selectedTheme: string
  selectedMode: GameMode
}

export interface GameRegistry {
  register(plugin: IGamePlugin): void
  unregister(gameId: string): void
  get(gameId: string): IGamePlugin | undefined
  getAll(): IGamePlugin[]
}
