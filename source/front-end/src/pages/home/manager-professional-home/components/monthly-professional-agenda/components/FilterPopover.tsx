import React from 'react'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'
import FilterContent from '../shared/FilterSharedContent'

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
      <FilterContent
        onClose={onClose}
        statuses={statuses}
        selected={selected}
        onToggle={onToggle}
        onMarkAll={onMarkAll}
        onClear={onClear}
        onApply={onApply}
        legendIcon={legendIcon}
        prettyStatus={prettyStatus}
        statusChip={statusChip}
        StatusFilterChips={StatusFilterChips}
      />
    </div>
  )
}

export default FilterPopover
