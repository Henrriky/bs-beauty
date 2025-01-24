import { DateTime } from 'luxon'
import { FindAppointmentServiceByCustomerId } from '../../../store/appointment/types'
import ProfilePicture from '../../profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import {
  CheckBadgeIcon,
  ClockIcon,
  PencilSquareIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Button } from '../../../components/button/Button'
import { ListAppointmentsButtonStatus } from '../types'

interface CustomerAppointmentCardProps {
  appointment: FindAppointmentServiceByCustomerId
  switchButtonStatus: ListAppointmentsButtonStatus
}

function CustomerAppointmentCard(props: CustomerAppointmentCardProps) {
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
        className={`flex items-center justify-between h-24 py-4 px-6 rounded-2xl mt-5 bg-[#262626]
              transition-all duration-300 ease-in-out flex-grow`}
      >
        <div className="flex items-center gap-4">
          <div className="">
            <ProfilePicture
              size="md"
              profilePhotoUrl={
                props.appointment.serviceOffered.employee.profilePhotoUrl ??
                'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
              }
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#D9D9D9] text-base text-opacity-85">
              {firstLetterOfWordToUpperCase(
                props.appointment.serviceOffered.service.name,
              )}
            </h1>
            <h3 className="text-[#D9D9D9] text-xs text-opacity-55">
              {firstLetterOfWordToUpperCase(
                props.appointment.serviceOffered.employee.name || '',
              )}
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {props.switchButtonStatus === 'schedulled' ? (
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
              Aprox {props.appointment.serviceOffered.estimatedTime} Min
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2 text-[#A4978A] text-sm text-opacity-85 font-semibold !pt-0 pb-1"
              variant="text-only"
              label={
                <>
                  <PencilSquareIcon className="size-5 text-[#A4978A]" /> Editar
                </>
              }
            ></Button>
          </div>
        </div>
      </div>
    </label>
  )
}

export { CustomerAppointmentCard }
