import { ClockIcon, MagnifyingGlassCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { DateTime } from 'luxon'
import { useMemo, useRef } from 'react'
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
    professional?: { name?: string | null; profilePhotoUrl?: string | null } | null
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

  if (loading) {
    return (
      <div className="mt-3 flex gap-3 overflow-hidden">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <div key={i} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] h-[140px] rounded-2xl bg-primary-800/60 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="mt-3 text-sm text-red-400">Erro ao carregar agendamentos.</div>
  }

  if (!hasItems) {
    return <div className="mt-3 text-sm text-primary-100">{emptyMessage}</div>
  }

  return (
    <div className="relative mt-3 min-w-0">
      <style>{`
        .apptCarouselHost::-webkit-scrollbar {
          height: 6px;
        }
        .apptCarouselHost::-webkit-scrollbar-thumb {
          background: #A4978A;
          border-radius: 3px;
        }
        .apptCarouselHost::-webkit-scrollbar-thumb:hover {
          background: #A4978A;
        }
      `}</style>

      <div
        ref={scrollRef}
        className="
          apptCarouselHost
          flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth
          snap-x snap-mandatory px-1 pb-3 overscroll-x-contain
        "
        style={{
          scrollPaddingLeft: '0.25rem',
          WebkitOverflowScrolling: 'touch',
          contain: 'inline-size',
        }}
      >
        {itemsSortedByTime.map((appointment) => {
          const d = DateTime.fromISO(appointment.appointmentDate).setZone(DISPLAY_TZ)
          const isSchedulled = appointment.status === Status.PENDING || appointment.status === Status.CONFIRMED
          const hasPendingRating = appointment.rating !== null && appointment.rating?.score === null

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
                  <div className="text-xs text-primary-100/70">{d.setLocale('pt-BR').toFormat('ccc dd/LL')}</div>
                </div>
                <div className="relative">
                  <ProfilePicture
                    size="sm"
                    profilePhotoUrl={
                      appointment.offer?.professional?.profilePhotoUrl ??
                      'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
                    }
                    filter={isSchedulled ? 'none' : 'black-white'}
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
                  <div className="text-primary-100/70 text-xs truncate">
                    {appointment.offer?.professional?.name ?? 'Profissional não definido'}
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge
                    text={Formatter.formatApplicationStatusToPrettyRepresentation(appointment.status)}
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
                            <MagnifyingGlassCircleIcon className="size-4" /> Visualizar
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
