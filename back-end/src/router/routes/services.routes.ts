import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'

const serviceRoutes = Router()

serviceRoutes.get('/services', ServicesController.handleFindAll)
serviceRoutes.get('/services/:id', ServicesController.handleFindById)
serviceRoutes.post('/services', ServicesController.handleCreate)
serviceRoutes.put('/services/:id', ServicesController.handleUpdate)
serviceRoutes.delete('/services/:id', ServicesController.handleDelete)

export { serviceRoutes }
