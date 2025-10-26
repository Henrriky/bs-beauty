import { BlockedTimesController } from '@/controllers/blocked-times.controller'
import { combinedAuthMiddleware } from '@/middlewares/auth/combined-auth.middleware'
import { validateCreateBlockedTime } from '@/middlewares/data-validation/blocked-time/create-blocked-time.validation.middleware'
import { validateUpdateBlockedTime } from '@/middlewares/data-validation/blocked-time/update-blocked-time.validation.middleware'
import { UserType } from '@prisma/client'
import { Router } from 'express'

const blockedTimesRoutes = Router()

blockedTimesRoutes.use(combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], []))
blockedTimesRoutes.get('/',
  combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], ['blocked_time.read_own', 'blocked_time.read_all']),
  BlockedTimesController.handleFindAllPaginated
)
blockedTimesRoutes.get('/:id',
  combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], ['blocked_time.read_own', 'blocked_time.read_all']),
  BlockedTimesController.handleFindById
)
blockedTimesRoutes.post('/',
  combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], ['blocked_time.create_own']),
  validateCreateBlockedTime, BlockedTimesController.handleCreate
)
blockedTimesRoutes.put('/:id',
  combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], ['blocked_time.edit_own', 'blocked_time.edit_all']),
  validateUpdateBlockedTime, BlockedTimesController.handleUpdate
)
blockedTimesRoutes.delete('/:id',
  combinedAuthMiddleware([UserType.MANAGER, UserType.PROFESSIONAL], ['blocked_time.delete_own', 'blocked_time.delete_all']),
  BlockedTimesController.handleDelete
)

const blockedTimeRelatedWithProfessionalRoutes = Router({
  mergeParams: true
})

blockedTimeRelatedWithProfessionalRoutes.get('/', BlockedTimesController.findByProfessionalAndPeriod)

export { blockedTimesRoutes, blockedTimeRelatedWithProfessionalRoutes }
