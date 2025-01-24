export interface AvailableSchedulling {
  startTimestamp: number
  endTimestamp: number
  isBusy: boolean
}

export interface Offer {
  id: string
  createdAt: Date
  updatedAt: Date
  estimatedTime: number
  price: string
  isOffering: boolean
  serviceId: string
  employeeId: string
}
