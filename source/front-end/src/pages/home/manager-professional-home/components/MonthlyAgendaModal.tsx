import {
  ChevronLeftIcon, ChevronRightIcon, FunnelIcon, XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  addMonths, endOfMonth, format, isSameDay, startOfMonth,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useMemo, useRef, useState } from 'react'
import Calendar from 'react-calendar'
import { appointmentAPI } from '../../../../store/appointment/appointment-api'
import useAppSelector from '../../../../hooks/use-app-selector'

type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED'
type Props = { isOpen: boolean; onClose: () => void }

const ALL_STATUSES: Status[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED']

const statusChip = (s: Status) => ({
  CONFIRMED: 'bg-green-700/20 text-green-300',
  PENDING: 'bg-yellow-700/20 text-yellow-300',
  CANCELLED: 'bg-zinc-700/20 text-zinc-300',
  FINISHED: 'bg-purple-700/20 text-purple-300',
}[s] ?? 'bg-zinc-700/20 text-zinc-300')

const legendIcon = (s: Status) => ({
  CONFIRMED: '●',
  PENDING: '◐',
  CANCELLED: '⛔',
  FINISHED: '✓',
}[s] ?? '•')

const prettyStatus = (s: Status) => ({
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  FINISHED: 'Finalizado',
}[s] ?? s)

export default function MonthlyAgendaModal({ isOpen, onClose }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState<'calendar' | 'day'>('calendar')

  // filtro por status (aplicado x rascunho)
  const [appliedStatuses, setAppliedStatuses] = useState<Status[]>([])
  const [draftStatuses, setDraftStatuses] = useState<Status[]>([])

  // gerente e "visualizar todos"
  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user?.userType === 'MANAGER'
  const [viewAll, setViewAll] = useState(false)

  // abrir/fechar painéis de filtro
  const [filterOpen, setFilterOpen] = useState(false)
  const desktopPopoverRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  // breakpoint para controlar outside-click somente no desktop
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mm = window.matchMedia('(min-width: 640px)')
    const update = () => setIsDesktop(mm.matches)
    update()
    mm.addEventListener('change', update)
    return () => mm.removeEventListener('change', update)
  }, [])

  // abre filtro copiando o aplicado p/ rascunho
  const openFilter = () => { setDraftStatuses(appliedStatuses); setFilterOpen(true) }
  const applyFilter = () => { setAppliedStatuses(draftStatuses); setFilterOpen(false) }

  // fecha popover desktop ao clicar fora
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

  // trava scroll do body quando o modal está aberto
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // intervalo do mês atual
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const fromISO = monthStart.toISOString()
  const toISO = monthEnd.toISOString()

  // se nada selecionado, não envia "status" (=> todos)
  const queryStatuses = appliedStatuses.length ? appliedStatuses : undefined

  const { data, isLoading, isError } = appointmentAPI.useFetchAppointmentsQuery({
    page: 1,
    limit: 50,
    from: fromISO,
    to: toISO,
    status: queryStatuses,
    viewAll: isManager ? viewAll : undefined,
  })

  // indexa por dia
  const byDay = useMemo(() => {
    type Item = {
      id: string
      status: Status
      start: Date
      durationMin: number | null
      customerName: string
      serviceName: string
      professionalName: string | null  // ⬅️ novo campo
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
        professionalName: appt.offer?.professional?.name ?? null, // ⬅️ vem do back
      })
    }
    data?.data.forEach(appt => {
      const d = new Date(appt.appointmentDate)
      add(new Date(d.getFullYear(), d.getMonth(), d.getDate()), appt)
    })
    return map
  }, [data])

  // lista do painel do dia (filtra pelos statuses aplicados)
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

  // chips reutilizáveis (editam APENAS o rascunho)
  const StatusChips = ({ dense = false }: { dense?: boolean }) => (
    <>
      <div className={`text-sm text-primary-300 ${dense ? 'mb-1.5' : 'mb-2'}`}>Status</div>
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(s => {
          const active = draftStatuses.includes(s)
          return (
            <button
              key={s}
              type="button"
              onClick={() =>
                setDraftStatuses(prev =>
                  prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                )
              }
              className={`px-2 py-1 rounded text-xs border
                ${active ? 'bg-[#3A3027] text-[#A4978A] border-transparent'
                  : 'bg-black/15 text-primary-200 border-[#6a5f54]'}`}
            >
              {legendIcon(s)} {prettyStatus(s)}
            </button>
          )
        })}
      </div>
      <div className={`flex gap-2 ${dense ? 'mt-2' : 'mt-3'}`}>
        <button
          type="button"
          className="px-2 py-1 rounded text-xs hover:bg-black/20"
          onClick={() => setDraftStatuses(ALL_STATUSES)}
        >
          Marcar todos
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded text-xs hover:bg-black/20"
          onClick={() => setDraftStatuses([])}
        >
          Limpar
        </button>
      </div>
    </>
  )

  return (
    <div role="dialog" aria-modal="true" aria-label="Agenda do mês" className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-stretch justify-center">
        <div className="relative m-0 sm:m-6 w-full sm:w-[min(980px,95vw)] h-[100svh] sm:h-[82vh] bg-secondary-100 rounded-none sm:rounded-[12px] shadow-xl overflow-hidden text-primary-100 pb-[env(safe-area-inset-bottom)]">

          {/* Header */}
          <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-[#595149] relative">
            <button className="p-2 rounded hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#A4978A]" onClick={goPrevMonth}>
              <ChevronLeftIcon className="size-5" />
            </button>
            <div className="mx-1 sm:mx-2 font-medium">
              {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
            </div>
            <button className="p-2 rounded hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#A4978A]" onClick={goNextMonth}>
              <ChevronRightIcon className="size-5" />
            </button>
            <button className="ml-1 sm:ml-2 px-3 py-1.5 text-sm rounded bg-[#3A3027] text-[#A4978A]" onClick={goToday}>
              Hoje
            </button>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {isManager && (
                <button
                  type="button"
                  onClick={() => setViewAll(v => !v)}
                  className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm rounded hover:bg-black/20 ${viewAll ? 'bg-[#3A3027] text-[#A4978A]' : ''
                    }`}
                  title="Visualizar todos os agendamentos"
                >
                  <span className="sm:hidden">Todos</span>
                  <span className="hidden sm:inline">Visualizar todos</span>
                </button>
              )}


              <button onClick={openFilter} className="inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm rounded hover:bg-black/20">
                <FunnelIcon className="size-5" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              <button onClick={onClose} className="p-2 rounded hover:bg-black/20" aria-label="Fechar">
                <XMarkIcon className="size-5" />
              </button>
            </div>

            {/* Popover Desktop */}
            {filterOpen && (
              <div
                ref={desktopPopoverRef}
                className="hidden sm:block absolute right-3 top-[56px] z-[60] w-[360px]
                           rounded-lg border border-[#595149] bg-secondary-100 shadow-xl"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#595149]">
                  <span className="text-primary-200 font-medium">Filtros</span>
                  <button className="p-1.5 rounded hover:bg-black/20" onClick={() => setFilterOpen(false)}>
                    <XMarkIcon className="size-5" />
                  </button>
                </div>
                <div className="p-3">
                  <StatusChips />
                </div>
                <div className="px-3 py-2 border-t border-[#595149] flex justify-end gap-2">
                  <button className="px-3 py-1.5 rounded hover:bg-black/20" onClick={() => setDraftStatuses([])}>
                    Limpar
                  </button>
                  <button className="px-3 py-1.5 rounded bg-[#3A3027] text-[#A4978A]" onClick={applyFilter}>
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Abas (mobile) */}
          <div className="sm:hidden flex border-b border-[#595149]">
            <button className={`flex-1 py-2 text-sm ${activeTab === 'calendar' ? 'text-secondary-300 border-b-2 border-secondary-300' : 'text-primary-300'}`} onClick={() => setActiveTab('calendar')}>Calendário</button>
            <button className={`flex-1 py-2 text-sm ${activeTab === 'day' ? 'text-secondary-300 border-b-2 border-secondary-300' : 'text-primary-300'}`} onClick={() => setActiveTab('day')} disabled={!selectedDate}>Dia</button>
          </div>

          {/* Conteúdo */}
          <div className="h-[calc(100%-104px)] sm:h-[calc(100%-64px)] grid grid-cols-1 sm:grid-cols-12">

            {/* Calendário */}
            <section className={`${activeTab === 'calendar' ? 'block' : 'hidden'} sm:block sm:col-span-7 md:col-span-8 border-r border-[#595149] overflow-y-auto`}>
              <div className="rcWrap w-full">
                <Calendar
                  className="react-calendar rcScoped text-[#A4978A] w-full"
                  locale="pt-BR"
                  showNeighboringMonth={false}
                  minDetail="month"
                  prev2Label={null}
                  next2Label={null}
                  prevLabel={<ChevronLeftIcon className="size-5" />}
                  nextLabel={<ChevronRightIcon className="size-5" />}
                  navigationLabel={({ label, view }) => view === 'month'
                    ? <span className="text-[#A5A5A5]">{`${label.split(' ')[0].replace(/^\w/, c => c.toUpperCase())} - ${label.split(' ')[2]}`}</span>
                    : label}
                  formatShortWeekday={(_, date) => date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase()}

                  activeStartDate={currentMonth}
                  onActiveStartDateChange={({ activeStartDate }) => { if (activeStartDate) setCurrentMonth(startOfMonth(activeStartDate)) }}

                  value={selectedDate ?? undefined}
                  onClickDay={(value) => { setSelectedDate(value); setActiveTab('day') }}

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
                          <span key={k} className={`rc-chip ${statusChip(k)}`}>{legendIcon(k)} {v}</span>
                        ))}
                        {extra > 0 && <span className="rc-chip bg-black/20 text-primary-200">+{extra}</span>}
                      </div>
                    )
                  }}
                />
                {isLoading && <div className="px-4 py-3 text-sm text-primary-300">Carregando agendamentos…</div>}
                {isError && <div className="px-4 py-3 text-sm text-red-300">Erro ao carregar dados.</div>}
              </div>
            </section>

            {/* Painel do dia */}
            <section className={`${activeTab === 'day' ? 'block' : 'hidden'} sm:block sm:col-span-5 md:col-span-4 overflow-y-auto`}>
              <div className="flex items-center justify-between p-3 sm:p-4">
                <div className="text-primary-200 font-medium">
                  {selectedDate ? format(selectedDate, "EEEE, dd 'de' LLL", { locale: ptBR }) : 'Selecione um dia'}
                </div>
              </div>
              <div className="bg-[#595149] w-full h-0.5" />
              <div className="p-3 sm:p-4 space-y-2">
                {selectedDate && dayList.length > 0 ? (
                  dayList.map(a => (
                    <article key={a.id} className="rounded-md bg-[#3A3027]/60 p-3 flex items-start gap-3">
                      <div className="text-primary-0 text-sm w-16 shrink-0">
                        {format(a.start, 'HH:mm')}<br />
                        {a.durationMin ? <span className="text-primary-0 text-xs">({a.durationMin}m)</span> : null}
                      </div>
                      <div className="flex-1">
                        <div className="text-primary-0 text-[15px] font-medium">
                          {a.customerName} • {a.serviceName}
                        </div>

                        {
                          isManager && viewAll && a.professionalName && (
                            <div className="text-primary-0 text-sm mt-0.5">
                              Profissional: {a.professionalName}
                            </div>
                          )}

                        <div className="mt-1">
                          <span className={`px-1.5 py-0.5 text-[11px] rounded ${statusChip(a.status)}`}>
                            {legendIcon(a.status)} {prettyStatus(a.status)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-primary-300 text-sm py-6 text-center">
                    {selectedDate ? 'Sem agendamentos neste dia.' : 'Selecione um dia no calendário.'}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Bottom sheet (mobile) */}
          {filterOpen && (
            <div
              className="sm:hidden absolute inset-x-0 bottom-0 z-[60] bg-secondary-100 border-t border-[#595149] p-4 rounded-t-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-primary-200 font-medium">Filtros</div>
                <button className="p-2 rounded hover:bg-black/20" onClick={() => setFilterOpen(false)}>
                  <XMarkIcon className="size-5" />
                </button>
              </div>

              <div className="space-y-4">
                <StatusChips dense />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-1.5 rounded hover:bg-black/20" onClick={() => setDraftStatuses([])}>
                  Limpar
                </button>
                <button className="px-3 py-1.5 rounded bg-[#3A3027] text-[#A4978A]" onClick={applyFilter}>
                  Aplicar
                </button>
              </div>
            </div>
          )}

          {/* CSS escopado do calendário */}
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
          `}</style>
        </div>
      </div>
    </div>
  )
}
