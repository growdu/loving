import type {
  IPlugin,
  IThemePlugin,
  ICardPlugin,
  IGamePlugin,
  ThemeRegistry,
  CardRegistry,
  GameRegistry
} from './types'

// ============ Base Registry ============
abstract class BaseRegistry<T extends IPlugin> {
  protected plugins = new Map<string, T>()

  register(plugin: T): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} already registered, replacing`)
    }
    plugin.initialize()
    this.plugins.set(plugin.id, plugin)
  }

  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId)
    if (plugin) {
      plugin.dispose()
      this.plugins.delete(pluginId)
    }
  }

  get(pluginId: string): T | undefined {
    return this.plugins.get(pluginId)
  }

  getAll(): T[] {
    return Array.from(this.plugins.values())
  }

  dispose(): void {
    for (const plugin of this.plugins.values()) {
      plugin.dispose()
    }
    this.plugins.clear()
  }
}

// ============ Theme Registry ============
class ThemeRegistryImpl extends BaseRegistry<IThemePlugin> implements ThemeRegistry {
  private activeId: string | null = null

  setActive(themeId: string): boolean {
    const plugin = this.plugins.get(themeId)
    if (!plugin) return false

    const current = this.getActive()
    if (current) current.remove()

    plugin.apply()
    this.activeId = themeId
    return true
  }

  getActive(): IThemePlugin | undefined {
    return this.activeId ? this.plugins.get(this.activeId) : undefined
  }
}

// ============ Card Registry ============
class CardRegistryImpl extends BaseRegistry<ICardPlugin> implements CardRegistry {
  getAllVersions(): import('./types').CardVersion[] {
    const versions: import('./types').CardVersion[] = []
    for (const plugin of this.plugins.values()) {
      versions.push(...plugin.getVersions())
    }
    return versions
  }
}

// ============ Game Registry ============
class GameRegistryImpl extends BaseRegistry<IGamePlugin> implements GameRegistry {}

// Export registry classes for use
export { ThemeRegistryImpl, CardRegistryImpl, GameRegistryImpl }
