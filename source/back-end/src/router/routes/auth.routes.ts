import { CodeValidationController } from '@/controllers/auth/code-validation.controller'
import { Router } from 'express'
import { CompleteUserRegisterController } from '../../controllers/auth/complete-user-register.controller'
import { ExchangeCodeByTokenController } from '../../controllers/auth/exchange-code-by-token.controller'
import { FetchUserInfoController } from '../../controllers/auth/fetch-user-info.controller'
import { GenerateGoogleRedirectUriController } from '../../controllers/auth/generate-google-redirect-uri.controller'
import { LoginController } from '../../controllers/auth/login.controller'
import { RegisterUserController } from '../../controllers/auth/register-user.controller'
import { verifyJwtTokenMiddleware } from '../../middlewares/auth/verify-jwt-token.middleware'
import { PasswordResetRequestController } from '@/controllers/auth/password-reset-request.controller'
import { PasswordResetSetPasswordController } from '@/controllers/auth/password-reset-set-password.controller'

const authRoutes = Router()

authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/google/exchange-code', ExchangeCodeByTokenController.handle)
authRoutes.post('/login', LoginController.handle)
authRoutes.post('/register/complete', verifyJwtTokenMiddleware, CompleteUserRegisterController.handle)
authRoutes.get('/user', verifyJwtTokenMiddleware, FetchUserInfoController.handle)
authRoutes.post('/register', RegisterUserController.handleRegisterCustomer)
authRoutes.put('/register', RegisterUserController.handleRegisterEmployee)
authRoutes.get('/register/:email', RegisterUserController.handleFindEmployeeByEmail)
authRoutes.post('/code-validation', CodeValidationController.handle)
authRoutes.post('/password-reset/request', PasswordResetRequestController.handle)
authRoutes.post('/password-reset/set-password', PasswordResetSetPasswordController.handle)

export { authRoutes }
