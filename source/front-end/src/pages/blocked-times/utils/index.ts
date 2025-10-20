import {
  BlockedTime,
  BlockedTimeSelectPeriodPossibleValues,
  CreateBlockedTimeFormData,
} from '../types'

import * as luxon from 'luxon'

const formatDateForInput = (date: Date | string) => {
  const onlyDate =
    typeof date === 'string'
      ? date.split('T')[0]
      : [
          date.getFullYear().toString().padStart(4, '0'),
          (date.getMonth() + 1).toString().padStart(2, '0'),
          date.getDate().toString().padStart(2, '0'),
        ].join('-')
  return onlyDate
}

const formatTimeForInput = (isoString: string) => {
  return luxon.DateTime.fromISO(isoString).toFormat('HH:mm:ss')
}

export const convertBlockedTimeToForm = (blockedTime: BlockedTime) => {
  return {
    ...blockedTime,
    startDate: formatDateForInput(blockedTime.startDate),
    endDate: blockedTime.endDate
      ? formatDateForInput(blockedTime.endDate)
      : undefined,
    startTime: formatTimeForInput(blockedTime.startTime),
    endTime: formatTimeForInput(blockedTime.endTime),
  }
}

export const convertFormToBlockedTime = (
  formData: CreateBlockedTimeFormData,
) => {
  const startDate = new Date(`${formData.startDate} 00:00:00`).toISOString()
  const endDate = formData.endDate
    ? new Date(`${formData.endDate} 00:00:00`).toISOString()
    : undefined

  return {
    ...formData,
    startDate,
    endDate,
  }
}

export const formatTimeFromInput = (timeString: string) => {
  const today = new Date().toISOString().split('T')[0]
  return new Date(`${today}T${timeString}:00`).toISOString()
}

export const getEndDateFromPeriodSelectValue = (
  period: BlockedTimeSelectPeriodPossibleValues,
  startDate: string,
): string | undefined => {
  if (period === 'undefined') return undefined
  if (period === 'custom') return undefined

  const luxonStartDate = luxon.DateTime.fromISO(startDate)

  switch (period) {
    case 'today':
      return formatDateForInput(luxonStartDate.toJSDate())
    case '1week':
      return formatDateForInput(luxonStartDate.plus({ days: 7 }).toJSDate())
    case '1month':
      return formatDateForInput(luxonStartDate.plus({ months: 1 }).toJSDate())
    case '3months':
      return formatDateForInput(luxonStartDate.plus({ months: 3 }).toJSDate())
    case '6months':
      return formatDateForInput(luxonStartDate.plus({ months: 6 }).toJSDate())
    case '1year':
      return formatDateForInput(luxonStartDate.plus({ years: 1 }).toJSDate())
    default:
      return undefined
  }
}

export const getPeriodSelectValueFromSelectedDate = (
  startDate: string,
  endDate: string | undefined,
): BlockedTimeSelectPeriodPossibleValues => {
  if (!endDate) return 'undefined'

  const luxonStartDate = luxon.DateTime.fromISO(startDate)
  const luxonEndDate = luxon.DateTime.fromISO(endDate)

  const diffDays = luxonEndDate.diff(luxonStartDate, 'days').days
  switch (diffDays) {
    case 0:
      return 'today'
    case 7:
      return '1week'
    case 31:
      return '1month'
    case 92:
      return '3months'
    case 182:
      return '6months'
    case 365:
      return '1year'
    default:
      return 'custom'
  }
}
