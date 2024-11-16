import { Router } from 'express'
import { GenerateGoogleRedirectUriController } from '../../controllers/auth/generate-google-redirect-uri.controller'
import { LoginController } from '../../controllers/auth/login.controller'

const authRoutes = Router()

authRoutes.get('/google/redirect-uri', GenerateGoogleRedirectUriController.handle)
authRoutes.post('/login', LoginController.handle)
authRoutes.post('/register/complete')

export { authRoutes }
