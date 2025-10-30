import { Dayjs } from 'dayjs'

export const buildQueryParams = (
  professionalId: string | undefined,
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  toISO: (date: string, endOfDay?: boolean) => string,
) => {
  return {
    professionalId: professionalId!,
    startDate: startDate ? toISO(startDate.format('YYYY-MM-DD')) : '',
    endDate: endDate ? toISO(endDate.format('YYYY-MM-DD'), true) : '',
  }
}
