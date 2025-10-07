import { PaymentRecordsController } from '@/controllers/payment-records.controller'
import { validateCreatePaymentRecord } from '@/middlewares/data-validation/payment-record/create-payment-record.validation.middleware'
import { validateUpdatePaymentRecord } from '@/middlewares/data-validation/payment-record/update-payment-record.validation.middleware'
import { routeAuthMiddleware } from '@/middlewares/route-auth.middleware'
import { UserType } from '@prisma/client'
import { Router } from 'express'

const paymentRecordRoutes = Router()

paymentRecordRoutes.get('/:id', PaymentRecordsController.handleFindById)
paymentRecordRoutes.get('/professional/:professionalId', PaymentRecordsController.handleFindByProfessionalIdPaginated)
paymentRecordRoutes.post('/', routeAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL]), validateCreatePaymentRecord, PaymentRecordsController.handleCreate)
paymentRecordRoutes.put('/:id', routeAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL]), validateUpdatePaymentRecord, PaymentRecordsController.handleUpdate)
paymentRecordRoutes.delete('/:id', routeAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL]), PaymentRecordsController.handleDelete)

export { paymentRecordRoutes }
