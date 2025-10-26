import { Button } from '../../../components/button/Button'
import { NotificationDTO } from '../../../store/notification/types'
import { buildTitleWithDate, prettifyISOInText } from '../utils/format'

interface Props {
  notification: NotificationDTO
  onClose: () => void
}

function formatCreatedAt(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  // reutiliza o mesmo formato “às”
  const date = d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${date} às ${time}`
}

export default function NotificationDetails({ notification, onClose }: Props) {
  const title = buildTitleWithDate(notification.message)
  const rawBody =
    notification.message.split('|')[1]?.trim() ?? notification.message
  const body = prettifyISOInText(rawBody)
  const createdAt = formatCreatedAt(notification.createdAt)

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-[#D9D9D9] text-base text-center mb-4">{title}</p>

      <div className="w-full max-w-[295px]">
        <p className="text-sm text-[#D9D9D9] leading-relaxed whitespace-pre-wrap break-words mb-4">
          {body}
        </p>
        {createdAt && (
          <p className="text-xs text-gray-400">Criada em: {createdAt}</p>
        )}
      </div>

      <Button
        type="button"
        label="Fechar"
        onClick={onClose}
        className="mt-5 max-w-[294px] w-full bg-[#A4978A] border-t-white py-2 rounded hover:opacity-90 transition"
      />
    </div>
  )
}
