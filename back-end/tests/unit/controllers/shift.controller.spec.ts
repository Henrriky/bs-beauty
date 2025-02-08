import { Shift, WeekDays } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { makeShiftUseCaseFactory } from "../../../src/factory/make-shift-use-case.factory";
import { ShiftController } from "../../../src/controllers/shift.controller";

vi.mock('../../../src/factory/make-shift-use-case.factory');

describe('ShiftController', () => {

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
      executeFindAllByEmployeeId: vi.fn(),
      executeFindById: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
    };

    vi.mocked(makeShiftUseCaseFactory).mockReturnValue(useCaseMock);
    vi.setSystemTime(new Date('2025-01-01T09:00:00'));

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(ShiftController).toBeDefined();
  });

  describe('handleFindAllByEmployeeId', () => {
    it('should return 200 and shifts when use case succeeds', async () => {
      // arrange
      useCaseMock.executeFindAllByEmployeeId.mockResolvedValueOnce({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123',
          }
        ] as Shift[],
      });

      // act
      await ShiftController.handleFindAllByEmployeeId(req, res, next);

      // assert
      expect(useCaseMock.executeFindAllByEmployeeId).toHaveBeenCalledWith('user-123');
      expect(res.send).toHaveBeenCalledWith({
        shifts: [
          {
            id: 'shift-1',
            weekDay: WeekDays.MONDAY,
            shiftStart: new Date(),
            employeeId: 'user-123',
          }
        ],
      });
    });

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure');
      useCaseMock.executeFindAllByEmployeeId.mockRejectedValueOnce(error);

      // act
      await ShiftController.handleFindAllByEmployeeId(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFindById', () => {
    it('should send 200 and shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'shift-1';
      req.params.id = shiftId;
      useCaseMock.executeFindById.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      } as Shift);

      // act
      await ShiftController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledWith(shiftId);
      expect(res.send).toHaveBeenCalledWith({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      });
    });

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await ShiftController.handleFindById(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
    });
  })

  describe('handleCreate', () => {
    it('should send 201 and created shift when use case succeeds', async () => {
      // arrange
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      }
      useCaseMock.executeCreate.mockResolvedValueOnce({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      } as Shift);

      // act
      await ShiftController.handleCreate(req, res, next);

      // assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith({
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      });
      expect(res.send).toHaveBeenCalledWith({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      });
    });

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure');
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      }
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await ShiftController.handleCreate(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
    })
  });

  describe('handleUpdate', () => {
    it('should send 200 and updated shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'shift-1';
      req.params.id = shiftId;
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      }
      useCaseMock.executeUpdate.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-02T07:00:00.000Z'),
        employeeId: 'user-123',
      } as Shift);

      // act
      await ShiftController.handleUpdateByIdAndEmployeeId(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(shiftId, {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      });
      expect(res.send).toHaveBeenCalledWith({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date('2025-01-02T07:00:00.000Z'),
        employeeId: 'user-123',
      });
    });

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure');
      const shiftId = 'shift-1';
      req.params.id = shiftId;
      req.body = {
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      }
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await ShiftController.handleUpdateByIdAndEmployeeId(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
    })
  })

  describe('handleDelete', () => {
    it('should send 200 and deleted shift when use case succeeds', async () => {
      // arrange
      const shiftId = 'shift-1';
      req.params.id = shiftId;

      useCaseMock.executeDelete.mockResolvedValueOnce({
        id: shiftId,
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      } as Shift);

      // act
      await ShiftController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith('shift-1');
      expect(res.send).toHaveBeenCalledWith({
        id: 'shift-1',
        weekDay: WeekDays.MONDAY,
        shiftStart: new Date(),
        employeeId: 'user-123',
      });
    });

    it('should call next with an error if use case throws', async () => {
      // arrange
      const error = new Error('Use case failure');
      const shiftId = 'shift-1';
      req.params.id = shiftId;

      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await ShiftController.handleDelete(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
    });

  });


});