import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type Props = {
  open: boolean
  onClose: () => void

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

function FilterSheet({
  open,
  onClose,
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
      className="sm:hidden absolute inset-x-0 bottom-0 z-[60] bg-secondary-100 border-t border-[#595149] p-4 rounded-t-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-primary-200 font-medium">Filtros</div>
        <button className="p-2 rounded hover:bg-black/20" onClick={onClose}>
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="space-y-4">
        <StatusFilterChips
          dense
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

      <div className="mt-4 flex justify-end gap-2">
        <button className="px-3 py-1.5 rounded hover:bg-black/20" onClick={onClear}>
          Limpar
        </button>
        <button className="px-3 py-1.5 rounded bg-[#3A3027] text-[#A4978A]" onClick={onApply}>
          Aplicar
        </button>
      </div>
    </div>
  )
}

export default FilterSheet
