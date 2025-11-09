import { RatingsUseCase } from '@/services/ratings.use-case'
import { MockRatingRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type Prisma, type Rating } from '@prisma/client'
import { beforeEach, describe, expect, it } from 'vitest'

describe('RatingsUseCase (Unit Tests)', () => {
  let ratingsUseCase: RatingsUseCase

  beforeEach(() => {
    ratingsUseCase = new RatingsUseCase(MockRatingRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(ratingsUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return all ratings', async () => {
      const ratings: Rating[] = [
        {
          id: faker.string.uuid(),
          score: 5,
          comment: 'Excellent service!',
          appointmentId: faker.string.uuid(),
          createdAt: faker.date.past()
        },
        {
          id: faker.string.uuid(),
          score: 4,
          comment: 'Very good!',
          appointmentId: faker.string.uuid(),
          createdAt: faker.date.past()
        }
      ]

      MockRatingRepository.findAll.mockResolvedValue(ratings)

      const result = await ratingsUseCase.executeFindAll()
      expect(result).toEqual({ ratings })
      expect(MockRatingRepository.findAll).toHaveBeenCalled()
    })

    it('should throw an error if no ratings are found', async () => {
      MockRatingRepository.findAll.mockResolvedValue([])

      const promise = ratingsUseCase.executeFindAll()
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindById', () => {
    it('should return a rating by id', async () => {
      const rating: Rating = {
        id: faker.string.uuid(),
        score: 5,
        comment: 'Excellent service!',
        appointmentId: faker.string.uuid(),
        createdAt: faker.date.past()
      }

      MockRatingRepository.findById.mockResolvedValue(rating)

      const result = await ratingsUseCase.executeFindById(rating.id)
      expect(result).toEqual(rating)
      expect(MockRatingRepository.findById).toHaveBeenCalledWith(rating.id)
    })

    it('should throw an error if rating is not found', async () => {
      const ratingId = faker.string.uuid()
      MockRatingRepository.findById.mockResolvedValue(null)

      const promise = ratingsUseCase.executeFindById(ratingId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindByAppointmentId', () => {
    it('should return a rating by appointment id', async () => {
      const appointmentId = faker.string.uuid()
      const rating: Rating = {
        id: faker.string.uuid(),
        score: 5,
        comment: 'Excellent service!',
        appointmentId,
        createdAt: faker.date.past()
      }

      MockRatingRepository.findByAppointmentId.mockResolvedValue(rating)

      const result = await ratingsUseCase.executeFindByAppointmentId(appointmentId)
      expect(result).toEqual(rating)
      expect(MockRatingRepository.findByAppointmentId).toHaveBeenCalledWith(appointmentId)
    })

    it('should throw an error if rating is not found by appointment id', async () => {
      const appointmentId = faker.string.uuid()
      MockRatingRepository.findByAppointmentId.mockResolvedValue(null)

      const promise = ratingsUseCase.executeFindByAppointmentId(appointmentId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeCreate', () => {
    it('should create a new rating', async () => {
      const appointmentId = faker.string.uuid()
      const ratingToCreate = {
        score: 5,
        comment: 'Excellent service!',
        appointmentId
      } as unknown as Prisma.RatingCreateInput

      const createdRating: Rating = {
        id: faker.string.uuid(),
        score: 5,
        comment: 'Excellent service!',
        appointmentId,
        createdAt: new Date()
      }

      MockRatingRepository.findByAppointmentId.mockResolvedValue(null)
      MockRatingRepository.create.mockResolvedValue(createdRating)

      const result = await ratingsUseCase.executeCreate(ratingToCreate)

      expect(result).toEqual(createdRating)
      expect(MockRatingRepository.findByAppointmentId).toHaveBeenCalledWith(appointmentId)
      expect(MockRatingRepository.create).toHaveBeenCalledWith(ratingToCreate)
    })

    it('should throw an error if rating already exists for the appointment', async () => {
      const appointmentId = faker.string.uuid()
      const ratingToCreate = {
        score: 5,
        comment: 'Excellent service!',
        appointmentId
      } as unknown as Prisma.RatingCreateInput

      const existingRating: Rating = {
        id: faker.string.uuid(),
        score: 4,
        comment: 'Good service',
        appointmentId,
        createdAt: faker.date.past()
      }

      MockRatingRepository.findByAppointmentId.mockResolvedValue(existingRating)

      const promise = ratingsUseCase.executeCreate(ratingToCreate)
      await expect(promise).rejects.toThrow('Bad Request')
    })
  })

  describe('executeUpdate', () => {
    it('should update a rating', async () => {
      const ratingId = faker.string.uuid()
      const appointmentId = faker.string.uuid()

      const existingRating: Rating = {
        id: ratingId,
        score: 4,
        comment: 'Good service',
        appointmentId,
        createdAt: faker.date.past()
      }

      const ratingToUpdate: Prisma.RatingUpdateInput = {
        score: 5,
        comment: 'Updated: Excellent service!'
      }

      const updatedRating: Rating = {
        id: ratingId,
        score: 5,
        comment: 'Updated: Excellent service!',
        appointmentId,
        createdAt: faker.date.past()
      }

      MockRatingRepository.findById.mockResolvedValue(existingRating)
      MockRatingRepository.update.mockResolvedValue(updatedRating)

      const result = await ratingsUseCase.executeUpdate(ratingId, ratingToUpdate)

      expect(result).toEqual(updatedRating)
      expect(MockRatingRepository.findById).toHaveBeenCalledWith(ratingId)
      expect(MockRatingRepository.update).toHaveBeenCalledWith(ratingId, ratingToUpdate)
    })

    it('should throw an error if rating is not found', async () => {
      const ratingId = faker.string.uuid()
      const ratingToUpdate: Prisma.RatingUpdateInput = {
        score: 5,
        comment: 'Updated comment'
      }

      MockRatingRepository.findById.mockResolvedValue(null)

      const promise = ratingsUseCase.executeUpdate(ratingId, ratingToUpdate)
      await expect(promise).rejects.toThrow('Not Found')
      expect(MockRatingRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('executeDelete', () => {
    it('should delete a rating', async () => {
      const ratingId = faker.string.uuid()
      const appointmentId = faker.string.uuid()

      const existingRating: Rating = {
        id: ratingId,
        score: 5,
        comment: 'Excellent service!',
        appointmentId,
        createdAt: faker.date.past()
      }

      const deletedRating: Rating = {
        id: ratingId,
        score: 5,
        comment: 'Excellent service!',
        appointmentId,
        createdAt: faker.date.past()
      }

      MockRatingRepository.findById.mockResolvedValue(existingRating)
      MockRatingRepository.delete.mockResolvedValue(deletedRating)

      const result = await ratingsUseCase.executeDelete(ratingId)

      expect(result).toEqual(deletedRating)
      expect(MockRatingRepository.findById).toHaveBeenCalledWith(ratingId)
      expect(MockRatingRepository.delete).toHaveBeenCalledWith(ratingId)
    })

    it('should throw an error if rating is not found', async () => {
      const ratingId = faker.string.uuid()

      MockRatingRepository.findById.mockResolvedValue(null)

      const promise = ratingsUseCase.executeDelete(ratingId)
      await expect(promise).rejects.toThrow('Not Found')
      expect(MockRatingRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('executeGetMeanScore', () => {
    it('should return mean score and rating count', async () => {
      const meanScoreData = {
        meanScore: 4.5,
        ratingCount: 10
      }

      MockRatingRepository.getMeanScore.mockResolvedValue(meanScoreData)

      const result = await ratingsUseCase.executeGetMeanScore()

      expect(result).toEqual(meanScoreData)
      expect(MockRatingRepository.getMeanScore).toHaveBeenCalled()
    })

    it('should return zero mean score when no ratings exist', async () => {
      const meanScoreData = {
        meanScore: 0,
        ratingCount: 0
      }

      MockRatingRepository.getMeanScore.mockResolvedValue(meanScoreData)

      const result = await ratingsUseCase.executeGetMeanScore()

      expect(result).toEqual(meanScoreData)
      expect(MockRatingRepository.getMeanScore).toHaveBeenCalled()
    })
  })
})
