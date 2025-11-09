import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

type Status = ApiStatus

type ContentProps = {
  title?: string
  onClose: () => void
  statuses: Status[]
  selected: Status[]
  onToggle: (s: Status) => void
  onMarkAll: () => void
  onClear: () => void
  onApply: () => void
  dense?: boolean
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

function FilterSharedContent({
  title = 'Filtros',
  onClose,
  statuses,
  selected,
  onToggle,
  onMarkAll,
  onClear,
  onApply,
  dense = false,
  legendIcon,
  prettyStatus,
  statusChip,
  StatusFilterChips,
}: ContentProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#595149]">
        <span className="text-primary-300 font-medium">{title}</span>
        <button
          className="p-1.5 rounded hover:bg-black/20"
          onClick={onClose}
          aria-label="Fechar filtros"
        >
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
          dense={dense}
          legendIcon={legendIcon}
          prettyStatus={prettyStatus}
          statusChip={statusChip}
        />
      </div>

      <div className="px-3 py-2 border-t border-[#595149] flex justify-end gap-2">
        <button
          className="px-3 py-1.5 hover:bg-black/10 rounded text-primary-300"
          onClick={onClear}
        >
          Limpar
        </button>
        <button
          className="px-3 py-1.5 rounded bg-[#595149] text-[#D9D9D9]"
          onClick={onApply}
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}

export default FilterSharedContent
