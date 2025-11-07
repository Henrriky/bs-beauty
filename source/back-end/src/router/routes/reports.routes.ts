import { ReportsController } from '@/controllers/reports.controller'
import { Router } from 'express'

const reportRoutes = Router()

// Customer Reports
reportRoutes.get('/discovery-source-count', ReportsController.getDiscoverySourceCount)
reportRoutes.get('/customer-age-distribution', ReportsController.getCustomerAgeDistribution)

// Financial Reports
reportRoutes.get('/revenue-evolution', ReportsController.getRevenueEvolution)
reportRoutes.get('/total-revenue', ReportsController.getTotalRevenue)
reportRoutes.get('/revenue-by-service', ReportsController.getRevenueByService)
reportRoutes.get('/revenue-by-professional', ReportsController.getRevenueByProfessional)

export { reportRoutes }
