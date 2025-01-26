import { type NextFunction, type Request, type Response } from 'express'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { number, z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import { makeAppointmentServicesUseCaseFactory } from '../factory/make-appointment-services-use-case.factory'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { Decimal } from '@prisma/client/runtime/library'

const schema = z.object({
  totalAppointments: z.number(),
  finishedAppointments: z.number(),
  totalCustomers: z.number(),
  numberOfServices: z.number(),
  numberOfEmployees: z.number(),
  totalRevenue: z.number()
})

type Analytics = z.infer<typeof schema>

class AnalyticsController {
  public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      // TODO: maybe filter by date, so it retrieves the appointments that were not complete.
      const appointmentServicesUseCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await appointmentServicesUseCase.executeFindAll()
      analytics.totalAppointments = appointmentServices.length

      let finishedAppointmentsCount = 0
      appointmentServices.forEach(appointmentService => {
        if (appointmentService.status === 'FINISHED') {
          finishedAppointmentsCount++
        }
      })
      analytics.finishedAppointments = finishedAppointmentsCount

      const customerUseCase = makeCustomersUseCaseFactory()
      const { customers } = await customerUseCase.executeFindAll()
      analytics.totalCustomers = customers.length

      const serviceUseCase = makeServiceUseCaseFactory()
      const { services } = await serviceUseCase.executeFindAll()
      analytics.numberOfServices = services.length

      const employeeUseCase = makeEmployeesUseCaseFactory()
      const { employees } = await employeeUseCase.executeFindAll()
      analytics.numberOfEmployees = employees.length

      let revenueCount = Number(0)
      const offerUseCase = makeOffersUseCaseFactory()
      for (const appointmentService of appointmentServices) {
        const offers = await offerUseCase.executeFindById(appointmentService.serviceOfferedId)
        if (offers?.price !== undefined && offers?.price !== null) {
          revenueCount += Number(offers.price)
        }
      }
      analytics.totalRevenue = revenueCount

      const parseResult = schema.parse(analytics)

      res.send(parseResult)
    } catch (error) {
      next(error)
    }
  }
}

export { AnalyticsController }
