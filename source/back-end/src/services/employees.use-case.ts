import { type Employee, type Prisma } from '@prisma/client'
import { type EmployeeRepository } from '../repository/protocols/employee.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type EmployeeFilters } from '../types/employees/employee-filters'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type ServicesOfferedByEmployee } from '../repository/types/employee-repository.types'

interface EmployeesOutput {
  employees: Employee[]
}

class EmployeesUseCase {
  private readonly entityName = 'Employee'

  constructor (private readonly employeeRepository: EmployeeRepository) { }

  public async executeFindAll (): Promise<EmployeesOutput> {
    const employees = await this.employeeRepository.findAll()
    RecordExistence.validateManyRecordsExistence(employees, 'employees')

    return { employees }
  }

  public async executeFindById (employeeId: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findById(employeeId)
    RecordExistence.validateRecordExistence(employee, this.entityName)

    return employee
  }

  public async executeCreate (employeeToCreate: Prisma.EmployeeCreateInput) {
    const employee = await this.employeeRepository.findByEmail(employeeToCreate.email)
    RecordExistence.validateRecordNonExistence(employee, this.entityName)
    const newEmployee = await this.employeeRepository.create(employeeToCreate)

    return newEmployee
  }

  public async executeUpdate (employeeId: string, employeeToUpdate: Prisma.EmployeeUpdateInput) {
    await this.executeFindById(employeeId)
    const updatedEmployee = await this.employeeRepository.update(employeeId, employeeToUpdate)

    return updatedEmployee
  }

  public async executeDelete (employeeId: string) {
    await this.executeFindById(employeeId)
    const deletedEmployee = await this.employeeRepository.delete(employeeId)

    return deletedEmployee
  }

  public async fetchServicesOfferedByEmployee (employeeId: string): Promise<{ employee: ServicesOfferedByEmployee }> {
    const { employee } = await this.employeeRepository.fetchServicesOfferedByEmployee(employeeId)
    RecordExistence.validateRecordExistence(employee, 'Employee')

    return { employee: employee! }
  }

  public async executeFindAllPaginated (
    params: PaginatedRequest<EmployeeFilters>
  ): Promise<PaginatedResult<Employee>> {
    const result = await this.employeeRepository.findAllPaginated(params)

    return result
  }
}

export { EmployeesUseCase }
