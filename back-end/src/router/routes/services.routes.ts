import { Router } from 'express'
import { FetchServicesController } from '../../controllers/fetch-services.controller'

const serviceRoutes = Router()

serviceRoutes.use((req, res, next) => {
  console.log('REQUEST PARA O FetchServicesController, informação: ')
  next()
})
serviceRoutes.get('/services', FetchServicesController.handle)

export { serviceRoutes }
