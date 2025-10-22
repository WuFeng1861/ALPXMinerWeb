import { ref, watch } from 'vue'
import { t } from '../i18n'

export type ThemeType = 'cyan' | 'orange' | 'purple'

export interface Theme {
  nameKey: string
  primary: string
  primaryDark: string
  shadow: string
  gradient: string
}

export const themes: Record<ThemeType, Theme> = {
  cyan: {
    nameKey: 'themeCyan',
    primary: '#00ffff',
    primaryDark: '#00a3ff',
    shadow: 'rgba(0, 255, 255, 0.3)',
    gradient: 'linear-gradient(135deg, #00a3ff 0%, #00ffff 100%)'
  },
  orange: {
    nameKey: 'themeOrange',
    primary: '#ff8800',
    primaryDark: '#ff6600',
    shadow: 'rgba(255, 136, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)'
  },
  purple: {
    nameKey: 'themePurple',
    primary: '#b845ff',
    primaryDark: '#8b2fc9',
    shadow: 'rgba(184, 69, 255, 0.3)',
    gradient: 'linear-gradient(135deg, #8b2fc9 0%, #b845ff 100%)'
  }
}

export function getThemeName(theme: ThemeType): string {
  return t(themes[theme].nameKey as any)
}

function getValidTheme(): ThemeType {
  const stored = localStorage.getItem('theme') as ThemeType
  return stored && themes[stored] ? stored : 'cyan'
}

const currentTheme = ref<ThemeType>(getValidTheme())

function applyTheme(theme: ThemeType) {
  const themeConfig = themes[theme]
  if (!themeConfig) {
    console.warn(`Invalid theme: ${theme}, falling back to cyan`)
    currentTheme.value = 'cyan'
    return
  }

  const root = document.documentElement

  root.style.setProperty('--color-primary', themeConfig.primary)
  root.style.setProperty('--color-primary-dark', themeConfig.primaryDark)
  root.style.setProperty('--color-shadow', themeConfig.shadow)
  root.style.setProperty('--gradient-primary', themeConfig.gradient)
}

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('theme', newTheme)
}, { immediate: true })

export function useTheme() {
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
  }

  return {
    currentTheme,
    themes,
    setTheme
  }
}
