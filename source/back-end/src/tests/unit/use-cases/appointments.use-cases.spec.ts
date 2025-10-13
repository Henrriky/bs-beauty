import { AppointmentsUseCase, MAXIMUM_APPOINTMENTS_PER_DAY, MINIMUM_SCHEDULLING_TIME_MINUTES } from '@/services/appointments.use-case'
import { MockAppointmentRepository, MockCustomerRepository, MockProfessionalRepository, MockRatingRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type Prisma, type Appointment } from '@prisma/client'

describe('AppointmentsUseCase (Unit Tests)', () => {
  let appointmentsUseCase: AppointmentsUseCase

  beforeEach(() => {
    appointmentsUseCase = new AppointmentsUseCase(
      MockAppointmentRepository,
      MockCustomerRepository,
      MockProfessionalRepository,
      MockRatingRepository
    )
  })

  it('should be defined', () => {
    expect(appointmentsUseCase).toBeDefined()
  })

  describe('executeCreate', () => {
    it('should create an appointment', async () => {
      const appointmentDateInOneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInOneHourFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }
      MockAppointmentRepository.create.mockResolvedValue(appointmentToCreate as Appointment)
      MockAppointmentRepository.countCustomerAppointmentsPerDay.mockResolvedValueOnce(MAXIMUM_APPOINTMENTS_PER_DAY - 1)

      const appointmentCreated = await appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, faker.string.uuid())
      expect(MockAppointmentRepository.create).toHaveBeenCalledWith(appointmentToCreate)
      expect(MockAppointmentRepository.create).toHaveBeenCalledTimes(1)
      expect(appointmentCreated).toEqual(appointmentToCreate)
    })

    it('should throw an error if try to create an appointment with invalid date', async () => {
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: 'invalid-date' as any,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }
      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, faker.string.uuid())
      await expect(promise).rejects.toThrowError(`Invalid appointment date provided: ${String(appointmentToCreate.appointmentDate)}`)
    })

    it('should throw an error if try to create an appointment with date in the past', async () => {
      const appointmentDateInOneHourFromNow = new Date(Date.now() - 60 * 60 * 1000)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInOneHourFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }

      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, faker.string.uuid())

      await expect(promise).rejects.toThrowError('The selected time is in the past.')
    })

    it(`should throw an error if appointment is scheduled less than ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes from now`, async () => {
      const HALF_MINIMUM_SCHEDULING_MS = (MINIMUM_SCHEDULLING_TIME_MINUTES / 2) * 60 * 1000
      const appointmentDateInHalfMinimumFromNow = new Date(Date.now() + HALF_MINIMUM_SCHEDULING_MS)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInHalfMinimumFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }

      MockAppointmentRepository.create.mockResolvedValue(appointmentToCreate as Appointment)
      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, faker.string.uuid())

      await expect(promise).rejects.toThrowError(`The selected time must be at least ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in the future.`)
    })

    it('should throw an error if user reach the maximum of appointments per day', async () => {
      const appointmentDateInOneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInOneHourFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }

      MockAppointmentRepository.countCustomerAppointmentsPerDay.mockResolvedValueOnce(MAXIMUM_APPOINTMENTS_PER_DAY)

      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, faker.string.uuid())

      await expect(promise).rejects.toThrowError('You have reached the maximum number of appointments for today, please try again tomorrow.')
    })
  })
})
