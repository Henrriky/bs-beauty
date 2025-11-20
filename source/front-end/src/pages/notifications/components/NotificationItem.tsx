import { useState } from 'react'
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline'
import { NotificationDTO } from '../../../store/notification/types'
import { useNotificationsLogic } from '../hooks/useNotificationsLogic'
import { DeleteNotificationsModal } from './DeleteNotificationsModal'

interface NotificationItemProps {
  notification: NotificationDTO
  onOpenDetails: (n: NotificationDTO) => void
  checked: boolean
  onToggle: (id: string) => void
  enableSelection?: boolean
}

export default function NotificationItem({
  notification,
  onOpenDetails,
  checked,
  onToggle,
  enableSelection = true,
}: NotificationItemProps) {

  const {
    deleteNotifications,
    isDeleting
  } = useNotificationsLogic()

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleOpen = () => {
    onOpenDetails(notification)
  }

  const handleAskDelete = () => {
    if (isDeleting) return
    setConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return
    await deleteNotifications({ ids: [notification.id] }).unwrap()
    setConfirmDeleteOpen(false)
  }

  const isUnread = !notification.readAt
  const title = notification.title
  const message = notification.message

  return (
    <>
      <div className="w-full bg-[#222222] rounded-2xl border-none px-4 py-3 flex flex-col gap-4">
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
            onClick={handleOpen}
            aria-label="Ver detalhes"
            className="shrink-0 p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
            title="Ver detalhes"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>

          <button
            onClick={handleAskDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all disabled:opacity-50"
            title="Excluir notificação"
            disabled={isDeleting}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        <div>
          <span className="text-sm text-gray-400 line-clamp-2">{message}</span>
        </div>

        <div className="sm:hidden">
          <ReadBadge unread={isUnread} />
        </div>
        <div className="hidden sm:block">
          <ReadBadge unread={isUnread} />
        </div>
      </div>

      <DeleteNotificationsModal
        isOpen={confirmDeleteOpen}
        count={1}
        isLoading={isDeleting}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
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
