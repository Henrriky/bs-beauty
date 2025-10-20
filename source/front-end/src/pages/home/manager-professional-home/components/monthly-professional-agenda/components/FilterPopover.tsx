import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type Props = {
  open: boolean
  onClose: () => void

  popoverRef: React.RefObject<HTMLDivElement>

  statuses: Status[]
  selected: Status[]
  onToggle: (s: Status) => void
  onMarkAll: () => void
  onClear: () => void
  onApply: () => void
  legendIcon: (s: Status) => string
  prettyStatus: (s: Status) => string
  statusChip: (s: Status) => string

  StatusFilterChips: React.ComponentType<{
    statuses: Status[]
    selected: Status[]
    onToggle: (s: Status) => void
    onMarkAll: () => void
    onClear: () => void
    dense?: boolean
    legendIcon: (s: Status) => string
    prettyStatus: (s: Status) => string
    statusChip: (s: Status) => string
  }>
}

function FilterPopover({
  open,
  onClose,
  popoverRef,
  statuses,
  selected,
  onToggle,
  onMarkAll,
  onClear,
  onApply,
  legendIcon,
  prettyStatus,
  statusChip,
  StatusFilterChips,
}: Props) {
  if (!open) return null

  return (
    <div
      ref={popoverRef}
      className="hidden sm:block absolute right-3 top-[56px] z-[60] w-[360px]
                 rounded-lg border border-[#595149] bg-secondary-100 shadow-xl"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#595149]">
        <span className="text-primary-200 font-medium">Filtros</span>
        <button className="p-1.5 rounded hover:bg-black/20" onClick={onClose}>
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="p-3">
        <StatusFilterChips
          statuses={statuses}
          selected={selected}
          onToggle={onToggle}
          onMarkAll={onMarkAll}
          onClear={onClear}
          legendIcon={legendIcon}
          prettyStatus={prettyStatus}
          statusChip={statusChip}
        />
      </div>

      <div className="px-3 py-2 border-t border-[#595149] flex justify-end gap-2">
        <button className="px-3 py-1.5 rounded hover:bg-black/20" onClick={onClear}>
          Limpar
        </button>
        <button
          className="px-3 py-1.5 rounded bg-[#3A3027] text-[#A4978A]"
          onClick={onApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}

export default FilterPopover
