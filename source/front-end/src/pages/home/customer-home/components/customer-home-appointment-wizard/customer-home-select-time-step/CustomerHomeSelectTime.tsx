/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
import { offerAPI } from '../../../../../../store/offer/offer-api'
import Subtitle from '../../../../../../components/texts/Subtitle'
import CustomerHomeSelectTimeCard from './CustomerHomeSelectTimeCard'
import { MINIMUM_SCHEDULLING_TIME_IN_MILLISECONDS } from './constants'
import { blockedtimesAPI } from '../../../../../../store/blocked-times/blocked-times-api'
import { useState, useMemo } from 'react'
import { BlockedTime } from '../../../../../../pages/blocked-times/types'
import { getHumanDayOfWeekFromDate } from '../../../../../../utils/date/get-human-day-of-week-from-date'
import { getOnlyDateFromJSDate } from '../../../../../../utils/date/get-only-date-from-js-date'
import { getDateForCombinedDays } from '../../../../../../utils/date/get-date-for-combined-days'

const minDate = new Date()
const maxDateCopy = new Date()
maxDateCopy.setFullYear(maxDateCopy.getFullYear() + 1)
const maxDate = maxDateCopy

function CustomerHomeSelectTimeContainer() {
  const { watch, setValue } = useFormContext<CreateAppointmentFormData>()
  const serviceOfferedId = watch('serviceOfferedId')
  const professionalId = watch('professionalId')
  const appointmentDayPicked = watch('appointmentDayPicked')
  const appointmentDateStr = watch('appointmentDate')

  // Estado para controlar o mês atual do calendário
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const appointmentDate = appointmentDateStr
    ? new Date(appointmentDateStr)
    : null

  // Calcular início e fim do mês para buscar blocked times
  const monthPeriod = useMemo(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    )
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    )

    return {
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
    }
  }, [currentMonth])

  const {
    data: schedullingData,
    isLoading: schedullingIsLoading,
    isError: schedullingIsError,
  } = offerAPI.useFetchForAvailableSchedulesFromProfessionalOfferQuery(
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

  const {
    data: professionalSelectedShiftsData,
    isLoading,
    isError,
    error,
  } = shiftAPI.useFindShiftsByProfessionalQuery(
    {
      professionalId: professionalId || '',
    },
    {
      skip: !professionalId,
    },
  )

  // Buscar blocked times do mês atual
  const { data: blockedTimesResponse } =
    blockedtimesAPI.useFindByProfessionalAndPeriodQuery(
      {
        professionalId: professionalId || '',
        startDate: monthPeriod.startDate,
        endDate: monthPeriod.endDate,
      },
      {
        skip: !professionalId,
      },
    )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blockedTimesData = blockedTimesResponse?.data || []

  const professionalSelectedShiftsMap = useMemo(() => {
    if (professionalSelectedShiftsData === undefined)
      return new Map<
        string,
        { shiftStart: Date; shiftEnd: Date; isBusy: boolean }
      >()

    return professionalSelectedShiftsData.shifts.reduce((map, shift) => {
      map.set(shift.weekDay.toLowerCase(), {
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        isBusy: shift.isBusy,
      })
      return map
    }, new Map<string, { shiftStart: Date; shiftEnd: Date; isBusy: boolean }>())
  }, [professionalSelectedShiftsData])

  const blockedDaysOfCurrentMonthSet = useMemo(() => {
    const calculateBlockedDaysSet = () => {
      let currentDate = new Date(monthPeriod.startDate)
      const endDate = new Date(monthPeriod.endDate)
      const blockedDaysOfCurrentMonthSet = new Set<string>()

      while (currentDate <= endDate) {
        const dateWithoutTime = getOnlyDateFromJSDate(currentDate)

        const currentDateDayOfWeek = getHumanDayOfWeekFromDate(currentDate)
        const currentDateEndOfDay = new Date(dateWithoutTime)
        currentDateEndOfDay.setHours(23, 59, 59, 999)
        const currentDateStartOfDay = new Date(dateWithoutTime)
        currentDateStartOfDay.setHours(0, 0, 0, 0)

        const currentDateEndOfDayTimestamp = currentDateEndOfDay.getTime()
        const currentDateStartOfDayTimestamp = currentDateStartOfDay.getTime()

        const isCurrentDayBusyByProfessionalShift =
          professionalSelectedShiftsMap.get(currentDateDayOfWeek)?.isBusy ||
          false

        const isCurrentDayBusyByBlockedTime = blockedTimesData.some(
          (blockedTime) => {
            const blockedTimeStartDate = new Date(blockedTime.startDate)
            const blockedTimeEndDate = blockedTime.endDate
              ? new Date(blockedTime.endDate)
              : null

            const blockedTimeStartTimestamp = blockedTimeStartDate.getTime()
            const blockedTimeEndTimestamp = blockedTimeEndDate?.getTime()

            // 1. Verificar se existe algum blocked time na onde blockedTime.startDate <= currentDateEndOfDay && blockedTime.endDate >= currentDateStartOfDay
            const isCurrentDayCoveredByBlockedTime =
              blockedTimeStartTimestamp <= currentDateEndOfDayTimestamp &&
              (blockedTimeEndTimestamp === undefined ||
                blockedTimeEndTimestamp === null ||
                blockedTimeEndTimestamp >= currentDateStartOfDayTimestamp)

            // 2. Verificar se o dia da semana do currentDate está marcado como bloqueado no blocked time
            const isCurrentDateDayOfWeekBlocked =
              blockedTime[
                currentDateDayOfWeek.toLowerCase() as keyof BlockedTime
              ]

            // 3. Verificar se o blocked time satisfaz a condição: blockedTime.startDate <= professionalShiftStartTime && blockedTime.endDate >= professionalShiftEndTime
            const currentDayProfessionalShift =
              professionalSelectedShiftsMap.get(currentDateDayOfWeek)!

            const {
              timestamp: currentDayProfessionalShiftStartTimestamp,
              date: currentDayProfessionalShiftStartDate,
            } = getDateForCombinedDays({
              dayToExtractDate: currentDate,
              dayToExtractTime: new Date(
                currentDayProfessionalShift.shiftStart,
              ),
            })

            const {
              timestamp: currentDayProfessionalShiftEndTimestamp,
              date: currentDayProfessionalShiftEndDate,
            } = getDateForCombinedDays({
              dayToExtractDate: currentDate,
              dayToExtractTime: new Date(currentDayProfessionalShift.shiftEnd),
            })

            const {
              timestamp: currentDayBlockedTimeStartTimestamp,
              date: currentDayBlockedTimeStartDate,
            } = getDateForCombinedDays({
              dayToExtractDate: currentDate,
              dayToExtractTime: new Date(blockedTime.startTime),
            })
            const {
              timestamp: currentDayBlockedTimeEndTimestamp,
              date: currentDayBlockedTimeEndDate,
            } = blockedTimeEndDate
              ? getDateForCombinedDays({
                  dayToExtractDate: currentDate,
                  dayToExtractTime: new Date(blockedTime.endTime),
                })
              : { timestamp: null }

            // TODO: Verificar o tempo estimado do agendamento e caso o blocked time não conflite com os horários de atendimento professinal, verificar se o tempo disponível é superior ao tempo estimado do serviço selecionado
            // TODO: Lidar com o caso do blocked time de apenas um dia individual

            const isCurrentDateSlotsBusyByBlockedTime =
              currentDayBlockedTimeStartTimestamp <=
                currentDayProfessionalShiftStartTimestamp &&
              (currentDayBlockedTimeEndTimestamp === undefined ||
                currentDayBlockedTimeEndTimestamp === null ||
                currentDayBlockedTimeEndTimestamp >=
                  currentDayProfessionalShiftEndTimestamp)

            console.log(`----- DEBUG INFO ${currentDate} -------`)
            console.log({
              blockedTime,
              currentDate: currentDate.toISOString(),
              currentDateDayOfWeek,
              currentDayProfessionalShiftStartTimestamp,
              currentDayProfessionalShiftEndTimestamp,
              currentDayProfessionalShift,
              isCurrentDayCoveredByBlockedTime,
              isCurrentDateDayOfWeekBlocked,
              isCurrentDateSlotsBusyByBlockedTime,
            })
            console.log(`-----`)
            console.log(`-----`, {
              blockedTimeStartTimestamp,
              currentDayBlockedTimeStartDate,
              currentDayBlockedTimeStartTimestamp,
              currentDayBlockedTimeEndDate,
              currentDayBlockedTimeEndTimestamp,
              currentDayProfessionalShiftStartTimestamp,
              currentDayProfessionalShiftStartDate,
              currentDayProfessionalShiftEndTimestamp,
              currentDayProfessionalShiftEndDate,
            })

            return (
              isCurrentDayCoveredByBlockedTime &&
              isCurrentDateDayOfWeekBlocked &&
              isCurrentDateSlotsBusyByBlockedTime
            )
          },
        )

        if (
          isCurrentDayBusyByBlockedTime ||
          isCurrentDayBusyByProfessionalShift
        )
          blockedDaysOfCurrentMonthSet.add(dateWithoutTime)
        currentDate = new Date(currentDate)
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return blockedDaysOfCurrentMonthSet
    }

    return calculateBlockedDaysSet()
  }, [blockedTimesData, professionalSelectedShiftsMap, monthPeriod])

  if (!serviceOfferedId || !professionalId) {
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

  if (isLoading)
    return (
      <BSBeautyLoading title="Carregando os horários do profissionais escolhido..." />
    )

  if (isError) {
    toast.error('Erro ao carregar os horários do funcionário')
    console.error(`Error trying to fetch professional time`, error)

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
            calendarType="hebrew"
            defaultActiveStartDate={minDate}
            minDate={minDate}
            maxDate={maxDate}
            showNeighboringMonth={false}
            minDetail="month"
            prev2Label={<ChevronDoubleLeftIcon className="size-5" />}
            prevLabel={<ChevronLeftIcon className="size-5" />}
            next2Label={<ChevronDoubleRightIcon className="size-5" />}
            nextLabel={<ChevronRightIcon className="size-5" />}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) {
                setCurrentMonth(activeStartDate)
              }
            }}
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
                const currentDateSelectedString = getOnlyDateFromJSDate(
                  props.date,
                )
                return blockedDaysOfCurrentMonthSet.has(
                  currentDateSelectedString,
                )
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
            <BSBeautyLoading title="Carregando os horários do profissionais escolhido..." />
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
                  schedullingData.availableSchedulling
                    .filter((availSched) => !availSched.isBusy)
                    .map((schedullingDate, index) => {
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
                              schedullingDate.startTimestamp < Date.now() ||
                              schedullingDate.startTimestamp - Date.now() <
                                MINIMUM_SCHEDULLING_TIME_IN_MILLISECONDS
                            }
                            onClick={() => {
                              setValue(
                                'appointmentDate',
                                new Date(
                                  Number(schedullingDate.startTimestamp),
                                ).toISOString(),
                              )
                            }}
                          />
                        </div>
                      )
                    })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default CustomerHomeSelectTimeContainer
