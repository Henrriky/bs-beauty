import { ReactNode } from 'react'
import { Service } from '../../../store/service/types'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
  service: Service
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (isOpen) {
    return (
      <div
        className={`fixed inset-0 flex justify-center items-center animate-fadeIn z-[1000] transition-colors ${isOpen ? 'visible bg-black/60' : 'invisible'}`}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1E1E1E] rounded-2xl shadow p-6 w-full h-full max-w-[343px] max-h-[320px] flex justify-center items-center"
        >
          {children}
        </div>
      </div>
    )
  }

  return null
}

export default Modal
