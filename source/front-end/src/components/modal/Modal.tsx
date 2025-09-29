import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
  className?: string
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  title,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm max-h-[400px]',
    md: 'max-w-md max-h-[500px]',
    lg: 'max-w-lg max-h-[600px]',
    xl: 'max-w-2xl max-h-[700px]',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'bg-primary-900 rounded-2xl shadow-xl w-full relative overflow-y-auto',
            sizeClasses[size],
            className,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            {title && (
              <h3 className="text-lg font-semibold text-primary-0">{title}</h3>
            )}
            <button
              onClick={onClose}
              className="p-2 text-primary-200 hover:text-primary-0 hover:bg-primary-800 rounded-lg transition-colors duration-200"
              title="Fechar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
