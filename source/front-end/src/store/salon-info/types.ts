export type SalonInfo = {
  openingHours: {
    name: string
    initialHour: string
    finalHour: string
    isClosed: boolean
  }[]
  salonAddress: string
  salonEmail: string
  salonPhoneNumber: string
  minimumAdvanceTime: number
}
