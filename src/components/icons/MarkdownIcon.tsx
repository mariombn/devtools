import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'

export interface MarkdownIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface MarkdownIconProps {
  size?: number
  className?: string
}

export const MarkdownIcon = forwardRef<MarkdownIconHandle, MarkdownIconProps>(
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
      >
        <rect
          width="20"
          height="16"
          x="2"
          y="4"
          rx="2"
          style={{
            transition: 'all 0.3s ease',
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
            transformOrigin: 'center',
          }}
        />
        <path
          d="M6 9v6"
          style={{
            transition: 'all 0.3s ease',
            strokeDasharray: 6,
            strokeDashoffset: isAnimating ? -6 : 0,
          }}
        />
        <path
          d="M10 9 6 15l-4-6"
          style={{
            transition: 'all 0.3s ease',
            opacity: isAnimating ? 0.6 : 1,
          }}
        />
        <path
          d="M14 15V9l4 6V9"
          style={{
            transition: 'all 0.3s ease',
            strokeDasharray: 16,
            strokeDashoffset: isAnimating ? -16 : 0,
          }}
        />
      </svg>
    )
  }
)

MarkdownIcon.displayName = 'MarkdownIcon'
