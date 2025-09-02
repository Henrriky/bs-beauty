import { prismaClient } from '../../../lib/prisma'
import { PrismaEmployeeRepository } from '../../../repository/prisma/prisma-employee.repository'
import { EmployeesUseCase } from '../../../services/employees.use-case'

describe('EmployeesUseCase', () => {
  let employeesUseCase: EmployeesUseCase

  beforeAll(async () => {
    employeesUseCase = new EmployeesUseCase(new PrismaEmployeeRepository())
  })

  beforeEach(async () => {
    await prismaClient.employee.deleteMany({})
  })

  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  it('should be defined', () => {
    expect(employeesUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should retrieve all employees', async () => {
      // arrange
      const employee1 = await prismaClient.employee.create({
        data: { name: 'John Doe', email: 'john.doe@example.com' }
      })

      const employee2 = await prismaClient.employee.create({
        data: { name: 'Thomas Doe', email: 'thomas.doe@example.com' }
      })

      const employee3 = await prismaClient.employee.create({
        data: { name: 'Leon S. Kennedy', email: 'leon.s.kennedy@example.com' }
      })

      // act
      const result = await employeesUseCase.executeFindAll()

      // assert
      expect(result.employees).toHaveLength(3)
      expect(result.employees[0].name).toBe(employee1.name)
      expect(result.employees[0].email).toBe(employee1.email)
      expect(result.employees[1].name).toBe(employee2.name)
      expect(result.employees[1].email).toBe(employee2.email)
      expect(result.employees[2].name).toBe(employee3.name)
      expect(result.employees[2].email).toBe(employee3.email)
    })
  })

  describe('executeFindById', () => {
    it('should return an employee by id from the database', async () => {
      // arrange
      const employee = await prismaClient.employee.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' }
      })

      // act
      const result = await employeesUseCase.executeFindById('random-uuid')

      // assert
      expect(result).toEqual(employee)
    })
  })

  describe('executeCreate', () => {
    it('should create a new employee and store in the database', async () => {
      // arrange
      const newEmployee = { name: 'Mark Smith', email: 'mark@example.com' }

      // act
      const createdEmployee = await employeesUseCase.executeCreate(newEmployee)

      // assert
      const employeeFromDb = await prismaClient.employee.findUnique({ where: { email: newEmployee.email } })
      expect(createdEmployee).toEqual(employeeFromDb)
    })
  })

  describe('executeUpdate', () => {
    it('should update an employee and save changes in the database', async () => {
      // arrange
      const employee = await prismaClient.employee.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' }
      })

      // act & assert
      const updatedEmployee = await employeesUseCase.executeUpdate('random-uuid', { name: 'John Updated' })
      expect(updatedEmployee.name).toEqual('John Updated')
      const employeeFromDb = await prismaClient.employee.findUnique({ where: { id: employee.id } })
      expect(employeeFromDb?.name).toEqual('John Updated')
    })
  })

  describe('executeDelete', () => {
    it('should delete an employee from the database', async () => {
      // arrange
      const employee = await prismaClient.employee.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' }
      })

      // act
      const deletedEmployee = await employeesUseCase.executeDelete(employee.id)

      // assert
      expect(deletedEmployee.id).toEqual(employee.id)
      const employeeFromDb = await prismaClient.employee.findUnique({ where: { id: employee.id } })
      expect(employeeFromDb).toBeNull()
    })
  })
})
