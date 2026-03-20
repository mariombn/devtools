import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: ReactNode
  title: string
  fullWidth?: boolean
}

export function MainLayout({ children, title, fullWidth = false }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    return stored === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title={title}
          onMenuClick={handleDrawerToggle}
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          {fullWidth ? (
            children
          ) : (
            <div className="mx-auto max-w-5xl">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
