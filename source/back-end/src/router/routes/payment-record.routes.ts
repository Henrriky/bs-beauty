import { PaymentRecordsController } from '@/controllers/payment-records.controller'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'
import { validateCreatePaymentRecord } from '@/middlewares/data-validation/payment-record/create-payment-record.validation.middleware'
import { validateUpdatePaymentRecord } from '@/middlewares/data-validation/payment-record/update-payment-record.validation.middleware'
import { Router } from 'express'

const paymentRecordRoutes = Router()

paymentRecordRoutes.get('/:id', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['payment_record.read']), PaymentRecordsController.handleFindById)
paymentRecordRoutes.get('/professional/:professionalId', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['payment_record.read']), PaymentRecordsController.handleFindByProfessionalIdPaginated)
paymentRecordRoutes.post('/', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['payment_record.create']), validateCreatePaymentRecord, PaymentRecordsController.handleCreate)
paymentRecordRoutes.put('/:id', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['payment_record.edit']), validateUpdatePaymentRecord, PaymentRecordsController.handleUpdate)
paymentRecordRoutes.delete('/:id', combinedAuthMiddleware(['MANAGER', 'PROFESSIONAL'], ['payment_record.delete']), PaymentRecordsController.handleDelete)

export { paymentRecordRoutes }
