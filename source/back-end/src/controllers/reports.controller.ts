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

  public static async getRevenueEvolution(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate, professionalId } = req.query

      if (!startDate || !endDate) {
        res.status(400).send({ error: 'startDate and endDate are required' })
        return
      }

      const report = await useCase.executeGetRevenueEvolution(
        new Date(String(startDate)),
        new Date(String(endDate)),
        professionalId ? String(professionalId) : undefined
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }

  public static async getTotalRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate, professionalId } = req.query

      if (!startDate || !endDate) {
        res.status(400).send({ error: 'startDate and endDate are required' })
        return
      }

      const report = await useCase.executeGetTotalRevenue(
        new Date(String(startDate)),
        new Date(String(endDate)),
        professionalId ? String(professionalId) : undefined
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }

  public static async getRevenueByService(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate, professionalId } = req.query

      if (!startDate || !endDate) {
        res.status(400).send({ error: 'startDate and endDate are required' })
        return
      }

      const report = await useCase.executeGetRevenueByService(
        new Date(String(startDate)),
        new Date(String(endDate)),
        professionalId ? String(professionalId) : undefined
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }

  public static async getRevenueByProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeReportsUseCaseFactory()
      const { startDate, endDate } = req.query

      if (!startDate || !endDate) {
        res.status(400).send({ error: 'startDate and endDate are required' })
        return
      }

      const report = await useCase.executeGetRevenueByProfessional(
        new Date(String(startDate)),
        new Date(String(endDate))
      )

      res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }
}

export { ReportsController }
