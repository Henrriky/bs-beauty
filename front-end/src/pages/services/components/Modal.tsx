import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
  className?: string
}

function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (isOpen) {
    return (
      <div
        className={`fixed inset-0 flex justify-center items-center animate-fadeIn z-[1000] transition-colors ${isOpen ? 'visible bg-black/60' : 'invisible'}`}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'bg-[#1E1E1E] rounded-2xl shadow p-6 w-full h-full max-w-[343px] max-h-[320px] flex justify-center items-center relative',
            className,
          )}
        >
          <XMarkIcon
            className="size-7 color-[#D9D9D9] hover:text-primary-0 hover:size-8 transition-all text-primary-100 absolute top-5 right-5"
            onClick={onClose}
          />
          {children}
        </div>
      </div>
    )
  }

  return null
}

export default Modal
