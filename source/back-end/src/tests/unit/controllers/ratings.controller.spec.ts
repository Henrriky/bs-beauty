/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Prisma, type Rating } from '@prisma/client'
import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RatingsController } from '../../../controllers/ratings.controller'
import { makeRatingsUseCaseFactory } from '../../../factory/make-ratings-use-case.factory'
import { mockRequest, type MockRequest, mockResponse } from '../utils/test-utilts'

vi.mock('@/factory/make-ratings-use-case.factory.ts')

describe('RatingsController', () => {
  let req: MockRequest
  let res: Response
  let next: any
  let useCaseMock: any

  beforeEach(() => {
    vi.clearAllMocks()

    req = mockRequest()

    res = mockResponse()

    next = vi.fn()

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByAppointmentId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn()
    }

    vi.mocked(makeRatingsUseCaseFactory).mockReturnValue(useCaseMock)
    vi.setSystemTime(new Date('2025-01-01T09:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(RatingsController).toBeDefined()
  })

  describe('handleFindAll', () => {
    it('should return a list of ratings', async () => {
      // arrange
      const ratings = [
        {
          id: 'rating-uuid-1',
          score: 5,
          comment: 'Excellent service!',
          appointmentId: 'appointment-1',
          createdAt: new Date('2025-01-01T09:00:00')
        },
        {
          id: 'rating-uuid-2',
          score: 4,
          comment: 'Very good!',
          appointmentId: 'appointment-2',
          createdAt: new Date('2025-01-01T09:00:00')
        }
      ] as Rating[]

      useCaseMock.executeFindAll.mockResolvedValueOnce({ ratings })

      // act
      await RatingsController.handleFindAll(req, res, next)

      // assert
      expect(res.send).toHaveBeenCalledWith({ ratings })
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      useCaseMock.executeFindAll.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleFindAll(req, res, next)

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindById', () => {
    it('should return a rating by id', async () => {
      // arrange
      const rating: Rating = {
        id: 'rating-uuid-1',
        score: 5,
        comment: 'Excellent service!',
        appointmentId: 'appointment-1',
        createdAt: new Date('2025-01-01T09:00:00')
      }
      req.params.id = 'rating-uuid-1'
      useCaseMock.executeFindById.mockResolvedValueOnce(rating)

      // act
      await RatingsController.handleFindById(req, res, next)

      // assert
      expect(req.params.id).toBe('rating-uuid-1')
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(rating)
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith('rating-uuid-1')
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Rating not found')
      req.params.id = 'rating-uuid-1'
      useCaseMock.executeFindById.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleFindById(req, res, next)

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith('rating-uuid-1')
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleFindByAppointmentId', () => {
    it('should return a rating by appointment id', async () => {
      // arrange
      const rating: Rating = {
        id: 'rating-uuid-1',
        score: 5,
        comment: 'Excellent service!',
        appointmentId: 'appointment-1',
        createdAt: new Date('2025-01-01T09:00:00')
      }
      req.params.appointmentId = 'appointment-1'
      useCaseMock.executeFindByAppointmentId.mockResolvedValueOnce(rating)

      // act
      await RatingsController.handleFindByAppointmentId(req, res, next)

      // assert
      expect(req.params.appointmentId).toBe('appointment-1')
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(rating)
      expect(useCaseMock.executeFindByAppointmentId).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindByAppointmentId).toHaveBeenCalledWith('appointment-1')
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFindByAppointmentId fails', async () => {
      // arrange
      const error = new Error('Rating not found for appointment')
      req.params.appointmentId = 'appointment-1'
      useCaseMock.executeFindByAppointmentId.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleFindByAppointmentId(req, res, next)

      // assert
      expect(useCaseMock.executeFindByAppointmentId).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeFindByAppointmentId).toHaveBeenCalledWith('appointment-1')
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleCreate', () => {
    it('should create a rating', async () => {
      // arrange
      const newRating: Prisma.RatingCreateInput = {
        score: 5,
        comment: 'Excellent service!',
        appointment: {
          connect: { id: 'appointment-1' }
        }
      }
      const createdRating: Rating = {
        id: 'rating-uuid-1',
        score: 5,
        comment: 'Excellent service!',
        appointmentId: 'appointment-1',
        createdAt: new Date('2025-01-01T09:00:00')
      }
      req.body = newRating
      useCaseMock.executeCreate.mockResolvedValueOnce(createdRating)

      // act
      await RatingsController.handleCreate(req, res, next)

      // assert
      expect(req.body).toEqual(newRating)
      expect(res.send).toHaveBeenCalledWith(createdRating)
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(newRating)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Failed to create rating')
      const newRating: Prisma.RatingCreateInput = {
        score: 5,
        comment: 'Excellent service!',
        appointment: {
          connect: { id: 'appointment-1' }
        }
      }
      req.body = newRating
      useCaseMock.executeCreate.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleCreate(req, res, next)

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(newRating)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdate', () => {
    it('should update a rating', async () => {
      // arrange
      const ratingToUpdate: Prisma.RatingUpdateInput = {
        score: 4,
        comment: 'Updated comment'
      }
      const updatedRating: Rating = {
        id: 'rating-uuid-1',
        score: 4,
        comment: 'Updated comment',
        appointmentId: 'appointment-1',
        createdAt: new Date('2025-01-01T09:00:00')
      }
      const ratingId = 'rating-uuid-1'
      req.body = ratingToUpdate
      req.params.id = ratingId
      useCaseMock.executeUpdate.mockResolvedValueOnce(updatedRating)

      // act
      await RatingsController.handleUpdate(req, res, next)

      // assert
      expect(req.body).toEqual(ratingToUpdate)
      expect(req.params.id).toBe(ratingId)
      expect(res.send).toHaveBeenCalledWith(updatedRating)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(ratingId, ratingToUpdate)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Failed to update rating')
      const ratingToUpdate: Prisma.RatingUpdateInput = {
        score: 4,
        comment: 'Updated comment'
      }
      const ratingId = 'rating-uuid-1'
      req.body = ratingToUpdate
      req.params.id = ratingId
      useCaseMock.executeUpdate.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleUpdate(req, res, next)

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(ratingId, ratingToUpdate)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleDelete', () => {
    it('should delete a rating', async () => {
      // arrange
      const deletedRating: Rating = {
        id: 'rating-uuid-1',
        score: 5,
        comment: 'Excellent service!',
        appointmentId: 'appointment-1',
        createdAt: new Date('2025-01-01T09:00:00')
      }
      const ratingId = 'rating-uuid-1'
      req.params.id = ratingId
      useCaseMock.executeDelete.mockResolvedValueOnce(deletedRating)

      // act
      await RatingsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(ratingId)
      expect(res.send).toHaveBeenCalledWith(deletedRating)
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Failed to delete rating')
      const ratingId = 'rating-uuid-1'
      req.params.id = ratingId
      useCaseMock.executeDelete.mockRejectedValueOnce(error)

      // act
      await RatingsController.handleDelete(req, res, next)

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(ratingId)
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
