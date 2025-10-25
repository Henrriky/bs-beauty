import { BlockedTimesController } from '@/controllers/blocked-times.controller'
import { validateCreateBlockedTime } from '@/middlewares/data-validation/blocked-time/create-blocked-time.validation.middleware'
import { validateUpdateBlockedTime } from '@/middlewares/data-validation/blocked-time/update-blocked-time.validation.middleware'
import { Router } from 'express'

const blockedTimesRoutes = Router()

blockedTimesRoutes.get('/', BlockedTimesController.handleFindAllPaginated)
blockedTimesRoutes.get('/:id', BlockedTimesController.handleFindById)
blockedTimesRoutes.post('/', validateCreateBlockedTime, BlockedTimesController.handleCreate)
blockedTimesRoutes.put('/:id', validateUpdateBlockedTime, BlockedTimesController.handleUpdate)
blockedTimesRoutes.delete('/:id', BlockedTimesController.handleDelete)

const blockedTimeRelatedWithProfessionalRoutes = Router({
  mergeParams: true
})

blockedTimeRelatedWithProfessionalRoutes.get('/', BlockedTimesController.findByProfessionalAndPeriod)

export { blockedTimesRoutes, blockedTimeRelatedWithProfessionalRoutes }
