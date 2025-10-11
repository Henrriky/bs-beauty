import { type Rating, type Prisma } from '@prisma/client'
import { type RatingRepository } from '../repository/protocols/rating.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface RatingsOutput {
  ratings: Rating[]
}

class RatingsUseCase {
  private readonly entityName = 'Rating'

  constructor(private readonly ratingRepository: RatingRepository) { }

  public async executeFindAll(): Promise<RatingsOutput> {
    const ratings = await this.ratingRepository.findAll()
    RecordExistence.validateManyRecordsExistence(ratings, this.entityName)

    return { ratings }
  }

  public async executeFindById(ratingId: string): Promise<Rating | null> {
    const rating = await this.ratingRepository.findById(ratingId)
    RecordExistence.validateRecordExistence(rating, this.entityName)

    return rating
  }

  public async executeFindByAppointmentId(appointmentId: string): Promise<Rating | null> {
    const rating = await this.ratingRepository.findByAppointmentId(appointmentId)
    RecordExistence.validateRecordExistence(rating, this.entityName)

    return rating
  }

  public async executeCreate(ratingToCreate: Prisma.RatingCreateInput) {
    const rating = ratingToCreate as unknown as Rating
    const appointmentId = rating.appointmentId
    const foundRating = await this.ratingRepository.findByAppointmentId(appointmentId)
    RecordExistence.validateRecordNonExistence(foundRating, this.entityName)
    const newRating = await this.ratingRepository.create(ratingToCreate)

    return newRating
  }

  public async executeUpdate(ratingId: string, ratingToUpdate: Prisma.RatingUpdateInput) {
    await this.executeFindById(ratingId)
    const updatedRating = await this.ratingRepository.update(ratingId, ratingToUpdate)

    return updatedRating
  }

  public async executeDelete(ratingId: string) {
    await this.executeFindById(ratingId)
    const deletedRating = await this.ratingRepository.delete(ratingId)

    return deletedRating
  }

  public async executeGetMeanScore(): Promise<{ meanScore: number, ratingCount: number }> {
    return await this.ratingRepository.getMeanScore()
  }
}

export { RatingsUseCase }
