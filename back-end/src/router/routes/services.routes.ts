import { Router } from 'express'
import { ServicesController } from '../../controllers/services.controller'

const serviceRoutes = Router()

serviceRoutes.get('/', ServicesController.handleFindAll)
serviceRoutes.get('/:id', ServicesController.handleFindById)
serviceRoutes.post('/', ServicesController.handleCreate)
serviceRoutes.put('/:id', ServicesController.handleUpdate)
serviceRoutes.delete('/:id', ServicesController.handleDelete)

export { serviceRoutes }
