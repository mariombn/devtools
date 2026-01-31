import { createContext, useContext, useState, useMemo, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'

interface ThemeContextType {
  mode: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components -- useTheme is a hook used by consumers
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-mode')
    if (!saved) {
      localStorage.setItem('theme-mode', 'dark')
      return 'dark'
    }
    return saved as 'light' | 'dark'
  })

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme-mode', newMode)
      return newMode
    })
  }

  const value = useMemo(() => ({ mode, toggleTheme }), [mode])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
