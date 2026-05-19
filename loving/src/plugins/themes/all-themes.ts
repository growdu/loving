import type { IThemePlugin, ThemeVariables } from '@/plugins/core/types'

// Sensual dark theme for romantic couples
export const romanticTheme: IThemePlugin = {
  id: 'romantic',
  name: '浪漫暧昧',
  version: '1.0.0',
  dependencies: [],
  description: '浪漫暧昧主题，深红玫瑰色调',
  preview: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF69B4 100%)',
  variables: {
    primary: '#DC143C',
    primaryLight: '#FF69B4',
    primaryDark: '#8B0000',
    accent: '#FFD700',
    background: '#1a0a0a',
    backgroundSecondary: '#2d1515',
    text: '#FFF0F0',
    textLight: '#D4A5A5',
    cardBg: 'linear-gradient(145deg, #1f0f0f 0%, #2a1515 100%)',
    cardBorder: '#4a2020',
    borderRadius: '20px',
    borderRadiusSm: '12px',
    shadow: '0 8px 32px rgba(220, 20, 60, 0.3)',
    shadowHover: '0 12px 48px rgba(220, 20, 60, 0.5)',
    btnBg: 'linear-gradient(135deg, #DC143C 0%, #FF69B4 100%)',
    btnHoverBg: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF69B4 100%)'
  },

  initialize() {},
  dispose() {},

  apply() {
    document.body.className = 'theme-romantic'
    this.applyVariables()
  },

  remove() {
    document.body.className = ''
  },

  applyVariables() {
    const root = document.documentElement
    const v = this.variables
    root.style.setProperty('--primary', v.primary)
    root.style.setProperty('--primary-light', v.primaryLight)
    root.style.setProperty('--primary-dark', v.primaryDark)
    root.style.setProperty('--accent', v.accent)
    root.style.setProperty('--background', v.background)
    root.style.setProperty('--background-secondary', v.backgroundSecondary)
    root.style.setProperty('--text', v.text)
    root.style.setProperty('--text-light', v.textLight)
    root.style.setProperty('--card-bg', v.cardBg)
    root.style.setProperty('--card-border', v.cardBorder)
    root.style.setProperty('--theme-border-radius', v.borderRadius)
    root.style.setProperty('--theme-border-radius-sm', v.borderRadiusSm)
    root.style.setProperty('--theme-shadow', v.shadow)
    root.style.setProperty('--theme-shadow-hover', v.shadowHover)
    root.style.setProperty('--theme-btn-bg', v.btnBg)
    root.style.setProperty('--theme-btn-hover-bg', v.btnHoverBg)
    root.style.setProperty('--theme-gradient', v.gradient)
  }
}

export const minimalTheme: IThemePlugin = {
  id: 'minimal',
  name: '神秘诱惑',
  version: '1.0.0',
  dependencies: [],
  description: '神秘诱惑主题，深蓝紫色调',
  preview: 'linear-gradient(135deg, #1a0033 0%, #4B0082 50%, #8A2BE2 100%)',
  variables: {
    primary: '#8A2BE2',
    primaryLight: '#9932CC',
    primaryDark: '#4B0082',
    accent: '#FFD700',
    background: '#0d0d1a',
    backgroundSecondary: '#1a1a2e',
    text: '#E8E8FF',
    textLight: '#9090B0',
    cardBg: 'linear-gradient(145deg, #0f0f1f 0%, #1a1a30 100%)',
    cardBorder: '#2d2d4d',
    borderRadius: '16px',
    borderRadiusSm: '10px',
    shadow: '0 8px 32px rgba(138, 43, 226, 0.3)',
    shadowHover: '0 12px 48px rgba(138, 43, 226, 0.5)',
    btnBg: 'linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%)',
    btnHoverBg: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 100%)',
    gradient: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 100%)'
  },

  initialize() {},
  dispose() {},

  apply() {
    document.body.className = 'theme-minimal'
    this.applyVariables()
  },

  remove() {
    document.body.className = ''
  },

  applyVariables() {
    const root = document.documentElement
    const v = this.variables
    root.style.setProperty('--primary', v.primary)
    root.style.setProperty('--primary-light', v.primaryLight)
    root.style.setProperty('--primary-dark', v.primaryDark)
    root.style.setProperty('--accent', v.accent)
    root.style.setProperty('--background', v.background)
    root.style.setProperty('--background-secondary', v.backgroundSecondary)
    root.style.setProperty('--text', v.text)
    root.style.setProperty('--text-light', v.textLight)
    root.style.setProperty('--card-bg', v.cardBg)
    root.style.setProperty('--card-border', v.cardBorder)
    root.style.setProperty('--theme-border-radius', v.borderRadius)
    root.style.setProperty('--theme-border-radius-sm', v.borderRadiusSm)
    root.style.setProperty('--theme-shadow', v.shadow)
    root.style.setProperty('--theme-shadow-hover', v.shadowHover)
    root.style.setProperty('--theme-btn-bg', v.btnBg)
    root.style.setProperty('--theme-btn-hover-bg', v.btnHoverBg)
    root.style.setProperty('--theme-gradient', v.gradient)
  }
}

export const playfulTheme: IThemePlugin = {
  id: 'playful',
  name: '热情奔放',
  version: '1.0.0',
  dependencies: [],
  description: '热情奔放主题，火焰红橙色调',
  preview: 'linear-gradient(135deg, #4A0000 0%, #FF4500 50%, #FFD700 100%)',
  variables: {
    primary: '#FF4500',
    primaryLight: '#FF6347',
    primaryDark: '#4A0000',
    accent: '#FFD700',
    background: '#1a0f05',
    backgroundSecondary: '#2d1a10',
    text: '#FFF5E0',
    textLight: '#D4A574',
    cardBg: 'linear-gradient(145deg, #1f1208 0%, #2a1a10 100%)',
    cardBorder: '#4a3020',
    borderRadius: '24px',
    borderRadiusSm: '14px',
    shadow: '0 8px 32px rgba(255, 69, 0, 0.3)',
    shadowHover: '0 12px 48px rgba(255, 69, 0, 0.5)',
    btnBg: 'linear-gradient(135deg, #FF4500 0%, #FFD700 100%)',
    btnHoverBg: 'linear-gradient(135deg, #4A0000 0%, #FF4500 100%)',
    gradient: 'linear-gradient(135deg, #4A0000 0%, #FF4500 50%, #FFD700 100%)'
  },

  initialize() {},
  dispose() {},

  apply() {
    document.body.className = 'theme-playful'
    this.applyVariables()
  },

  remove() {
    document.body.className = ''
  },

  applyVariables() {
    const root = document.documentElement
    const v = this.variables
    root.style.setProperty('--primary', v.primary)
    root.style.setProperty('--primary-light', v.primaryLight)
    root.style.setProperty('--primary-dark', v.primaryDark)
    root.style.setProperty('--accent', v.accent)
    root.style.setProperty('--background', v.background)
    root.style.setProperty('--background-secondary', v.backgroundSecondary)
    root.style.setProperty('--text', v.text)
    root.style.setProperty('--text-light', v.textLight)
    root.style.setProperty('--card-bg', v.cardBg)
    root.style.setProperty('--card-border', v.cardBorder)
    root.style.setProperty('--theme-border-radius', v.borderRadius)
    root.style.setProperty('--theme-border-radius-sm', v.borderRadiusSm)
    root.style.setProperty('--theme-shadow', v.shadow)
    root.style.setProperty('--theme-shadow-hover', v.shadowHover)
    root.style.setProperty('--theme-btn-bg', v.btnBg)
    root.style.setProperty('--theme-btn-hover-bg', v.btnHoverBg)
    root.style.setProperty('--theme-gradient', v.gradient)
  }
}

export const premiumTheme: IThemePlugin = {
  id: 'premium',
  name: '奢华私密',
  version: '1.0.0',
  dependencies: [],
  description: '奢华私密主题，玫瑰金暗色调',
  preview: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f1f 50%, #B76E79 100%)',
  variables: {
    primary: '#B76E79',
    primaryLight: '#D4A5A5',
    primaryDark: '#8B4513',
    accent: '#FFD700',
    background: '#0d0d0d',
    backgroundSecondary: '#1a1515',
    text: '#FFF0F0',
    textLight: '#A0A0A0',
    cardBg: 'linear-gradient(145deg, #1a1515 0%, #2d2020 100%)',
    cardBorder: '#3d2d2d',
    borderRadius: '20px',
    borderRadiusSm: '12px',
    shadow: '0 8px 32px rgba(183, 110, 121, 0.3)',
    shadowHover: '0 12px 48px rgba(183, 110, 121, 0.5)',
    btnBg: 'linear-gradient(135deg, #B76E79 0%, #D4A5A5 100%)',
    btnHoverBg: 'linear-gradient(135deg, #8B4513 0%, #B76E79 100%)',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f1f 50%, #B76E79 100%)'
  },

  initialize() {},
  dispose() {},

  apply() {
    document.body.className = 'theme-premium'
    this.applyVariables()
  },

  remove() {
    document.body.className = ''
  },

  applyVariables() {
    const root = document.documentElement
    const v = this.variables
    root.style.setProperty('--primary', v.primary)
    root.style.setProperty('--primary-light', v.primaryLight)
    root.style.setProperty('--primary-dark', v.primaryDark)
    root.style.setProperty('--accent', v.accent)
    root.style.setProperty('--background', v.background)
    root.style.setProperty('--background-secondary', v.backgroundSecondary)
    root.style.setProperty('--text', v.text)
    root.style.setProperty('--text-light', v.textLight)
    root.style.setProperty('--card-bg', v.cardBg)
    root.style.setProperty('--card-border', v.cardBorder)
    root.style.setProperty('--theme-border-radius', v.borderRadius)
    root.style.setProperty('--theme-border-radius-sm', v.borderRadiusSm)
    root.style.setProperty('--theme-shadow', v.shadow)
    root.style.setProperty('--theme-shadow-hover', v.shadowHover)
    root.style.setProperty('--theme-btn-bg', v.btnBg)
    root.style.setProperty('--theme-btn-hover-bg', v.btnHoverBg)
    root.style.setProperty('--theme-gradient', v.gradient)
  }
}

export const allThemes = [romanticTheme, minimalTheme, playfulTheme, premiumTheme]