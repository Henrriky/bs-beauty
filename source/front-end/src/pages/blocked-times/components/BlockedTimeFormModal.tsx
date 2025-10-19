import { CreateBlockedTimeFormData, BlockedTime } from '../types'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Checkbox } from '../../../components/inputs/Checkbox'
import Modal from '../../../components/modal/Modal'
import { useBlockedTimeForm } from '../hooks/useBlockedTimeForm'

interface BlockedTimeFormModalProps {
  isOpen: boolean
  blockedtime: BlockedTime | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: CreateBlockedTimeFormData) => void
}

export function BlockedTimeFormModal({
  isOpen,
  blockedtime,
  isLoading,
  onClose,
  onSubmit,
}: BlockedTimeFormModalProps) {
  const { register, handleSubmit, errors, resetForm } = useBlockedTimeForm(
    blockedtime,
    onSubmit,
  )

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        blockedtime ? 'Editar Bloqueio de Horário' : 'Nova Bloqueio de Horário'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Motivo do Bloqueio
            <label className="text-red-400"> *</label>
          </label>
          <Input
            registration={{
              ...register('reason'),
            }}
            id="reason"
            type="text"
            placeholder="Motivo do bloqueio"
            className="w-full"
            error={errors.reason?.message}
          />
        </div>

        {/* Descrição */}
        {/* <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Descrição
          </label>
          <Textarea
            {...register('description')}
            id="description"
            placeholder="Descreva as responsabilidades desta bloqueio de horário..."
            rows={3}
            error={errors.description?.message}
          />
        </div> */}

        {/* Status Ativo */}
        <div className="pt-2">
          <Checkbox
            registration={{ ...register('isActive') }}
            id="isActive"
            label="Ativo"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            label="Cancelar"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="solid"
            label={isLoading ? 'Salvando...' : 'Salvar'}
            className="flex-1"
            disabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  )
}
