import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfessionalSchemas } from '../../../utils/validation/zod-schemas/professional.zod-schemas.validation.utils'
import { CreateProfessionalFormData } from '../types'
import { UserType } from '../../../store/auth/types'

export function useProfessionalForm(
  onSubmit: (data: CreateProfessionalFormData) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateProfessionalFormData>({
    resolver: zodResolver(ProfessionalSchemas.createSchema),
    defaultValues: {
      email: '',
      userType: UserType.PROFESSIONAL,
      isCommissioned: false,
      commissionPercentage: undefined,
    },
  })

  const handleFormSubmit = (data: CreateProfessionalFormData) => {
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
    watch,
    setValue,
  }
}
