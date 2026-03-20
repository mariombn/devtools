import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTitleProps {
  children: ReactNode
  className?: string
  description?: string
}

export function PageTitle({ children, className, description }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className={cn('text-3xl font-bold tracking-tight', className)}>
        {children}
      </h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
