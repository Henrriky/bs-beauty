import { NotificationDTO } from '../../../store/notification/types'
import { buildDate, buildTitle } from '../utils/format'

interface NotificationItemProps {
  notification: NotificationDTO
  onOpenDetails: (n: NotificationDTO) => void
  checked: boolean
  onToggle: (id: string) => void
  enableSelection?: boolean
}

function ReadBadge({ unread }: { unread: boolean }) {
  return unread ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-amber-700 bg-amber-100 rounded border-[1px] border-amber-200 border-opacity-25">
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
      Não lida
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded border-[1px] border-green-200 border-opacity-25">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
      Lida
    </span>
  )
}

export default function NotificationItem({
  notification,
  onOpenDetails,
  checked,
  onToggle,
  enableSelection = true,
}: NotificationItemProps) {
  const isUnread = !notification.readAt
  const title = buildTitle(notification.message)
  const date = buildDate(notification.message)

  return (
    <div className="w-full bg-[#222222] rounded-2xl border-none px-4 py-3">
      <div className="flex items-center gap-3">
        {enableSelection && (
          <input
            type="checkbox"
            className="appearance-none size-4 rounded border-2 border-[#A4978A] checked:bg-[#A4978A] focus:outline-none cursor-pointer shrink-0"
            checked={checked}
            onChange={() => onToggle(notification.id)}
            aria-label="Selecionar notificação"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{title}</h3>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(notification)}
          aria-label="Ver detalhes"
          className="shrink-0 p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
          title="Ver detalhes"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
            />
          </svg>
        </button>
      </div>
      <div>
        <span className="text-sm text-gray-400">Data: {date}</span>
      </div>
      <div className="mt-2 sm:hidden">
        <ReadBadge unread={isUnread} />
      </div>
      <div className="mt-2 hidden sm:block">
        <ReadBadge unread={isUnread} />
      </div>
    </div>
  )
}
