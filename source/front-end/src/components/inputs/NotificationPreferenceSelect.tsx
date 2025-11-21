import { Select } from './Select'
import { UseFormRegister, FieldError } from 'react-hook-form'

const NOTIFICATION_OPTIONS = [
  { value: 'NONE', label: 'Não receber' },
  { value: 'IN_APP', label: 'Receber pela plataforma' },
  { value: 'ALL', label: 'Receber pela plataforma e por email' },
]

interface NotificationPreferenceSelectProps {
  register: UseFormRegister<any>
  error?: FieldError
}

function NotificationPreferenceSelect({
  register,
  error,
}: NotificationPreferenceSelectProps) {
  return (
    <Select
      registration={{ ...register('notificationPreference') }}
      id="notificationPreference"
      label="Deseja receber notificações?"
      options={NOTIFICATION_OPTIONS}
      error={error?.message?.toString()}
      variant="outline"
      wrapperClassName="w-full"
    />
  )
}

export default NotificationPreferenceSelect
