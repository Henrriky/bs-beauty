import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type PaymentRecordRepository } from '@/repository/protocols/payment-record.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { RecordExistence } from '@/utils/validation/record-existence.validation.util'
import { type Prisma, type PaymentRecord } from '@prisma/client'

interface PaymentRecordOutput {
  paymentRecords: PaymentRecord[]
}

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

  public async executeFindByProfessionalId (id: string): Promise<PaymentRecordOutput> {
    const paymentRecords = await this.paymentRecordRepository.findByProfessionalId(id)
    RecordExistence.validateManyRecordsExistence(paymentRecords, 'payment records')

    return { paymentRecords }
  }

  public async executeCreate (data: Prisma.PaymentRecordCreateInput) {
    const paymentRecord = data as unknown as PaymentRecord

    const professionalId = paymentRecord.professionalId
    const customerId = paymentRecord.customerId

    const professional = this.professionalRepository.findById(professionalId)
    const customer = this.customerRepository.findById(customerId)

    RecordExistence.validateRecordExistence(professional, 'Professional')
    RecordExistence.validateRecordExistence(customer, 'Customer')

    const newPaymentRecord = await this.paymentRecordRepository.create(data)
    return newPaymentRecord
  }

  public async executeUpdate (id: string, data: Prisma.PaymentRecordUpdateInput) {
    await this.executeFindById(id)

    const updatedPaymentRecord = await this.paymentRecordRepository.update(id, data)
    return updatedPaymentRecord
  }
}

export { PaymentRecordsUseCase }
