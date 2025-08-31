import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginController } from '../../../../src/controllers/auth/login.controller';
import { makeLoginUseCase } from '../../../../src/factory/make-login-use-case.factory';
import { LoginUseCase } from '../../../../src/services/use-cases/auth/login.use-case';
import { MockRequest, mockRequest, mockResponse } from '../../../unit/utils/test-utilts';
import { createMock } from '../../utils/mocks';

vi.mock('../../../../src/factory/make-login-use-case.factory', () => ({
    makeLoginUseCase: vi.fn(),
}));

describe('LoginController', () => {
    let req: MockRequest;
    let res: Response;
    let next: any;
    let executeMock: ReturnType<typeof vi.fn>;
    let usecaseMock: LoginUseCase;

    beforeEach(() => {

        vi.clearAllMocks();
        req = mockRequest();
        res = mockResponse();
        next = vi.fn();

        const result = createMock<LoginUseCase>();
        usecaseMock = result.usecase;
        executeMock = result.executeMock;

        vi.mocked(makeLoginUseCase).mockReturnValue(usecaseMock);

    });

    it('should be defined', () => {
        expect(LoginController).toBeDefined();
    });

    describe('handle', () => {

        it('should return 400 if no authorization header and missing email/password', async () => {
            // act
            await LoginController.handle(req, res, next);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(res.send).toHaveBeenCalledWith({ message: 'Email and password are required for login' });
            expect(usecaseMock.execute).not.toHaveBeenCalled()
        });

        it('should return 200 and an access token if the login use case succeeds', async () => {

            // arrange
            req = mockRequest({ headers: { authorization: 'Bearer valid_token' } });
            executeMock.mockResolvedValueOnce({ accessToken: 'fake_access_token' });

            // act
            await LoginController.handle(req, res, next);

            // assert
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.send).toHaveBeenCalledWith({ accessToken: 'fake_access_token' });
            expect(usecaseMock.execute).toHaveBeenCalledWith({ token: 'valid_token' })
        });

        it('should return 500 if the login use case throws an error', async () => {
            // arrange
            req = mockRequest({ headers: { authorization: 'Bearer valid_token' } });
            executeMock.mockRejectedValueOnce(new Error('Use case failure'));

            // act
            await LoginController.handle(req, res, next);

            // assert
            expect(next).toHaveBeenCalledTimes(1);
            expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
            expect((next.mock.calls[0][0] as Error).message).toBe('Use case failure');
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });
    });

});