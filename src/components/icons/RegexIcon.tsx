import type { Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface RegexIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface RegexIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const SLASH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
}

const DOT_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { duration: 0.2 },
  },
  animate: {
    scale: [0, 1.3, 1],
    transition: { duration: 0.4, delay: 0.1 },
  },
}

const STAR_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    rotate: [0, 90],
    scale: [0.5, 1],
    transition: { duration: 0.4, delay: 0.15 },
  },
}

export const RegexIcon = forwardRef<RegexIconHandle, RegexIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      }
    })

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e)
        } else {
          controls.start('animate')
        }
      },
      [controls, onMouseEnter]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e)
        } else {
          controls.start('normal')
        }
      },
      [controls, onMouseLeave]
    )

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Forward slash / */}
          <motion.path
            animate={controls}
            d="M17 3 7 21"
            initial="normal"
            variants={SLASH_VARIANTS}
          />
          {/* Dot . */}
          <motion.circle
            animate={controls}
            cx="5"
            cy="12"
            r="1.5"
            fill="currentColor"
            stroke="none"
            initial="normal"
            variants={DOT_VARIANTS}
          />
          {/* Star * (asterisk lines) */}
          <motion.g
            animate={controls}
            initial="normal"
            variants={STAR_VARIANTS}
          >
            <line x1="19" y1="5" x2="19" y2="11" />
            <line x1="16.4" y1="6.5" x2="21.6" y2="9.5" />
            <line x1="21.6" y1="6.5" x2="16.4" y2="9.5" />
          </motion.g>
        </svg>
      </div>
    )
  }
)

RegexIcon.displayName = 'RegexIcon'
