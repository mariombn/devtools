import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'

export interface ShieldCheckIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface ShieldCheckIconProps {
  size?: number
  className?: string
}

export const ShieldCheckIcon = forwardRef<ShieldCheckIconHandle, ShieldCheckIconProps>(
  ({ size = 24, className = '' }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
      if (isAnimating) {
        const timeout = setTimeout(() => setIsAnimating(false), 600)
        return () => clearTimeout(timeout)
      }
    }, [isAnimating])

    useImperativeHandle(ref, () => ({
      startAnimation: () => setIsAnimating(true),
      stopAnimation: () => setIsAnimating(false),
    }))

    return (
      <svg
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
          transition: 'transform 0.3s ease',
          transform: isAnimating ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          style={{
            transition: 'all 0.3s ease',
            opacity: isAnimating ? 0.8 : 1,
          }}
        />
        <polyline
          points="9 12 11 14 15 10"
          style={{
            transition: 'all 0.3s ease',
            strokeDasharray: 20,
            strokeDashoffset: isAnimating ? 0 : 20,
          }}
        />
      </svg>
    )
  }
)

ShieldCheckIcon.displayName = 'ShieldCheckIcon'
