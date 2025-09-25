import { makeSalonInfoUseCaseFactory } from '@/factory/make-salon-info-use-case.factory'
import { mockRequest, mockResponse, type MockRequest } from '../utils/test-utilts'
import { type Response } from 'express'
import { SalonInfoController } from '@/controllers/salon-info.controller'
import { type Prisma, type SalonInfo } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'

vi.mock('@/factory/make-salon-info-use-case.factory.ts')

describe('SalonInfoController', () => {
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
      executeFetchInfo: vi.fn(),
      executeUpdateInfo: vi.fn()
    }

    vi.mocked(makeSalonInfoUseCaseFactory).mockReturnValue(useCaseMock)
    vi.setSystemTime(new Date('2025-01-01T09:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(SalonInfoController).toBeDefined()
  })

  describe('handleFetchInfo', () => {
    it('should return the salon info', async () => {
      // arrange
      const salonInfo: SalonInfo = {
        id: 1,
        name: 'BS Beauty Academy',
        openingHours: null,
        salonAddress: 'Localização',
        salonEmail: 'email@example.com',
        salonPhoneNumber: '(11) 91111-1111',
        minimumAdvanceTime: '30 minutos',
        updatedAt: new Date()
      }

      useCaseMock.executeFetchInfo.mockResolvedValueOnce(salonInfo)

      // act
      await SalonInfoController.handleFetchInfo(req, res, next)

      // assert
      expect(useCaseMock.executeFetchInfo).toHaveBeenCalledTimes(1)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(salonInfo)

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeFetchInfo fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      useCaseMock.executeFetchInfo.mockRejectedValueOnce(error)

      // act
      await SalonInfoController.handleFetchInfo(req, res, next)

      // assert
      expect(useCaseMock.executeFetchInfo).toHaveBeenCalledTimes(1)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('handleUpdateInfo', () => {
    it('should update the salon info', async () => {
      // arrange
      const salonInfoToUpdate: Prisma.SalonInfoUpdateInput = {
        salonAddress: 'Localização',
        salonEmail: 'newemail',
        salonPhoneNumber: '(11) 91111-1111',
        minimumAdvanceTime: '1 hora'
      }

      const salonId = '1'

      req.body = salonInfoToUpdate
      req.params.id = salonId
      useCaseMock.executeUpdateInfo.mockResolvedValueOnce(salonInfoToUpdate)

      // act
      await SalonInfoController.handleUpdateInfo(req, res, next)

      // assert
      expect(useCaseMock.executeUpdateInfo).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdateInfo).toHaveBeenCalledWith(parseInt(salonId), salonInfoToUpdate)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(res.send).toHaveBeenCalledWith(salonInfoToUpdate)

      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with an error if executeUpdateInfo fails', async () => {
      // arrange
      const error = new Error('Database connection failed')
      const salonInfoToUpdate: Prisma.SalonInfoUpdateInput = {
        salonAddress: 'Localização',
        salonEmail: 'newemail@example.com',
        salonPhoneNumber: '(11) 91111-1111',
        minimumAdvanceTime: '1 hora'
      }

      const salonId = '1'

      req.body = salonInfoToUpdate
      req.params.id = salonId
      useCaseMock.executeUpdateInfo.mockRejectedValueOnce(error)

      // act
      await SalonInfoController.handleUpdateInfo(req, res, next)

      // assert
      expect(useCaseMock.executeUpdateInfo).toHaveBeenCalledTimes(1)
      expect(useCaseMock.executeUpdateInfo).toHaveBeenCalledWith(parseInt(salonId), salonInfoToUpdate)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
