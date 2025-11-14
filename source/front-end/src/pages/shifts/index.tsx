import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { DateTime } from 'luxon'
import { Button } from '../../components/button/Button'
import { WeekDays } from '../../enums/enums'
import { PageHeader } from '../../layouts/PageHeader'
import { Shift } from '../../store/auth/types'
import { shiftAPI } from '../../store/shift/shift-api'
import DaysRow from './components/DaysRow'
import ShiftsRow from './components/ShiftsRow'

const WeekDayMapping: { [key: string]: string } = {
  Domingo: 'SUNDAY',
  Segunda: 'MONDAY',
  Terça: 'TUESDAY',
  Quarta: 'WEDNESDAY',
  Quinta: 'THURSDAY',
  Sexta: 'FRIDAY',
  Sábado: 'SATURDAY',
}

interface EditableShift {
  shiftStart: string
  shiftEnd: string
  isBusy: boolean
}

const Shifts = () => {
  const { data, refetch } = shiftAPI.useFindShiftsByAuthenticatedUserQuery()
  const [createShift] = shiftAPI.useCreateShiftMutation()
  const [updateShift] = shiftAPI.useUpdateShiftMutation()

  const [editableShifts, setEditableShifts] = useState<
    Record<string, { shiftStart: string; shiftEnd: string; isBusy: boolean }>
  >({})
  const weekDays = Object.values(WeekDays)

  useEffect(() => {
    if (data?.shifts) {
      initializeEditableShifts(data.shifts)
    } else {
      const defaultShifts: Record<string, EditableShift> = {}
      weekDays.forEach((day) => {
        defaultShifts[day] = {
          shiftStart: '00:00',
          shiftEnd: '00:00',
          isBusy: true,
        }
      })
      setEditableShifts(defaultShifts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const initializeEditableShifts = (shifts: Shift[]) => {
    const initialShifts: Record<string, EditableShift> = {}
    weekDays.forEach((day) => {
      const shift = shifts?.length ? getShiftByDay(shifts, day) : null
      initialShifts[day] = {
        shiftStart: shift ? formatTime(shift.shiftStart) : '',
        shiftEnd: shift ? formatTime(shift.shiftEnd) : '',
        isBusy: shift ? shift.isBusy : true,
      }
    })
    setEditableShifts(initialShifts)
  }

  const getShiftByDay = (shifts: Shift[], day: string) => {
    const backendDay = WeekDayMapping[day]
    return shifts.find((shift) => shift.weekDay === backendDay)
  }

  const handleSaveChanges = async () => {
    if (!validateShifts()) {
      return
    }
    try {
      const updates = Object.entries(editableShifts).map(
        async ([day, shiftData]) => {
          const backendDay: WeekDays = WeekDayMapping[day] as WeekDays
          const existingShift = getShiftByDay(data?.shifts || [], day)

          const normalize = (t: string) => (t || '00:00').slice(0, 5)

          const convertLocalTimeToUTC = (time: string): string => {
            const [hours, minutes] = time.split(':').map(Number)
            const localDateTime = DateTime.local().set({
              hour: hours,
              minute: minutes,
              second: 0,
              millisecond: 0,
            })
            const utcDateTime = localDateTime.plus({ hours: 3 })
            return utcDateTime.toFormat('HH:mm')
          }

          const payload = {
            weekDay: backendDay,
            shiftStart: convertLocalTimeToUTC(normalize(shiftData.shiftStart)),
            shiftEnd: convertLocalTimeToUTC(normalize(shiftData.shiftEnd)),
            isBusy: shiftData.isBusy,
          }

          if (existingShift) {
            await updateShift({
              id: existingShift.id,
              shiftStart: payload.shiftStart,
              shiftEnd: payload.shiftEnd,
              isBusy: payload.isBusy,
            })
          } else {
            await createShift(payload)
          }
        },
      )

      await Promise.all(updates)
      refetch()
      toast.success('Alterações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      toast.error('Erro ao salvar alterações.')
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ''

    let m = /^(\d{2}):(\d{2})/.exec(time)
    if (!m) {
      m = /T(\d{2}):(\d{2})/.exec(time)
    }

    if (!m) return ''

    const [_, hours, minutes] = m
    const utcDateTime = DateTime.local().set({
      hour: parseInt(hours),
      minute: parseInt(minutes),
      second: 0,
      millisecond: 0,
    })
    const localDateTime = utcDateTime.minus({ hours: 3 })

    return localDateTime.toFormat('HH:mm')
  }

  const validateShifts = (): boolean => {
    let isValid = true

    for (const { shiftStart, shiftEnd } of Object.values(editableShifts)) {
      if (shiftStart && shiftEnd && shiftStart > shiftEnd) {
        console.log('teste')
        isValid = false
        break
      }
    }

    if (!isValid) {
      toast.error(
        'Alguns turnos não estão configurados corretamente. Confira os horários de início e fim.',
      )
    }

    return isValid
  }

  return (
    <>
      <PageHeader
        title="Turnos"
        subtitle={<>Defina seus horários de expediente</>}
      />
      <div className="mt-6 flex flex-col items-center gap-6">
        <div
          className="grid grid-cols-2 w-full gap-x-4 text-[#D9D9D9] text-sm"
          style={{ gridTemplateColumns: '3fr 1fr' }}
        >
          <div>
            <DaysRow weekDays={weekDays} editableShifts={editableShifts} />
          </div>
          <div>
            <ShiftsRow
              weekDays={weekDays}
              editableShifts={editableShifts}
              setEditableShifts={setEditableShifts}
            />
          </div>
        </div>
        <Button
          label="Salvar alterações"
          variant="solid"
          className="w-[50%]"
          onClick={handleSaveChanges}
        />
      </div>
    </>
  )
}

export default Shifts
