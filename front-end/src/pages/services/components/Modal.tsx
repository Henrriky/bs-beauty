import { ReactNode } from 'react'
import clsx from 'clsx'

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
            'bg-[#1E1E1E] rounded-2xl shadow p-6 w-full h-full max-w-[343px] max-h-[320px] flex justify-center items-center',
            className,
          )}
        >
          {children}
        </div>
      </div>
    )
  }

  return null
}

export default Modal
