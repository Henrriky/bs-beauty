import { Router } from 'express'
import { FetchServicesController } from '../../controllers/fetch-services.controller'

const serviceRoutes = Router()

serviceRoutes.get('/services', FetchServicesController.handle)

export { serviceRoutes }
