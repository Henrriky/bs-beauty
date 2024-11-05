import { type Employee, type Prisma } from '@prisma/client'
import { type EmployeeRepository } from '../repository/protocols/employee.repository'
import { CustomError } from '../utils/errors/custom.error.util'

interface EmployeesOutput {
  employees: Employee[]
}

class EmployeesUseCase {
  constructor (private readonly employeeRepository: EmployeeRepository) { }

  public async executeFindAll (): Promise<EmployeesOutput> {
    const employees = await this.employeeRepository.findAll()
    if (employees.length === 0) {
      throw new CustomError('Not Found', 404, 'No employees found.')
    }

    return { employees }
  }

  public async executeFindById (employeeId: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findById(employeeId)
    this.validateEmployeeExistence(employee)

    return employee
  }

  public async executeCreate (employeeToCreate: Prisma.EmployeeCreateInput) {
    const doesEmployeeExist = this.employeeRepository.findByEmail(employeeToCreate.email)
    if (doesEmployeeExist != null) {
      throw new CustomError('Bad Request', 400, 'Customer already exists.')
    }
    const newEmployee = await this.employeeRepository.create(employeeToCreate)

    return newEmployee
  }

  public async executeUpdate (employeeId: string, employeeToUpdate: Prisma.EmployeeUpdateInput) {
    const employee = await this.employeeRepository.update(employeeId, employeeToUpdate)
    this.validateEmployeeExistence(employee)

    return employee
  }

  public async executeDelete (employeeId: string) {
    const employeeToDelete = await this.employeeRepository.findById(employeeId)
    this.validateEmployeeExistence(employeeToDelete)
    const employeeDeleted = await this.employeeRepository.delete(employeeId)

    return employeeDeleted
  }

  private validateEmployeeExistence (employee: Employee | null) {
    if (employee == null) {
      throw new CustomError('Not Found', 404, 'Employee not found.')
    }
  }
}

export { EmployeesUseCase }
