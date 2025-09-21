import { type AppointmentRepository } from '@/repository/protocols/appointment.repository'
import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
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

export { MockAppointmentRepository, MockCustomerRepository, MockProfessionalRepository, MockServiceRepository }
