import { useMemo } from 'react'
import { formatPeriodLabel } from '../utils/formatPeriodLabel'
import type {
  FetchAppointmentsCountResponse,
  FetchEstimatedTimeResponse,
} from '../../../store/analytics/types'

export function useChartData(
  data: FetchAppointmentsCountResponse | FetchEstimatedTimeResponse | undefined,
  type: 'count' | 'time',
) {
  return useMemo(() => {
    if (!data?.data) {
      return { dates: [], values: [] }
    }

    const dates = data.data.map((item) =>
      formatPeriodLabel(item.period, data.groupBy),
    )

    const values =
      type === 'count'
        ? (data as FetchAppointmentsCountResponse).data.map(
            (item) => item.count,
          )
        : (data as FetchEstimatedTimeResponse).data.map(
            (item) =>
              Math.round((item.estimatedTimeInMinutes / 60) * 100) / 100,
          )

    return { dates, values }
  }, [data, type])
}

export function useTotalWorkTime(
  estimatedTimeData: FetchEstimatedTimeResponse | undefined,
) {
  return useMemo(() => {
    if (!estimatedTimeData?.data) return '0'
    const totalMinutes = estimatedTimeData.data.reduce(
      (sum, item) => sum + item.estimatedTimeInMinutes,
      0,
    )
    return (totalMinutes / 60).toFixed(1)
  }, [estimatedTimeData])
}

interface CancelationData {
  totalAppointments: number
  canceledAppointments: number
}

export function useCancellationData(
  cancelationData: CancelationData | undefined,
) {
  const chartData = useMemo(() => {
    if (!cancelationData) {
      return [
        { id: 0, value: 0, label: 'Concluídos', color: '#A4978A' },
        { id: 1, value: 0, label: 'Cancelados', color: '#CC3636' },
      ]
    }

    const completed =
      cancelationData.totalAppointments - cancelationData.canceledAppointments
    const canceled = cancelationData.canceledAppointments

    return [
      { id: 0, value: completed, label: 'Concluídos', color: '#A4978A' },
      { id: 1, value: canceled, label: 'Cancelados', color: '#CC3636' },
    ]
  }, [cancelationData])

  const cancellationPercentage = useMemo(() => {
    if (!cancelationData || cancelationData.totalAppointments === 0) return 0
    return (
      (cancelationData.canceledAppointments /
        cancelationData.totalAppointments) *
      100
    ).toFixed(1)
  }, [cancelationData])

  const activePercentage = useMemo(() => {
    if (!cancelationData || cancelationData.totalAppointments === 0) return 0
    const completed =
      cancelationData.totalAppointments - cancelationData.canceledAppointments
    return ((completed / cancelationData.totalAppointments) * 100).toFixed(1)
  }, [cancelationData])

  return { chartData, cancellationPercentage, activePercentage }
}
