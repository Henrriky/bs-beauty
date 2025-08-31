import { Professional, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { makeProfessionalsUseCaseFactory } from "../../../src/factory/make-professionals-use-case.factory";
import { ProfessionalsController } from "../../../src/controllers/professionals.controller";

vi.mock('../../../src/factory/make-professionals-use-case.factory');

describe('ProfessionalsController', () => {

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

    vi.mocked(makeProfessionalsUseCaseFactory).mockReturnValue(useCaseMock);

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(ProfessionalsController).toBeDefined();
  });

  describe('handleFindAll', () => {

    it('should return a list of professionals', async () => {
      // arrange
      const professionalsListFromUseCase = {
        professionals: [
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
        ] as Professional[],
      };

      useCaseMock.executeFindAll.mockResolvedValueOnce(professionalsListFromUseCase);

      // act
      await ProfessionalsController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(professionalsListFromUseCase);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await ProfessionalsController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleFindById', () => {

    it('should return an professional', async () => {
      // arrange
      const professional = {
        id: 'user-123',
        name: 'John Doe',
        email: 'rikolas@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      } as Professional;

      useCaseMock.executeFindById.mockResolvedValueOnce(professional);

      // act
      await ProfessionalsController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(professional);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await ProfessionalsController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleCreate', () => {

    it('should create an professional', async () => {
      // arrange
      const newProfessional: Prisma.ProfessionalCreateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      req.body = newProfessional;
      useCaseMock.executeCreate.mockResolvedValueOnce(newProfessional);

      // act
      await ProfessionalsController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeCreate).toHaveBeenCalledWith(newProfessional);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith(newProfessional);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await ProfessionalsController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleUpdate', () => {

    it('should update an professional', async () => {
      // arrange
      const professionalToUpdate: Prisma.ProfessionalUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      const professionalId = 'user-123';

      req.body = professionalToUpdate;
      req.params.id = professionalId;
      useCaseMock.executeUpdate.mockResolvedValueOnce(professionalToUpdate);

      // act
      await ProfessionalsController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(professionalId, professionalToUpdate);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith(professionalToUpdate);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const professionalToUpdate: Prisma.ProfessionalUpdateInput = {
        name: 'Usuário',
        email: 'newuser@example.com',
        registerCompleted: true,
        googleId: 'google-id-123',
      };
      const professionalId = 'user-123';

      req.body = professionalToUpdate;
      req.params.id = professionalId;
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await ProfessionalsController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledWith(professionalId, professionalToUpdate);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleDelete', () => {

    it('should delete an professional', async () => {
      // arrange
      const professionalId = 'user-123';
      req.params.id = professionalId;
      useCaseMock.executeDelete.mockResolvedValueOnce(undefined);

      // act
      await ProfessionalsController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(professionalId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      const professionalId = 'user-123';
      req.params.id = professionalId;
      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await ProfessionalsController.handleDelete(req, res, next);

      // assert
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(useCaseMock.executeDelete).toHaveBeenCalledWith(professionalId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  })

});