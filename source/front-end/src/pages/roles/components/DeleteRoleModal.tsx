import { Role } from '../types'
import { Button } from '../../../components/button/Button'
import Modal from '../../../components/modal/Modal'

interface DeleteRoleModalProps {
  isOpen: boolean
  role: Role | null
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteRoleModal({
  isOpen,
  role,
  isLoading,
  onClose,
  onConfirm,
}: DeleteRoleModalProps) {
  return (
    <Modal
      isOpen={isOpen && !!role}
      onClose={onClose}
      title="Confirmar Exclusão"
      size="sm"
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900 bg-opacity-20 mb-4">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-primary-0 mb-2">
              Excluir role &ldquo;{role?.name}&rdquo;?
            </h4>
            <p className="text-xs text-primary-200">
              Esta ação não pode ser desfeita. A role será removida
              permanentemente do sistema.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            label="Cancelar"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={onConfirm}
            variant="solid"
            label={isLoading ? 'Excluindo...' : 'Excluir'}
            className="flex-1 !bg-red-600 hover:!bg-red-700"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  )
}
