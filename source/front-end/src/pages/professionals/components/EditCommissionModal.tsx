import { useEffect } from 'react'
import { Professional } from '../../../store/auth/types'
import Modal from '../../../components/modal/Modal'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import {
  useEditCommissionForm,
  EditCommissionFormData,
} from '../hooks/useEditCommissionForm'

interface EditCommissionModalProps {
  isOpen: boolean
  professional: Professional | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (professionalId: string, commissionPercentage: number) => void
}

export function EditCommissionModal({
  isOpen,
  professional,
  isLoading,
  onClose,
  onSubmit,
}: EditCommissionModalProps) {
  const { register, handleSubmit, errors, resetForm, setValue } =
    useEditCommissionForm((data: EditCommissionFormData) => {
      if (professional?.id) {
        onSubmit(professional.id, data.commissionPercentage)
      }
    })

  useEffect(() => {
    if (professional?.commissionRate) {
      const percentage =
        Math.round(professional.commissionRate * 100 * 100) / 100
      setValue('commissionPercentage', percentage)
    }
  }, [professional, setValue])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!professional) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Taxa de Comissão"
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <p className="text-sm text-[#D9D9D9] mb-4">
            Profissional:{' '}
            <span className="font-semibold text-[#B19B86]">
              {professional.name || professional.email}
            </span>
          </p>

          <label className="block text-sm font-medium text-primary-0 mb-2">
            Porcentagem de Comissão (%)
            <label className="text-red-400"> * </label>
          </label>
          <Input
            registration={register('commissionPercentage', {
              valueAsNumber: true,
            })}
            id="commissionPercentage"
            type="number"
            placeholder="Ex: 10"
            autoComplete="off"
            error={errors.commissionPercentage?.message?.toString()}
            min={0}
            max={100}
            step={0.01}
            inputClassName="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
