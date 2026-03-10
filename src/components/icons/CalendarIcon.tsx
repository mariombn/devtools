import { forwardRef, useImperativeHandle, useRef } from 'react'
import { motion, useAnimation } from 'motion/react'
import type { Variants } from 'motion/react'

export interface CalendarIconHandle {
    startAnimation: () => void
    stopAnimation: () => void
}

interface CalendarIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number
}

const calendarVariants: Variants = {
    normal: {
        scale: 1,
    },
    animate: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
}

const checkVariants: Variants = {
    normal: {
        pathLength: 0,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            delay: 0.1,
            duration: 0.4,
            ease: 'easeOut',
        },
    },
}

const CalendarIcon = forwardRef<CalendarIconHandle, CalendarIconProps>(
    ({ size = 24, className, ...props }, ref) => {
        const calendarControls = useAnimation()
        const checkControls = useAnimation()
        const isHovered = useRef(false)

        useImperativeHandle(ref, () => ({
            startAnimation: () => {
                isHovered.current = true
                calendarControls.start('animate')
                checkControls.start('animate')
            },
            stopAnimation: () => {
                isHovered.current = false
                calendarControls.start('normal')
                checkControls.start('normal')
            },
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
                {...props}
            >
                <motion.path
                    variants={calendarVariants}
                    initial="normal"
                    animate={calendarControls}
                    d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                />
                <motion.path
                    variants={checkVariants}
                    initial="normal"
                    animate={checkControls}
                    d="m9 16 2 2 4-4"
                />
            </svg>
        )
    }
)

CalendarIcon.displayName = 'CalendarIcon'

export { CalendarIcon }
