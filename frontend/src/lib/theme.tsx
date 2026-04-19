import React, { createContext, useContext, useState, useEffect } from 'react'
import { setSoundTheme } from './sounds'

export type Theme = 'cyborg' | 'aero' | 'minimal' | 'apple2001' | 'ps2' | 'aurora' | 'xvlk'
export type AuroraVariant = 'green' | 'purple'

export const themeNames: Record<Theme, string> = {
  cyborg:    'Cyborg',
  aero:      'Aero',
  minimal:   'Minimal',
  apple2001: 'Apple 2001',
  ps2:       'PS2',
  aurora:    'Aurora',
  xvlk:      'xvlk',
}

export const themeEmojis: Record<Theme, string> = {
  cyborg:    '🤖',
  aero:      '🪟',
  minimal:   '⬜',
  apple2001: '🍎',
  ps2:       '🎮',
  aurora:    '🌌',
  xvlk:      '💙',
}

const darkOnly = new Set<Theme>(['cyborg', 'ps2', 'aurora', 'xvlk'])

type ThemeCtx = {
  theme: Theme
  setTheme: (t: Theme) => void
  darkMode: boolean
  setDarkMode: (d: boolean) => void
  auroraVariant: AuroraVariant
  setAuroraVariant: (v: AuroraVariant) => void
  mode: 'dark' | 'light'
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeCtx>({
  theme: 'cyborg', setTheme: () => {},
  darkMode: true,  setDarkMode: () => {},
  auroraVariant: 'green', setAuroraVariant: () => {},
  mode: 'dark', toggleMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(() =>
    (localStorage.getItem('tkm-theme') as Theme) ?? 'cyborg'
  )
  const [darkMode, setDarkRaw] = useState(() => {
    const saved = localStorage.getItem('tkm-dark')
    return saved !== null ? saved === 'true' : true
  })
  const [auroraVariant, setAuroraVariant] = useState<AuroraVariant>('green')

  const setTheme = (t: Theme) => {
    setThemeRaw(t)
    setSoundTheme(t)
    localStorage.setItem('tkm-theme', t)
    if (darkOnly.has(t)) { setDarkRaw(true); localStorage.setItem('tkm-dark', 'true') }
  }

  useEffect(() => { setSoundTheme(theme) }, [theme])

  const setDarkMode = (d: boolean) => {
    if (darkOnly.has(theme) && !d) return
    setDarkRaw(d)
    localStorage.setItem('tkm-dark', String(d))
  }

  const toggleMode = () => setDarkMode(!darkMode)

  useEffect(() => {
    const html = document.documentElement
    darkMode ? html.classList.add('dark') : html.classList.remove('dark')
    html.setAttribute('data-mode', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      darkMode, setDarkMode,
      auroraVariant, setAuroraVariant,
      mode: darkMode ? 'dark' : 'light',
      toggleMode,
    }}>
      <div data-theme={theme} data-aurora={auroraVariant}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
