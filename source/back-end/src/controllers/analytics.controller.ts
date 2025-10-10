import { type NextFunction, type Request, type Response } from 'express'
import { makeCustomersUseCaseFactory } from '../factory/make-customers-use-case.factory'
import { z } from 'zod'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { makeProfessionalsUseCaseFactory } from '../factory/make-professionals-use-case.factory'
import { makeOffersUseCaseFactory } from '../factory/make-offers-use-case.factory'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type Appointment } from '@prisma/client'
import { makeRatingsUseCaseFactory } from '@/factory/make-ratings-use-case.factory'
import { prismaClient } from '../lib/prisma'
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

const ratingsSchema = z.object({
  meanRatingScore: z.number()
})

type Analytics = z.infer<typeof schema>
type RatingsAnalytics = z.infer<typeof ratingsSchema>

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
      const professionalsUseCase = makeProfessionalsUseCaseFactory();
      const offerUseCase = makeOffersUseCaseFactory();
      const appointmentUseCase = makeAppointmentsUseCaseFactory();
      const ratingsUseCase = makeRatingsUseCaseFactory();
      const professionals = await professionalsUseCase.executeFindAll();
      const selectedProfessionals = professionals.professionals.slice(0, 5);

      const professionalsWithMeanRating = await Promise.all(selectedProfessionals.map(async (prof) => {
        let offers: import('@prisma/client').Offer[] = [];
        try {
          const result = await offerUseCase.executeFindByProfessionalId(prof.id);
          offers = result.offers as import('@prisma/client').Offer[];
        } catch (error: any) {
          if (error.statusCode === 404) {
            offers = [];
          } else {
            throw error;
          }
        }
        const offerIds = offers.map((o) => o.id);

        let appointments: { id: string }[] = [];
        if (offerIds.length > 0) {
          for (const offerId of offerIds) {
            try {
              const result = await appointmentUseCase.executeFindByServiceOfferedId(offerId);
              appointments.push(...result.appointments.map(a => ({ id: a.id })));
            } catch (error: any) {
              if (error.statusCode === 404) {
              } else {
                throw error;
              }
            }
          }
        }
        const appointmentIds = appointments.map((a) => a.id);

        let ratings: { score: number | null }[] = [];
        if (appointmentIds.length > 0) {
          try {
            let ratingsArr: { score: number | null }[] = [];
            for (const appointmentId of appointmentIds) {
              try {
                const currentRating = await ratingsUseCase.executeFindByAppointmentId(appointmentId);
                if (Array.isArray(currentRating)) {
                  ratingsArr.push(...currentRating.filter(r => r && typeof r.score === 'number'));
                } else if (currentRating !== null && typeof currentRating.score === 'number') {
                  ratingsArr.push(currentRating);
                }
              } catch (error: any) {
                if (error?.statusCode === 404) {
                } else {
                  throw error;
                }
              }
            }
            ratings = ratingsArr ?? [];
          } catch (error: any) {
            if (error.statusCode === 404) {
              ratings = [];
            } else {
              throw error;
            }
          }
        }
        const scores = ratings
          .map((r) => r.score)
          .filter((s): s is number => typeof s === 'number' && s !== null);
        const meanRating = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        return {
          id: prof.id,
          name: prof.name,
          specialization: prof.specialization,
          profilePhotoUrl: prof.profilePhotoUrl,
          meanRating,
          ratingCount: scores.length
        };
      }));

      const salonRating = await ratingsUseCase.executeGetMeanScore();

      res.send({ professionals: professionalsWithMeanRating,
        salonRating
       });
    } catch (error) {
      next(error);
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
      const amountParam = req.body.amount as string | undefined
      const amount = amountParam ? parseInt(amountParam, 10) : 5

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const meanRatingByService = await analyticsUseCase.executeGetMeanRatingByService(amount)
      res.send(meanRatingByService)
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetMeanRatingOfProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.body.amount as string | undefined
      const amount = professionalId ? parseInt(professionalId, 10) : 5

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const meanRatingByProfessional = await analyticsUseCase.executeGetMeanRatingOfProfessionals(amount)
      res.send(meanRatingByProfessional)
    } catch (error) {
      next(error)
    }
  }

  public static async handleGetAppointmentAmountInDateRange(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.body as { startDate: string, endDate: string }

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate are required in the request body.' })
      }
      
      const parsedStartDate = new Date(startDate)
      const parsedEndDate = new Date(endDate)
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Please use a valid date string.' })
      }

      const analyticsUseCase = makeAnalyticsUseCaseFactory()
      const appointmentCount = await analyticsUseCase.executeGetAppointmentNumberOnDateRange(parsedStartDate, parsedEndDate)
      res.json({ appointmentCount })
    } catch (error) {
      next(error)
    }
  }

}

export { AnalyticsController }
