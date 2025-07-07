import {
  CalendarDaysIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Calendar from 'react-calendar'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'

import { CreateAppointmentFormData } from '../types'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { shiftAPI } from '../../../../../../store/shift/shift-api'
import { weekDaysEnumToNumberRepresentation } from '../../../../../../utils/formatter/week-days-enum-to-number-representation'
import { offerAPI } from '../../../../../../store/offer/offer-api'
import Subtitle from '../../../../../../components/texts/Subtitle'
import CustomerHomeSelectTimeCard from './CustomerHomeSelectTimeCard'

const minDate = new Date()
const maxDateCopy = new Date()
maxDateCopy.setFullYear(maxDateCopy.getFullYear() + 1)
const maxDate = maxDateCopy

function CustomerHomeSelectTimeContainer() {
  const { watch, setValue } = useFormContext<CreateAppointmentFormData>()
  const serviceOfferedId = watch('serviceOfferedId')
  const employeeId = watch('employeeId')
  const appointmentDayPicked = watch('appointmentDayPicked')
  const appointmentDateStr = watch('appointmentDate')

  const appointmentDate = appointmentDateStr
    ? new Date(appointmentDateStr)
    : null

  const {
    data: schedullingData,
    isLoading: schedullingIsLoading,
    isError: schedullingIsError,
  } = offerAPI.useFetchForAvailableSchedulesFromEmployeeOfferQuery(
    {
      serviceOfferedId,
      dayToFetchAvailableSchedulling: appointmentDayPicked
        ? new Date(appointmentDayPicked).toISOString()
        : '',
    },
    {
      skip: !appointmentDayPicked,
    },
  )

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

  return (
    <>
      <Subtitle
        align="left"
        className="text-[#A4978A] font-medium mb-4 text-xl"
      >
        Selecione o seu melhor horário:
      </Subtitle>
      <section className="max-h-[90%]">
        <div className="bg-[#595149] w-full h-0.5 mb-4"></div>
        <div>
          <Subtitle
            align="left"
            className="text-[#A4978A] font-medium !text-lg flex items-center justify-center mb-4 gap-2"
          >
            <CalendarDaysIcon className="size-7" />
            Selecionar data
          </Subtitle>
          <Calendar
            className="text-[#A4978A]"
            defaultActiveStartDate={minDate}
            minDate={minDate}
            maxDate={maxDate}
            showNeighboringMonth={false}
            minDetail="month"
            prev2Label={<ChevronDoubleLeftIcon className="size-5" />}
            prevLabel={<ChevronLeftIcon className="size-5" />}
            next2Label={<ChevronDoubleRightIcon className="size-5" />}
            nextLabel={<ChevronRightIcon className="size-5" />}
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
            tileClassName={(params) => {
              if (params.view === 'month' && appointmentDayPicked) {
                const pickedDate = new Date(appointmentDayPicked)

                const isDaySelected =
                  params.date.getFullYear() === pickedDate.getFullYear() &&
                  params.date.getMonth() === pickedDate.getMonth() &&
                  params.date.getDate() === pickedDate.getDate()

                if (isDaySelected) return 'abbr-selected'
              }

              return ''
            }}
            onClickDay={(value) => {
              setValue('appointmentDayPicked', value.toISOString())
            }}
          />
        </div>
        <div className="bg-[#595149] w-full h-0.5 mb-4"></div>
        <div>
          {schedullingIsLoading ? (
            <BSBeautyLoading title="Carregando os horários do funcionários escolhido..." />
          ) : schedullingIsError ? (
            <ErrorMessage
              message={
                'Erro ao carregar informações. Tente novamente mais tarde.'
              }
            />
          ) : (
            <>
              {schedullingData?.availableSchedulling && (
                <Subtitle
                  align="left"
                  className="text-[#A4978A] font-medium !text-lg flex items-center justify-center mb-4 gap-2"
                >
                  <ClockIcon className="size-7" />
                  Selecionar horário
                </Subtitle>
              )}
              <div className="flex gap-2 flex-wrap justify-center">
                {schedullingData?.availableSchedulling &&
                  schedullingData.availableSchedulling.map(
                    (schedullingDate, index) => {
                      return (
                        <div key={`time-${index}`}>
                          <input
                            className="invisible"
                            type="radio"
                            id={schedullingDate.startTimestamp.toString()}
                            value={schedullingDate.startTimestamp}
                          />
                          <CustomerHomeSelectTimeCard
                            isSelected={
                              appointmentDate?.getTime() ===
                              schedullingDate.startTimestamp
                            }
                            for={schedullingDate.startTimestamp.toString()}
                            startDate={schedullingDate.startTimestamp}
                            isBusy={
                              schedullingDate.isBusy ||
                              schedullingDate.startTimestamp < Date.now()
                            }
                            onClick={() => {
                              setValue(
                                'appointmentDate',
                                new Date(
                                  Number(schedullingDate.startTimestamp),
                                ).toISOString(),
                              ) // <-- Aqui
                            }}
                          />
                        </div>
                      )
                    },
                  )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default CustomerHomeSelectTimeContainer
