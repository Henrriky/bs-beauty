import { type NextFunction, type Request, type Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import { makeAppointmentServicesUseCaseFactory } from '../factory/make-appointment-services-use-case.factory'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type AppointmentService } from '@prisma/client'

const schema = z.object({
  totalAppointments: z.number(),
  newAppointments: z.number(),
  finishedAppointments: z.number(),
  totalCustomers: z.number(),
  numberOfServices: z.number(),
  numberOfEmployees: z.number().optional(),
  totalRevenue: z.number()
})

type Analytics = z.infer<typeof schema>

class AnalyticsController {
  public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      const appointmentServicesUseCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await appointmentServicesUseCase.executeFindAll()
      analytics.totalAppointments = appointmentServices.length

      let newAppointmentsCount = 0
      appointmentServices.forEach(appointmentService => {
        if (appointmentService.status === 'PENDING') {
          newAppointmentsCount++
        }
      })
      analytics.newAppointments = newAppointmentsCount

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
        if (appointmentService.status === 'FINISHED') {
          const offers = await offerUseCase.executeFindById(appointmentService.serviceOfferedId)
          if (offers?.price !== undefined && offers?.price !== null) {
            revenueCount += Number(offers.price)
          }
        }
      }
      analytics.totalRevenue = revenueCount

      const parseResult = schema.parse(analytics)

      res.send(parseResult)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByEmployeeId(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      const employeeId = req.params.id

      const offerUseCase = makeOffersUseCaseFactory()
      console.log(employeeId);
      
      const { offers } = await offerUseCase.executeFindByEmployeeId(employeeId)
      const appointmentServicesUseCase = makeAppointmentServicesUseCaseFactory()
      const employeeAppointments: AppointmentService[] = []
      for (const offer of offers) {
        const { appointmentServices } = await appointmentServicesUseCase.executeFindByServiceOfferedId(offer.id)
        appointmentServices.forEach((item) => {
          employeeAppointments.push(item)
        })
      }
      analytics.totalAppointments = employeeAppointments.length

      let newAppointmentsCount = 0
      employeeAppointments.forEach(appointment => {
        if (appointment.status === 'PENDING') {
          newAppointmentsCount++
        }
      })
      analytics.newAppointments = newAppointmentsCount

      let finishedAppointmentsCount = 0
      employeeAppointments.forEach(appointment => {
        if (appointment.status === 'FINISHED') {
          finishedAppointmentsCount++
        }
      })
      analytics.finishedAppointments = finishedAppointmentsCount

      const currentEmployeeCustomersIds = new Set<string>()
      const appointmentUseCase = makeAppointmentsUseCaseFactory()
      for (const appointmentService of employeeAppointments) {
        const appointment = await appointmentUseCase.executeFindById(appointmentService.appointmentId)
        if (appointment !== null) {
          currentEmployeeCustomersIds.add(appointment.customerId)
        }
      }
      analytics.totalCustomers = currentEmployeeCustomersIds.size

      analytics.numberOfServices = offers.length

      let revenueCount = Number(0)
      for (const offer of offers) {
        const { appointmentServices } = await appointmentServicesUseCase.executeFindByServiceOfferedId(offer.id)
        for (const appointmentService of appointmentServices) {
          if (appointmentService.status === 'FINISHED') {
            revenueCount += Number(offer.price)
          }
        }
      }
      analytics.totalRevenue = revenueCount

      res.send(analytics)
    } catch (error) {
      next(error)
    }
  }
}

export { AnalyticsController }
