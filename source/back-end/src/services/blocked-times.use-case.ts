/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type FindAllPaginated, type BlockedTimeRepository } from '@/repository/protocols/blocked-times.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type BlockedTimesUseCaseFilters } from '@/types/blocked-times/blocked-times'
import { type PaginatedResult, type PaginatedRequest } from '@/types/pagination'
import { type AuthInformations, type AuthContext } from '@/types/shared'
import { PermissionChecker } from '@/utils/auth/permission-checker.util'
import { CustomError } from '@/utils/errors/custom.error.util'
import { RecordExistence } from '@/utils/validation/record-existence.validation.util'
import { type Prisma, UserType, type BlockedTime } from '@prisma/client'
import * as luxon from 'luxon'

class BlockedTimesUseCase {
  constructor (
    private readonly blockedTimesRepository: BlockedTimeRepository,
    private readonly professionalsRepository: ProfessionalRepository
  ) {
  }

  public async executeFindAllPaginated (
    params: AuthContext<PaginatedRequest<BlockedTimesUseCaseFilters>>
  ): Promise<PaginatedResult<FindAllPaginated>> {
    const hasLeastOnePermission = params.permissions && params.permissions.length > 0
    const hasPermissionToReadAll = PermissionChecker.hasPermission(params.permissions, 'blocked_time.read_all')
    const hasPermissionToReadOwn = PermissionChecker.hasPermission(params.permissions, 'blocked_time.read_own')
    const isUserManager = params.userType === UserType.MANAGER

    if (hasLeastOnePermission && !hasPermissionToReadAll && !hasPermissionToReadOwn) {
      throw new CustomError('Forbidden', 403, 'You do not have permission to read blocked times.')
    }

    const user = await this.professionalsRepository.findById(params.userId)
    RecordExistence.validateRecordExistence(user, 'Professional')

    let professionalId: string | undefined = user!.id
    if (hasLeastOnePermission) {
      if (hasPermissionToReadOwn) {
        professionalId = user!.id
      }
      if (hasPermissionToReadAll) {
        professionalId = undefined
      }
    }

    if (!hasLeastOnePermission) {
      if (isUserManager) professionalId = undefined
    }

    const result = await this.blockedTimesRepository.findAllPaginated({
      ...params,
      extra: {
        ...params.extra,
        filters: {
          ...params.extra.filters,
          professionalId
        }
      }
    })

    return result
  }

  public async executeCreate (
    params: AuthContext<Prisma.BlockedTimeCreateInput>
  ): Promise<void> {
    const hasLeastOnePermission = params.permissions && params.permissions.length > 0
    if (hasLeastOnePermission) {
      const hasPermission = PermissionChecker.hasPermission(params.permissions, 'blocked_time.create_own')
      if (!hasPermission) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to create blocked times.')
      }
    }

    await this.validateProfessionalExistance(params.userId)

    if (params.extra.endDate) this.validateStartAndEndDates(params.extra.startDate, params.extra.endDate)
    this.validateStartAndEndDates(params.extra.startTime, params.extra.endTime)

    await this.blockedTimesRepository.create(params)
  }

  public async executeUpdate (
    blockedTimeId: string,
    params: AuthContext<Prisma.BlockedTimeUpdateInput>
  ): Promise<BlockedTime> {
    await this.validateProfessionalExistance(params.userId)

    if (params.extra.startDate && params.extra.endDate) this.validateStartAndEndDates(params.extra.startDate as Date, params.extra.endDate as Date)
    if (params.extra.startTime && params.extra.endTime) this.validateStartAndEndDates(params.extra.startTime as Date, params.extra.endTime as Date)

    const blockedTimeById = await this.validateBlockedTimeExistance(blockedTimeId)
    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById!, operation: 'update' })

    const blockedTimeUpdated = await this.blockedTimesRepository.update(blockedTimeId, params.extra)

    return blockedTimeUpdated
  }

  public async executeFindById (
    params: AuthContext<{ blockedTimeId: string }>
  ): Promise<BlockedTime> {
    await this.validateProfessionalExistance(params.userId)

    const blockedTimeById = await this.validateBlockedTimeExistance(params.extra.blockedTimeId)

    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById!, operation: 'read' })

    return blockedTimeById!
  }

  public async executeDelete (
    params: AuthContext<{ blockedTimeId: string }>
  ): Promise<BlockedTime> {
    await this.validateProfessionalExistance(params.userId)

    const blockedTimeById = await this.validateBlockedTimeExistance(params.extra.blockedTimeId)

    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById!, operation: 'delete' })

    await this.blockedTimesRepository.delete(params.extra.blockedTimeId)

    return blockedTimeById!
  }

  public async executeFindByProfessionalAndPeriod ({
    professionalId,
    startDate,
    endDate
  }: { professionalId: string, startDate: string, endDate: string }) {
    const differenceInDays = luxon.DateTime.fromISO(endDate).diff(luxon.DateTime.fromISO(startDate), 'days').days

    if (differenceInDays > 31) {
      throw new CustomError('Bad Request', 400, 'The maximum allowed period is 31 days.')
    }

    await this.validateProfessionalExistance(professionalId)
    const blockedTimes = await this.blockedTimesRepository.findByProfessionalAndPeriod({
      professionalId,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })

    return blockedTimes
  }

  private async validateProfessionalExistance (professionalId: string) {
    const professional = await this.professionalsRepository.findById(professionalId)
    RecordExistence.validateRecordExistence(professional, 'Professional')

    return professional
  }

  private async validateBlockedTimeExistance (blockedTimeId: string) {
    const blockedTimeById = await this.blockedTimesRepository.findById(blockedTimeId)
    RecordExistence.validateRecordExistence(blockedTimeById, 'BlockedTime')

    return blockedTimeById
  }

  private validateResourcePermission ({
    authInformations,
    blockedTime,
    operation
  }: { authInformations: AuthInformations, blockedTime: BlockedTime, operation: 'update' | 'delete' | 'read' }): void {
    const userIsOwner = blockedTime.professionalId === authInformations.userId
    const userIsManager = authInformations.userType === UserType.MANAGER
    const hasLeastOnePermission = authInformations.permissions && authInformations.permissions.length > 0

    if (!hasLeastOnePermission) {
      if (!userIsOwner && !userIsManager) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to access this blocked time.')
      }

      return
    }

    if (operation === 'read') {
      const hasPermissionToReadAll = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.read_all')
      const hasPermissionToReadOwn = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.read_own')

      if (!userIsOwner && !hasPermissionToReadAll) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to read blocked times.')
      }

      if (userIsOwner && !hasPermissionToReadOwn) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to read blocked times.')
      }
    }

    if (operation === 'update') {
      const hasPermissionToUpdateAll = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.edit_all')
      const hasPermissionToUpdateOwn = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.edit_own')

      if (!userIsOwner && !hasPermissionToUpdateAll) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to update blocked times.')
      }

      if (userIsOwner && !hasPermissionToUpdateOwn) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to update blocked times.')
      }
    }

    if (operation === 'delete') {
      const hasPermissionToDeleteAll = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.delete_all')
      const hasPermissionToDeleteOwn = PermissionChecker.hasPermission(authInformations.permissions, 'blocked_time.delete_own')

      if (!userIsOwner && !hasPermissionToDeleteAll) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to delete blocked times.')
      }

      if (userIsOwner && !hasPermissionToDeleteOwn) {
        throw new CustomError('Forbidden', 403, 'You do not have permission to delete blocked times.')
      }
    }
  }

  private validateStartAndEndDates (startDate: Date | string, endDate: Date | string): void {
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    if (startDate > endDate) {
      throw new CustomError('Bad Request', 400, 'Start date must be before end date.')
    }
  }
}

export { BlockedTimesUseCase }
