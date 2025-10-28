export const getDateForCombinedDays = ({
  dayToExtractTime,
  dayToExtractDate,
}: {
  dayToExtractTime: Date
  dayToExtractDate: Date
}) => {
  const mainDay = new Date(dayToExtractDate)
  mainDay.setHours(
    dayToExtractTime.getHours(),
    dayToExtractTime.getMinutes(),
    dayToExtractTime.getSeconds(),
    dayToExtractTime.getMilliseconds(),
  )
  return { timestamp: mainDay.getTime(), date: mainDay }
}
