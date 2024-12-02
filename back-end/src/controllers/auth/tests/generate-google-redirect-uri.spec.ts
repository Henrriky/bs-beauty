import { StatusCodes } from "http-status-codes";
import { GenerateOAuthRedirectUriUseCase } from "../../../services/use-cases/auth/generate-oauth-redirect-uri.use-case";
import { GenerateGoogleRedirectUriController } from "../generate-google-redirect-uri.controller";


vi.mock('../../../services/use-cases/auth/generate-oauth-redirect-uri.use-case');

describe('GenerateGoogleRedirectUriController', () => {

    let req: any
    let res: any;
    let serviceMock: any;

    beforeEach(() => {

        vi.clearAllMocks();

        req = {}

        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        serviceMock = {
            execute: vi.fn(),
        };
        vi.mocked(GenerateOAuthRedirectUriUseCase).mockImplementation(() => serviceMock);

    })

    it('should be defined', () => {
        expect(GenerateGoogleRedirectUriController).toBeDefined();
    })

    describe('handle', () => {
        it('should return 200 and the authorization URL if the use case succeeds', async () => {
            // arrange
            serviceMock.execute.mockReturnValueOnce({ authorizationUrl: 'http://example.com/auth' });

            // act
            await GenerateGoogleRedirectUriController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith({ authorizationUrl: 'http://example.com/auth' });
            expect(serviceMock.execute).toHaveBeenCalledTimes(1);
        })

        it('should return 500 if the use case throws an error', async () => {
            // arrange
            serviceMock.execute.mockImplementationOnce(() => {
                throw new Error('Use case failure');
            });

            // act
            await GenerateGoogleRedirectUriController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.send).toHaveBeenCalledWith({
                message: 'Error trying to generate google redirect uri, please check back-end logs...',
            });
        });
    });

})