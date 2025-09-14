export type SalonInfo = {
  openingHours:
    | {
        name: string
        initialHour: string
        finalHour: string
        isClosed: boolean
      }[]
    | null
  salonAddress: string | null
  salonEmail: string | null
  salonPhoneNumber: string | null
  minimumAdvanceTime: string | null
}
