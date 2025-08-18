import { Prisma, Service } from "@prisma/client";
import { Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ServicesController } from "../../../src/controllers/services.controller";
import { makeServiceUseCaseFactory } from "../../../src/factory/make-service-use-case.factory";
import { mockRequest, MockRequest, mockResponse } from "../utils/test-utilts";

vi.mock('../../../src/factory/make-service-use-case.factory.ts');

describe('ServicesController', () => {

  let req: MockRequest;
  let res: Response;
  let next: any;
  let useCaseMock: any;

  beforeEach(() => {

    vi.clearAllMocks();

    req = mockRequest();

    res = mockResponse();

    next = vi.fn();

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      fetchEmployeesOfferingService: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
    };

    vi.mocked(makeServiceUseCaseFactory).mockReturnValue(useCaseMock);
    vi.setSystemTime(new Date('2025-01-01T09:00:00'));

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(ServicesController).toBeDefined();
  });

  describe('handleFindAll', () => {
    it('should return a list of services', async () => {

      // arrange
      const services = [
        {
          id: 'random-uuid',
          name: 'Service 1',
          description: 'Description 1',
          category: 'Category 1',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
        },
        {
          id: 'random-uuid-2',
          name: 'Service 2',
          description: 'Description 2',
          category: 'Category 2',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
        },
      ] as Service[];

      useCaseMock.executeFindAll.mockResolvedValueOnce({ services });

      // act
      await ServicesController.handleFindAll(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith({ services });
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await ServicesController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  })

  describe('handleFindById', () => {
    it('should return a service', async () => {

      // arrange
      const service = {
        id: 'random-uuid',
        name: 'Service 1',
        description: 'Description 1',
        category: 'Category 1',
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Service;
      req.params.id = 'random-uuid';
      useCaseMock.executeFindById.mockResolvedValueOnce(service);

      // act
      await ServicesController.handleFindById(req, res, next);

      // assert
      expect(req.params.id).toBe('random-uuid');
      expect(res.send).toHaveBeenCalledWith(service);
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await ServicesController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  })

  describe('handleFetchEmployeesOfferingService', () => {
    it('should return employees offering a service', async () => {
      // arrange
      const employeesOfferingService = {
        id: 'service-123',
        offers: [
          {
            id: 'offer-1',
            estimatedTime: 60,
            price: 100.0,
            employee: {
              id: 'employee-1',
              name: 'John Doe',
              specialization: 'Hair Stylist',
              profilePhotoUrl: 'https://example.com/john-doe.jpg',
            },
          },
          {
            id: 'offer-2',
            estimatedTime: 45,
            price: 75.0,
            employee: {
              id: 'employee-2',
              name: 'Jane Smith',
              specialization: 'Makeup Artist',
              profilePhotoUrl: 'https://example.com/jane-smith.jpg',
            },
          },
        ],
      };
      useCaseMock.fetchEmployeesOfferingService.mockResolvedValue({ employeesOfferingService })
      req.params.id = 'random-uuid-service-1'

      // act
      await ServicesController.handleFetchEmployeesOfferingService(req, res, next)

      // assert
      expect(useCaseMock.fetchEmployeesOfferingService).toHaveBeenCalledWith('random-uuid-service-1')
      expect(res.send).toHaveBeenCalledWith({ employeesOfferingService })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error if something goes wrong', async () => {
      const mockError = new Error('Something went wrong')
      useCaseMock.fetchEmployeesOfferingService.mockRejectedValue(mockError)
      req.params = { id: '1' }

      await ServicesController.handleFetchEmployeesOfferingService(req, res, next)

      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(mockError)
    })
  })

  describe('handleCreate', () => {
    it('should create a service', async () => {
      // arrange
      const newService: Prisma.ServiceCreateInput = {
        name: 'Service 1',
        description: 'Description 1',
        category: 'Category 1',
      };
      req.body = newService;
      useCaseMock.executeCreate.mockResolvedValueOnce(newService);

      // act
      await ServicesController.handleCreate(req, res, next);

      // assert
      expect(req.body).toEqual(newService);
      expect(res.send).toHaveBeenCalledWith(newService);
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await ServicesController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleUpdate', () => {
    it('should update a service', async () => {
      // arrange
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: 'Service 1',
        description: 'Description 1',
        category: 'Category 1',
      };
      const serviceId = 'random-uuid';
      req.body = serviceToUpdate;
      req.params.id = serviceId;
      useCaseMock.executeUpdate.mockResolvedValueOnce(serviceToUpdate);

      // act
      await ServicesController.handleUpdate(req, res, next);

      // assert
      expect(req.body).toEqual(serviceToUpdate);
      expect(req.params.id).toBe(serviceId);
      expect(res.send).toHaveBeenCalledWith(serviceToUpdate);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const serviceToUpdate: Prisma.ServiceUpdateInput = {
        name: 'Service 1',
        description: 'Description 1',
        category: 'Category 1',
      };
      const serviceId = 'random-uuid';
      req.body = serviceToUpdate;
      req.params.id = serviceId;

      const error = new Error('Database connection failed');
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await ServicesController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(serviceId, serviceToUpdate);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleDelete', () => {
    it('should delete a service', async () => {
      // arrange
      const serviceId = 'random-uuid';
      req.params.id = serviceId;
      useCaseMock.executeDelete.mockResolvedValueOnce(undefined);

      // act
      await ServicesController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(serviceId);
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
      await ServicesController.handleDelete(req, res, next);

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