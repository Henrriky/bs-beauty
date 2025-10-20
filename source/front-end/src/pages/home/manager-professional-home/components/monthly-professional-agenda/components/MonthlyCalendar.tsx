import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { format, startOfDay, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from 'react-calendar'
import {
  buildStatusCounts,
  generateTileClasses,
  baseCalendarConfig,
  formatShortWeekday
} from '../shared/calendar-utils'
import { renderStatusChips } from '../shared/calendar-components'

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

  return (
    <Calendar
      {...baseCalendarConfig}
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
      formatShortWeekday={formatShortWeekday}
      activeStartDate={currentMonth}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) onMonthChange(startOfMonth(activeStartDate))
      }}
      value={selectedDate ?? undefined}
      onClickDay={(value) => onSelectDate(value as Date)}
      tileClassName={({ date, view }) =>
        view !== 'month' ? '' : generateTileClasses(date, selectedDate, currentMonth)
      }
      tileContent={({ date, view }) => {
        if (view !== 'month') return null

        const bucket = byDay.get(dayKey(date))
        if (!bucket) return null

        const statusCounts = buildStatusCounts(bucket.items, appliedStatuses)

        return renderStatusChips(statusCounts, statusChip, legendIcon)
      }}
    />
  )
}
