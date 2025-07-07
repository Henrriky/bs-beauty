import { Customer, Prisma, UserType } from "@prisma/client";
import { CustomersController } from "../../../src/controllers/customers.controller";
import { makeCustomersUseCaseFactory } from "../../../src/factory/make-customers-use-case.factory";
import { faker } from "@faker-js/faker";

vi.mock('../../../src/factory/make-customers-use-case.factory.ts');

describe('CustomerController', () => {

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

    vi.mocked(makeCustomersUseCaseFactory).mockReturnValue(useCaseMock);

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(CustomersController).toBeDefined();
  });

  describe('handleFindAll', () => {
    it('should return a list of customers', async () => {

      // arrange
      const customers = [
        {
          id: 'random-uuid',
          name: 'John Doe',
          email: 'johndoe@example.com',
          registerCompleted: true,
          googleId: 'google-id-1',
        },
        {
          id: 'random-uuid-2',
          name: 'Anne Doe',
          email: 'annedoe@example.com',
          registerCompleted: true,
          googleId: 'google-id-2',
        }
      ] as Customer[];
      useCaseMock.executeFindAll.mockResolvedValue({ customers });

      // act
      await CustomersController.handleFindAll(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith({ customers });
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await CustomersController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });


  });

  describe('handleFindById', () => {
    it('should return a customer', async () => {

      // arrange
      const customerId = 'random-uuid';
      req.params.id = customerId;
      const customer = {
        id: 'random-uuid',
        name: 'John Doe',
        email: 'johndoe@example.com',
        registerCompleted: true,
        googleId: 'google-id-1',
      } as Customer;
      useCaseMock.executeFindById.mockResolvedValueOnce(customer);

      // act
      await CustomersController.handleFindById(req, res, next);

      // assert
      expect(req.params.id).toBe(customerId);
      expect(res.send).toHaveBeenCalledWith(customer);
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await CustomersController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleCreate', () => {
    it('should create a customer', async () => {

      // arrange
      const newCustomer: Prisma.CustomerCreateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
        userType: UserType.CUSTOMER,
        birthdate: faker.date.birthdate(),
      };
      req.body = newCustomer;
      useCaseMock.executeCreate.mockResolvedValueOnce(newCustomer);

      // act
      await CustomersController.handleCreate(req, res, next);

      // assert
      expect(req.body).toEqual(newCustomer);
      expect(res.send).toHaveBeenCalledWith(newCustomer);
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await CustomersController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleUpdate', () => {
    it('should update a customer', async () => {

      // arrange
      const customerToUpdate: Prisma.CustomerUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      const customerId = 'random-uuid';
      req.body = customerToUpdate;
      req.params.id = customerId;
      useCaseMock.executeUpdate.mockResolvedValueOnce(customerToUpdate);

      // act
      await CustomersController.handleUpdate(req, res, next);

      // assert
      expect(req.body).toEqual(customerToUpdate);
      expect(req.params.id).toBe(customerId);
      expect(res.send).toHaveBeenCalledWith(customerToUpdate);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await CustomersController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleDelete', () => {
    it('should delete a customer', async () => {

      // arrange
      const customerId = 'random-uuid';
      req.params.id = customerId;
      useCaseMock.executeDelete.mockResolvedValueOnce(undefined);

      // act
      await CustomersController.handleDelete(req, res, next);

      // assert
      expect(req.params.id).toBe(customerId);
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const serviceId = 'random-uuid';
      req.params.id = serviceId;
      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await CustomersController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(serviceId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

});