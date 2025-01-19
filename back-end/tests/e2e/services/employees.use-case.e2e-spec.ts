import { prismaClient } from "../../../src/lib/prisma";
import { PrismaEmployeeRepository } from "../../../src/repository/prisma/prisma-employee.repository";
import { EmployeesUseCase } from "../../../src/services/employees.use-case";

describe('EmployeesUseCase', () => {
  let employeesUseCase: EmployeesUseCase;
  let prismaEmployeeRepository: PrismaEmployeeRepository;

  beforeAll(async () => {
    prismaEmployeeRepository = new PrismaEmployeeRepository();
    employeesUseCase = new EmployeesUseCase(prismaEmployeeRepository);
  });

  afterEach(async () => {
    await prismaClient.employee.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it('should retrieve all employees', async () => {
    const employee1 = await prismaClient.employee.create({
      data: { name: 'John Doe', email: 'john.doe@example.com' },
    });

    const employee2 = await prismaClient.employee.create({
      data: { name: 'Thomas Doe', email: 'thomas.doe@example.com' },
    });

    const employee3 = await prismaClient.employee.create({
      data: { name: 'Leon S. Kennedy', email: 'leon.s.kennedy@example.com' },
    });

    const result = await employeesUseCase.executeFindAll();

    expect(result.employees).toHaveLength(3);
    expect(result.employees[0].name).toBe(employee1.name);
    expect(result.employees[0].email).toBe(employee1.email);
    expect(result.employees[1].name).toBe(employee2.name);
    expect(result.employees[1].email).toBe(employee2.email);
    expect(result.employees[2].name).toBe(employee3.name);
    expect(result.employees[2].email).toBe(employee3.email);
  });



})

