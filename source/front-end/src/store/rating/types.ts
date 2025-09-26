export interface Rating {
  id: string
  score?: number | null
  comment?: string | null
  appointmentId: string
}
