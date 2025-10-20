import { useEffect, useMemo, useRef, useState } from 'react'
import { notificationAPI } from '../../../store/notification/notification-api'
import NotificationItem from './NotificationItem'
import { NotificationDTO } from '../../../store/notification/types'
import NotificationDetails from './NotificationDetails'
import Modal from '../../services/components/Modal'
import { Button } from '../../../components/button/Button'

type Params = {
  page?: number
  limit?: number
  readStatus?: 'ALL' | 'READ' | 'UNREAD'
}

function ListNotifications({ params }: { params: Params }) {
  const { data, isLoading, isError, isFetching } =
    notificationAPI.useFetchNotificationsQuery(params)
  const [markRead, { isLoading: isMarking }] =
    notificationAPI.useMarkNotificationsReadMutation()

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<NotificationDTO | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const notifications = data?.data ?? []
  const pageIds = useMemo(() => notifications.map((n) => n.id), [notifications])

  const allSelectedOnPage = useMemo(
    () => pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id)),
    [pageIds, selectedIds],
  )
  const someSelectedOnPage = useMemo(
    () => pageIds.some((id) => selectedIds.includes(id)) && !allSelectedOnPage,
    [pageIds, selectedIds, allSelectedOnPage],
  )

  const masterRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = someSelectedOnPage
    }
  }, [someSelectedOnPage])

  const toggleOne = (id: string) => {
    setSelectedIds((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    )
  }

  const toggleAllOnPage = () => {
    setSelectedIds((curr) => {
      const allOn = pageIds.every((id) => curr.includes(id))
      return allOn
        ? curr.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...curr, ...pageIds]))
    })
  }

  const handleMarkSelectedAsRead = async () => {
    if (selectedIds.length === 0) return
    await markRead({ ids: selectedIds }).unwrap()
    setSelectedIds([])
  }

  const isReadTab = params.readStatus === 'READ'
  useEffect(() => {
    setSelectedIds([])
  }, [isReadTab, pageIds.join('|')])

  if (isLoading)
    return (
      <p className="text-[#D9D9D9] mt-2 mb-8 text-sm text-center">
        Carregando notificações...
      </p>
    )
  if (isError)
    return (
      <p className="text-[#CC3636] mt-2 text-sm text-center">
        Erro ao carregar notificações.
      </p>
    )
  if (!notifications.length)
    return (
      <p className="text-[#D9D9D9] mb-8 mt-2 text-sm text-center">
        Não há notificações.
      </p>
    )

  return (
    <>
      {!isReadTab && notifications.length > 0 && (
        <div className="flex items-center gap-2 mt-3 mb-1 justify-end">
          <Button
            label={allSelectedOnPage ? 'Desmarcar' : 'Selecionar'}
            onClick={toggleAllOnPage}
            disabled={isFetching || isMarking || pageIds.length === 0}
            variant="outline"
            outlineVariantBorderStyle="solid"
            className="!w-auto !max-w-[120px] !px-3 !py-1.5 text-sm rounded-md shrink-0"
          />
          <Button
            label={
              selectedIds.length ? `Marcar (${selectedIds.length})` : 'Marcar'
            }
            onClick={handleMarkSelectedAsRead}
            disabled={selectedIds.length === 0 || isMarking}
            variant="outline"
            outlineVariantBorderStyle="solid"
            className="!w-auto !max-w-[120px] !px-3 !py-1.5 text-sm rounded-md shrink-0"
          />
        </div>
      )}

      <div className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4">
        <div className="max-h-[500px] overflow-y-auto w-full">
          <div className="gap-2 p-[2px] w-full flex flex-col justify-center items-center">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                checked={selectedIds.includes(n.id)}
                onToggle={toggleOne}
                onOpenDetails={(notif) => {
                  setSelected(notif)
                  setOpen(true)
                }}
                enableSelection={!isReadTab}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0">
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false)
            setSelected(null)
          }}
          className="max-w-[343px]"
        >
          {selected && (
            <NotificationDetails
              notification={selected}
              onClose={() => {
                setOpen(false)
                setSelected(null)
              }}
            />
          )}
        </Modal>
      </div>
    </>
  )
}

export default ListNotifications
