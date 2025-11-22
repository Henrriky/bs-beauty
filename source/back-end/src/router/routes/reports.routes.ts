import { ReportsController } from '@/controllers/reports.controller'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'
import { Router } from 'express'

const reportRoutes = Router()

// Customer Reports
reportRoutes.get('/discovery-source-count', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getDiscoverySourceCount)
reportRoutes.get('/customer-age-distribution', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getCustomerAgeDistribution)
reportRoutes.get('/new-customers-count', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getNewCustomersCount)

// Financial Reports
reportRoutes.get('/revenue-evolution', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getRevenueEvolution)
reportRoutes.get('/total-revenue', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getTotalRevenue)
reportRoutes.get('/revenue-by-service', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getRevenueByService)
reportRoutes.get('/revenue-by-professional', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getRevenueByProfessional)

// Occupancy Reports
reportRoutes.get('/occupancy-rate', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getOccupancyRate)
reportRoutes.get('/idle-rate', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getIdleRate)
// Peak Hours Reports
reportRoutes.get('/peak-hours', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getPeakHours)
reportRoutes.get('/busiest-weekdays', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getBusiestWeekdays)

// Service Reports
reportRoutes.get('/most-booked-services', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getMostBookedServices)
reportRoutes.get('/most-profitable-services', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getMostProfitableServices)
// Commissioned Revenue Report
reportRoutes.get('/commissioned-revenue', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['report.read']), ReportsController.getCommissionedRevenue)

export { reportRoutes }
