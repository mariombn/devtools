import { useRef } from 'react'
import { motion } from 'motion/react'
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
import { ScanTextIcon } from '@/components/icons/ScanTextIcon'
import type { ScanTextIconHandle } from '@/components/icons/ScanTextIcon'
import { LayersIcon } from '@/components/icons/LayersIcon'
import type { LayersIconHandle } from '@/components/icons/LayersIcon'
import { CircleCheckIcon } from '@/components/icons/CircleCheckIcon'
import type { CircleCheckIconHandle } from '@/components/icons/CircleCheckIcon'
import { CalendarDaysIcon } from '@/components/icons/CalendarDaysIcon'
import type { CalendarDaysIconHandle } from '@/components/icons/CalendarDaysIcon'

const drawerWidth = 260
const collapsedWidth = 64

const textEnter = { duration: 0.15, ease: 'easeOut' as const, delay: 0.18 }
const textExit = { duration: 0.1, ease: 'easeOut' as const }

const menuItems = [
  { text: 'JSON Toolkit', path: '/json', animatedIcon: 'chevrons' as const },
  { text: 'Validators', path: '/validators', animatedIcon: 'checkSquare' as const },
  { text: 'Data Generator', path: '/generator', animatedIcon: 'users' as const },
  { text: 'Text Comparator', path: '/diff', animatedIcon: 'gitCompare' as const },
  { text: 'Bcrypt Generator', path: '/bcrypt', animatedIcon: 'shieldCheck' as const },
  { text: 'Markdown Preview', path: '/markdown', animatedIcon: 'markdown' as const },
  { text: 'SQL Tools', path: '/sql', animatedIcon: 'database' as const },
  { text: 'Date & Time Tools', path: '/dates', animatedIcon: 'calendar' as const },
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
  const checkSquareIconRef = useRef<CircleCheckIconHandle>(null)
  const usersIconRef = useRef<UsersIconHandle>(null)
  const gitCompareIconRef = useRef<GitCompareIconHandle>(null)
  const shieldCheckIconRef = useRef<ShieldCheckIconHandle>(null)
  const markdownIconRef = useRef<ScanTextIconHandle>(null)
  const databaseIconRef = useRef<LayersIconHandle>(null)
  const calendarIconRef = useRef<CalendarDaysIconHandle>(null)

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const linkClass = (path: string) =>
    cn(
      'relative flex w-full items-center rounded px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150',
      location.pathname === path
        ? 'bg-secondary text-foreground'
        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
    )

  const drawerContent = (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-4 border-b border-border md:border-0">
          <div className="flex shrink-0 size-8 items-center justify-center rounded bg-foreground text-background">
            <Wrench className="size-4" />
          </div>
          <motion.span
            className="overflow-hidden whitespace-nowrap font-semibold tracking-tight text-foreground"
            initial={false}
            animate={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              transition: collapsed ? textExit : textEnter,
            }}
          >
            DevTools
          </motion.span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const animatedType = 'animatedIcon' in item ? item.animatedIcon : null

            const handleMouseEnter = () => {
              if (animatedType === 'chevrons') chevronsIconRef.current?.startAnimation()
              if (animatedType === 'checkSquare') checkSquareIconRef.current?.startAnimation()
              if (animatedType === 'users') usersIconRef.current?.startAnimation()
              if (animatedType === 'gitCompare') gitCompareIconRef.current?.startAnimation()
              if (animatedType === 'shieldCheck') shieldCheckIconRef.current?.startAnimation()
              if (animatedType === 'markdown') markdownIconRef.current?.startAnimation()
              if (animatedType === 'database') databaseIconRef.current?.startAnimation()
              if (animatedType === 'calendar') calendarIconRef.current?.startAnimation()
            }
            const handleMouseLeave = () => {
              if (animatedType === 'chevrons') chevronsIconRef.current?.stopAnimation()
              if (animatedType === 'checkSquare') checkSquareIconRef.current?.stopAnimation()
              if (animatedType === 'users') usersIconRef.current?.stopAnimation()
              if (animatedType === 'gitCompare') gitCompareIconRef.current?.stopAnimation()
              if (animatedType === 'shieldCheck') shieldCheckIconRef.current?.stopAnimation()
              if (animatedType === 'markdown') markdownIconRef.current?.stopAnimation()
              if (animatedType === 'database') databaseIconRef.current?.stopAnimation()
              if (animatedType === 'calendar') calendarIconRef.current?.stopAnimation()
            }

            return (
              <Tooltip key={item.text}>
                <TooltipTrigger asChild>
                  <button
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
                    ) : animatedType === 'checkSquare' ? (
                      <CircleCheckIcon
                        ref={checkSquareIconRef}
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
                    ) : animatedType === 'markdown' ? (
                      <ScanTextIcon
                        ref={markdownIconRef}
                        size={18}
                        className="shrink-0 opacity-80"
                      />
                    ) : animatedType === 'database' ? (
                      <LayersIcon
                        ref={databaseIconRef}
                        size={18}
                        className="shrink-0 opacity-80"
                      />
                    ) : animatedType === 'calendar' ? (
                      <CalendarDaysIcon
                        ref={calendarIconRef}
                        size={18}
                        className="shrink-0 opacity-80"
                      />
                    ) : null}
                    <motion.span
                      className="overflow-hidden whitespace-nowrap"
                      initial={false}
                      animate={{
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : 'auto',
                        marginLeft: collapsed ? 0 : 12,
                        transition: collapsed ? textExit : textEnter,
                      }}
                    >
                      {item.text}
                    </motion.span>
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={8}>
                    {item.text}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/mariombn/devtools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="GitHub Repository"
              >
                <Github className="shrink-0 size-4" />
                <motion.span
                  className="overflow-hidden whitespace-nowrap"
                  initial={false}
                  animate={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : 'auto',
                    transition: collapsed ? textExit : textEnter,
                  }}
                >
                  GitHub Repository
                </motion.span>
              </a>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={8}>
                GitHub Repository
              </TooltipContent>
            )}
          </Tooltip>
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
        className="hidden shrink-0 flex-col border-r border-border bg-card/95 backdrop-blur transition-[width] duration-300 ease-in-out md:flex"
        style={{ width: collapsed ? collapsedWidth : drawerWidth }}
      >
        {drawerContent}
      </aside>
    </>
  )
}
