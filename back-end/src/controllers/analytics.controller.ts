import { type NextFunction, type Request, type Response } from 'express'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'

const schema = z.object({
  totalAppointments: z.number(),
  finishedAppointments: z.number(),
  totalCustomers: z.number(),
  numberOfServices: z.number(),
  numberOfEmployees: z.number()
})

type Analytics = z.infer<typeof schema>

class AnalyticsController {
  public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      // TODO: maybe filter by date, so it retrieves the appointments that were not complete.
      const appointmentUseCase = makeAppointmentsUseCaseFactory()
      const { appointments } = await appointmentUseCase.executeFindAll()
      analytics.totalAppointments = appointments.length

      let finishedAppointmentsCount = 0
      appointments.forEach(appointment => {
        if (appointment.status === 'FINISHED') {
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

      const parseResult = schema.parse(analytics)

      res.send(parseResult)
    } catch (error) {
      next(error)
    }
  }
}

export { AnalyticsController }
