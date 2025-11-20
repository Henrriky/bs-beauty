import { ReportsController } from '@/controllers/reports.controller'
import { Router } from 'express'

const reportRoutes = Router()

// Customer Reports
reportRoutes.get('/discovery-source-count', ReportsController.getDiscoverySourceCount)
reportRoutes.get('/customer-age-distribution', ReportsController.getCustomerAgeDistribution)
reportRoutes.get('/new-customers-count', ReportsController.getNewCustomersCount)

// Financial Reports
reportRoutes.get('/revenue-evolution', ReportsController.getRevenueEvolution)
reportRoutes.get('/total-revenue', ReportsController.getTotalRevenue)
reportRoutes.get('/revenue-by-service', ReportsController.getRevenueByService)
reportRoutes.get('/revenue-by-professional', ReportsController.getRevenueByProfessional)

// Occupancy Reports
reportRoutes.get('/occupancy-rate', ReportsController.getOccupancyRate)
reportRoutes.get('/idle-rate', ReportsController.getIdleRate)

// Peak Hours Reports
reportRoutes.get('/peak-hours', ReportsController.getPeakHours)
reportRoutes.get('/busiest-weekdays', ReportsController.getBusiestWeekdays)

// Service Reports
reportRoutes.get('/most-booked-services', ReportsController.getMostBookedServices)
reportRoutes.get('/most-profitable-services', ReportsController.getMostProfitableServices)

// Commissioned Revenue Report
reportRoutes.get('/commissioned-revenue', ReportsController.getCommissionedRevenue)

export { reportRoutes }
