import { useRef } from 'react'
import { Wrench } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronsLeftRightIcon } from '@/components/icons/ChevronsLeftRightIcon'
import type { ChevronsLeftRightIconHandle } from '@/components/icons/ChevronsLeftRightIcon'
import { UsersIcon } from '@/components/icons/UsersIcon'
import type { UsersIconHandle } from '@/components/icons/UsersIcon'
import { GitCompareIcon } from '@/components/icons/GitCompareIcon'
import type { GitCompareIconHandle } from '@/components/icons/GitCompareIcon'
import { ShieldCheckIcon } from '@/components/icons/ShieldCheckIcon'
import type { ShieldCheckIconHandle } from '@/components/icons/ShieldCheckIcon'

const drawerWidth = 260

const menuItems = [
  { text: 'JSON Toolkit', path: '/json', animatedIcon: 'chevrons' as const },
  { text: 'Data Generator', path: '/generator', animatedIcon: 'users' as const },
  { text: 'Text Comparator', path: '/diff', animatedIcon: 'gitCompare' as const },
  { text: 'Bcrypt Generator', path: '/bcrypt', animatedIcon: 'shieldCheck' as const },
] as const

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const chevronsIconRef = useRef<ChevronsLeftRightIconHandle>(null)
  const usersIconRef = useRef<UsersIconHandle>(null)
  const gitCompareIconRef = useRef<GitCompareIconHandle>(null)
  const shieldCheckIconRef = useRef<ShieldCheckIconHandle>(null)

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const linkClass = (path: string) =>
    cn(
      'relative flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150',
      location.pathname === path
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
    )

  const drawerContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 md:border-0">
        <div className="flex size-6 items-center justify-center rounded-lg bg-foreground text-background">
          <Wrench className="size-4" />
        </div>
        <span className="font-semibold tracking-tight text-foreground">DevTools</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const animatedType = 'animatedIcon' in item ? item.animatedIcon : null

          const handleMouseEnter = () => {
            if (animatedType === 'chevrons') chevronsIconRef.current?.startAnimation()
            if (animatedType === 'users') usersIconRef.current?.startAnimation()
            if (animatedType === 'gitCompare') gitCompareIconRef.current?.startAnimation()
            if (animatedType === 'shieldCheck') shieldCheckIconRef.current?.startAnimation()
          }
          const handleMouseLeave = () => {
            if (animatedType === 'chevrons') chevronsIconRef.current?.stopAnimation()
            if (animatedType === 'users') usersIconRef.current?.stopAnimation()
            if (animatedType === 'gitCompare') gitCompareIconRef.current?.stopAnimation()
            if (animatedType === 'shieldCheck') shieldCheckIconRef.current?.stopAnimation()
          }

          return (
            <button
              key={item.text}
              type="button"
              className={linkClass(item.path)}
              onClick={() => handleNavigation(item.path)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
                  aria-hidden
                />
              )}
              {animatedType === 'chevrons' ? (
                <ChevronsLeftRightIcon
                  ref={chevronsIconRef}
                  size={18}
                  className="shrink-0 opacity-80"
                />
              ) : animatedType === 'users' ? (
                <UsersIcon
                  ref={usersIconRef}
                  size={18}
                  className="shrink-0 opacity-80"
                />
              ) : animatedType === 'gitCompare' ? (
                <GitCompareIcon
                  ref={gitCompareIconRef}
                  size={18}
                  className="shrink-0 opacity-80"
                />
              ) : animatedType === 'shieldCheck' ? (
                <ShieldCheckIcon
                  ref={shieldCheckIconRef}
                  size={18}
                  className="shrink-0 opacity-80"
                />
              ) : null}
              {item.text}
            </button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      <div
        role="presentation"
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 md:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[var(--sidebar-width)] border-r border-border bg-card shadow-xl transition-[transform] duration-200 ease-out md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ '--sidebar-width': `${drawerWidth}px` } as React.CSSProperties}
      >
        {drawerContent}
      </aside>

      <aside
        className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-card/95 backdrop-blur md:flex"
        style={{ width: drawerWidth }}
      >
        {drawerContent}
      </aside>
    </>
  )
}
