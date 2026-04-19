import { createContext, useContext, useState, useEffect } from 'react'

type Mode = 'dark' | 'light'

type ThemeContextType = {
  mode: Mode
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({ mode: 'dark', toggleMode: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('tkm-mode') as Mode) || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem('tkm-mode', mode)
  }, [mode])

  const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
