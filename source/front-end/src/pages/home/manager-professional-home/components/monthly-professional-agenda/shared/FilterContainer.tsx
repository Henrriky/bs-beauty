import React from 'react'
import type { FilterBaseProps } from './filter-types'
import FilterSharedContent from './FilterSharedContent'

type Mode = 'popover' | 'sheet'

type Props = FilterBaseProps & {
  mode: Mode
  popoverRef?: React.RefObject<HTMLDivElement>
}

export default function FilterContainer({
  mode,
  popoverRef,
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

  if (mode === 'popover') {
    return (
      <div
        ref={popoverRef}
        className="hidden sm:block absolute right-3 top-[56px] z-[60] w-[360px]
                   rounded-lg border border-[#595149] bg-secondary-100 shadow-xl"
      >
        <FilterSharedContent
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

  return (
    <div
      className="sm:hidden absolute inset-x-0 bottom-0 z-[60] bg-secondary-100 border-t border-[#595149] p-4 rounded-t-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="-mx-4 -mt-4">
        <FilterSharedContent
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
          dense
        />
      </div>
    </div>
  )
}
