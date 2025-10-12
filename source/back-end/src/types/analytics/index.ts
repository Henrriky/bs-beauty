interface PublicProfessionalInfo {
  id: string
  name: string | null
  profilePhotoUrl: string | null
  specialization: string | null
  meanRating: number | null
  ratingCount: number
}

export type { PublicProfessionalInfo }
