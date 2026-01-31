import * as React from 'react'
import { cn } from '@/lib/utils'

const TOGGLE_ANIMATION_DURATION_MS = 200

interface ItemPosition {
  left: number
  top: number
  width: number
  height: number
}

interface ToggleGroupContextValue {
  value: string
  onValueChange: (value: string) => void
  registerItem: (value: string, element: HTMLButtonElement | null) => void
}

const ToggleGroupContext = React.createContext<
  ToggleGroupContextValue | undefined
>(undefined)

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  type?: 'single'
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
    const [positions, setPositions] = React.useState<Record<string, ItemPosition>>({})
    const [containerSize, setContainerSize] = React.useState({ width: 1, height: 1 })

    const registerItem = React.useCallback(
      (itemValue: string, element: HTMLButtonElement | null) => {
        if (element) {
          itemRefs.current.set(itemValue, element)
        } else {
          itemRefs.current.delete(itemValue)
        }
      },
      []
    )

    const measurePositions = React.useCallback(() => {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      setContainerSize({ width: containerRect.width, height: containerRect.height })

      const newPositions: Record<string, ItemPosition> = {}

      itemRefs.current.forEach((el, itemValue) => {
        const rect = el.getBoundingClientRect()
        newPositions[itemValue] = {
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        }
      })

      setPositions((prev) =>
        Object.keys(newPositions).length > 0 ? newPositions : prev
      )
    }, [])

    React.useLayoutEffect(() => {
      measurePositions()
    }, [value, measurePositions, children])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const resizeObserver = new ResizeObserver(measurePositions)
      resizeObserver.observe(container)

      return () => resizeObserver.disconnect()
    }, [measurePositions])

    const contextValue = React.useMemo(
      () => ({ value, onValueChange, registerItem }),
      [value, onValueChange, registerItem]
    )

    const selectedPosition = value ? positions[value] : null
    const { width: cw, height: ch } = containerSize

    const clipPath =
      selectedPosition && cw > 0 && ch > 0
        ? `inset(${(selectedPosition.top / ch) * 100}% ${100 - ((selectedPosition.left + selectedPosition.width) / cw) * 100}% ${100 - ((selectedPosition.top + selectedPosition.height) / ch) * 100}% ${(selectedPosition.left / cw) * 100}% round 6px)`
        : 'inset(0 100% 0 0 round 6px)'

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={(el) => {
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
            ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }}
          className={cn(
            'relative flex items-center gap-0.5 rounded-md border border-border bg-muted/50 p-0.5',
            className
          )}
          role="group"
          {...props}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-md bg-[#0a0a0a]/5 dark:bg-[#fafafa]/10 shadow-sm"
            style={{
              clipPath,
              transition: `clip-path ${TOGGLE_ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 1, 1)`,
            }}
            aria-hidden
          />
          <div className="relative z-[1] flex items-center gap-0.5">
            {children}
          </div>
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = 'ToggleGroup'

interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  if (!context)
    throw new Error('ToggleGroupItem must be used within ToggleGroup')

  const isSelected = context.value === value

  const setRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      context.registerItem(value, el)
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
    },
    [context, value, ref]
  )

  return (
    <button
      ref={setRef}
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
      {children}
    </button>
  )
})
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
