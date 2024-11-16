import { Router } from 'express'
import { CompleteUserRegisterController } from '../../controllers/auth/complete-user-register.controller'
import { GenerateGoogleRedirectUriController } from '../../controllers/auth/generate-google-redirect-uri.controller'
import { LoginController } from '../../controllers/auth/login.controller'
import { verifyJwtTokenMiddleware } from '../../middlewares/auth/verify-jwt-token.middleware'

const authRoutes = Router()

authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/login', LoginController.handle)
authRoutes.post('/register/complete', verifyJwtTokenMiddleware, CompleteUserRegisterController.handle)

export { authRoutes }
