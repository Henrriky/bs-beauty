import { WeekDays } from '../../store/shift/types'

const weekDaysToNumber = {
  [WeekDays.SUNDAY]: 0,
  [WeekDays.MONDAY]: 1,
  [WeekDays.TUESDAY]: 2,
  [WeekDays.WEDNESDAY]: 3,
  [WeekDays.THURSDAY]: 4,
  [WeekDays.FRIDAY]: 5,
  [WeekDays.SATURDAY]: 6,
}

export const weekDaysEnumToNumberRepresentation = (dayOfWeek: WeekDays) => {
  return weekDaysToNumber[dayOfWeek]
}
