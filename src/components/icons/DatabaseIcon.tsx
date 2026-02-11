import { forwardRef, useImperativeHandle, useState, useRef } from 'react'

interface DatabaseIconProps {
  size?: number
  className?: string
}

export interface DatabaseIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

export const DatabaseIcon = forwardRef<DatabaseIconHandle, DatabaseIconProps>(
  ({ size = 24, className = '' }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const timeoutRef = useRef<number | undefined>(undefined)

    const startAnimation = () => {
      if (isAnimating) return
      
      setIsAnimating(true)
      
      timeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false)
      }, 600)
    }

    const stopAnimation = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsAnimating(false)
    }

    useImperativeHandle(ref, () => ({
      startAnimation,
      stopAnimation,
    }))

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{
          transition: 'transform 0.2s ease-in-out',
          transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    )
  }
)

DatabaseIcon.displayName = 'DatabaseIcon'
