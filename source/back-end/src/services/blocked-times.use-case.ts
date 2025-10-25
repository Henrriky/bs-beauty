/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type BlockedTimeRepository } from '@/repository/protocols/blocked-times.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type BlockedTimesUseCaseFilters } from '@/types/blocked-times/blocked-times'
import { type PaginatedResult, type PaginatedRequest } from '@/types/pagination'
import { type AuthInformations, type AuthContext } from '@/types/shared'
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
  ): Promise<PaginatedResult<BlockedTime>> {
    const user = await this.professionalsRepository.findById(params.userId)

    RecordExistence.validateRecordExistence(user, 'Professional')

    const userIsManager = params.userType === UserType.MANAGER

    const result = await this.blockedTimesRepository.findAllPaginated({
      ...params,
      extra: {
        ...params.extra,
        filters: {
          ...params.extra.filters,
          professionalId: userIsManager ? undefined : params.userId
        }
      }
    })

    return result
  }

  public async executeCreate (
    params: AuthContext<Prisma.BlockedTimeCreateInput>
  ): Promise<void> {
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
    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById! })

    const blockedTimeUpdated = await this.blockedTimesRepository.update(blockedTimeId, params.extra)

    return blockedTimeUpdated
  }

  public async executeFindById (
    params: AuthContext<{ blockedTimeId: string }>
  ): Promise<BlockedTime> {
    await this.validateProfessionalExistance(params.userId)

    const blockedTimeById = await this.validateBlockedTimeExistance(params.extra.blockedTimeId)

    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById! })

    return blockedTimeById!
  }

  public async executeDelete (
    params: AuthContext<{ blockedTimeId: string }>
  ): Promise<BlockedTime> {
    await this.validateProfessionalExistance(params.userId)

    const blockedTimeById = await this.validateBlockedTimeExistance(params.extra.blockedTimeId)

    this.validateResourcePermission({ authInformations: params, blockedTime: blockedTimeById! })

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
    blockedTime
  }: { authInformations: AuthInformations, blockedTime: BlockedTime }): void {
    const userIsOwner = blockedTime.professionalId === authInformations.userId
    const userIsManager = authInformations.userType === UserType.MANAGER

    if (!userIsOwner && !userIsManager) {
      throw new CustomError('Forbidden', 403, 'You do not have permission to access this blocked time.')
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
