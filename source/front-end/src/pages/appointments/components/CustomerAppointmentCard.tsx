import { DateTime } from 'luxon'
import { FindAppointmentByCustomerId } from '../../../store/appointment/types'
import ProfilePicture from '../../profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import {
  CheckBadgeIcon,
  ClockIcon,
  MagnifyingGlassCircleIcon,
  PencilSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Button } from '../../../components/button/Button'
import { ListAppointmentsButtonStatus } from '../types'
import { Link } from 'react-router-dom'
import StatusBadge from '../../../components/status/StatusBadge'

interface CustomerAppointmentCardProps {
  appointment: FindAppointmentByCustomerId
  switchButtonStatus: ListAppointmentsButtonStatus
}

function CustomerAppointmentCard(props: CustomerAppointmentCardProps) {
  const isSchedulled = props.switchButtonStatus === 'schedulled'
  const hasPendingRating =
    props.appointment.rating !== null &&
    props.appointment.rating?.score === null

  const hasBeenRated =
    props.appointment.rating !== null &&
    props.appointment.rating !== undefined &&
    props.appointment.rating?.score !== null

  return (
    <label className="flex gap-12 text-[#C0C0C0] mt-2 items-center">
      <div className="text-lg">
        <h3 className="leading-8">
          {DateTime.fromISO(props.appointment.appointmentDate)
            .setZone('local')
            .toFormat('HH:mm')}
        </h3>
        <div className="flex items-end gap-0.5">
          <h3 className="leading-none">
            {DateTime.fromISO(props.appointment.appointmentDate)
              .setZone('local')
              .setLocale('pt-BR')
              .weekdayShort?.toUpperCase()}
          </h3>
          <h4 className="text-xs leading-none font-normal">
            {DateTime.fromISO(props.appointment.appointmentDate)
              .setZone('local')
              .setLocale('pt-BR')
              .toFormat('dd/MM')}
          </h4>
        </div>
      </div>
      <div
        className={`flex justify-between py-4 ${hasPendingRating ? 'pb-6' : ''} px-6 rounded-2xl mt-5 bg-[#262626]
              transition-all duration-300 ease-in-out flex-grow flex-col sm:flex-row sm:items-center border-secondary-300`}
      >
        <div>
          <div className="flex items gap-4 align-middle">
            <div className="">
              <ProfilePicture
                size="md"
                profilePhotoUrl={
                  props.appointment.offer?.professional?.profilePhotoUrl ?? ''
                }
                filter={isSchedulled ? 'none' : 'black-white'}
                displayName={
                  props.appointment.offer.professional.name ?? undefined
                }
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[#D9D9D9] text-base text-opacity-85">
                {firstLetterOfWordToUpperCase(
                  props.appointment.offer.service.name,
                )}
              </h1>
              <h3 className="text-[#D9D9D9] text-xs text-opacity-55">
                {firstLetterOfWordToUpperCase(
                  props.appointment.offer?.professional?.name ||
                    'Profissional não definido',
                )}
              </h3>
            </div>
          </div>
          {hasPendingRating && (
            <StatusBadge
              text={'Avaliação Pendente'}
              color={'amber'}
              className="mt-2 w-max"
            />
          )}
          {hasBeenRated && (
            <StatusBadge
              text={'Avaliado'}
              color={'green'}
              className="mt-2 w-max"
            />
          )}
        </div>
        <div className="flex flex-wrap mt-4 gap-2 sm:flex-col sm:mt-0">
          <div className="flex items-center gap-2">
            {isSchedulled ? (
              <CheckBadgeIcon className="size-5 text-[#A4978A]" />
            ) : (
              <XCircleIcon className="size-5 text-[#A4978A]" />
            )}
            <h3 className="text-[#A4978A] text-sm text-opacity-85 font-semibold">
              {Formatter.formatApplicationStatusToPrettyRepresentation(
                props.appointment.status,
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="size-5 text-[#A4978A]" />
            <h3 className="text-[#A4978A] text-sm text-opacity-85 font-semibold">
              Aprox {props.appointment.offer.estimatedTime} Min
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/appointments/${props.appointment.id}?action=${isSchedulled ? 'edit' : 'view'}`}
            >
              <Button
                className="flex items-center gap-2 text-[#A4978A] text-sm text-opacity-85 font-semibold !pt-0 pb-1"
                variant="text-only"
                label={
                  <>
                    {isSchedulled ? (
                      <>
                        <PencilSquareIcon className="size-5 text-[#A4978A]" />{' '}
                        Editar
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassCircleIcon className="size-5 text-[#A4978A]" />{' '}
                        Visualizar
                      </>
                    )}
                  </>
                }
              ></Button>
            </Link>
          </div>
        </div>
      </div>
    </label>
  )
}

export { CustomerAppointmentCard }
