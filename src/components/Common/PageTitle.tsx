import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTitleProps {
  children: ReactNode
  className?: string
  description?: string
}

export function PageTitle({ children, className, description }: PageTitleProps) {
  return (
    <div className="mb-8 space-y-2">
    <h1 className={cn('text-2xl font-semibold tracking-tight text-foreground sm:text-3xl', className)}>
      {children}
    </h1>
    {description && <p className="text-muted-foreground">{description}</p>}
  </div>
  )
}
