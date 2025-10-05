import { useState, ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return {
          tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          arrow:
            'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
        }
      case 'bottom':
        return {
          tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
          arrow:
            'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
        }
      case 'left':
        return {
          tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
          arrow:
            'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
        }
      case 'right':
        return {
          tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
          arrow:
            'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
        }
      default:
        return {
          tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          arrow:
            'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
        }
    }
  }

  const { tooltip: tooltipClasses, arrow: arrowClasses } = getPositionClasses()

  if (!content) {
    return <>{children}</>
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg min-w-60 ${tooltipClasses}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
