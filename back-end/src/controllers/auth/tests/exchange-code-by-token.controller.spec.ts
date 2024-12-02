import { StatusCodes } from "http-status-codes";
import { ExchangeCodeByTokenUseCase } from "../../../services/use-cases/auth/exchange-code-by-token.use-case";
import { ExchangeCodeByTokenController } from "../exchange-code-by-token.controller";

vi.mock('../../../services/use-cases/auth/exchange-code-by-token.use-case');
vi.mock('../../../services/identity-providers/google-oauth-identity-provider.service');

describe('ExchangeCodeByTokenController', () => {

    let req: any;
    let res: any;
    let serviceMock: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
        };

        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
            json: vi.fn(),
        };

        serviceMock = {
            execute: vi.fn(),
        };

        vi.mocked(ExchangeCodeByTokenUseCase).mockImplementation(() => serviceMock);
    })

    it('should be defined', () => {
        expect(ExchangeCodeByTokenController).toBeDefined();
    })

    describe('handle', () => {

        it('should return 200 and the access token if the use case succeeds', async () => {
            // arrange
            req.body = { code: 'valid_code' };
            serviceMock.execute.mockResolvedValueOnce({ accessToken: 'fake_access_token' });

            // act
            await ExchangeCodeByTokenController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith({ accessToken: 'fake_access_token' });
            expect(serviceMock.execute).toHaveBeenCalledWith({ code: 'valid_code' });
        });

        it('should return 400 if the body validation fails', async () => {
            // arrange
            req.body = { invalidKey: 'value' };

            // act
            await ExchangeCodeByTokenController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Validation Error',
                errors: expect.any(Array),
            }));
            expect(serviceMock.execute).not.toHaveBeenCalled();
        });

        it('should return 500 if the use case throws an error', async () => {
            // arrange
            req.body = { code: 'valid_code' };
            serviceMock.execute.mockRejectedValueOnce(new Error('Use case failure'));

            // act
            await ExchangeCodeByTokenController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error trying to exchange code by token, please check back-end logs...',
            });
        });

    });
})