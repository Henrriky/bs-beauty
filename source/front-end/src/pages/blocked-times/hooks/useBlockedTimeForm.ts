import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import {
  CreateBlockedTimeFormData,
  BlockedTime,
  BlockedTimeSelectPeriodPossibleValues,
} from '../types'
import { BlockedTimeSchemas } from '../../../utils/validation/zod-schemas/blocked-times.zod-schemas.validation.utils'
import {
  convertBlockedTimeToForm,
  convertFormToBlockedTime,
  getEndDateFromPeriodSelectValue,
  getPeriodSelectValueFromSelectedDate,
} from '../utils'

const CREATE_BLOCKEDTIME_INITIAL_VALUES: Omit<
  BlockedTime,
  'id' | 'createdAt' | 'updatedAt' | 'endDate'
> = {
  reason: '',
  startDate: new Date().toISOString().split('T')[0],
  startTime: '00:00:00',
  endTime: '23:59:59',
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
  blockedTime: BlockedTime | null,
  onSubmit: (data: CreateBlockedTimeFormData) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<CreateBlockedTimeFormData>({
    resolver: zodResolver(BlockedTimeSchemas.createSchema),
    defaultValues: CREATE_BLOCKEDTIME_INITIAL_VALUES,
  })

  const watchedStartDate = watch('startDate')
  const watchedEndDate = watch('endDate')

  useEffect(() => {
    if (blockedTime === null) return
    const blockedTimeInFormFormat = convertBlockedTimeToForm(blockedTime)
    setValue('reason', blockedTime ? blockedTime.reason : '')
    setValue('startTime', blockedTimeInFormFormat.startTime)
    setValue('endTime', blockedTimeInFormFormat.endTime)
    setValue('startDate', blockedTimeInFormFormat.startDate)
    setValue('endDate', blockedTimeInFormFormat.endDate)
    setValue('sunday', blockedTime ? blockedTime.sunday : false)
    setValue('monday', blockedTime ? blockedTime.monday : false)
    setValue('tuesday', blockedTime ? blockedTime.tuesday : false)
    setValue('wednesday', blockedTime ? blockedTime.wednesday : false)
    setValue('thursday', blockedTime ? blockedTime.thursday : false)
    setValue('friday', blockedTime ? blockedTime.friday : false)
    setValue('saturday', blockedTime ? blockedTime.saturday : false)
    setValue('isActive', blockedTime ? blockedTime.isActive : true)
  }, [blockedTime, setValue])

  const periodSelectValue = useMemo(() => {
    return getPeriodSelectValueFromSelectedDate(
      watchedStartDate,
      watchedEndDate,
    )
  }, [watchedStartDate, watchedEndDate])

  const handlePeriodChange = (period: string) => {
    setValue(
      'endDate',
      getEndDateFromPeriodSelectValue(
        period as BlockedTimeSelectPeriodPossibleValues,
        getValues('startDate'),
      ),
    )
  }

  const handleFormSubmit = (data: CreateBlockedTimeFormData) => {
    const blockedTimeInAPIFormat = convertFormToBlockedTime(data)
    onSubmit(blockedTimeInAPIFormat)
  }

  const resetForm = () => {
    reset()
  }

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    errors,
    resetForm,
    periodSelectValue,
    handlePeriodChange,
  }
}
