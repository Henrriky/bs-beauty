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
import { GenerateTokensController } from '@/controllers/auth/generate-tokens.controller'
import { LogoutController } from '@/controllers/auth/logout.controller'

const authRoutes = Router()

/* OAuth */
authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/google/exchange-code', ExchangeCodeByTokenController.handle)

/* Login */
authRoutes.post('/login', LoginController.handle)
authRoutes.post('/logout', LogoutController.handle)
authRoutes.post('/new-tokens', GenerateTokensController.handle)

/* Register */
authRoutes.post('/register/complete', verifyJwtTokenMiddleware, CompleteUserRegisterController.handle)
authRoutes.post('/register', RegisterUserController.handleRegisterCustomer)
authRoutes.put('/register', RegisterUserController.handleRegisterProfessional)
authRoutes.get('/register/:email', RegisterUserController.handleFindProfessionalByEmail)

/* Password Reset */
authRoutes.post('/password-reset/request', PasswordResetRequestController.handle)
authRoutes.post('/password-reset/set-password', PasswordResetSetPasswordController.handle)

/* Code Validation */
authRoutes.post('/code-validation', CodeValidationController.handle)

/* Profile Informations */
authRoutes.get('/user', verifyJwtTokenMiddleware, FetchUserInfoController.handle)

export { authRoutes }
