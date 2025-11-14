import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository'
import { PrismaPaymentRecordRepository } from '@/repository/prisma/prisma-payment-record.repository'
import { PrismaProfessionalRepository } from '@/repository/prisma/prisma-professional.repository'
import { PaymentRecordsUseCase } from '@/services/payment-records.use-case'

function makePaymentRecordUseCaseFactory () {
  const paymentRecordRepository = new PrismaPaymentRecordRepository()
  const customerRepository = new PrismaCustomerRepository()
  const professionalRepository = new PrismaProfessionalRepository()

  const useCase = new PaymentRecordsUseCase(paymentRecordRepository, customerRepository, professionalRepository)
  return useCase
}

export { makePaymentRecordUseCaseFactory }
