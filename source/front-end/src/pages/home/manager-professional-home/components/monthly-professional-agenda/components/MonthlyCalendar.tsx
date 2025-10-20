import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { format, isSameDay, startOfDay, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from 'react-calendar'

type Status = string
type DayBucket = { date: Date; items: Array<{ status: Status }> }

type Props = {
  currentMonth: Date
  selectedDate: Date | null
  byDay: Map<string, DayBucket>
  appliedStatuses: Status[]
  statusChip: (s: Status) => string
  legendIcon: (s: Status) => string
  prettyStatus: (s: Status) => string
  onMonthChange: (d: Date) => void
  onSelectDate: (d: Date) => void
}



export default function MonthlyCalendar({
  currentMonth,
  selectedDate,
  byDay,
  appliedStatuses,
  statusChip,
  legendIcon,
  prettyStatus: _prettyStatus,
  onMonthChange,
  onSelectDate,
}: Props) {
  const dayKey = (d: Date) => format(startOfDay(d), 'yyyy-MM-dd')

  function buildStatusCounts<TStatus extends string>(
    items: Array<{ status: TStatus }>,
    applied: TStatus[]
  ) {
    const counts: Partial<Record<TStatus, number>> = {}
    for (const it of items) {
      if (!applied.length || applied.includes(it.status)) {
        counts[it.status] = (counts[it.status] ?? 0) + 1
      }
    }
    return Object.entries(counts) as Array<[TStatus, number]>
  }

  function tileClassBase(date: Date, selected: Date | null, monthRef: Date) {
    const c = ['rc-tile', 'rounded-[10px]']
    if (isSameDay(date, new Date())) c.push('rc-is-today')
    if (selected && isSameDay(date, selected)) c.push('rc-is-selected')
    if (date.getMonth() !== monthRef.getMonth()) c.push('rc-is-outside')
    return c.join(' ')
  }

  return (
    <Calendar
      className="react-calendar rcScoped text-[#A4978A] w-full"
      locale="pt-BR"
      showNeighboringMonth={false}
      minDetail="month"
      prev2Label={null}
      next2Label={null}
      prevLabel={<ChevronLeftIcon className="size-5" />}
      nextLabel={<ChevronRightIcon className="size-5" />}
      navigationLabel={({ view }) =>
        view === 'month'
          ? (
            <span className="text-[#595149]">
              {format(currentMonth, "LLLL 'de' yyyy", { locale: ptBR })}
            </span>
          )
          : null
      }
      formatShortWeekday={(_, date) =>
        date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase()
      }
      activeStartDate={currentMonth}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) onMonthChange(startOfMonth(activeStartDate))
      }}
      value={selectedDate ?? undefined}
      onClickDay={(value) => onSelectDate(value as Date)}
      tileClassName={({ date, view }) =>
        view !== 'month' ? '' : tileClassBase(date, selectedDate, currentMonth)
      }
      tileContent={({ date, view }) => {
        if (view !== 'month') return null

        const bucket = byDay.get(dayKey(date))
        if (!bucket) return null

        const entries = buildStatusCounts(bucket.items, appliedStatuses)
        if (!entries.length) return null

        entries.sort((a, b) => b[1] - a[1])

        const visible = entries.slice(0, 3)
        const extra = entries.length - visible.length

        return (
          <div className="rc-chipwrap">
            {visible.map(([k, v]) => (
              <span key={k} className={`rc-chip ${statusChip(k)}`}>
                {legendIcon(k)} {v}
              </span>
            ))}
            {extra > 0 && (
              <span className="rc-chip bg-black/20 text-primary-200">+{extra}</span>
            )}
          </div>
        )
      }}
    />
  )
}
