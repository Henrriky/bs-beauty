import { type Customer, type Prisma } from '@prisma/client'
import { type CustomerRepository } from '../repository/protocols/customer.repository'

interface CustomersOutput {
  customers: Customer[]
}

class CustomersUseCase {
  constructor (private readonly customerRepository: CustomerRepository) {}

  public async executeFindAll (): Promise<CustomersOutput> {
    const customers = await this.customerRepository.findAll()

    return { customers }
  }

  public async executeFindById (customerId: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(customerId)

    this.validateCustomerExistenceInRepository(customer)

    return customer
  }

  public async executeCreate (newCustomer: Prisma.CustomerCreateInput) {
    const customer = await this.customerRepository.create(newCustomer)

    return customer
  }

  public async executeUpdate (customerId: string, customerToUpdate: Prisma.CustomerUpdateInput) {
    const customer = await this.customerRepository.update(customerId, customerToUpdate)

    this.validateCustomerExistenceInRepository(customer)

    return customer
  }

  public async executeDelete (customerId: string) {
    const customer = await this.customerRepository.delete(customerId)

    this.validateCustomerExistenceInRepository(customer)

    return customer
  }

  private validateCustomerExistenceInRepository (customer: Customer | null) {
    if (customer == null) {
      throw new Error('Customer not found.')
    }
  }
}

export { CustomersUseCase }
