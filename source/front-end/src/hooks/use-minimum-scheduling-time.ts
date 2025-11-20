import { salonInfoAPI } from '../store/salon-info/salon-info-api'

export function useMinimumSchedulingTime() {
  const { data } = salonInfoAPI.useFetchSalonInfoQuery(1)
  const minutes = Number(data?.minimumAdvanceTime) || 30
  return minutes * 60 * 1000
}
