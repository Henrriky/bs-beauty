/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type NotificationTemplateRepository } from '@/repository/protocols/notification-template.repository'
import { type NotificationTemplateFilters } from '@/types/notification-templates/notification-template'
import { type PaginatedRequest } from '@/types/pagination'
import { CustomError } from '@/utils/errors/custom.error.util'
import { PLACEHOLDER_REGEX } from '@/utils/formatting/placeholder.util'
import { RecordExistence } from '@/utils/validation/record-existence.validation.util'
import { type Prisma } from '@prisma/client'

class NotificationTemplateUseCase {
  private readonly entityName = 'NotificationTemplate'

  constructor (private readonly notificationTemplateRepository: NotificationTemplateRepository) { }

  public async executeFindAll (
    params: PaginatedRequest<NotificationTemplateFilters>
  ) {
    const result = await this.notificationTemplateRepository.findAll(params)

    return result
  }

  public async executeUpdate (key: string, data: Prisma.NotificationTemplateUpdateInput) {
    const notificationTemplate = await this.notificationTemplateRepository.findActiveByKey(key)

    RecordExistence.validateRecordExistence(notificationTemplate, this.entityName)

    const nextTitle = nextStringField(notificationTemplate!.title, data.title)
    const nextBody = nextStringField(notificationTemplate!.body, data.body)

    const nextPlaceholdersArr: string[] = [
      ...extractPlaceholders(nextTitle),
      ...extractPlaceholders(nextBody)
    ]
    const nextPlaceholders = new Set<string>(nextPlaceholdersArr)

    const currentAllowedFromColumn = asStringArray(notificationTemplate!.variables as unknown)
    const fallbackAllowedFromText: string[] = [
      ...extractPlaceholders(notificationTemplate!.title),
      ...extractPlaceholders(notificationTemplate!.body)
    ]
    const allowedList: string[] = currentAllowedFromColumn.length > 0
      ? currentAllowedFromColumn
      : fallbackAllowedFromText

    const allowed = new Set<string>(allowedList)

    const invalid = [...nextPlaceholders].filter(ph => !allowed.has(ph))
    if (invalid.length > 0) {
      const detailsObj = {
        invalidPlaceholders: invalid.map(k => `{${k}}`),
        allowedPlaceholders: [...allowed].map(k => `{${k}}`)
      }
      throw new CustomError(
        'Invalid placeholders along the title/body.',
        422,
        JSON.stringify(detailsObj)
      )
    }

    return await this.notificationTemplateRepository.updateByKey(key, data)
  }
}

export const extractPlaceholders = (text: string) =>
  Array.from(text.matchAll(PLACEHOLDER_REGEX), m => m[1])

function nextStringField (
  current: string,
  input?: string | Prisma.StringFieldUpdateOperationsInput | null
): string {
  if (typeof input === 'string') return input
  if (input && typeof input === 'object' && 'set' in input && typeof input.set === 'string') {
    return input.set
  }
  return current
}

function asStringArray (json: unknown): string[] {
  if (Array.isArray(json) && json.every(v => typeof v === 'string')) {
    return json
  }
  return []
}

export { NotificationTemplateUseCase }
