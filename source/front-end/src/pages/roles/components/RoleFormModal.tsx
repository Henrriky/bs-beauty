import { CreateRoleFormData, Role } from '../types'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Textarea } from '../../../components/inputs/Textarea'
import { Checkbox } from '../../../components/inputs/Checkbox'
import Modal from '../../../components/modal/Modal'
import { useRoleForm } from '../hooks/useRoleForm'

interface RoleFormModalProps {
  isOpen: boolean
  role: Role | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: CreateRoleFormData) => void
}

export function RoleFormModal({
  isOpen,
  role,
  isLoading,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const { register, handleSubmit, errors, resetForm } = useRoleForm(
    role,
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
      title={role ? 'Editar Função' : 'Nova Função'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Nome da Função
            <label className="text-red-400"> *</label>
          </label>
          <Input
            registration={{
              ...register('name'),
            }}
            id="name"
            type="text"
            placeholder="Assistente"
            className="w-full"
            error={errors.name?.message}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Descrição
          </label>
          <Textarea
            {...register('description')}
            id="description"
            placeholder="Descreva as responsabilidades desta role..."
            rows={3}
            error={errors.description?.message}
          />
        </div>

        {/* Status Ativo */}
        <div className="pt-2">
          <Checkbox
            registration={{
              ...register('isActive'),
            }}
            id="isActive"
            label="Role ativa"
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
