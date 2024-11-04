import { type Employee, type Prisma } from '@prisma/client'
import { type EmployeeRepository } from '../repository/protocols/employee.repository'

interface EmployeesOutput {
  employees: Employee[]
}

class EmployeesUseCase {
  constructor (private readonly employeeRepository: EmployeeRepository) {}

  public async executeFindAll (): Promise<EmployeesOutput> {
    const employees = await this.employeeRepository.findAll()

    return { employees }
  }

  public async executeFindById (employeeId: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findById(employeeId)

    this.validateEmployeeExistenceInRepository(employee)

    return employee
  }

  public async executeCreate (newEmployee: Prisma.EmployeeCreateInput) {
    const employee = await this.employeeRepository.create(newEmployee)

    return employee
  }

  public async executeUpdate (employeeId: string, employeeToUpdate: Prisma.EmployeeUpdateInput) {
    const employee = await this.employeeRepository.update(employeeId, employeeToUpdate)

    this.validateEmployeeExistenceInRepository(employee)

    return employee
  }

  public async executeDelete (employeeId: string) {
    const employee = await this.employeeRepository.delete(employeeId)

    this.validateEmployeeExistenceInRepository(employee)

    return employee
  }

  private validateEmployeeExistenceInRepository (employee: Employee | null) {
    if (employee == null) {
      throw new Error('Employee not found.')
    }
  }
}

export { EmployeesUseCase }
