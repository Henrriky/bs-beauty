import { type NextFunction, type Request, type Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeProfessionalsUseCaseFactory } from '../factory/make-professionals-use-case.factory'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type Appointment } from '@prisma/client'
import { makeRatingsUseCaseFactory } from '@/factory/make-ratings-use-case.factory'
import { makeAnalyticsUseCaseFactory } from '@/factory/make-analytics-use-case.factory'

const schema = z.object({
  totalAppointments: z.number(),
  newAppointments: z.number(),
  finishedAppointments: z.number(),
  totalCustomers: z.number(),
  numberOfServices: z.number(),
  numberOfProfessionals: z.number().optional(),
  totalRevenue: z.number()
})

const appointmentsFilterSchema = z.object({
  startDate: z.string().datetime({ message: 'Invalid startDate. Must be a valid ISO date string.' }),
  endDate: z.string().datetime({ message: 'Invalid endDate. Must be a valid ISO date string.' }),
  statusList: z.array(z.string()).optional(),
  professionalId: z.string().uuid().optional(),
  serviceIds: z.array(z.string().uuid()).optional()
})

type Analytics = z.infer<typeof schema>

// TODO: Extract logic/calculations to an use case

class AnalyticsController {
  public static async handleFindAll(req: Request, res: Response, next: NextFunction) {
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
        const professionalUseCase = makeProfessionalsUseCaseFactory()
        const { professionals } = await professionalUseCase.executeFindAll()
        analytics.numberOfProfessionals = professionals.length
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.warn('No professionals found (404). Continuing...')
          analytics.numberOfProfessionals = 0
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

  public static async handleFindByProfessionalId(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics: Partial<Analytics> = {}

      const professionalId = req.params.id

      const offerUseCase = makeOffersUseCaseFactory()
      let offerList
      try {
        const { offers } = await offerUseCase.executeFindByProfessionalId(professionalId)
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
        const professionalAppointments: Appointment[] = []
        for (const offer of offerList) {
          try {
            const { appointments } = await appointmentsUseCase.executeFindByServiceOfferedId(offer.id)
            appointments.forEach((item) => {
              professionalAppointments.push(item)
            })
          } catch (error: any) {
            if (error.statusCode === 404) {
              console.warn('No appointment services found (404). Continuing...')
            } else {
              throw error
            }
          }
        }
        analytics.totalAppointments = professionalAppointments.length

        if (analytics.totalAppointments > 0) {
          let newAppointmentsCount = 0
          professionalAppointments.forEach(appointment => {
            if (appointment.status === 'PENDING') {
              newAppointmentsCount++
            }
          })
          analytics.newAppointments = newAppointmentsCount

          let finishedAppointmentsCount = 0
          professionalAppointments.forEach(appointment => {
            if (appointment.status === 'FINISHED') {
              finishedAppointmentsCount++
            }
          })
          analytics.finishedAppointments = finishedAppointmentsCount
        } else {
          analytics.newAppointments = 0
          analytics.finishedAppointments = 0
        }

        const currentProfessionalCustomersIds = new Set<string>()
        const appointmentUseCase = makeAppointmentsUseCaseFactory()
        for (const appointment of professionalAppointments) {
          currentProfessionalCustomersIds.add(appointment.customerId)
        }
        analytics.totalCustomers = currentProfessionalCustomersIds.size

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

  public static async handleGetRatingsAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const ratingsUseCase = makeRatingsUseCaseFactory()
      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const professionals = await analyticsUseCase.executeGetTopProfessionalsRatingsAnalytics(5)

      const salonRating = await ratingsUseCase.executeGetMeanScore()
      res.send({
        professionals,
        salonRating
      })
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetCustomerAmountPerRatingScore(req: Request, res: Response, next: NextFunction) {
    try {
      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const customerCountPerRating = await analyticsUseCase.executeGetCustomerAmountPerRatingScore()
      res.send(customerCountPerRating)
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetMeanRatingByService(req: Request, res: Response, next: NextFunction) {
    try {
      const amount = req.body.amount as number | undefined
      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const meanRatingByService = await analyticsUseCase.executeGetMeanRatingByService(amount)

      res.send(meanRatingByService)
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetMeanRatingOfProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const amount = req.body.amount as number | undefined
      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const meanRatingByProfessional = await analyticsUseCase.executeGetMeanRatingOfProfessionals(amount)

      res.send(meanRatingByProfessional)
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetAppointmentAmountInDateRangeByStatusAndProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      const data = appointmentsFilterSchema.parse(req.body)

      const parsedStartDate = new Date(data.startDate)
      const parsedEndDate = new Date(data.endDate)

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const appointmentCount = await analyticsUseCase.executeGetAppointmentNumberOnDateRangeByStatusProfessionalAndServices(user, parsedStartDate, parsedEndDate, data.statusList, data.professionalId, data.serviceIds)
      res.json({ appointmentCount })
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetEstimatedAppointmentTimeInDateRangeByProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      const data = appointmentsFilterSchema.omit({statusList: true}).parse(req.body)

      const parsedStartDate = new Date(data.startDate)
      const parsedEndDate = new Date(data.endDate)

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const estimatedTimeInMinutes = await analyticsUseCase.executeGetEstimatedAppointmentTimeByProfessionalAndServices(user, parsedStartDate, parsedEndDate, data.professionalId, data.serviceIds)
      res.json({ estimatedTimeInMinutes })
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetAppointmentCancelationRateByProfessional (req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user
      const data = appointmentsFilterSchema.omit({statusList: true}).parse(req.body)
     
      const parsedStartDate = new Date(data.startDate)
      const parsedEndDate = new Date(data.endDate)

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const cancelationRate = await analyticsUseCase.executeGetAppointmentCancelationRateByProfessional(user, parsedStartDate, parsedEndDate, data.professionalId, data.serviceIds)
      res.json({ cancelationRate })
    } catch (error) {
      next(error)
    }
  }
}

export { AnalyticsController }
