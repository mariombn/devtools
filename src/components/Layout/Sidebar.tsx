import { useRef } from 'react'
import { Wrench, Github } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronsLeftRightIcon } from '@/components/icons/ChevronsLeftRightIcon'
import type { ChevronsLeftRightIconHandle } from '@/components/icons/ChevronsLeftRightIcon'
import { UsersIcon } from '@/components/icons/UsersIcon'
import type { UsersIconHandle } from '@/components/icons/UsersIcon'
import { GitCompareIcon } from '@/components/icons/GitCompareIcon'
import type { GitCompareIconHandle } from '@/components/icons/GitCompareIcon'
import { ShieldCheckIcon } from '@/components/icons/ShieldCheckIcon'
import type { ShieldCheckIconHandle } from '@/components/icons/ShieldCheckIcon'

const drawerWidth = 260
const collapsedWidth = 64

const menuItems = [
  { text: 'JSON Toolkit', path: '/json', animatedIcon: 'chevrons' as const },
  { text: 'Data Generator', path: '/generator', animatedIcon: 'users' as const },
  { text: 'Text Comparator', path: '/diff', animatedIcon: 'gitCompare' as const },
  { text: 'Bcrypt Generator', path: '/bcrypt', animatedIcon: 'shieldCheck' as const },
] as const

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
  collapsed?: boolean
}

export function Sidebar({ mobileOpen, onClose, collapsed = false }: SidebarProps) {
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
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        <div className={cn(
          "flex h-14 shrink-0 items-center border-b border-border md:border-0",
          collapsed ? "justify-center px-2" : "gap-2 px-4"
        )}>
          <div className="flex size-6 items-center justify-center rounded-lg bg-foreground text-background">
            <Wrench className="size-4" />
          </div>
          {!collapsed && (
            <span className="font-semibold tracking-tight text-foreground">DevTools</span>
          )}
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

          const buttonContent = (
            <button
              key={item.text}
              type="button"
              className={cn(
                linkClass(item.path),
                collapsed && "justify-center px-2"
              )}
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
              {!collapsed && <span>{item.text}</span>}
            </button>
          )

          return collapsed ? (
            <Tooltip key={item.text}>
              <TooltipTrigger asChild>
                {buttonContent}
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.text}
              </TooltipContent>
            </Tooltip>
          ) : (
            buttonContent
          )
        })}
        </nav>
        <div className={cn(
          "border-t border-border p-3",
          collapsed ? "flex justify-center" : "flex items-center gap-2"
        )}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/mariombn/devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="GitHub Repository"
              >
                <Github className="size-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">
              GitHub Repository
            </TooltipContent>
          </Tooltip>
        ) : (
          <a
            href="https://github.com/mariombn/devtools"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="size-4" />
            <span>GitHub Repository</span>
          </a>
        )}
      </div>
      </div>
    </TooltipProvider>
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
        className="hidden shrink-0 flex-col border-r border-border bg-card/95 backdrop-blur transition-all duration-300 ease-in-out md:flex"
        style={{ width: collapsed ? collapsedWidth : drawerWidth }}
      >
        {drawerContent}
      </aside>
    </>
  )
}
