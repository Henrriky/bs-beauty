import { Router } from 'express'
import { CompleteUserRegisterController } from '../../controllers/auth/complete-user-register.controller'
import { GenerateGoogleRedirectUriController } from '../../controllers/auth/generate-google-redirect-uri.controller'
import { LoginController } from '../../controllers/auth/login.controller'
import { verifyJwtTokenMiddleware } from '../../middlewares/auth/verify-jwt-token.middleware'
import { ExchangeCodeByTokenController } from '../../controllers/auth/exchange-code-by-token.controller'
import { FetchUserInfoController } from '../../controllers/auth/fetch-user-info.controller'
import { RegisterCustomerController } from '../../controllers/auth/register-customer.controller'

const authRoutes = Router()

authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/google/exchange-code', ExchangeCodeByTokenController.handle)
authRoutes.post('/login', LoginController.handle)
authRoutes.post('/register/complete', verifyJwtTokenMiddleware, CompleteUserRegisterController.handle)
authRoutes.get('/user', verifyJwtTokenMiddleware, FetchUserInfoController.handle)
authRoutes.post('/register', RegisterCustomerController.handle)

export { authRoutes }
