import { Offer } from "@prisma/client";
import { OffersController } from "../../../src/controllers/offers.controller";
import { makeOffersUseCaseFactory } from "../../../src/factory/make-offers-use-case.factory";
import { Decimal } from "@prisma/client/runtime/library";

vi.mock('../../../src/factory/make-offers-use-case.factory.ts');

describe('OffersController', () => {

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
      executeFindByServiceId: vi.fn(),
      executeFindByProfessionalId: vi.fn(),
      executeCreate: vi.fn(),
      executeUpdate: vi.fn(),
      executeDelete: vi.fn(),
      executeFetchAvailableSchedulingToOfferByDay: vi.fn(),
    };

    vi.mocked(makeOffersUseCaseFactory).mockReturnValue(useCaseMock);
    vi.setSystemTime(new Date('2025-01-01T09:00:00'));

  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(OffersController).toBeDefined();
  });

  describe('handleFindAll', () => {
    it('should find all offers', async () => {

      const mockOffers = [
        {
          id: 'random-uuid',
          serviceId: 'random-uuid-service',
          professionalId: 'random-uuid-professional',
          estimatedTime: 60,
          price: new Decimal(100.0),
          isOffering: true,
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
        }
      ] as Offer[];

      // arrange
      useCaseMock.executeFindAll.mockResolvedValueOnce({ offers: mockOffers });

      // act
      await OffersController.handleFindAll(req, res, next);

      // assert
      expect(res.send).toHaveBeenCalledWith({ offers: mockOffers });
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeFindAll fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindAll.mockRejectedValueOnce(error);

      // act
      await OffersController.handleFindAll(req, res, next);

      // assert
      expect(useCaseMock.executeFindAll).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFindById', () => {
    it('should find an offer by id', async () => {

      // arrange
      const mockOffer = {
        id: 'random-uuid',
        serviceId: 'random-uuid-service',
        professionalId: 'random-uuid-professional',
        estimatedTime: 60,
        price: new Decimal(100.0),
        isOffering: true,
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Offer;

      req.params.id = 'random-uuid';
      useCaseMock.executeFindById.mockResolvedValueOnce(mockOffer);

      // act
      await OffersController.handleFindById(req, res, next);

      // assert
      expect(req.params.id).toBe('random-uuid');
      expect(res.send).toHaveBeenCalledWith(mockOffer);
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeFindById fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindById.mockRejectedValueOnce(error);

      // act
      await OffersController.handleFindById(req, res, next);

      // assert
      expect(useCaseMock.executeFindById).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFindByServiceId', () => {
    it('should find an offer by service id', async () => {

      // arrange
      const mockOffer = {
        id: 'random-uuid',
        serviceId: 'random-uuid-service',
        professionalId: 'random-uuid-professional',
        estimatedTime: 60,
        price: new Decimal(100.0),
        isOffering: true,
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Offer;

      req.params.serviceId = mockOffer.serviceId;
      useCaseMock.executeFindByServiceId.mockResolvedValueOnce(mockOffer);

      // act
      await OffersController.handleFindByServiceId(req, res, next);

      // assert
      expect(req.params.serviceId).toBe(mockOffer.serviceId);
      expect(res.send).toHaveBeenCalledWith(mockOffer);
      expect(useCaseMock.executeFindByServiceId).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();

    });

    it('should call next with an error if executeFindByServiceId fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindByServiceId.mockRejectedValueOnce(error);

      // act
      await OffersController.handleFindByServiceId(req, res, next);

      // assert
      expect(useCaseMock.executeFindByServiceId).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleFindByProfessionalId', () => {
    it('should find offers by professional id', async () => {

      // arrange
      const mockOffers = [
        {
          id: 'random-uuid',
          serviceId: 'random-uuid-service',
          professionalId: 'random-uuid-professional',
          estimatedTime: 60,
          price: new Decimal(100.0),
          isOffering: true,
          createdAt: new Date('2025-01-01T09:00:00'),
          updatedAt: new Date('2025-01-01T09:00:00'),
        }
      ] as Offer[];

      req.params.professionalId = mockOffers[0].professionalId;
      useCaseMock.executeFindByProfessionalId.mockResolvedValueOnce({ offers: mockOffers });

      // act
      await OffersController.handleFindByProfessionalId(req, res, next);

      // assert
      expect(req.params.professionalId).toBe(mockOffers[0].professionalId);
      expect(res.send).toHaveBeenCalledWith({ offers: mockOffers });
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeFindByProfessionalId fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeFindByProfessionalId.mockRejectedValueOnce(error);

      // act
      await OffersController.handleFindByProfessionalId(req, res, next);

      // assert
      expect(useCaseMock.executeFindByProfessionalId).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });

  });

  describe('handleCreate', () => {
    it('should create an offer', async () => {

      // arrange
      const mockOffer = {
        serviceId: 'random-uuid-service',
        professionalId: 'random-uuid-professional',
        estimatedTime: 60,
        price: new Decimal(100.0),
        isOffering: true,
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Offer;

      req.body = mockOffer;
      useCaseMock.executeCreate.mockResolvedValueOnce(mockOffer);

      // act
      await OffersController.handleCreate(req, res, next);

      // assert
      expect(req.body).toEqual(mockOffer);
      expect(res.send).toHaveBeenCalledWith(mockOffer);
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeCreate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeCreate.mockRejectedValueOnce(error);

      // act
      await OffersController.handleCreate(req, res, next);

      // assert
      expect(useCaseMock.executeCreate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleUpdate', () => {
    it('should update an offer', async () => {

      // arrange
      const mockOffer = {
        id: 'random-uuid',
        serviceId: 'random-uuid-service',
        professionalId: 'random-uuid-professional',
        estimatedTime: 60,
        price: new Decimal(100.0),
        isOffering: true,
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Offer;

      req.params.id = mockOffer.id;
      req.body = mockOffer;
      useCaseMock.executeUpdate.mockResolvedValueOnce(mockOffer);

      // act
      await OffersController.handleUpdate(req, res, next);

      // assert
      expect(req.params.id).toBe(mockOffer.id);
      expect(req.body).toEqual(mockOffer);
      expect(res.send).toHaveBeenCalledWith(mockOffer);
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeUpdate fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeUpdate.mockRejectedValueOnce(error);

      // act
      await OffersController.handleUpdate(req, res, next);

      // assert
      expect(useCaseMock.executeUpdate).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleDelete', () => {
    it('should delete an offer', async () => {

      // arrange
      const mockOffer = {
        id: 'random-uuid',
        serviceId: 'random-uuid-service',
        professionalId: 'random-uuid-professional',
        estimatedTime: 60,
        price: new Decimal(100.0),
        isOffering: true,
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-01T09:00:00'),
      } as Offer;

      req.params.id = mockOffer.id;
      useCaseMock.executeDelete.mockResolvedValueOnce(mockOffer);

      // act
      await OffersController.handleDelete(req, res, next);

      // assert
      expect(req.params.id).toBe(mockOffer.id);
      expect(res.send).toHaveBeenCalledWith(mockOffer);
      expect(useCaseMock.executeDelete).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if executeDelete fails', async () => {
      // arrange
      const error = new Error('Database connection failed');
      useCaseMock.executeDelete.mockRejectedValueOnce(error);

      // act
      await OffersController.handleDelete(req, res, next);

      // assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('handleFetchAvailableSchedulingToOfferByDay', () => {
    it('should fetch available scheduling for an offer by day', async () => {
      // arrange
      const serviceOfferingId = 'random-service-id';
      const dayToFetchAvailableSchedulling = '2025-02-10T00:00:00.000Z';
      const availableSchedulling = [
        { startTimestamp: '10:00 AM', endTimestamp: '10:00 AM', isBusy: false },
        { startTimestamp: '12:00 AM', endTimestamp: '15:00 AM', isBusy: true },
        { startTimestamp: '12:00 AM', endTimestamp: '15:00 AM', isBusy: true },
        { startTimestamp: '11:00 AM', endTimestamp: '17:00 AM', isBusy: true },
      ];

      req.params.id = serviceOfferingId;
      req.query.dayToFetchAvailableSchedulling = dayToFetchAvailableSchedulling;

      useCaseMock.executeFetchAvailableSchedulingToOfferByDay.mockResolvedValueOnce({
        availableSchedulling
      });

      // act
      await OffersController.handleFetchAvailableSchedulingToOfferByDay(req, res, next);

      // assert
      expect(useCaseMock.executeFetchAvailableSchedulingToOfferByDay).toHaveBeenCalledWith(
        serviceOfferingId,
        new Date(dayToFetchAvailableSchedulling)
      );
      expect(res.send).toHaveBeenCalledWith({ availableSchedulling });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if use case fails', async () => {
      // arrange
      const error = new Error('Something went wrong');

      req.params.id = 'random-service-id';
      req.query.dayToFetchAvailableSchedulling = '2025-02-10T00:00:00.000Z';

      useCaseMock.executeFetchAvailableSchedulingToOfferByDay.mockRejectedValueOnce(error);

      // act
      await OffersController.handleFetchAvailableSchedulingToOfferByDay(req, res, next);

      // assert
      expect(next).toHaveBeenCalledWith(error);
      expect(res.send).not.toHaveBeenCalled();
    });
  });


});