import { CreateBlockedTimeFormData, BlockedTime } from '../types'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import { Checkbox } from '../../../components/inputs/Checkbox'
import { DatePicker } from '../../../components/inputs/DatePicker'
import { TimePicker } from '../../../components/inputs/TimePicker'
import { Select } from '../../../components/inputs/Select'
import Modal from '../../../components/modal/Modal'
import { useBlockedTimeForm } from '../hooks/useBlockedTimeForm'

interface BlockedTimeFormModalProps {
  isOpen: boolean
  blockedtime: BlockedTime | null
  isLoading: boolean
  onClose: () => void
  onSubmit: (data: CreateBlockedTimeFormData) => void
}

const endDatePeriodOptions = [
  { label: 'Indeterminado', value: 'undefined' },
  { label: 'Dia atual', value: 'today' },
  { label: '1 semana', value: '1week' },
  { label: '1 mês', value: '1month' },
  { label: '3 meses', value: '3months' },
  { label: '6 meses', value: '6months' },
  { label: '1 ano', value: '1year' },
  { label: 'Personalizado', value: 'custom' },
]

export function BlockedTimeFormModal({
  isOpen,
  blockedtime,
  isLoading,
  onClose,
  onSubmit,
}: BlockedTimeFormModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    resetForm,
    handlePeriodChange,
    periodSelectValue,
  } = useBlockedTimeForm(blockedtime, onSubmit)

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        blockedtime ? 'Editar Bloqueio de Horário' : 'Novo Bloqueio de Horário'
      }
      size="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-4 flex flex-col gap-4"
      >
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

        {/* Período */}
        <div className="flex gap-6 flex-wrap">
          {/* Data Final Helper */}
          <div className="mt-0.5">
            <label className="block text-sm font-medium text-primary-0 mb-2">
              Período de Bloqueio
            </label>
            <Select
              id="endDatePeriod"
              options={endDatePeriodOptions}
              value={periodSelectValue}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full"
              placeholder="Selecione o período"
            />
          </div>
          <div className="flex-1 flex gap-4">
            {/* Data Inicial */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-0 mb-2">
                Data Inicial
                <label className="text-red-400"> *</label>
              </label>
              <DatePicker
                registration={{
                  ...register('startDate'),
                }}
                id="startDate"
                className="w-full"
                error={errors.startDate?.message}
              />
            </div>
            {/* Data Final - só aparece quando "Personalizado" está selecionado */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-0 mb-2">
                Data Final
              </label>
              <DatePicker
                registration={{
                  ...register('endDate'),
                }}
                id="endDate"
                className="w-full"
                error={errors.endDate?.message}
              />
            </div>
          </div>
        </div>

        {/* Horários */}
        <div>
          <div className="flex gap-4">
            {/* Horário Inicial */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-0 mb-2">
                Horário Inicial
                <label className="text-red-400"> *</label>
              </label>
              <TimePicker
                registration={{
                  ...register('startTime'),
                }}
                id="startTime"
                className="w-full"
                error={errors.startTime?.message}
              />
            </div>
            {/* Horário Final */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-0 mb-2">
                Horário Final
                <label className="text-red-400"> *</label>
              </label>
              <TimePicker
                registration={{
                  ...register('endTime'),
                }}
                id="endTime"
                className="w-full"
                error={errors.endTime?.message}
              />
            </div>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="mt-2">
          <label className="block text-sm font-medium text-primary-0 mb-3">
            Dias da Semana
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Checkbox
              registration={{ ...register('sunday') }}
              id="sunday"
              label="Domingo"
            />
            <Checkbox
              registration={{ ...register('monday') }}
              id="monday"
              label="Segunda"
            />
            <Checkbox
              registration={{ ...register('tuesday') }}
              id="tuesday"
              label="Terça"
            />
            <Checkbox
              registration={{ ...register('wednesday') }}
              id="wednesday"
              label="Quarta"
            />
            <Checkbox
              registration={{ ...register('thursday') }}
              id="thursday"
              label="Quinta"
            />
            <Checkbox
              registration={{ ...register('friday') }}
              id="friday"
              label="Sexta"
            />
            <Checkbox
              registration={{ ...register('saturday') }}
              id="saturday"
              label="Sábado"
            />
          </div>
        </div>

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
