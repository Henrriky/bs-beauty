import { CreateProfessionalFormData } from '../types'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Professional } from '../../../store/auth/types'
import { useProfessionalForm } from '../hooks/useProfessionalForm'
import Modal from '../../../components/modal/Modal'

interface ProfessionalFormModalProps {
  isOpen: boolean
  professional: Professional | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: CreateProfessionalFormData) => void
}

export function ProfessionalFormModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: ProfessionalFormModalProps) {
  const { register, handleSubmit, errors, resetForm } =
    useProfessionalForm(onSubmit)

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={'Novo Profissional'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Email da Profissional
            <label className="text-red-400"> * </label>
          </label>
          <Input
            registration={register('email')}
            id="email"
            type="email"
            placeholder="Digite o e-mail do novo funcionário"
            autoComplete="off"
            error={errors.email?.message?.toString()}
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
