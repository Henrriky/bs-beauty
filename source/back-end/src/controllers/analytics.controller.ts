import { type NextFunction, type Request, type Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeEmployeesUseCaseFactory } from '../factory/make-employees-use-case.factory'
import { makeAppointmentServicesUseCaseFactory } from '../factory/make-appointment-services-use-case.factory'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type Appointment } from '@prisma/client'

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
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      const appointmentUseCase = makeAppointmentsUseCaseFactory()
      let appointmentsList: Appointment[] | undefined
      try {
        const { appointments } = await appointmentUseCase.executeFindAll()
        appointmentsList = appointments
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No appointments found (404). Continuing...')
        } else {
          throw error
        }
      }

      if (appointmentsList !== undefined) {
        analytics.totalAppointments = appointmentsList.length

        let newAppointmentsCount = 0
        appointmentsList.forEach(appointment => {
          if (appointment.status === 'PENDING') {
            newAppointmentsCount++
          }
        })
        analytics.newAppointments = newAppointmentsCount

        let finishedAppointmentsCount = 0
        appointmentsList.forEach(appointment => {
          if (appointment.status === 'FINISHED') {
            finishedAppointmentsCount++
          }
        })
        analytics.finishedAppointments = finishedAppointmentsCount

        let revenueCount = Number(0)
        const offerUseCase = makeOffersUseCaseFactory()
        for (const appointment of appointmentsList) {
          if (appointment.status === 'FINISHED') {
            const offers = await offerUseCase.executeFindById(appointment.serviceOfferedId)
            if (offers?.price !== undefined && offers?.price !== null) {
              revenueCount += Number(offers.price)
            }
          }
        }
        analytics.totalRevenue = revenueCount
      } else {
        analytics.totalAppointments = 0
        analytics.newAppointments = 0
        analytics.finishedAppointments = 0
        analytics.totalRevenue = 0
      }

      try {
        const customerUseCase = makeCustomersUseCaseFactory()
        const { customers } = await customerUseCase.executeFindAll()
        analytics.totalCustomers = customers.length
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No customers found (404). Continuing...')
          analytics.totalCustomers = 0
        } else {
          throw error
        }
      }

      try {
        const serviceUseCase = makeServiceUseCaseFactory()
        const { services } = await serviceUseCase.executeFindAll()
        analytics.numberOfServices = services.length
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No services found (404). Continuing...')
          analytics.numberOfServices = 0
        } else {
          throw error
        }
      }

      try {
        const employeeUseCase = makeEmployeesUseCaseFactory()
        const { employees } = await employeeUseCase.executeFindAll()
        analytics.numberOfEmployees = employees.length
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No employees found (404). Continuing...')
          analytics.numberOfEmployees = 0
        } else {
          throw error
        }
      }

      const parseResult = schema.parse(analytics)

      res.send(parseResult)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByEmployeeId (req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      const employeeId = req.params.id

      const offerUseCase = makeOffersUseCaseFactory()
      let offerList
      try {
        const { offers } = await offerUseCase.executeFindByEmployeeId(employeeId)
        offerList = offers
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No offers found (404). Continuing...')
        } else {
          throw error
        }
      }

      if (offerList !== undefined) {
        const appointmentsUseCase = makeAppointmentsUseCaseFactory()
        const employeeAppointments: Appointment[] = []
        for (const offer of offerList) {
          try {
            const { appointments } = await appointmentsUseCase.executeFindByServiceOfferedId(offer.id)
            appointments.forEach((item) => {
              employeeAppointments.push(item)
            })
          } catch (error: any) {
            if (error.statusCode === 404) {
              console.warn('No appointment services found (404). Continuing...')
            } else {
              throw error
            }
          }
        }
        analytics.totalAppointments = employeeAppointments.length

        if (analytics.totalAppointments > 0) {
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
        } else {
          analytics.newAppointments = 0
          analytics.finishedAppointments = 0
        }

        const currentEmployeeCustomersIds = new Set<string>()
        const appointmentUseCase = makeAppointmentsUseCaseFactory()
        for (const appointment of employeeAppointments) {
          currentEmployeeCustomersIds.add(appointment.customerId)
        }
        analytics.totalCustomers = currentEmployeeCustomersIds.size

        analytics.numberOfServices = offerList.length

        let revenueCount = Number(0)
        for (const offer of offerList) {
          try {
            const { appointments } = await appointmentUseCase.executeFindByServiceOfferedId(offer.id)
            for (const appointment of appointments) {
              if (appointment.status === 'FINISHED') {
                revenueCount += Number(offer.price)
              }
            }
          } catch (error: any) {
            if (error.statusCode === 404) {
              console.warn('No appointment services found (404). Continuing...')
            } else {
              throw error
            }
          }
        }
        analytics.totalRevenue = revenueCount
      } else {
        analytics.totalAppointments = 0
        analytics.finishedAppointments = 0
        analytics.newAppointments = 0
        analytics.numberOfServices = 0
        analytics.totalCustomers = 0
        analytics.totalRevenue = 0
      }

      res.send(analytics)
    } catch (error) {
      next(error)
    }
  }
}

export { AnalyticsController }
