import { Appointment, Status } from "@prisma/client";
import { AppointmentController } from "../../../src/controllers/appointments.controller";
import { makeAppointmentsUseCaseFactory } from "../../../src/factory/make-appointments-use-case.factory";

vi.mock('../../../src/factory/make-appointments-use-case.factory.ts');

describe('AppointmentController', () => {

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
      query: {},
    };



    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    next = vi.fn();

    useCaseMock = {
      executeFindAll: vi.fn(),
      executeFindById: vi.fn(),
      executeFindByCustomerId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
    };

    vi.mocked(makeAppointmentsUseCaseFactory).mockReturnValue(useCaseMock);
    vi.setSystemTime(new Date('2025-01-01T09:00:00'));

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(AppointmentController).toBeDefined();
  });

  describe('handleFindAll', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointments = [
        {
          id: 'random-uuid-appointment-1',
          customerId: 'random-uuid-customer-1',
          observation: 'Observation 1',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
          status: Status.PENDING,
        },
        {
          id: 'random-uuid-appointment-2',
          customerId: 'random-uuid-customer-2',
          observation: 'Observation 2',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
          status: Status.PENDING,
        },
      ] as Appointment[];

      useCaseMock.executeFindAll.mockResolvedValueOnce({ appointments: mockAppointments });

      // act
      await AppointmentController.handleFindAll(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith({ appointments: mockAppointments });
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFindById', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointment = {
        id: 'random-uuid-appointment-1',
        customerId: 'random-uuid-customer-1',
        observation: 'Observation 1',
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
        status: Status.PENDING,
      } as Appointment;

      req.params.id = mockAppointment.id;
      useCaseMock.executeFindById.mockResolvedValueOnce(mockAppointment);

      // act
      await AppointmentController.handleFindById(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith(mockAppointment);
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const serviceId = 'random-uuid';
      req.params.id = serviceId;
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFindByCustomerId', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointments = [
        {
          id: 'random-uuid-appointment-1',
          customerId: 'random-uuid-customer-1',
          observation: 'Observation 1',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
          status: Status.PENDING,
        },
        {
          id: 'random-uuid-appointment-2',
          customerId: 'random-uuid-customer-2',
          observation: 'Observation 2',
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
          status: Status.PENDING,
        },
      ] as Appointment[];

      req.params.customerId = mockAppointments[0].customerId;
      useCaseMock.executeFindByCustomerId.mockResolvedValueOnce(mockAppointments);

      // act
      await AppointmentController.handleFindByCustomerId(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith(mockAppointments);
      expect(useCaseMock.executeFindByCustomerId).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeFindByCustomerId fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const serviceId = 'random-uuid';
      req.params.customerId = serviceId;
      useCaseMock.executeFindByCustomerId.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleFindByCustomerId(req, res, next);

      // assert
      expect(useCaseMock.executeFindByCustomerId).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleCreate', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointment = {
        id: 'random-uuid-appointment-1',
        customerId: 'random-uuid-customer-1',
        observation: 'Observation 1',
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
        status: Status.PENDING,
      } as Appointment;

      req.body = mockAppointment;
      useCaseMock.executeCreate.mockResolvedValueOnce(mockAppointment);

      // act
      await AppointmentController.handleCreate(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith(mockAppointment);
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleUpdate', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointment = {
        id: 'random-uuid-appointment-1',
        customerId: 'random-uuid-customer-1',
        observation: 'Observation 1',
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
        status: Status.PENDING,
      } as Appointment;

      req.params.id = mockAppointment.id;
      req.body = mockAppointment;
      useCaseMock.executeUpdate.mockResolvedValueOnce(mockAppointment);

      // act
      await AppointmentController.handleUpdate(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith(mockAppointment);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleUpdate(req, res, next);

      // assert 
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleDelete', () => {
    it('should call use case', async () => {

      // arrange
      const mockAppointment = {
        id: 'random-uuid-appointment-1',
        customerId: 'random-uuid-customer-1',
        observation: 'Observation 1',
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
        status: Status.PENDING,
      } as Appointment;

      req.params.id = mockAppointment.id;
      useCaseMock.executeDelete.mockResolvedValueOnce(mockAppointment);

      // act
      await AppointmentController.handleDelete(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith(mockAppointment);
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(makeAppointmentsUseCaseFactory).toHaveBeenCalled();
    });

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const serviceId = 'random-uuid';
      req.params.id = serviceId;
      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await AppointmentController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

});