import {
  ClockIcon,
  MagnifyingGlassCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { DateTime } from 'luxon'
import { useMemo, useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../../components/button/Button'
import StatusBadge from '../../../../components/status/StatusBadge'
import { Status } from '../../../../store/appointment/types'
import { Formatter } from '../../../../utils/formatter/formatter.util'
import ProfilePicture from '../../../profile/components/ProfilePicture'

export type AppointmentCardItem = {
  id: string
  status: Status
  appointmentDate: string
  offer?: {
    estimatedTime?: number | null
    service?: { name?: string | null } | null
    professional?: {
      name?: string | null
      profilePhotoUrl?: string | null
    } | null
  } | null
  customer?: { name?: string | null } | null
  rating?: { score?: number | null } | null
}

type AppointmentsCarouselProps = {
  items: AppointmentCardItem[]
  loading?: boolean
  error?: boolean
  emptyMessage?: string
}

type BadgeColor = 'red' | 'green' | 'amber' | 'gray'
const STATUS_BADGE_COLOR: Record<Status, BadgeColor> = {
  PENDING: 'amber',
  CONFIRMED: 'green',
  RESCHEDULED: 'gray',
  FINISHED: 'gray',
  CANCELLED: 'red',
  NO_SHOW: 'red',
}

const SKELETON_CARD_COUNT = 3
const DISPLAY_TZ = 'America/Sao_Paulo'

export default function AppointmentsCarousel({
  items,
  loading,
  error,
  emptyMessage = 'Nenhum agendamento para hoje.',
}: AppointmentsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const scrollIntervalRef = useRef<number | null>(null)

  const hasItems = (items?.length ?? 0) > 0

  const itemsSortedByTime = useMemo(
    () =>
      (items ?? [])
        .slice()
        .sort(
          (a, b) =>
            DateTime.fromISO(a.appointmentDate).toMillis() -
            DateTime.fromISO(b.appointmentDate).toMillis(),
        ),
    [items],
  )

  useEffect(() => {
    const el = scrollRef.current
    if (!el || isPaused || !itemsSortedByTime || itemsSortedByTime.length <= 1) return

    const cardElement = el.querySelector('article') as HTMLElement
    const cardWidthPx = cardElement ? cardElement.offsetWidth : 280
    const gap = 12
    const step = cardWidthPx + gap
    const delayMs = 4000

    el.style.scrollBehavior = 'smooth'

    const advance = () => {
      if (!el || isPaused) return
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const next = Math.min(el.scrollLeft + step, maxScrollLeft)
      el.scrollTo({ left: next })

      if (next >= maxScrollLeft) {
        setTimeout(() => {
          if (el && !isPaused) {
            el.scrollTo({ left: 0 })
          }
        }, delayMs)
      }
    }

    scrollIntervalRef.current = window.setInterval(advance, delayMs)

    return () => {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current)
      }
    }
  }, [itemsSortedByTime, isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)
  const handleTouchStart = () => setIsPaused(true)
  const handleTouchEnd = () => setIsPaused(false)

  if (loading) {
    return (
      <div className="relative mt-3 min-w-0">
        <div
          className="
          carousel-scrollbar
          flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth
          snap-x snap-mandatory px-1 pb-3 overscroll-x-contain
        "
          style={{
            scrollPaddingLeft: '0.25rem',
            WebkitOverflowScrolling: 'touch',
            contain: 'inline-size',
          }}
        >
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <article
              key={i}
              className="
              snap-start shrink-0
              min-w-[280px] sm:min-w-[320px] md:min-w-[360px]
              rounded-2xl bg-[#262626] border border-secondary-300/30
              px-4 py-4 flex flex-col gap-3
              animate-pulse
              min-h-[156px]
            "
            >
              <header className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-16 bg-[#3A3A3A] rounded mb-1" />
                  <div className="h-3 w-24 bg-[#3A3A3A] rounded" />
                </div>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-[#3A3A3A]" />
                </div>
              </header>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-40 bg-[#3A3A3A] rounded mb-2" />
                  <div className="h-3 w-32 bg-[#3A3A3A] rounded" />
                </div>
                <div className="shrink-0">
                  <div className="h-6 w-24 bg-[#3A3A3A] rounded-full" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-28 bg-[#3A3A3A] rounded" />
                <div className="ml-auto h-5 w-20 bg-[#3A3A3A] rounded" />
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-3 text-sm text-red-400">
        Erro ao carregar agendamentos.
      </div>
    )
  }

  if (!hasItems) {
    return <div className="mt-3 text-sm text-primary-100">{emptyMessage}</div>
  }

  return (
    <div className="relative mt-3 min-w-0">
      <div
        ref={scrollRef}
        className="
          carousel-scrollbar
          flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth
          snap-x snap-mandatory px-1 pb-3 overscroll-x-contain
        "
        style={{
          scrollPaddingLeft: '0.25rem',
          WebkitOverflowScrolling: 'touch',
          contain: 'inline-size',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {itemsSortedByTime.map((appointment) => {
          const d = DateTime.fromISO(appointment.appointmentDate).setZone(
            DISPLAY_TZ,
          )
          const isSchedulled =
            appointment.status === Status.PENDING ||
            appointment.status === Status.CONFIRMED
          const hasPendingRating =
            appointment.rating !== null && appointment.rating?.score === null

          return (
            <article
              key={appointment.id}
              className="
                snap-start shrink-0
                min-w-[280px] sm:min-w-[320px] md:min-w-[360px]
                rounded-2xl bg-[#262626] border border-secondary-300/30
                px-4 py-4 flex flex-col gap-3
              "
            >
              <header className="flex items-center justify-between">
                <div>
                  <div className="text-lg text-[#D9D9D9] leading-6">{d.toFormat('HH:mm')}</div>
                  <div className="text-xs text-[#979797]">{d.setLocale('pt-BR').toFormat('ccc dd/LL')}</div>
                </div>
                <div className="relative">
                  <ProfilePicture
                    size="sm"
                    profilePhotoUrl={
                      appointment.offer?.professional?.profilePhotoUrl ??
                      ''
                    }
                    filter={isSchedulled ? 'none' : 'black-white'}
                    displayName={appointment.customer?.name ?? 'Cliente'}
                  />
                  {hasPendingRating && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <StatusBadge text="Avaliação Pendente" color="amber" />
                    </div>
                  )}
                </div>
              </header>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[#D9D9D9] text-sm truncate">
                    {appointment.offer?.service?.name ?? 'Serviço'}
                  </div>
                  <div className="text-[#979797] text-xs truncate">
                    {appointment.customer?.name ?? 'Cliente'}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge
                    text={Formatter.formatApplicationStatusToPrettyRepresentation(
                      appointment.status,
                    )}
                    color={STATUS_BADGE_COLOR[appointment.status]}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#A4978A]">
                <span className="inline-flex items-center gap-1 text-sm">
                  <ClockIcon className="size-4" />
                  {`Aprox ${appointment.offer?.estimatedTime ?? 0} min`}
                </span>

                <Link
                  to={`/appointments/${appointment.id}?action=${isSchedulled ? 'edit' : 'view'}`}
                  className="ml-auto"
                >
                  <Button
                    variant="text-only"
                    className="!py-0 !px-1 text-sm inline-flex items-center gap-1"
                    label={
                      <>
                        {isSchedulled ? (
                          <>
                            <PencilSquareIcon className="size-4" /> Editar
                          </>
                        ) : (
                          <>
                            <MagnifyingGlassCircleIcon className="size-4" />{' '}
                            Visualizar
                          </>
                        )}
                      </>
                    }
                  />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
