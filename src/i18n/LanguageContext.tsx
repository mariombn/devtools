import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { en, pt } from '@/i18n'
import type { Locale, Translations } from '@/i18n'

// ── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'devtools-locale'

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'pt') return stored
  const browserLang = navigator.language ?? ''
  return browserLang.startsWith('pt') ? 'pt' : 'en'
}

const dictionaries: Record<Locale, Translations> = { en, pt }

// Simple type-safe getter for nested keys like "json.validate"
type DeepKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${DeepKeys<T[K]>}` : `${K}`) : never }[keyof T]
  : never

export type TranslationKey = DeepKeys<Translations>

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

// ── Context ────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next)
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const dict = dictionaries[locale] as Record<string, unknown>
      let value = getNestedValue(dict, key)
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, String(v))
        }
      }
      return value
    },
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
