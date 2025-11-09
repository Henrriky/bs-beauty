import {
  addMonths, endOfMonth, format,
  startOfMonth
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useRef, useState } from 'react'
import useAppSelector from '../../../../../hooks/use-app-selector'
import { appointmentAPI } from '../../../../../store/appointment/appointment-api'
import { Status as ApiStatus } from '../../../../../store/appointment/types'
import CalendarPanel from './components/CalendarPanel'
import DayPanel from './components/DayPanel'
import FilterPopover from './components/FilterPopover'
import FilterSheet from './components/FilterSheet'
import MonthlyAgendaHeader from './components/MonthlyAgendaHeader'
import StatusFilterChips from './components/StatusFilterChips'
import {
  chipFor as statusChip,
  iconFor as legendIcon,
  labelFor as prettyStatus,
} from './shared/statusUi'

type Status = ApiStatus
type Props = { isOpen: boolean; onClose: () => void }

const FILTERABLE_STATUSES: Status[] = [
  ApiStatus.PENDING,
  ApiStatus.CONFIRMED,
  ApiStatus.CANCELLED,
  ApiStatus.FINISHED,
]

export default function MonthlyAgendaModal({ isOpen, onClose }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState<'calendar' | 'day'>('calendar')

  const [appliedStatuses, setAppliedStatuses] = useState<Status[]>([])
  const [draftStatuses, setDraftStatuses] = useState<Status[]>([])

  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user?.userType === 'MANAGER'
  const [viewAll, setViewAll] = useState(false)

  const [filterOpen, setFilterOpen] = useState(false)
  const desktopPopoverRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mm = window.matchMedia('(min-width: 640px)')
    const update = () => setIsDesktop(mm.matches)
    update()
    mm.addEventListener('change', update)
    return () => mm.removeEventListener('change', update)
  }, [])

  const openFilter = () => { setDraftStatuses(appliedStatuses); setFilterOpen(true) }
  const applyFilter = () => { setAppliedStatuses(draftStatuses); setFilterOpen(false) }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!filterOpen || !isDesktop) return
      if (desktopPopoverRef.current && !desktopPopoverRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [filterOpen, isDesktop])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const fromYMD = format(monthStart, 'yyyy-MM-dd')
  const toYMD = format(monthEnd, 'yyyy-MM-dd')

  const queryStatuses = appliedStatuses.length ? appliedStatuses : undefined

  const { data, isLoading, isError } = appointmentAPI.useFetchAppointmentsQuery({
    page: 1,
    limit: 50,
    from: fromYMD,
    to: toYMD,
    status: queryStatuses,
    viewAll: isManager ? viewAll : undefined,
  })

  const byDay = useMemo(() => {
    type Item = {
      id: string
      status: Status
      start: Date
      durationMin: number | null
      customerName: string
      serviceName: string
      professionalName: string | null
    }
    const map = new Map<string, { date: Date; items: Item[] }>()
    const add = (day: Date, appt: any) => {
      const key = day.toDateString()
      if (!map.has(key)) map.set(key, { date: day, items: [] })
      map.get(key)!.items.push({
        id: appt.id,
        status: appt.status as Status,
        start: new Date(appt.appointmentDate),
        durationMin: appt.offer?.estimatedTime ?? null,
        customerName: appt.customer?.name ?? 'Cliente',
        serviceName: appt.offer?.service?.name ?? 'Serviço',
        professionalName: appt.offer?.professional?.name ?? null,
      })
    }
    data?.data.forEach(appt => {
      const d = new Date(appt.appointmentDate)
      add(new Date(d.getFullYear(), d.getMonth(), d.getDate()), appt)
    })
    return map
  }, [data])

  const dayList = useMemo(() => {
    if (!selectedDate) return []
    const key = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ).toDateString()
    const items = byDay.get(key)?.items ?? []
    const allow = appliedStatuses.length ? (s: Status) => appliedStatuses.includes(s) : () => true
    return items
      .filter(i => allow(i.status))
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }, [selectedDate, byDay, appliedStatuses])

  if (!isOpen) return null

  const monthLabel = format(currentMonth, "LLLL 'de' yyyy", { locale: ptBR })
  const goPrevMonth = () => setCurrentMonth(d => startOfMonth(addMonths(d, -1)))
  const goNextMonth = () => setCurrentMonth(d => startOfMonth(addMonths(d, 1)))
  const goToday = () => { const t = new Date(); setCurrentMonth(startOfMonth(t)); setSelectedDate(t); setActiveTab('day') }

  const toggleDraftStatus = (s: Status) =>
    setDraftStatuses(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  const markAllStatuses = () => setDraftStatuses([...FILTERABLE_STATUSES])
  const clearStatuses = () => setDraftStatuses([])

  return (
    <div role="dialog" aria-modal="true" aria-label="Agenda do mês" className="fixed inset-0 z-50">

      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-stretch justify-center">
        <div className="relative m-0 sm:m-6 w-full sm:w-[min(980px,95vw)] h-[100svh] sm:h-[82vh] bg-secondary-100 rounded-none sm:rounded-[12px] shadow-xl overflow-hidden text-primary-100 pb-[env(safe-area-inset-bottom)]">

          <MonthlyAgendaHeader
            monthLabel={monthLabel}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
            onToday={goToday}
            onCloseModal={onClose}
            isManager={isManager}
            viewAll={viewAll}
            onToggleViewAll={() => setViewAll(v => !v)}
            onOpenFilter={openFilter}
          />

          {filterOpen && (
            <FilterPopover
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              popoverRef={desktopPopoverRef}
              statuses={FILTERABLE_STATUSES}
              selected={draftStatuses}
              onToggle={toggleDraftStatus}
              onMarkAll={markAllStatuses}
              onClear={clearStatuses}
              onApply={applyFilter}
              legendIcon={legendIcon}
              prettyStatus={prettyStatus}
              statusChip={statusChip}
              StatusFilterChips={StatusFilterChips}
            />
          )}


          <div className="sm:hidden flex border-b border-[#595149]">
            <button className={`flex-1 py-2 text-sm ${activeTab === 'calendar' ? 'text-secondary-300 border-b-2 border-secondary-300' : 'text-primary-300'}`} onClick={() => setActiveTab('calendar')}>Calendário</button>
            <button className={`flex-1 py-2 text-sm ${activeTab === 'day' ? 'text-secondary-300 border-b-2 border-secondary-300' : 'text-primary-300'}`} onClick={() => setActiveTab('day')} disabled={!selectedDate}>Dia</button>
          </div>

          <div className="h-[calc(100%-104px)] sm:h-[calc(100%-64px)] grid grid-cols-1 sm:grid-cols-12">
            <section className={`${activeTab === 'calendar' ? 'block' : 'hidden'} sm:block sm:col-span-7 md:col-span-8 border-r border-[#595149] overflow-y-auto`}>
              <CalendarPanel
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onChangeMonth={(d) => setCurrentMonth(d)}
                onSelectDate={(d) => { setSelectedDate(d); setActiveTab('day') }}
                byDay={byDay}
                appliedStatuses={appliedStatuses}
                legendIcon={legendIcon}
                statusChip={statusChip}
                isLoading={isLoading}
                isError={isError}
              />
            </section>

            <section className={`${activeTab === 'day' ? 'block' : 'hidden'} sm:block sm:col-span-5 md:col-span-4 overflow-y-auto`}>
              <DayPanel
                selectedDate={selectedDate}
                dayList={dayList}
                isManager={isManager}
                viewAll={viewAll}
                legendIcon={legendIcon}
                prettyStatus={prettyStatus}
                statusChip={statusChip}
                isLoading={isLoading}
                isError={isError}
              />
            </section>
          </div>

          {filterOpen && (
            <FilterSheet
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              statuses={FILTERABLE_STATUSES}
              selected={draftStatuses}
              onToggle={toggleDraftStatus}
              onMarkAll={markAllStatuses}
              onClear={clearStatuses}
              onApply={applyFilter}
              legendIcon={legendIcon}
              prettyStatus={prettyStatus}
              statusChip={statusChip}
              StatusFilterChips={StatusFilterChips}
            />
          )}

          <style>{`
            .rcScoped.react-calendar{ width:100%!important; background:transparent!important; border:0!important; color:#A4978A; }
            .rcScoped .react-calendar__navigation{ height:40px; margin-bottom:.25rem; }
            .rcScoped .react-calendar__navigation button{ background:transparent; border:0; color:#A4978A; }
            .rcScoped .react-calendar__month-view__weekdays{ text-transform:uppercase; font-size:12px; color:#B4ACA3; margin-bottom:6px; }
            .rcScoped .react-calendar__month-view__weekdays__weekday abbr{ text-decoration:none!important; }

            .rcScoped .react-calendar__tile.rc-tile{
              position:relative; background:rgba(225,216,207,0.05); border:1px solid rgba(164,151,138,0.28);
              border-radius:10px; padding:.6rem .5rem; padding-bottom:1.4rem; transition:background .15s,border-color .15s,box-shadow .15s;
              box-sizing:border-box; min-height:64px;
            }
            @media (min-width:640px){ .rcScoped .react-calendar__tile.rc-tile{ min-height:76px; } }
            @media (min-width:1024px){ .rcScoped .react-calendar__tile.rc-tile{ min-height:84px; } }

            .rcScoped .react-calendar__month-view__days__day abbr{ font-size:13px; font-weight:600; color:#8F8074; letter-spacing:.2px; }
            .rcScoped .react-calendar__month-view__days__day--weekend abbr{ color:#E46A6A; }
            .rcScoped .react-calendar__tile--now{ box-shadow:inset 0 0 0 2px rgba(164,151,138,.55); }
            .rcScoped .react-calendar__tile--active{ box-shadow:0 0 0 2px #B79E85; background:rgba(183,158,133,.08); }
            .rcScoped .react-calendar__tile:enabled:hover{ background:rgba(164,151,138,0.10); border-color:rgba(164,151,138,0.45); }
            @media (hover:none){ .rcScoped .react-calendar__tile:enabled:hover{ background:inherit!important; border-color:inherit!important; } }

            .rcScoped .rc-chipwrap{ position:absolute; left:6px; right:6px; bottom:6px; display:flex; flex-wrap:wrap; gap:4px; pointer-events:none; }
            .rcScoped .rc-chip{ padding:2px 6px; font-size:10px; line-height:1; border-radius:6px; white-space:nowrap; pointer-events:auto; }

            /* navegação: setas coladas ao label do mês */
            .rcScoped.react-calendar .react-calendar__navigation{
              display:flex !important;
              align-items:center !important;
              justify-content:center !important;  /* evita space-between */
              gap:8px !important;
            }

            /* o label não “expande” */
            .rcScoped.react-calendar .react-calendar__navigation__label{
              flex:0 0 auto !important;  /* equivale a flex-grow:0, flex-basis:auto */
              padding:0 .25rem !important;
              margin:0 !important;
            }

            /* setas menores e sem min-width do lib */
            .rcScoped.react-calendar .react-calendar__navigation__arrow{
              min-width:auto !important;
              padding:2px 4px !important;
              flex:0 0 auto !important;
            }

            /* ordem explícita: [prev] [label] [next] */
            .rcScoped.react-calendar .react-calendar__navigation__prev-button{ order:1 !important; }
            .rcScoped.react-calendar .react-calendar__navigation__label{       order:2 !important; }
            .rcScoped.react-calendar .react-calendar__navigation__next-button{ order:3 !important; }

          `}</style>
        </div>
      </div>
    </div>
  )
}
