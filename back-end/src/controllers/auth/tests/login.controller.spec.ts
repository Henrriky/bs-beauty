import { StatusCodes } from 'http-status-codes';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeLoginUseCase } from '../../../factory/make-login-use-case.factory';
import { LoginController } from '../login.controller';

vi.mock('../../../factory/make-login-use-case.factory', () => ({
    makeLoginUseCase: vi.fn(),
}));

describe('LoginController', () => {
    let req: any
    let res: any
    let usecaseMock: any

    beforeEach(() => {

        vi.clearAllMocks();
        req = {
            headers: {},
        }

        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        usecaseMock = {
            execute: vi.fn(),
        };
        vi.mocked(makeLoginUseCase).mockReturnValue(usecaseMock);
    });

    it('should be defined', () => {
        expect(LoginController).toBeDefined();
    });

    describe('handle', () => {

        it('should return 401 if no authorization header is provided', async () => {
            // act
            await LoginController.handle(req as any, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
            expect(res.send).toHaveBeenCalledWith({ message: 'Please, send google access token to login' });
            expect(usecaseMock.execute).not.toHaveBeenCalled()
        });

        it('should return 200 and an access token if the login use case succeeds', async () => {

            // arrange
            req.headers.authorization = 'Bearer valid_token'
            usecaseMock.execute.mockResolvedValueOnce({ accessToken: 'fake_access_token' })

            // act
            await LoginController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith({ accessToken: 'fake_access_token' });
            expect(usecaseMock.execute).toHaveBeenCalledWith({ token: 'valid_token' })
        });

        it('should return 500 if the login use case throws an error', async () => {
            // arrange
            req.headers.authorization = 'Bearer valid_token'
            usecaseMock.execute.mockRejectedValueOnce(new Error('Use case failure'))

            // act
            await LoginController.handle(req, res);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.send).toHaveBeenCalledWith({ message: 'Error trying to login, please check back-end logs...' });
        });
    });

});
