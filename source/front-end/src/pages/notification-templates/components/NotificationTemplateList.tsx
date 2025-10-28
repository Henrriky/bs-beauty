import { NotificationTemplate } from '../../../store/notification-template/types'
import { NotificationTemplateCard } from './NotificationTemplateCard'

type Props = {
  templates: NotificationTemplate[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onEdit: (tpl: NotificationTemplate) => void
}

export default function NotificationTemplateList({
  templates,
  isLoading,
  isError,
  onRetry,
  onEdit,
}: Props) {
  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#222222] w-full px-6 py-6 rounded-2xl h-24"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
        Ocorreu um erro ao carregar os templates.
        {onRetry && (
          <button onClick={onRetry} className="ml-2 underline hover:opacity-80">
            Tentar novamente
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-3">
      {templates.length === 0 ? (
        <div className="text-sm text-gray-400">Nenhum template encontrado.</div>
      ) : (
        templates.map((tpl) => (
          <NotificationTemplateCard
            key={tpl.id}
            template={tpl}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  )
}
