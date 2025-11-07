import { ReportsController } from '@/controllers/reports.controller'
import { Router } from 'express'

const reportRoutes = Router()

// Customer Reports
reportRoutes.get('/discovery-source-count', ReportsController.getDiscoverySourceCount)
reportRoutes.get('/customer-age-distribution', ReportsController.getCustomerAgeDistribution)

export { reportRoutes }
