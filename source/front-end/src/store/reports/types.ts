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



