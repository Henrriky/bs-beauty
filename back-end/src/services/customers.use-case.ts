import { type Customer, type Prisma } from '@prisma/client'
import { type CustomerRepository } from '../repository/protocols/customer.repository'
import { CustomError } from '../utils/errors/custom.error'

interface CustomersOutput {
  customers: Customer[]
}

class CustomersUseCase {
  constructor (private readonly customerRepository: CustomerRepository) {}

  public async executeFindAll (): Promise<CustomersOutput> {
    const customers = await this.customerRepository.findAll()
    if (customers.length === 0) {
      throw new CustomError('Not Found', 404, 'No customers found.')
    }
    return { customers }
  }

  public async executeFindById (customerId: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(customerId)
    this.validateCustomerExistence(customer)
    return customer
  }

  public async executeCreate (customerToCreate: Prisma.CustomerCreateInput) {
    const doesCustomerExist = await this.customerRepository.findByEmailOrPhone(customerToCreate.email, customerToCreate.phone)
    if (doesCustomerExist != null) {
      throw new CustomError('Bad Request', 400, 'Customer already exists.')
    }
    const newCustomer = await this.customerRepository.create(customerToCreate)
    return newCustomer
  }

  public async executeUpdate (customerId: string, customerToUpdate: Prisma.CustomerUpdateInput) {
    const customer = await this.customerRepository.update(customerId, customerToUpdate)
    this.validateCustomerExistence(customer)
    return customer
  }

  public async executeDelete (customerId: string) {
    const customerToDelete = await this.customerRepository.findById(customerId)
    this.validateCustomerExistence(customerToDelete)
    const customerDeleted = await this.customerRepository.delete(customerId)
    return customerDeleted
  }

  private validateCustomerExistence (customer: Customer | null) {
    if (customer == null) {
      throw new CustomError('Not Found', 404, 'Customer not found.')
    }
  }
}

export { CustomersUseCase }
