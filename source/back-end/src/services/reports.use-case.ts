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
}

export { ReportsUseCase }
