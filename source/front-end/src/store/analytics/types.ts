export interface Analytics {
  totalAppointments: number
  newAppointments: number
  finishedAppointments: number
  totalCustomers: number
  numberOfServices: number
  numberOfProfessionals?: number
  totalRevenue: number
}

export type Professional = {
  id: string
  name: string
  specialization: string
  profilePhotoUrl?: string
  meanRating: number
  ratingCount: number
}

export type RatingAnalytics = {
  professionals: Professional[]
  salonRating: {
    meanScore: string
    ratingCount: number
  }
}
