// import { toast } from 'react-toastify'
// import BSBeautyLoading from '../../../../../../components/feedback/Loading'
// import Subtitle from '../../../../../../components/texts/Subtitle'
// import { useFormContext } from 'react-hook-form'
// import { CreateAppointmentFormData } from '../types'
// import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
// import { FaceFrownIcon } from '@heroicons/react/24/outline'
// import CustomerHomeEmployeeCard from './CustomerHomeEmployeeCard'
// import { offerAPI } from '../../../../../../store/offer/offer-api'
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import Calendar from 'react-calendar'
import { CreateAppointmentFormData } from '../types'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { shiftAPI } from '../../../../../../store/shift/shift-api'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import { weekDaysEnumToNumberRepresentation } from '../../../../../../utils/formatter/week-days-enum-to-number-representation'

// function tileDisabled(args: TileArgs) {
//   // Disable tiles in month view only
//   // console.log(args)
//   return false
// }

const minDate = new Date()
const maxDateCopy = new Date()
maxDateCopy.setFullYear(maxDateCopy.getFullYear() + 1)
const maxDate = maxDateCopy

function CustomerHomeSelectTimeContainer() {
  const { watch } = useFormContext<CreateAppointmentFormData>()
  const serviceOfferedId = watch('serviceOfferedId')
  const employeeId = watch('employeeId')

  if (!serviceOfferedId || !employeeId) {
    toast.error(
      'Por favor, selecione um dos profissionais para acessar os horários',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um o serviço de um dos profissionais para acessar os horários'
        }
      />
    )
  }

  const { data, isLoading, isError, error } =
    shiftAPI.useFindShiftsByEmployeeQuery({
      employeeId,
    })

  if (isLoading)
    return (
      <BSBeautyLoading title="Carregando os horários do funcionários escolhido..." />
    )

  if (isError) {
    toast.error('Erro ao carregar os horários do funcionário')
    console.error(`Error trying to fetch employee time`, error)

    return (
      <ErrorMessage
        message={'Erro ao carregar informações. Tente novamente mais tarde.'}
      />
    )
  }

  console.log(data)

  return (
    <Calendar
      className="text-[#A4978A]"
      defaultActiveStartDate={minDate}
      minDate={minDate}
      maxDate={maxDate}
      // tileClassName={'border-2 border-[#A4978A] rounded-md'}
      showNeighboringMonth={false}
      navigationLabel={({ label, view }) => {
        if (view === 'month') {
          const onlyMonthLabel = label.split(' ')[0]
          const onlyYearLabel = label.split(' ')[2]
          return (
            <label className="text-lg text-[#A5A5A5]">
              {onlyMonthLabel.charAt(0).toUpperCase() +
                onlyMonthLabel.slice(1) +
                ` - ${onlyYearLabel}`}
            </label>
          )
        }

        return label
      }}
      minDetail="month"
      prev2Label={<ChevronDoubleLeftIcon className="size-5" />}
      prevLabel={<ChevronLeftIcon className="size-5" />}
      next2Label={<ChevronDoubleRightIcon className="size-5" />}
      nextLabel={<ChevronRightIcon className="size-5" />}
      tileDisabled={(props) => {
        if (props.view === 'month') {
          const currentCalendarDay = props.date.getDay()
          const currentShiftByCalendarDay = data!.shifts.find((shift) => {
            const currentShiftDay = weekDaysEnumToNumberRepresentation(
              shift.weekDay,
            )
            return currentShiftDay === currentCalendarDay
          })!
          return currentShiftByCalendarDay.isBusy
        }

        return false
      }}
      // tileDisabled={(props) => {}}
      // tileDisabled={}
      // tileContent={() => <div>Olá</div>}
    />
  )

  // if (!serviceOfferedId) {
  //   toast.error(
  //     'Por favor, selecione um o serviço de um dos profissionais para acessar os horários',
  //   )

  //   return (
  //     <ErrorMessage
  //       message={
  //         'Por favor, selecione um o serviço de um dos profissionais para acessar os horários'
  //       }
  //     />
  //   )
  // }

  // const { data, isLoading, isError, error } =
  //   offerAPI.useFetchForAvailableSchedulesFromEmployeeOfferQuery({
  //     serviceOfferedId,
  //     dayToFetchAvailableSchedulling,
  //   })

  // if (isLoading)
  //   return (
  //     <BSBeautyLoading title="Carregando os horários do funcionários escolhido..." />
  //   )

  // if (isError) {
  //   toast.error('Erro ao carregar os horários do funcionário')
  //   console.error(`Error trying to fetch employee time`, error)

  //   return (
  //     <ErrorMessage
  //       message={'Erro ao carregar informações. Tente novamente mais tarde.'}
  //     />
  //   )
  // }

  // if (data?.employeesOfferingService?.offers.length === 0) {
  //   return (
  //     <ErrorMessage
  //       message={
  //         <>
  //           <FaceFrownIcon />
  //           Infelizmente, no momento não temos horários disponíveis para esse
  //           funcionário
  //         </>
  //       }
  //     />
  //   )
  // }
  // return (
  //   <>
  //     <Subtitle align="left" className="text-[#A4978A] font-medium">
  //       Escolha o seu melhor horário:
  //     </Subtitle>

  //     {data?.employeesOfferingService &&
  //       data.employeesOfferingService.offers.map((offer) => {
  //         return (
  //           <>
  //             <input
  //               className="invisible"
  //               type="radio"
  //               id={offer.id}
  //               value={offer.id}
  //               {...register('serviceOfferedId')}
  //             />
  //             <CustomerHomeEmployeeCard
  //               isSelected={serviceOfferedId === offer.id}
  //               key={offer.id}
  //               for={offer.id}
  //               {...offer}
  //             />
  //           </>
  //         )
  //       })}
  //   </>
  // )
}

export default CustomerHomeSelectTimeContainer
