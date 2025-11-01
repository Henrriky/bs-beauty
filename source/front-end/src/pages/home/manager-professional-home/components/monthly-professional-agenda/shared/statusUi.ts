import { Status as ApiStatus } from '../../../../../../store/appointment/types'

export type FilterableStatus =
  | ApiStatus.PENDING
  | ApiStatus.CONFIRMED
  | ApiStatus.CANCELLED
  | ApiStatus.FINISHED

export const statusUi = {
  chipClass: {
    CONFIRMED: 'bg-blue-400/20 text-white',
    PENDING: 'bg-yellow-400/20 text-white',
    CANCELLED: 'bg-red-400/20 text-white',
    FINISHED: 'bg-green-400/20 text-white',
  } as const satisfies Record<FilterableStatus, string>,

  icon: {
    CONFIRMED: '●',
    PENDING: '◐',
    CANCELLED: '⛔',
    FINISHED: '✓',
  } as const satisfies Record<FilterableStatus, string>,

  labelPt: {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    CANCELLED: 'Cancelado',
    FINISHED: 'Finalizado',
  } as const satisfies Record<FilterableStatus, string>,
}

export const chipFor = (s: ApiStatus) => statusUi.chipClass[s as FilterableStatus] ?? 'bg-zinc-700/20 text-zinc-300'
export const iconFor = (s: ApiStatus) => statusUi.icon[s as FilterableStatus] ?? '•'
export const labelFor = (s: ApiStatus) => statusUi.labelPt[s as FilterableStatus] ?? String(s)
