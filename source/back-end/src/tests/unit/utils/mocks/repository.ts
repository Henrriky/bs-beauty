import { type AppointmentRepository } from '@/repository/protocols/appointment.repository'
import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type NotificationRepository } from '@/repository/protocols/notification.repository'
import { type NotificationTemplateRepository } from '@/repository/protocols/notification-template.repository'
import { type OfferRepository } from '@/repository/protocols/offer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type RatingRepository } from '@/repository/protocols/rating.repository'
import { type RoleRepository } from '@/repository/protocols/role.repository'
import { type ServiceRepository } from '@/repository/protocols/service.repository'
import { type ShiftRepository } from '@/repository/protocols/shift.repository'
import { type Mocked } from 'vitest'
import { type BlockedTimeRepository } from '@/repository/protocols/blocked-times.repository'
import { type PaymentRecordRepository } from '@/repository/protocols/payment-record.repository'
import { type ReportRepository } from '@/repository/protocols/report.repository'

vi.mock('@/factory/make-appointments-use-case.factory')

const MockAppointmentRepository: Mocked<AppointmentRepository> = {
  findAll: vi.fn(),
  findAllPaginated: vi.fn(),
  findById: vi.fn(),
  findByCustomerOrProfessionalId: vi.fn(),
  findByServiceOfferedId: vi.fn(),
  findByDateRangeStatusProfessionalAndServices: vi.fn(),
  countByDateRangeGrouped: vi.fn(),
  sumEstimatedTimeByDateRangeGrouped: vi.fn(),
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
  findAllPaginated: vi.fn(),
  findBirthdayCustomersOnCurrentDate: vi.fn()
}

const MockProfessionalRepository: Mocked<ProfessionalRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  countByRoleId: vi.fn(),
  addRoleToProfessional: vi.fn(),
  removeRoleFromProfessional: vi.fn(),
  findProfessionalRoleAssociation: vi.fn(),
  findRolesByProfessionalId: vi.fn(),
  updateCommission: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateByEmailAndGoogleId: vi.fn(),
  updateProfessionalByEmail: vi.fn(),
  delete: vi.fn(),
  fetchServicesOfferedByProfessional: vi.fn(),
  findAllPaginated: vi.fn(),
  findProfessionalPermissions: vi.fn(),
  findProfessionalsWithPermissionOrUserType: vi.fn()
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
  delete: vi.fn(),
  getMeanScore: vi.fn()
}

const MockRoleRepository: Mocked<RoleRepository> = {
  findAllPaginated: vi.fn(),
  findById: vi.fn(),
  findByName: vi.fn(),
  findRoleAssociations: vi.fn(),
  addPermissionToRole: vi.fn(),
  removePermissionFromRole: vi.fn(),
  findPermissionById: vi.fn(),
  findRolePermissionAssociation: vi.fn(),
  countProfessionalsWithRole: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

const MockNotificationRepository: Mocked<NotificationRepository> = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  findByMarker: vi.fn(),
  markManyAsReadForUser: vi.fn()
}

const MockNotificationTemplateRepository: Mocked<NotificationTemplateRepository> = {
  findAll: vi.fn(),
  findActiveByKey: vi.fn(),
  updateByKey: vi.fn()
}

const MockBlockedTimesRepository: Mocked<BlockedTimeRepository> = {
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findAllPaginated: vi.fn(),
  findByProfessionalAndPeriod: vi.fn()
}

const MockPaymentRecordRepository: Mocked<PaymentRecordRepository> = {
  findById: vi.fn(),
  findByProfessionalId: vi.fn(),
  findByProfessionalIdPaginated: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}

const MockReportRepository: Mocked<ReportRepository> = {
  getDiscoverySourceCount: vi.fn(),
  getCustomerAgeDistribution: vi.fn(),
  getNewCustomersCount: vi.fn(),
  getRevenueEvolution: vi.fn(),
  getTotalRevenue: vi.fn(),
  getRevenueByService: vi.fn(),
  getRevenueByProfessional: vi.fn(),
  getOccupancyRate: vi.fn(),
  getIdleRate: vi.fn(),
  getPeakHours: vi.fn(),
  getBusiestWeekdays: vi.fn(),
  getMostBookedServices: vi.fn(),
  getMostProfitableServices: vi.fn(),
  getCommissionedRevenue: vi.fn()
}

export {
  MockAppointmentRepository,
  MockCustomerRepository,
  MockNotificationRepository,
  MockNotificationTemplateRepository,
  MockOfferRepository,
  MockProfessionalRepository,
  MockRoleRepository,
  MockServiceRepository,
  MockShiftRepository,
  MockRatingRepository,
  MockBlockedTimesRepository,
  MockPaymentRecordRepository,
  MockReportRepository
}
