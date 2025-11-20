import { ReportsUseCase } from '@/services/reports.use-case'
import { MockReportRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { DiscoverySource } from '@prisma/client'

describe('ReportsUseCase (Unit Tests)', () => {
  let reportsUseCase: ReportsUseCase

  beforeEach(() => {
    reportsUseCase = new ReportsUseCase(MockReportRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(reportsUseCase).toBeDefined()
  })

  describe('executeGetDiscoverySourceCount', () => {
    it('should return discovery source count report', async () => {
      const mockReport = [
        { source: DiscoverySource.INSTAGRAM, count: 10 },
        { source: DiscoverySource.FACEBOOK, count: 5 },
        { source: DiscoverySource.REFERRAL, count: 8 }
      ]

      MockReportRepository.getDiscoverySourceCount.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetDiscoverySourceCount(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getDiscoverySourceCount).toHaveBeenCalledWith(startDate, endDate)
    })

    it('should return discovery source count without date filters', async () => {
      const mockReport = [
        { source: DiscoverySource.INSTAGRAM, count: 20 }
      ]

      MockReportRepository.getDiscoverySourceCount.mockResolvedValue(mockReport)

      const result = await reportsUseCase.executeGetDiscoverySourceCount()

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getDiscoverySourceCount).toHaveBeenCalledWith(undefined, undefined)
    })
  })

  describe('executeGetCustomerAgeDistribution', () => {
    it('should return customer age distribution report', async () => {
      const mockReport = [
        { ageRange: 'Jovens (13-24)', count: 15 },
        { ageRange: 'Adultos jovens (25-39)', count: 30 },
        { ageRange: 'Adultos maduros (40-59)', count: 20 },
        { ageRange: 'Idosos (60+)', count: 5 }
      ]

      MockReportRepository.getCustomerAgeDistribution.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetCustomerAgeDistribution(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getCustomerAgeDistribution).toHaveBeenCalledWith(startDate, endDate)
    })
  })

  describe('executeGetNewCustomersCount', () => {
    it('should return new customers count', async () => {
      const mockReport = { totalCustomers: 45 }

      MockReportRepository.getNewCustomersCount.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetNewCustomersCount(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getNewCustomersCount).toHaveBeenCalledWith(startDate, endDate)
    })
  })

  describe('executeGetRevenueEvolution', () => {
    it('should return revenue evolution report', async () => {
      const mockReport = [
        { date: '2024-01-01', totalValue: 1500.50 },
        { date: '2024-01-02', totalValue: 2300.75 },
        { date: '2024-01-03', totalValue: 1800.00 }
      ]

      MockReportRepository.getRevenueEvolution.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-03')

      const result = await reportsUseCase.executeGetRevenueEvolution(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getRevenueEvolution).toHaveBeenCalledWith(startDate, endDate, undefined)
    })

    it('should return revenue evolution for specific professional', async () => {
      const mockReport = [
        { date: '2024-01-01', totalValue: 500.00 }
      ]

      const professionalId = faker.string.uuid()
      MockReportRepository.getRevenueEvolution.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-01')

      const result = await reportsUseCase.executeGetRevenueEvolution(startDate, endDate, professionalId)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getRevenueEvolution).toHaveBeenCalledWith(startDate, endDate, professionalId)
    })
  })

  describe('executeGetTotalRevenue', () => {
    it('should return total revenue', async () => {
      const mockReport = {
        totalRevenue: 15000.50,
        transactionCount: 125
      }

      MockReportRepository.getTotalRevenue.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetTotalRevenue(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getTotalRevenue).toHaveBeenCalledWith(startDate, endDate, undefined)
    })

    it('should return total revenue for specific professional', async () => {
      const mockReport = {
        totalRevenue: 5000.00,
        transactionCount: 40
      }

      const professionalId = faker.string.uuid()
      MockReportRepository.getTotalRevenue.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetTotalRevenue(startDate, endDate, professionalId)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getTotalRevenue).toHaveBeenCalledWith(startDate, endDate, professionalId)
    })
  })

  describe('executeGetRevenueByService', () => {
    it('should return revenue by service', async () => {
      const mockReport = [
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Corte de Cabelo',
          category: 'Cabelo',
          totalRevenue: 5000.00,
          quantity: 50
        },
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Manicure',
          category: 'Unhas',
          totalRevenue: 3000.00,
          quantity: 60
        }
      ]

      MockReportRepository.getRevenueByService.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetRevenueByService(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getRevenueByService).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetRevenueByProfessional', () => {
    it('should return revenue by professional', async () => {
      const mockReport = [
        {
          professionalId: faker.string.uuid(),
          professionalName: 'João Silva',
          totalRevenue: 8000.00,
          transactionCount: 80
        },
        {
          professionalId: faker.string.uuid(),
          professionalName: 'Maria Santos',
          totalRevenue: 7000.00,
          transactionCount: 70
        }
      ]

      MockReportRepository.getRevenueByProfessional.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetRevenueByProfessional(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getRevenueByProfessional).toHaveBeenCalledWith(startDate, endDate)
    })
  })

  describe('executeGetOccupancyRate', () => {
    it('should return occupancy rate', async () => {
      const mockReport = {
        occupancyRate: 75.5,
        occupiedMinutes: 3020,
        availableMinutes: 4000
      }

      MockReportRepository.getOccupancyRate.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const result = await reportsUseCase.executeGetOccupancyRate(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getOccupancyRate).toHaveBeenCalledWith(startDate, endDate, undefined)
    })

    it('should return occupancy rate for specific professional', async () => {
      const mockReport = {
        occupancyRate: 80.0,
        occupiedMinutes: 800,
        availableMinutes: 1000
      }

      const professionalId = faker.string.uuid()
      MockReportRepository.getOccupancyRate.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-07')

      const result = await reportsUseCase.executeGetOccupancyRate(startDate, endDate, professionalId)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getOccupancyRate).toHaveBeenCalledWith(startDate, endDate, professionalId)
    })
  })

  describe('executeGetIdleRate', () => {
    it('should return idle rate', async () => {
      const mockReport = {
        idleRate: 24.5,
        idleMinutes: 980,
        availableMinutes: 4000
      }

      MockReportRepository.getIdleRate.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const result = await reportsUseCase.executeGetIdleRate(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getIdleRate).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetPeakHours', () => {
    it('should return peak hours report', async () => {
      const mockReport = [
        { hour: 9, appointmentCount: 15 },
        { hour: 10, appointmentCount: 20 },
        { hour: 14, appointmentCount: 25 },
        { hour: 15, appointmentCount: 18 }
      ]

      MockReportRepository.getPeakHours.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const result = await reportsUseCase.executeGetPeakHours(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getPeakHours).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetBusiestWeekdays', () => {
    it('should return busiest weekdays report', async () => {
      const mockReport = [
        { weekDay: 'MONDAY', appointmentCount: 45 },
        { weekDay: 'TUESDAY', appointmentCount: 50 },
        { weekDay: 'WEDNESDAY', appointmentCount: 48 },
        { weekDay: 'THURSDAY', appointmentCount: 52 },
        { weekDay: 'FRIDAY', appointmentCount: 60 },
        { weekDay: 'SATURDAY', appointmentCount: 55 },
        { weekDay: 'SUNDAY', appointmentCount: 20 }
      ]

      MockReportRepository.getBusiestWeekdays.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const result = await reportsUseCase.executeGetBusiestWeekdays(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getBusiestWeekdays).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetMostBookedServices', () => {
    it('should return most booked services', async () => {
      const mockReport = [
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Corte de Cabelo',
          category: 'Cabelo',
          bookingCount: 120
        },
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Manicure',
          category: 'Unhas',
          bookingCount: 95
        }
      ]

      MockReportRepository.getMostBookedServices.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetMostBookedServices(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getMostBookedServices).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetMostProfitableServices', () => {
    it('should return most profitable services', async () => {
      const mockReport = [
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Corte de Cabelo',
          category: 'Cabelo',
          totalRevenue: 6000.00,
          bookingCount: 120
        },
        {
          serviceId: faker.string.uuid(),
          serviceName: 'Coloração',
          category: 'Cabelo',
          totalRevenue: 5500.00,
          bookingCount: 50
        }
      ]

      MockReportRepository.getMostProfitableServices.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetMostProfitableServices(startDate, endDate)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getMostProfitableServices).toHaveBeenCalledWith(startDate, endDate, undefined)
    })
  })

  describe('executeGetCommissionedRevenue', () => {
    it('should return commissioned revenue for professional', async () => {
      const mockReport = {
        totalRevenue: 10000.00,
        commissionedRevenue: 5000.00,
        commissionRate: 0.5,
        transactionCount: 100
      }

      const professionalId = faker.string.uuid()
      MockReportRepository.getCommissionedRevenue.mockResolvedValue(mockReport)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetCommissionedRevenue(startDate, endDate, professionalId)

      expect(result).toEqual(mockReport)
      expect(MockReportRepository.getCommissionedRevenue).toHaveBeenCalledWith(startDate, endDate, professionalId)
    })

    it('should return null when professional is not commissioned', async () => {
      const professionalId = faker.string.uuid()
      MockReportRepository.getCommissionedRevenue.mockResolvedValue(null)

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const result = await reportsUseCase.executeGetCommissionedRevenue(startDate, endDate, professionalId)

      expect(result).toBeNull()
      expect(MockReportRepository.getCommissionedRevenue).toHaveBeenCalledWith(startDate, endDate, professionalId)
    })
  })
})
