import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface ToggleGroupContextValue {
  value: string
  onValueChange: (value: string) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(undefined)

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  type?: 'single'
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    const contextValue = React.useMemo(
      () => ({ value, onValueChange }),
      [value, onValueChange]
    )

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'relative flex items-center gap-0.5 rounded-md border border-border bg-muted/50 p-0.5',
            className
          )}
          role="group"
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = 'ToggleGroup'

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)

    if (!context) throw new Error('ToggleGroupItem must be used within ToggleGroup')

    const isSelected = context.value === value

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        className={cn(
          'relative inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
          'hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
          'disabled:pointer-events-none disabled:opacity-50',
          isSelected ? 'text-foreground' : 'text-muted-foreground',
          className
        )}
        onClick={() => context.onValueChange(value)}
        {...props}
      >
        {isSelected && (
          <motion.span
            layoutId="toggle-indicator"
            className="pointer-events-none absolute inset-0 rounded-md bg-[#0a0a0a]/5 shadow-sm dark:bg-[#fafafa]/10"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            aria-hidden
          />
        )}
        <span className="relative z-[1] flex items-center gap-1.5">{children}</span>
      </button>
    )
  }
)
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
