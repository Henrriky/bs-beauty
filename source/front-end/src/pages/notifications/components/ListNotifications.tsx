import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { Pagination } from '../../../components/select/Pagination'
import { NotificationDTO } from '../../../store/notification/types'
import Modal from '../../services/components/Modal'
import { Params, useNotificationsLogic } from '../hooks/useNotificationsLogic'
import NotificationDetails from './NotificationDetails'
import NotificationItem from './NotificationItem'
import { DeleteNotificationsModal } from './DeleteNotificationsModal'
import { MarkNotificationsReadModal } from './MarkNotificationsReadModal'

interface ListNotificationsProps {
  params: Params
  onPageChange?: (page: number) => void
}

function ListNotifications({ params, onPageChange }: ListNotificationsProps) {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    markRead,
    isMarking,
    deleteNotifications,
    isDeleting,
  } = useNotificationsLogic(params)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<NotificationDTO | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [confirmMarkOpen, setConfirmMarkOpen] = useState(false)

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
    if (!selectedIds.length) return
    await markRead({ ids: selectedIds }).unwrap()
    setSelectedIds([])
    setConfirmMarkOpen(false)
    setActionMenuOpen(false)
  }

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return
    await deleteNotifications({ ids: selectedIds }).unwrap()
    setSelectedIds([])
    setConfirmDeleteOpen(false)
    setActionMenuOpen(false)
  }

  const normalizedPageIds = pageIds.join('|')
  const isReadTab = params.readStatus === 'READ'

  useEffect(() => {
    setSelectedIds([])
    setActionMenuOpen(false)
    setConfirmDeleteOpen(false)
    setConfirmMarkOpen(false)
  }, [isReadTab, normalizedPageIds])

  const hasRenderedData = (data?.data?.length ?? 0) > 0
  const showSkeleton = isLoading || (isFetching && !hasRenderedData)

  if (isError)
    return (
      <p className="text-[#CC3636] mt-2 text-sm text-center">
        Erro ao carregar notificações.
      </p>
    )

  if (showSkeleton) {
    return (
      <NotificationListSkeleton
        count={params.limit ?? 10}
        showActionsBar
      />
    )
  }

  const showEmpty = !notifications.length && !open && !isLoading && !isFetching

  return (
    <>
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mt-3 mb-1 justify-end">
          <Button
            label={allSelectedOnPage ? 'Desmarcar' : 'Selecionar'}
            onClick={toggleAllOnPage}
            disabled={isFetching || isMarking || isDeleting || pageIds.length === 0}
            variant="outline"
            outlineVariantBorderStyle="solid"
            className="!w-auto !max-w-[120px] !px-3 !py-1.5 text-sm rounded-md shrink-0"
          />

          <div className="relative">
            <Button
              label={selectedIds.length ? `Ações (${selectedIds.length})` : 'Ações'}
              onClick={() => setActionMenuOpen((v) => !v)}
              disabled={selectedIds.length === 0 || isMarking || isDeleting}
              variant="outline"
              outlineVariantBorderStyle="solid"
              className="!w-auto !px-3 !py-1.5 text-sm rounded-md shrink-0"
              aria-haspopup="menu"
              aria-expanded={actionMenuOpen}
            />
            {actionMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-md bg-[#1e1e1e] shadow-lg border border-[#333] z-10 overflow-hidden"
              >
                {!isReadTab && (
                  <button
                    role="menuitem"
                    onClick={() => setConfirmMarkOpen(true)}
                    disabled={isMarking}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-200 hover:bg-[#2a2a2a] disabled:opacity-60"
                  >
                    <span>Marcar selecionadas como lidas</span>
                    {isMarking && (
                      <span className="w-3.5 h-3.5 border-2 border-t-transparent border-gray-200 rounded-full animate-spin" />
                    )}
                  </button>
                )}

                <button
                  role="menuitem"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={isDeleting}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 disabled:opacity-60"
                >
                  <span>Remover selecionadas</span>
                  {isDeleting && (
                    <span className="w-3.5 h-3.5 border-2 border-t-transparent border-red-300 rounded-full animate-spin" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="w-full mb-8 mt-4">
          <div className="overflow-y-auto w-full">
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
                  enableSelection={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showEmpty && (
        <p className="text-[#D9D9D9] mb-8 mt-2 text-sm text-center">
          Não há notificações.
        </p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          totalItems={data.total}
          totalPages={data.totalPages}
          currentPage={data.page}
          pageLimit={data.limit}
          onPageChange={(page) => onPageChange?.(page)}
        />
      )}

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

      <DeleteNotificationsModal
        isOpen={confirmDeleteOpen}
        count={selectedIds.length}
        isLoading={isDeleting}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteSelected}
      />

      <MarkNotificationsReadModal
        isOpen={confirmMarkOpen}
        count={selectedIds.length}
        isLoading={isMarking}
        onClose={() => setConfirmMarkOpen(false)}
        onConfirm={handleMarkSelectedAsRead}
      />
    </>
  )
}

export default ListNotifications

function NotificationListSkeleton({
  count = 10,
  showActionsBar = true,
}: {
  count?: number
  showActionsBar?: boolean
}) {
  return (
    <div className="w-full">
      {showActionsBar && (
        <div className="flex items-center gap-3 mt-3 mb-2 justify-end animate-pulse">
          <div className="h-9 w-32 rounded-md bg-[#3A3A3A]" />
          <div className="h-9 w-28 rounded-md bg-[#3A3A3A]" />
        </div>
      )}

      <div className="w-full mb-8 mt-4 animate-pulse">
        <div className="gap-5 w-full flex flex-col justify-center items-center">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="
                w-full max-w-[920px]
                bg-[#262626] border border-[#333]
                rounded-2xl
                p-4 sm:p-5
                flex items-start gap-4 sm:gap-5
                min-h-[104px]
              "
            >
              <div className="h-6 w-6 rounded bg-[#3A3A3A] mt-1" />

              <div className="flex-1">
                <div className="h-5 w-3/4 bg-[#3A3A3A] rounded mb-3" />
                <div className="h-4 w-1/2 bg-[#3A3A3A] rounded mb-2" />
                <div className="h-3 w-1/3 bg-[#3A3A3A] rounded" />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded bg-[#3A3A3A]" />
                <div className="h-6 w-6 rounded bg-[#3A3A3A]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
