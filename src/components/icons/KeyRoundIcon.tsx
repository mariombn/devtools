import type { Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface KeyRoundIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface KeyRoundIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const CIRCLE_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  animate: {
    rotate: [0, -15, 15, -10, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const PATH_VARIANTS: Variants = {
  normal: {
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  animate: {
    x: [0, 4, 0],
    transition: { duration: 0.4, ease: 'easeInOut', delay: 0.1 },
  },
}

export const KeyRoundIcon = forwardRef<KeyRoundIconHandle, KeyRoundIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const circleControls = useAnimation()
    const pathControls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true
      return {
        startAnimation: () => {
          circleControls.start('animate')
          pathControls.start('animate')
        },
        stopAnimation: () => {
          circleControls.start('normal')
          pathControls.start('normal')
        },
      }
    })

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e)
        } else {
          circleControls.start('animate')
          pathControls.start('animate')
        }
      },
      [circleControls, pathControls, onMouseEnter]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e)
        } else {
          circleControls.start('normal')
          pathControls.start('normal')
        }
      },
      [circleControls, pathControls, onMouseLeave]
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
          <motion.circle
            animate={circleControls}
            cx="7.5"
            cy="15.5"
            initial="normal"
            r="5.5"
            variants={CIRCLE_VARIANTS}
            style={{ originX: '7.5px', originY: '15.5px' }}
          />
          <motion.path
            animate={pathControls}
            d="m21 2-9.6 9.6"
            initial="normal"
            variants={PATH_VARIANTS}
          />
          <motion.path
            animate={pathControls}
            d="m15.5 7.5 3 3L22 7l-3-3"
            initial="normal"
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    )
  }
)

KeyRoundIcon.displayName = 'KeyRoundIcon'
