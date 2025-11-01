import React from 'react'
import { Status as ApiStatus } from '../../../../../../store/appointment/types'

export type Status = ApiStatus

export type StatusFilterChipsCmp = React.ComponentType<{
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

export type FilterBaseProps = {
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
  StatusFilterChips: StatusFilterChipsCmp
}

export type FilterPopoverProps = FilterBaseProps & {
  popoverRef: React.RefObject<HTMLDivElement>
}

export type FilterSheetProps = FilterBaseProps
