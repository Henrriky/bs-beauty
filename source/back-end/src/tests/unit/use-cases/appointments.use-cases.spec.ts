import { AppointmentsUseCase, MAXIMUM_APPOINTMENTS_PER_DAY, MINIMUM_SCHEDULLING_TIME_MINUTES } from '@/services/appointments.use-case'
import { MockAppointmentRepository, MockCustomerRepository, MockProfessionalRepository, MockRatingRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type Prisma, type Appointment, UserType, Status } from '@prisma/client'
import { type PaginatedRequest } from '@/types/pagination'
import { type AppointmentFilters } from '@/types/appointments/appointment-filters'
import { type FindByIdAppointments } from '@/repository/protocols/appointment.repository'
import { CustomError } from '@/utils/errors/custom.error.util'

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
      const tokenPayload = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        profilePhotoUrl: '',
        registerCompleted: true,
        userId: faker.string.uuid(),
        permissions: [],
        userType: UserType.CUSTOMER
      }

      const appointmentCreated = await appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, tokenPayload)
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

      const tokenPayload = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        profilePhotoUrl: '',
        registerCompleted: true,
        userId: faker.string.uuid(),
        permissions: [],
        userType: UserType.CUSTOMER
      }

      const promise = appointmentsUseCase.executeCreate(
        appointmentToCreate as Prisma.AppointmentCreateInput,
        tokenPayload
      )

      await expect(promise).rejects.toThrowError(
        `Invalid appointment date provided: ${String(appointmentToCreate.appointmentDate)}`
      )
    })

    it('should throw an error if try to create an appointment with date in the past', async () => {
      const appointmentDateInOneHourFromNow = new Date(Date.now() - 60 * 60 * 1000)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInOneHourFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }

      const tokenPayload = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        profilePhotoUrl: '',
        registerCompleted: true,
        userId: faker.string.uuid(),
        permissions: [],
        userType: UserType.CUSTOMER
      }

      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, tokenPayload)

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

      const tokenPayload = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        profilePhotoUrl: '',
        registerCompleted: true,
        userId: faker.string.uuid(),
        permissions: [],
        userType: UserType.CUSTOMER
      }

      MockAppointmentRepository.create.mockResolvedValue(appointmentToCreate as Appointment)
      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, tokenPayload)

      await expect(promise).rejects.toThrowError(`The selected time must be at least ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in the future.`)
    })

    it('should throw an error if user reach the maximum of appointments per day', async () => {
      const appointmentDateInOneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      const appointmentToCreate: Partial<Appointment> = {
        appointmentDate: appointmentDateInOneHourFromNow,
        customerId: faker.string.uuid(),
        serviceOfferedId: faker.string.uuid()
      }

      const tokenPayload = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        profilePhotoUrl: '',
        registerCompleted: true,
        permissions: [],
        userId: faker.string.uuid(),
        userType: UserType.CUSTOMER
      }

      MockAppointmentRepository.countCustomerAppointmentsPerDay.mockResolvedValueOnce(MAXIMUM_APPOINTMENTS_PER_DAY)

      const promise = appointmentsUseCase.executeCreate((appointmentToCreate) as Prisma.AppointmentCreateInput, tokenPayload)

      await expect(promise).rejects.toThrowError('You have reached the maximum number of appointments for today, please try again tomorrow.')
    })
  })

  describe('executeFindAll', () => {
    it('should return all appointments', async () => {
      const appointments: Appointment[] = [{ id: '1' } as any, { id: '2' } as any]
      MockAppointmentRepository.findAll.mockResolvedValue(appointments)

      const result = await appointmentsUseCase.executeFindAll()

      expect(MockAppointmentRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result.appointments).toEqual(appointments)
    })
  })

  describe('executeFindAllPaginated', () => {
    it('should return paginated appointments', async () => {
      const params: PaginatedRequest<AppointmentFilters> = { page: 1, limit: 10, filters: {} }
      const paginatedResult = {
        data: [{ id: '1' } as Appointment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
      MockAppointmentRepository.findAllPaginated.mockResolvedValue(paginatedResult)

      const result = await appointmentsUseCase.executeFindAllPaginated(params, { userId: 'any', viewAll: true })

      expect(MockAppointmentRepository.findAllPaginated).toHaveBeenCalledWith(params, { userId: 'any', viewAll: true })
      expect(result).toEqual(paginatedResult)
    })
  })

  describe('executeFindById', () => {
    it('should return an appointment by id', async () => {
      const appointment: FindByIdAppointments = { id: '1' } as any
      MockAppointmentRepository.findById.mockResolvedValue(appointment)

      const result = await appointmentsUseCase.executeFindById('1')

      expect(MockAppointmentRepository.findById).toHaveBeenCalledWith('1')
      expect(result).toEqual(appointment)
    })

    it('should throw an error if appointment not found', async () => {
      MockAppointmentRepository.findById.mockResolvedValue(null)
      await expect(appointmentsUseCase.executeFindById('1')).rejects.toThrow(new CustomError('Not Found', 404, 'Appointment not found.'))
    })
  })

  describe('executeFindByCustomerOrProfessionalId', () => {
    it('should return appointments for a customer', async () => {
      const customerId = faker.string.uuid()
      MockCustomerRepository.findById.mockResolvedValue({ id: customerId } as any)
      MockProfessionalRepository.findById.mockResolvedValue(null)
      MockAppointmentRepository.findByCustomerOrProfessionalId.mockResolvedValue([])

      await appointmentsUseCase.executeFindByCustomerOrProfessionalId(customerId)
      expect(MockAppointmentRepository.findByCustomerOrProfessionalId).toHaveBeenCalledWith(customerId)
    })

    it('should return appointments for a professional', async () => {
      const professionalId = faker.string.uuid()
      MockCustomerRepository.findById.mockResolvedValue(null)
      MockProfessionalRepository.findById.mockResolvedValue({ id: professionalId } as any)
      MockAppointmentRepository.findByCustomerOrProfessionalId.mockResolvedValue([])

      await appointmentsUseCase.executeFindByCustomerOrProfessionalId(professionalId)
      expect(MockAppointmentRepository.findByCustomerOrProfessionalId).toHaveBeenCalledWith(professionalId)
    })

    it('should throw an error if neither customer nor professional found', async () => {
      const invalidId = faker.string.uuid()
      MockCustomerRepository.findById.mockResolvedValue(null)
      MockProfessionalRepository.findById.mockResolvedValue(null)

      await expect(appointmentsUseCase.executeFindByCustomerOrProfessionalId(invalidId)).rejects.toThrowError('Customer or Professional not found')
    })
  })

  describe('executeFindByServiceOfferedId', () => {
    it('should return appointments by service offered id', async () => {
      const serviceOfferedId = faker.string.uuid()
      MockAppointmentRepository.findByServiceOfferedId.mockResolvedValue([])

      await appointmentsUseCase.executeFindByServiceOfferedId(serviceOfferedId)
      expect(MockAppointmentRepository.findByServiceOfferedId).toHaveBeenCalledWith(serviceOfferedId)
    })
  })

  describe('executeUpdate', () => {
    const appointmentId = faker.string.uuid()
    const customerId = faker.string.uuid()
    const professionalId = faker.string.uuid()
    const appointment = {
      id: appointmentId,
      customerId,
      offer: { professionalId }
    } as any

    it('should allow customer to update appointment', async () => {
      const tokenPayload = { userId: customerId, userType: UserType.CUSTOMER } as any
      MockAppointmentRepository.findById.mockResolvedValue(appointment)
      MockAppointmentRepository.update.mockResolvedValue({ ...appointment, status: Status.CONFIRMED })

      await appointmentsUseCase.executeUpdate(appointmentId, { status: Status.CONFIRMED }, tokenPayload)
      expect(MockAppointmentRepository.update).toHaveBeenCalledWith(appointmentId, { status: Status.CONFIRMED })
    })

    it('should allow professional to update appointment', async () => {
      const tokenPayload = { userId: professionalId, userType: UserType.PROFESSIONAL } as any
      MockAppointmentRepository.findById.mockResolvedValue(appointment)
      MockAppointmentRepository.update.mockResolvedValue({ ...appointment, status: Status.CANCELLED })

      await appointmentsUseCase.executeUpdate(appointmentId, { status: Status.CANCELLED }, tokenPayload)
      expect(MockAppointmentRepository.update).toHaveBeenCalledWith(appointmentId, { status: Status.CANCELLED })
    })

    it('should not allow other users to update appointment', async () => {
      const otherUserId = faker.string.uuid()
      const tokenPayload = { userId: otherUserId, userType: UserType.CUSTOMER } as any
      MockAppointmentRepository.findById.mockResolvedValue(appointment)

      await expect(appointmentsUseCase.executeUpdate(appointmentId, {}, tokenPayload)).rejects.toThrowError('You are not allowed to update this appointment')
    })
  })

  describe('executeFinishAppointment', () => {
    it('should finish an appointment and create a rating', async () => {
      const appointmentId = faker.string.uuid()
      const userId = faker.string.uuid()
      const tokenPayload = { userId, userType: UserType.PROFESSIONAL } as any
      const finishedAppointment = { id: appointmentId, status: Status.FINISHED } as any

      vi.spyOn(appointmentsUseCase, 'executeUpdate').mockResolvedValue(finishedAppointment)
      MockRatingRepository.create.mockResolvedValue({} as any)

      const result = await appointmentsUseCase.executeFinishAppointment(tokenPayload, appointmentId)

      expect(appointmentsUseCase.executeUpdate).toHaveBeenCalledWith(appointmentId, { status: 'FINISHED' }, tokenPayload)
      expect(MockRatingRepository.create).toHaveBeenCalledWith({
        appointment: {
          connect: { id: appointmentId }
        }
      })
      expect(result).toEqual(finishedAppointment)
    })
  })

  describe('executeDelete', () => {
    const appointmentId = faker.string.uuid()
    const customerId = faker.string.uuid()
    const professionalId = faker.string.uuid()
    const appointment = {
      id: appointmentId,
      customerId,
      offer: { professionalId }
    } as any

    it('should allow customer to delete appointment', async () => {
      MockAppointmentRepository.findById.mockResolvedValue(appointment)
      MockAppointmentRepository.delete.mockResolvedValue(appointment)

      await appointmentsUseCase.executeDelete(customerId, appointmentId)
      expect(MockAppointmentRepository.delete).toHaveBeenCalledWith(appointmentId)
    })

    it('should allow professional to delete appointment', async () => {
      MockAppointmentRepository.findById.mockResolvedValue(appointment)
      MockAppointmentRepository.delete.mockResolvedValue(appointment)

      await appointmentsUseCase.executeDelete(professionalId, appointmentId)
      expect(MockAppointmentRepository.delete).toHaveBeenCalledWith(appointmentId)
    })

    it('should not allow other users to delete appointment', async () => {
      const otherUserId = faker.string.uuid()
      MockAppointmentRepository.findById.mockResolvedValue(appointment)

      await expect(appointmentsUseCase.executeDelete(otherUserId, appointmentId)).rejects.toThrowError('You are not allowed to delete this appointment')
    })
  })
})
