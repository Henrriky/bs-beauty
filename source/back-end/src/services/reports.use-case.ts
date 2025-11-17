import { type ReportRepository } from '@/repository/protocols/report.repository'

class ReportsUseCase {
  constructor(private readonly reportRepository: ReportRepository) { }

  public async executeGetDiscoverySourceCount(startDate?: Date, endDate?: Date) {
    const report = await this.reportRepository.getDiscoverySourceCount(startDate, endDate)
    return report
  }

  public async executeGetCustomerAgeDistribution(startDate?: Date, endDate?: Date) {
    const report = await this.reportRepository.getCustomerAgeDistribution(startDate, endDate)
    return report
  }

  public async executeGetNewCustomersCount(startDate: Date, endDate: Date) {
    const report = await this.reportRepository.getNewCustomersCount(startDate, endDate)
    return report
  }

  public async executeGetRevenueEvolution(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getRevenueEvolution(startDate, endDate, professionalId)
    return report
  }

  public async executeGetTotalRevenue(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getTotalRevenue(startDate, endDate, professionalId)
    return report
  }

  public async executeGetRevenueByService(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getRevenueByService(startDate, endDate, professionalId)
    return report
  }

  public async executeGetRevenueByProfessional(startDate: Date, endDate: Date) {
    const report = await this.reportRepository.getRevenueByProfessional(startDate, endDate)
    return report
  }

  public async executeGetOccupancyRate(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getOccupancyRate(startDate, endDate, professionalId)
    return report
  }

  public async executeGetIdleRate(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getIdleRate(startDate, endDate, professionalId)
    return report
  }

  public async executeGetPeakHours(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getPeakHours(startDate, endDate, professionalId)
    return report
  }

  public async executeGetBusiestWeekdays(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getBusiestWeekdays(startDate, endDate, professionalId)
    return report
  }

  public async executeGetMostBookedServices(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getMostBookedServices(startDate, endDate, professionalId)
    return report
  }

  public async executeGetMostProfitableServices(startDate: Date, endDate: Date, professionalId?: string) {
    const report = await this.reportRepository.getMostProfitableServices(startDate, endDate, professionalId)
    return report
  }
}

export { ReportsUseCase }
