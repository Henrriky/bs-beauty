enum WeekDays {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
interface Shift {
  id: string
  employeeId: string
  weekDay: WeekDays
  isBusy: boolean
  shiftStart: Date
  shiftEnd: Date
}

export type FindShiftsByEmployeeResponse = Shift[]
