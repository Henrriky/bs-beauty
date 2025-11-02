import { isSameDay } from 'date-fns'

export function buildStatusCounts<TStatus extends string>(
  items: Array<{ status: TStatus }>,
  appliedStatuses: TStatus[]
): Array<[TStatus, number]> {
  const counts: Partial<Record<TStatus, number>> = {}

  for (const item of items) {
    if (!appliedStatuses.length || appliedStatuses.includes(item.status)) {
      counts[item.status] = (counts[item.status] ?? 0) + 1
    }
  }

  return (Object.entries(counts) as Array<[TStatus, number]>).sort((a, b) => b[1] - a[1])
}

export function generateTileClasses(
  date: Date,
  selectedDate: Date | null,
  currentMonth: Date
): string {
  const classes = ['rc-tile', 'rounded-[10px]']

  if (isSameDay(date, new Date())) {
    classes.push('rc-is-today')
  }

  if (selectedDate && isSameDay(date, selectedDate)) {
    classes.push('rc-is-selected')
  }

  if (date.getMonth() !== currentMonth.getMonth()) {
    classes.push('rc-is-outside')
  }

  return classes.join(' ')
}

export const baseCalendarConfig = {
  className: "react-calendar rcScoped text-[#A4978A] w-full",
  locale: "pt-BR" as const,
  showNeighboringMonth: false,
  minDetail: "month" as const,
  prev2Label: null,
  next2Label: null,
}

export const formatShortWeekday = (_: any, date: Date): string => {
  return date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase()
}