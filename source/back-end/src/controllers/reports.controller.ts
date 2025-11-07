import { makeReportsUseCaseFactory } from '@/factory/make-reports-use-case.factory'
import { type NextFunction, type Request, type Response } from 'express'

class ReportsController {
  public static async getDiscoverySourceCount(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate } = req.query
      const report = await useCase.executeGetDiscoverySourceCount(
        startDate ? new Date(String(startDate)) : undefined,
        endDate ? new Date(String(endDate)) : undefined
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }

  public static async getCustomerAgeDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate } = req.query
      const report = await useCase.executeGetCustomerAgeDistribution(
        startDate ? new Date(String(startDate)) : undefined,
        endDate ? new Date(String(endDate)) : undefined
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }
}

export { ReportsController }
