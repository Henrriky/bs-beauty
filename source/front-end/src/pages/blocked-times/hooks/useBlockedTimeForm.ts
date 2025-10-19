import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { CreateBlockedTimeFormData, BlockedTime } from '../types'
import { BlockedTimeSchemas } from '../../../utils/validation/zod-schemas/blocked-times.zod-schemas.validation.utils'

const CREATE_BLOCKEDTIME_INITIAL_VALUES: CreateBlockedTimeFormData = {
  reason: '',
  startDate: new Date().toISOString(),
  endTime: new Date('1970-01-01T00:00:00').toISOString(),
  startTime: new Date('1970-01-01T23:00:00').toISOString(),
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  isActive: true,
}

export function useBlockedTimeForm(
  blockedtime: BlockedTime | null,
  onSubmit: (data: CreateBlockedTimeFormData) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateBlockedTimeFormData>({
    resolver: zodResolver(BlockedTimeSchemas.createSchema),
    defaultValues: CREATE_BLOCKEDTIME_INITIAL_VALUES,
  })

  useEffect(() => {
    if (blockedtime) {
      setValue('reason', blockedtime.reason)
      setValue('startDate', blockedtime.startDate.toString())
      setValue(
        'endDate',
        blockedtime.endDate ? blockedtime.endDate.toString() : undefined,
      )
      setValue('startTime', blockedtime.startTime.toString())
      setValue('endTime', blockedtime.endTime.toString())
      setValue('sunday', blockedtime.sunday || false)
      setValue('monday', blockedtime.monday || false)
      setValue('tuesday', blockedtime.tuesday || false)
      setValue('wednesday', blockedtime.wednesday || false)
      setValue('thursday', blockedtime.thursday || false)
      setValue('friday', blockedtime.friday || false)
      setValue('saturday', blockedtime.saturday || false)
      setValue('isActive', blockedtime.isActive)
    } else {
      reset()
    }
  }, [blockedtime, setValue, reset])

  const handleFormSubmit = (data: CreateBlockedTimeFormData) => {
    onSubmit(data)
  }

  const resetForm = () => {
    reset()
  }

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    resetForm,
  }
}
