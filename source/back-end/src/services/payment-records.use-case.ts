import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type UpdatePaymentRecordInput, type CreatePaymentRecordInput, type PaymentRecordRepository } from '@/repository/protocols/payment-record.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type PaginatedRequest, type PaginatedResult } from '@/types/pagination'
import { RecordExistence } from '@/utils/validation/record-existence.validation.util'
import { type PartialPaymentRecordQuerySchema } from '@/utils/validation/zod-schemas/pagination/payment-records/payment-records-query.schema'
import { type PaymentRecord } from '@prisma/client'

class PaymentRecordsUseCase {
  constructor (
    private readonly paymentRecordRepository: PaymentRecordRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository
  ) { }

  public async executeFindById (id: string) {
    const paymentRecord = await this.paymentRecordRepository.findById(id)
    RecordExistence.validateRecordExistence(paymentRecord, 'Payment record')

    return paymentRecord
  }

  public async executeFindByProfessionalId (id: string): Promise<PaymentRecord[]> {
    const paymentRecords = await this.paymentRecordRepository.findByProfessionalId(id)
    RecordExistence.validateManyRecordsExistence(paymentRecords, 'payment records')

    return paymentRecords
  }

  public async executefindByProfessionalIdPaginated (id: string, params: PaginatedRequest<PartialPaymentRecordQuerySchema>): Promise<PaginatedResult<PaymentRecord>> {
    const result = await this.paymentRecordRepository.findByProfessionalIdPaginated(id, params)

    return result
  }

  public async executeCreate (data: CreatePaymentRecordInput) {
    const paymentRecord = data as unknown as PaymentRecord

    const professionalId = paymentRecord.professionalId
    const customerId = paymentRecord.customerId

    const professional = await this.professionalRepository.findById(professionalId)
    const customer = await this.customerRepository.findById(customerId)

    RecordExistence.validateRecordExistence(professional, 'Professional')
    RecordExistence.validateRecordExistence(customer, 'Customer')

    const newPaymentRecord = await this.paymentRecordRepository.create(data)
    return newPaymentRecord
  }

  public async executeUpdate (id: string, data: UpdatePaymentRecordInput) {
    await this.executeFindById(id)

    const updatedPaymentRecord = await this.paymentRecordRepository.update(id, data)
    return updatedPaymentRecord
  }

  public async executeDelete (id: string) {
    await this.executeFindById(id)

    const deletedPaymentRecord = await this.paymentRecordRepository.delete(id)
    return deletedPaymentRecord
  }
}

export { PaymentRecordsUseCase }
