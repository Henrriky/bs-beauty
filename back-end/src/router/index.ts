import { Router } from 'express'
import { serviceRoutes } from './routes/services.routes'

const appRoutes = Router()

appRoutes.use(serviceRoutes)

export { appRoutes }
