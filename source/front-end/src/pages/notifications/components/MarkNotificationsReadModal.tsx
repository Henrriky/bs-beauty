import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../components/button/Button'
import Modal from '../../../components/modal/Modal'

interface MarkNotificationsReadModalProps {
  isOpen: boolean
  count: number
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function MarkNotificationsReadModal({
  isOpen,
  count,
  isLoading,
  onClose,
  onConfirm,
}: MarkNotificationsReadModalProps) {
  return (
    <Modal
      isOpen={isOpen && count > 0}
      onClose={onClose}
      title="Confirmar Marcação"
      size="sm"
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500 bg-opacity-20 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-400" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-primary-0 mb-2">
              Marcar {count} notificação{count > 1 ? 'es' : ''} como lida{count > 1 ? 's' : ''}?
            </h4>
            <p className="text-xs text-primary-200">
              Você poderá visualizar estas notificações na aba “Lidas”.
            </p>
          </div>
        </div>

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
            label={isLoading ? 'Marcando...' : 'Marcar como lidas'}
            className="flex-1"
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  )
}
