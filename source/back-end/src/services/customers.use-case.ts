import { type Customer, type Prisma } from '@prisma/client'
import { type CustomerRepository } from '../repository/protocols/customer.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type CustomersFilters } from '../types/customers/customers-filters'

interface CustomersOutput {
  customers: Customer[]
}

class CustomersUseCase {
  private readonly entityName = 'Customer'

  constructor (private readonly customerRepository: CustomerRepository) { }

  public async executeFindAll (): Promise<CustomersOutput> {
    const customers = await this.customerRepository.findAll()
    RecordExistence.validateManyRecordsExistence(customers, 'customers')

    return { customers }
  }

  public async executeFindById (customerId: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(customerId)
    RecordExistence.validateRecordExistence(customer, this.entityName)

    return customer
  }

  public async executeCreate (customerToCreate: Prisma.CustomerCreateInput) {
    const customer = await this.customerRepository.findByEmailOrPhone(
      customerToCreate.email ?? '',
      customerToCreate.phone ?? ''
    )
    RecordExistence.validateRecordNonExistence(customer, this.entityName)
    const newCustomer = await this.customerRepository.create(customerToCreate)

    return newCustomer
  }

  public async executeUpdate (customerId: string, customerToUpdate: Prisma.CustomerUpdateInput) {
    await this.executeFindById(customerId)
    const updatedCustomer = await this.customerRepository.update(customerId, customerToUpdate)

    return updatedCustomer
  }

  public async executeDelete (customerId: string) {
    await this.executeFindById(customerId)
    const deletedCustomer = await this.customerRepository.delete(customerId)

    return deletedCustomer
  }

  public async executeFindAllPaginated (
    params: PaginatedRequest<CustomersFilters>
  ): Promise<PaginatedResult<Customer>> {
    const result = await this.customerRepository.findAllPaginated(params)

    return result
  }
}

export { CustomersUseCase }
