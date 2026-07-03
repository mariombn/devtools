import type { Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ScaleIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface ScaleIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const LEFT_PAN_VARIANTS: Variants = {
  normal: {
    y: 0,
    transition: { duration: 0.3 },
  },
  animate: {
    y: [0, 2, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const RIGHT_PAN_VARIANTS: Variants = {
  normal: {
    y: 0,
    transition: { duration: 0.3 },
  },
  animate: {
    y: [0, -2, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const BEAM_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.4 },
  },
}

export const ScaleIcon = forwardRef<ScaleIconHandle, ScaleIconProps>(
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
          {/* Left pan */}
          <motion.path
            animate={controls}
            d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"
            initial="normal"
            variants={LEFT_PAN_VARIANTS}
          />
          {/* Right pan */}
          <motion.path
            animate={controls}
            d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"
            initial="normal"
            variants={RIGHT_PAN_VARIANTS}
          />
          {/* Base */}
          <path d="M7 21h10" />
          {/* Column */}
          <path d="M12 3v18" />
          {/* Beam */}
          <motion.path
            animate={controls}
            d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"
            initial="normal"
            variants={BEAM_VARIANTS}
          />
        </svg>
      </div>
    )
  }
)

ScaleIcon.displayName = 'ScaleIcon'
