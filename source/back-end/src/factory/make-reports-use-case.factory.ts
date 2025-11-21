import { PrismaReportRepository } from '@/repository/prisma/prisma-report.repository'
import { ReportsUseCase } from '@/services/reports.use-case'

function makeReportsUseCaseFactory () {
  const prismaReportRepository = new PrismaReportRepository()
  const reportsUseCase = new ReportsUseCase(prismaReportRepository)
  return reportsUseCase
}

export { makeReportsUseCaseFactory }
