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

export type FetchAppointmentsCountParams = {
  startDate: string
  endDate: string
  statusList?: string[]
  professionalId?: string
  serviceIds?: string[]
}

export type GroupedAppointmentCount = {
  period: string
  count: number
}

export type FetchAppointmentsCountResponse = {
  groupBy: 'day' | 'week' | 'month'
  data: GroupedAppointmentCount[]
}

export type FetchEstimatedTimeParams = {
  startDate: string
  endDate: string
  professionalId?: string
  serviceIds?: string[]
}

export type GroupedEstimatedTime = {
  period: string
  estimatedTimeInMinutes: number
}

export type FetchEstimatedTimeResponse = {
  groupBy: 'day' | 'week' | 'month'
  data: GroupedEstimatedTime[]
}

export type FetchCancelationRateParams = {
  startDate: string
  endDate: string
  professionalId?: string
  serviceIds?: string[]
}

export type FetchCancelationRateResponse = {
  totalAppointments: number
  canceledAppointments: number
}

export type FetchRatingsCountParams = {
  professionalId?: string
  startDate?: string
  endDate?: string
}

export type FetchRatingsCountResponse = {
  1: number
  2: number
  3: number
  4: number
  5: number
}
