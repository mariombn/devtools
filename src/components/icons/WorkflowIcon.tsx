import type { Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface WorkflowIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface WorkflowIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

const SOURCE_NODE_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    scale: [1, 0.88, 1],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

const CONNECTOR_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.4, delay: 0.15 },
  },
}

const TARGET_NODE_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { duration: 0.3 },
  },
  animate: {
    scale: [1, 0.88, 1],
    transition: { duration: 0.4, delay: 0.45, ease: 'easeInOut' },
  },
}

export const WorkflowIcon = forwardRef<WorkflowIconHandle, WorkflowIconProps>(
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
          {/* Source node */}
          <motion.rect
            animate={controls}
            height="8"
            initial="normal"
            rx="2"
            style={{ transformOrigin: '7px 7px' }}
            variants={SOURCE_NODE_VARIANTS}
            width="8"
            x="3"
            y="3"
          />
          {/* Connector */}
          <motion.path
            animate={controls}
            d="M7 11v4a2 2 0 0 0 2 2h4"
            initial="normal"
            variants={CONNECTOR_VARIANTS}
          />
          {/* Target node */}
          <motion.rect
            animate={controls}
            height="8"
            initial="normal"
            rx="2"
            style={{ transformOrigin: '17px 17px' }}
            variants={TARGET_NODE_VARIANTS}
            width="8"
            x="13"
            y="13"
          />
        </svg>
      </div>
    )
  }
)

WorkflowIcon.displayName = 'WorkflowIcon'
