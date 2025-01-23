import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../components/button/Button'
import { WeekDays } from '../../enums/enums'
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

const formatTime = (isoTime: string) => {
  if (!isoTime) return ''
  try {
    const date = new Date(isoTime)
    return date.toISOString().slice(11, 16)
  } catch (error) {
    console.error('Invalid ISO time:', isoTime)
    return ''
  }
}

interface EditableShift {
  shiftStart: string
  shiftEnd: string
  isBusy: boolean
}

const EmployeeShifts = () => {
  const { data, refetch } = shiftAPI.useFindShiftsByAuthenticatedUserQuery()
  const [createShift] = shiftAPI.useCreateShiftMutation()
  const [updateShift] = shiftAPI.useUpdateShiftMutation()

  const [editableShifts, setEditableShifts] = useState<
    Record<string, { shiftStart: string; shiftEnd: string; isBusy: boolean }>
  >({})
  const weekDays = Object.values(WeekDays)

  useEffect(() => {
    document.title = 'BS Beauty - Seus Horários'
  }, [])

  useEffect(() => {
    if (data?.shifts) {
      initializeEditableShifts(data.shifts)
    } else {
      const defaultShifts: Record<string, EditableShift> = {}
      weekDays.forEach((day) => {
        defaultShifts[day] = {
          shiftStart: '',
          shiftEnd: '',
          isBusy: true,
        }
      })
      setEditableShifts(defaultShifts)
    }
  }, [data])

  const initializeEditableShifts = (shifts: Shift[]) => {
    const initialShifts: Record<string, EditableShift> = {}
    weekDays.forEach((day) => {
      const shift = shifts?.length ? getShiftByDay(shifts, day) : null
      initialShifts[day] = {
        shiftStart: shift ? formatTime(shift.shiftStart) : '',
        shiftEnd: shift ? formatTime(shift.shiftEnd) : '',
        isBusy: shift ? shift.isBusy : false,
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

          const payload = {
            weekDay: backendDay,
            shiftStart: shiftData.shiftStart || '00:00',
            shiftEnd: shiftData.shiftEnd || '00:00',
            isBusy: shiftData.isBusy,
          }

          if (existingShift) {
            console.log('updateShift')
            await updateShift({
              id: existingShift.id,
              shiftStart: payload.shiftStart,
              shiftEnd: payload.shiftEnd,
              isBusy: payload.isBusy,
            })
          } else {
            await createShift(payload)
          }
        }
      )

      await Promise.all(updates)
      refetch()
      toast.success('Alterações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      toast.error('Erro ao salvar alterações.')
    }
  }

  const validateShifts = (): boolean => {
    let isValid = true

    for (const { shiftStart, shiftEnd } of Object.values(editableShifts)) {
      console.log(shiftStart, shiftEnd)
      if (shiftStart && shiftEnd && shiftStart > shiftEnd) {
        isValid = false
        break
      }
    }

    if (!isValid) {
      toast.error(
        'Alguns turnos não estão configurados corretamente. Confira os horários de início e fim.'
      )
    }

    return isValid
  }

  return (
    <>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-[#D9D9D9] text-lg">Horários</h2>
          <p className="text-primary-200 text-sm">
            Defina seus horários de expediente
          </p>
        </div>
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
      </div>
    </>
  )
}

export default EmployeeShifts
