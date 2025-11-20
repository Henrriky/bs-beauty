import {
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { SalonInfo } from '../../../../store/salon-info/types'

interface SalonInfoDisplayProps {
  salonData: SalonInfo | undefined
}

function SalonInfoDisplay({ salonData }: SalonInfoDisplayProps) {
  const openingHours = salonData?.openingHours

  const formatMinimumAdvanceTime = (minutes: string | null | undefined) => {
    if (!minutes) return 'Não definido'

    const minutesNumber = parseInt(minutes, 10)

    if (isNaN(minutesNumber)) return minutes

    if (minutesNumber < 60) {
      return `${minutesNumber} minutos`
    }

    const hours = minutesNumber / 60
    if (hours === 1) {
      return '1 hora'
    }

    return `${hours} horas`
  }

  const infoCards = [
    {
      name: 'Horários de funcionamento',
      icon: <ClockIcon className="size-5" />,
      infos: [
        {
          name: 'Segunda à Sexta',
          content: openingHours?.at(0)?.isClosed
            ? 'Fechado'
            : 'das ' +
              openingHours?.at(0)?.initialHour +
              ' até ' +
              openingHours?.at(0)?.finalHour,
        },
        {
          name: 'Sábado',
          content: openingHours?.at(1)?.isClosed
            ? 'Fechado'
            : 'das ' +
              openingHours?.at(1)?.initialHour +
              ' até ' +
              openingHours?.at(1)?.finalHour,
        },
        {
          name: 'Domingo',
          content: openingHours?.at(2)?.isClosed
            ? 'Fechado'
            : 'das ' +
              openingHours?.at(2)?.initialHour +
              ' até ' +
              openingHours?.at(2)?.finalHour,
        },
      ],
    },
    {
      name: 'Antecedência mínima',
      icon: <CalendarIcon className="size-5" />,
      infos: [
        {
          name: 'Tempo mínimo de antecedência',
          content: formatMinimumAdvanceTime(salonData?.minimumAdvanceTime),
        },
      ],
    },
    {
      name: 'Endereço do salão',
      icon: <MapPinIcon className="size-5" />,
      infos: [
        {
          name: 'Endereço',
          content: salonData?.salonAddress,
        },
      ],
    },
    {
      name: 'Contatos',
      icon: <EnvelopeIcon className="size-5" />,
      infos: [
        {
          name: 'E-mail',
          content: salonData?.salonEmail,
        },
        {
          name: 'Telefone',
          content: salonData?.salonPhoneNumber,
        },
      ],
    },
  ]
  return (
    <div>
      {infoCards.map((card, index) => {
        return (
          <div
            key={index}
            className="flex flex-col gap-6 p-4 mb-2 bg-[#222222] text-primary-0 rounded-lg shadow-md"
          >
            <div className="flex gap-2 items-center">
              {card.icon}
              <p className="text-base text-primary-0">{card.name}</p>
            </div>
            {card.infos?.map((info, index) => {
              return (
                <p key={index} className="text-sm">
                  {info.name}:{' '}
                  <span className="text-primary-200">{info.content}</span>
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default SalonInfoDisplay
