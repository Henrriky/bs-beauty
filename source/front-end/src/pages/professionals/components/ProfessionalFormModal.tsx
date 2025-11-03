import { CreateProfessionalFormData } from '../types'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Professional } from '../../../store/auth/types'
import { useProfessionalForm } from '../hooks/useProfessionalForm'
import Modal from '../../../components/modal/Modal'
import { Checkbox } from '../../../components/inputs/Checkbox'
import { useEffect, useRef } from 'react'

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
  const { register, handleSubmit, errors, resetForm, watch, setValue } =
    useProfessionalForm(onSubmit)

  const isCommissioned = watch('isCommissioned')
  const prevIsOpenRef = useRef(isOpen)

  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      resetForm()
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen, resetForm])

  useEffect(() => {
    if (!isCommissioned) {
      setValue('commissionRate', undefined)
    }
  }, [isCommissioned, setValue])

  const handleClose = () => {
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
            wrapperClassName="mb-4"
          />
          <Checkbox
            registration={{
              ...register('isCommissioned'),
            }}
            label="Profissional comissionado?"
            id="isCommissioned"
            error={errors?.isCommissioned?.message?.toString()}
          />
          {isCommissioned && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-primary-0 mb-2">
                Porcentagem de Comissão (%)
                <label className="text-red-400"> * </label>
              </label>
              <Input
                registration={register('commissionRate', {
                  valueAsNumber: true,
                })}
                id="commissionRate"
                type="number"
                placeholder="Ex: 10"
                autoComplete="off"
                error={errors.commissionRate?.message?.toString()}
                min={0}
                max={100}
                step={0.01}
                inputClassName="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          )}
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
