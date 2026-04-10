import { Moon, Sun, Menu, PanelLeftClose, PanelLeft, Languages } from 'lucide-react'
import { useTheme } from '@/theme/ThemeProvider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/i18n/LanguageContext'

interface TopBarProps {
  title: string
  onMenuClick: () => void
  onSidebarToggle?: () => void
  sidebarCollapsed?: boolean
}

export function TopBar({ title, onMenuClick, onSidebarToggle, sidebarCollapsed = false }: TopBarProps) {
  const { mode, toggleTheme } = useTheme()
  const { t, locale, setLocale } = useLanguage()

  const toggleLocale = () => setLocale(locale === 'en' ? 'pt' : 'en')

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        'sm:gap-4 sm:px-6'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden -ml-1"
        aria-label={t('topbar.openMenu')}
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {onSidebarToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex rounded-lg -ml-1"
          aria-label={sidebarCollapsed ? t('topbar.expandSidebar') : t('topbar.collapseSidebar')}
          onClick={onSidebarToggle}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>
      )}

      <h1 className="flex-1 truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {title}
      </h1>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-lg"
        aria-label={locale === 'en' ? t('topbar.switchToPortuguese') : t('topbar.switchToEnglish')}
        onClick={toggleLocale}
        title={locale === 'en' ? t('topbar.switchToPortuguese') : t('topbar.switchToEnglish')}
      >
        <span className="flex items-center gap-1 text-xs font-semibold">
          <Languages className="size-4" />
          {locale === 'en' ? 'EN' : 'PT'}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-lg"
        aria-label={mode === 'dark' ? t('topbar.lightMode') : t('topbar.darkMode')}
        onClick={toggleTheme}
      >
        <span key={mode} className="animate-icon-blur inline-flex">
          {mode === 'dark' ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </span>
      </Button>
    </header>
  )
}
