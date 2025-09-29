import { type AppointmentRepository } from '@/repository/protocols/appointment.repository'
import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type OfferRepository } from '@/repository/protocols/offer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { RatingRepository } from '@/repository/protocols/rating.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
import { type ShiftRepository } from '@/repository/protocols/shift.repository'
import { type Mocked } from 'vitest'

vi.mock('@/factory/make-appointments-use-case.factory')

const MockAppointmentRepository: Mocked<AppointmentRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByCustomerOrProfessionalId: vi.fn(),
  findByServiceOfferedId: vi.fn(),
  findNonFinishedByUserAndDay: vi.fn(),
  countCustomerAppointmentsPerDay: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

const MockCustomerRepository: Mocked<CustomerRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmailOrPhone: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateByEmailAndGoogleId: vi.fn(),
  updateByEmail: vi.fn(),
  updateOrCreate: vi.fn(),
  delete: vi.fn(),
  findAllPaginated: vi.fn()
}

const MockProfessionalRepository: Mocked<ProfessionalRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateByEmailAndGoogleId: vi.fn(),
  updateProfessionalByEmail: vi.fn(),
  delete: vi.fn(),
  fetchServicesOfferedByProfessional: vi.fn(),
  findAllPaginated: vi.fn()
}

const MockServiceRepository: Mocked<ServiceRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  fetchProfessionalsOfferingService: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAllPaginated: vi.fn()
}

const MockOfferRepository: Mocked<OfferRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByServiceId: vi.fn(),
  findByProfessionalId: vi.fn(),
  findByProfessionalAndServiceId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByProfessionalIdPaginated: vi.fn()
}

const MockShiftRepository: Mocked<ShiftRepository> = {
  findAllByProfessionalId: vi.fn(),
  findById: vi.fn(),
  findByIdAndProfessionalId: vi.fn(),
  findByProfessionalId: vi.fn(),
  findByProfessionalAndWeekDay: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

const MockRatingRepository: Mocked<RatingRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByAppointmentId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

export {
  MockAppointmentRepository,
  MockCustomerRepository,
  MockOfferRepository,
  MockProfessionalRepository,
  MockServiceRepository,
  MockShiftRepository,
  MockRatingRepository
}
