import { computed, onMounted } from 'vue'
import { pluginContainer } from '@/plugins/core/container'
import type { IThemePlugin, ThemeVariables } from '@/plugins/core/types'

export function useThemeSystem() {
  const themes = computed(() => pluginContainer.themes.getAll())
  const activeTheme = computed(() => pluginContainer.themes.getActive())

  function switchTheme(themeId: string): boolean {
    const success = pluginContainer.themes.setActive(themeId)
    if (success) {
      localStorage.setItem('current_theme', themeId)
    }
    return success
  }

  function getTheme(themeId: string): IThemePlugin | undefined {
    return pluginContainer.themes.get(themeId)
  }

  function applyThemeVariables(variables: ThemeVariables): void {
    const root = document.documentElement
    root.style.setProperty('--primary', variables.primary)
    root.style.setProperty('--primary-light', variables.primaryLight)
    root.style.setProperty('--primary-dark', variables.primaryDark)
    root.style.setProperty('--accent', variables.accent)
    root.style.setProperty('--background', variables.background)
    root.style.setProperty('--background-secondary', variables.backgroundSecondary)
    root.style.setProperty('--text', variables.text)
    root.style.setProperty('--text-light', variables.textLight)
    root.style.setProperty('--card-bg', variables.cardBg)
    root.style.setProperty('--card-border', variables.cardBorder)
    root.style.setProperty('--theme-border-radius', variables.borderRadius)
    root.style.setProperty('--theme-border-radius-sm', variables.borderRadiusSm)
    root.style.setProperty('--theme-shadow', variables.shadow)
    root.style.setProperty('--theme-shadow-hover', variables.shadowHover)
    root.style.setProperty('--theme-btn-bg', variables.btnBg)
    root.style.setProperty('--theme-btn-hover-bg', variables.btnHoverBg)
    root.style.setProperty('--theme-gradient', variables.gradient)
  }

  return {
    themes,
    activeTheme,
    switchTheme,
    getTheme,
    applyThemeVariables
  }
}
