import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'

export interface CheckSquareIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface CheckSquareIconProps {
  size?: number
  className?: string
}

export const CheckSquareIcon = forwardRef<CheckSquareIconHandle, CheckSquareIconProps>(
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
          d="m9 11 3 3L22 4"
          style={{
            transition: 'all 0.3s ease',
            strokeDasharray: 20,
            strokeDashoffset: isAnimating ? 0 : 20,
          }}
        />
        <path
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          style={{
            transition: 'all 0.3s ease',
            opacity: isAnimating ? 0.8 : 1,
          }}
        />
      </svg>
    )
  }
)

CheckSquareIcon.displayName = 'CheckSquareIcon'
