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
