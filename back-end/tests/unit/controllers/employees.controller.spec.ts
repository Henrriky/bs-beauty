import { Employee, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { makeEmployeesUseCaseFactory } from "../../../src/factory/make-employees-use-case.factory";
import { EmployeesController } from "../../../src/controllers/employees.controller";

vi.mock('../../../src/factory/make-employees-use-case.factory');

describe('EmployeesController', () => {

  let req: any;
  let res: any;
  let next: any;
  let useCaseMock: any;

  beforeEach(() => {

    vi.clearAllMocks();

    req = {
      user: { userId: 'user-123' },
      body: {},
      params: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    next = vi.fn();

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
    };

    vi.mocked(makeEmployeesUseCaseFactory).mockReturnValue(useCaseMock);

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(EmployeesController).toBeDefined();
  });

  describe('handleFindAll', () => {

    it('should return a list of employees', async () => {
      // arrange
      const employeesListFromUseCase = {
        employees: [
          {
            id: 'user-123',
            name: 'John Doe',
            email: 'rikolas@example.com',
            registerCompleted: true,
            googleId: 'google-id-123',
          },
          {
            id: 'user-1',
            name: 'Jane Doe',
            email: 'ricks@example.com',
            registerCompleted: false,
          },
        ] as Employee[],
      };

      useCaseMock.executeFindAll.mockResolvedValueOnce(employeesListFromUseCase);

      // act
      await EmployeesController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(employeesListFromUseCase);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await EmployeesController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleFindById', () => {

    it('should return an employee', async () => {
      // arrange
      const employee = {
        id: 'user-123',
        name: 'John Doe',
        email: 'rikolas@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      } as Employee;

      useCaseMock.executeFindById.mockResolvedValueOnce(employee);

      // act
      await EmployeesController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(employee);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await EmployeesController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleCreate', () => {

    it('should create an employee', async () => {
      // arrange
      const newEmployee: Prisma.EmployeeCreateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      req.body = newEmployee;
      useCaseMock.executeCreate.mockResolvedValueOnce(newEmployee);

      // act
      await EmployeesController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(newEmployee);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith(newEmployee);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await EmployeesController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleUpdate', () => {

    it('should update an employee', async () => {
      // arrange
      const employeeToUpdate: Prisma.EmployeeUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      const employeeId = 'user-123';

      req.body = employeeToUpdate;
      req.params.id = employeeId;
      useCaseMock.executeUpdate.mockResolvedValueOnce(employeeToUpdate);

      // act
      await EmployeesController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(employeeId, employeeToUpdate);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(employeeToUpdate);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const employeeToUpdate: Prisma.EmployeeUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      const employeeId = 'user-123';

      req.body = employeeToUpdate;
      req.params.id = employeeId;
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await EmployeesController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(employeeId, employeeToUpdate);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleDelete', () => {

    it('should delete an employee', async () => {
      // arrange
      const employeeId = 'user-123';
      req.params.id = employeeId;
      useCaseMock.executeDelete.mockResolvedValueOnce(undefined);

      // act
      await EmployeesController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(employeeId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const employeeId = 'user-123';
      req.params.id = employeeId;
      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await EmployeesController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(employeeId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  })

});