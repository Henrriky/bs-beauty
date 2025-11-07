export enum DiscoverySource {
  REFERRAL = 'REFERRAL',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  GOOGLE = 'GOOGLE',
  WHATSAPP = 'WHATSAPP',
  WALK_IN = 'WALK_IN',
  OTHER = 'OTHER',
}

export interface DiscoverySourceCount {
  source: DiscoverySource | null
  count: number
}

export type GetDiscoverySourceCountResponse = DiscoverySourceCount[]

export interface GetDiscoverySourceCountParams {
  startDate?: string
  endDate?: string
}

export interface CustomerAgeDistribution {
  ageRange: string
  count: number
}

export type GetCustomerAgeDistributionResponse = CustomerAgeDistribution[]

export interface GetCustomerAgeDistributionParams {
  startDate?: string
  endDate?: string
}

export interface NewCustomersCount {
  totalCustomers: number
}

export type GetNewCustomersCountResponse = NewCustomersCount

export interface GetNewCustomersCountParams {
  startDate: string
  endDate: string
}

export interface RevenueEvolution {
  date: string
  totalValue: number
}

export type GetRevenueEvolutionResponse = RevenueEvolution[]

export interface GetRevenueEvolutionParams {
  startDate: string
  endDate: string
  professionalId?: string
}

export interface TotalRevenue {
  totalRevenue: number
  transactionCount: number
}

export type GetTotalRevenueResponse = TotalRevenue

export interface GetTotalRevenueParams {
  startDate: string
  endDate: string
  professionalId?: string
}

export interface RevenueByService {
  serviceId: string
  serviceName: string
  category: string
  totalRevenue: number
  quantity: number
}

export type GetRevenueByServiceResponse = RevenueByService[]

export interface GetRevenueByServiceParams {
  startDate: string
  endDate: string
  professionalId?: string
}

export interface RevenueByProfessional {
  professionalId: string
  professionalName: string
  totalRevenue: number
  transactionCount: number
}

export type GetRevenueByProfessionalResponse = RevenueByProfessional[]

export interface GetRevenueByProfessionalParams {
  startDate: string
  endDate: string
}



