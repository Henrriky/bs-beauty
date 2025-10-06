import { type Rating, type Prisma } from '@prisma/client'

interface RatingRepository {
  findAll: () => Promise<Rating[]>
  findById: (ratingId: string) => Promise<Rating | null>
  findByAppointmentId: (appointmentId: string) => Promise<Rating | null>
  create: (newRating: Prisma.RatingCreateInput) => Promise<Rating>
  update: (id: string, ratingUpdated: Prisma.RatingUpdateInput) => Promise<Rating>
  delete: (id: string) => Promise<Rating>
  getMeanScore: () => Promise<number>
}

export type { RatingRepository }
