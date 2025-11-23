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

  const displayOpeningHours = (index: number) => {
    if (openingHours?.at(index)?.isClosed) return 'Fechado'

    if (
      !openingHours?.at(index)?.initialHour ||
      !openingHours?.at(index)?.finalHour
    ) {
      return 'Não informado'
    }

    return (
      'das ' +
      openingHours?.at(index)?.initialHour +
      ' até ' +
      openingHours?.at(index)?.finalHour
    )
  }

  const formatMinimumAdvanceTime = (minutes: string | null | undefined) => {
    if (!minutes) return '30 minutos' // valor padrão

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
          content: displayOpeningHours(0),
        },
        {
          name: 'Sábado',
          content: displayOpeningHours(1),
        },
        {
          name: 'Domingo',
          content: displayOpeningHours(2),
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
          content: salonData?.salonEmail || 'Não informado',
        },
        {
          name: 'Telefone',
          content: salonData?.salonPhoneNumber || 'Não informado',
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
