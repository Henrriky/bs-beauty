import Calendar from 'react-calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { isSameDay, startOfMonth } from 'date-fns'

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
  // prettyStatus (não é usado aqui, mantido por simetria/futuro)
  onMonthChange,
  onSelectDate,
}: Props) {
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
      navigationLabel={({ label, view }) =>
        view === 'month'
          ? (
            <span className="text-[#A5A5A5]">
              {`${label.split(' ')[0].replace(/^\w/, c => c.toUpperCase())} - ${label.split(' ')[2]}`}
            </span>
          )
          : label
      }
      formatShortWeekday={(_, date) =>
        date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase()
      }
      activeStartDate={currentMonth}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) onMonthChange(startOfMonth(activeStartDate))
      }}
      value={selectedDate ?? undefined}
      onClickDay={(value) => onSelectDate(value)}
      tileClassName={({ date, view }) => {
        if (view !== 'month') return ''
        const c = ['rc-tile', 'rounded-[10px]']
        if (isSameDay(date, new Date())) c.push('rc-is-today')
        if (selectedDate && isSameDay(date, selectedDate)) c.push('rc-is-selected')
        if (date.getMonth() !== currentMonth.getMonth()) c.push('rc-is-outside')
        return c.join(' ')
      }}
      tileContent={({ date, view }) => {
        if (view !== 'month') return null
        const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString()
        const bucket = byDay.get(key)
        if (!bucket) return null

        // conta apenas os statuses aplicados (ou todos se nenhum aplicado)
        const counts: Partial<Record<Status, number>> = {}
        for (const it of bucket.items) {
          if (!appliedStatuses.length || appliedStatuses.includes(it.status)) {
            counts[it.status] = (counts[it.status] ?? 0) + 1
          }
        }
        const entries = Object.entries(counts) as Array<[Status, number]>
        if (!entries.length) return null

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
