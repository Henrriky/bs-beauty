type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

export const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const getHumanDayOfWeekFromDate = (date: Date): DayOfWeek => {
  return daysOfWeek[date.getDay()] as DayOfWeek
}
