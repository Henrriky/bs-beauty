import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginController } from '../login.controller';
import { makeLoginUseCase } from '../../../factory/make-login-use-case.factory';

vi.mock('../../../factory/make-login-use-case.factory', () => {
    return {
        makeLoginUseCase: vi.fn(),
    };
});

describe('LoginController', () => {

    const app = express();

    beforeEach(() => {
        app.use(express.json());
        app.post('/login', LoginController.handle);
    });

    describe('handle', () => {

        it('should return 401 if no authorization header is provided', async () => {
            const response = await request(app).post('/login');
            expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toEqual({
                message: 'Please, send google access token to login',
            });
        });

        it('should return 200 and an access token if the login use case succeeds', async () => {
            const mockUseCase = {
                execute: vi.fn().mockResolvedValue({ accessToken: 'valid-access-token' }),
            };

            (makeLoginUseCase as any).mockReturnValue(mockUseCase);

            const response = await request(app)
                .post('/login')
                .set('Authorization', 'Bearer valid-google-token');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toEqual({
                accessToken: 'valid-access-token',
            });
            expect(mockUseCase.execute).toHaveBeenCalledWith({ token: 'valid-google-token' });
        });

        it('should return 500 if the login use case throws an error', async () => {
            const mockUseCase = {
                execute: vi.fn().mockRejectedValue(new Error('Unexpected error')),
            };
            (makeLoginUseCase as any).mockReturnValue(mockUseCase);

            const response = await request(app)
                .post('/login')
                .set('Authorization', 'Bearer valid-google-token');

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual({
                message: 'Error trying to login, please check back-end logs...',
            });
            expect(mockUseCase.execute).toHaveBeenCalledWith({ token: 'valid-google-token' });
        });
    });

});
