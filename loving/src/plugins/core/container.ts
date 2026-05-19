import { ThemeRegistryImpl, CardRegistryImpl, GameRegistryImpl } from './registry'
import type {
  IThemePlugin,
  ICardPlugin,
  IGamePlugin,
  ThemeRegistry,
  CardRegistry,
  GameRegistry
} from './types'

// ============ PluginContainer (Execution Engine) ============
export class PluginContainer {
  readonly themes: ThemeRegistry
  readonly cards: CardRegistry
  readonly games: GameRegistry

  private _isVip: boolean = false
  private _vipListeners: Set<(isVip: boolean) => void> = new Set()

  constructor() {
    this.themes = new ThemeRegistryImpl()
    this.cards = new CardRegistryImpl()
    this.games = new GameRegistryImpl()
  }

  // ============ VIP Management ============
  get isVip(): boolean {
    return this._isVip
  }

  setVip(isVip: boolean): void {
    if (this._isVip !== isVip) {
      this._isVip = isVip
      this.notifyVipChange()
    }
  }

  onVipChange(listener: (isVip: boolean) => void): () => void {
    this._vipListeners.add(listener)
    return () => this._vipListeners.delete(listener)
  }

  private notifyVipChange(): void {
    for (const listener of this._vipListeners) {
      listener(this._isVip)
    }
  }

  // ============ Bootstrap ============
  async bootstrap(): Promise<void> {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem('current_theme') || 'romantic'
    if (this.themes.get(savedTheme)) {
      this.themes.setActive(savedTheme)
    } else {
      this.themes.setActive('romantic')
    }

    // Load VIP status
    const vipStatus = localStorage.getItem('is_vip') === 'true'
    this.setVip(vipStatus)
  }

  // ============ Cleanup ============
  dispose(): void {
    this.themes.dispose()
    this.cards.dispose()
    this.games.dispose()
    this._vipListeners.clear()
  }
}

// Singleton instance - the Execution Engine
export const pluginContainer = new PluginContainer()
