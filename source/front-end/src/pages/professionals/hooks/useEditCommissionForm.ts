import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const editCommissionSchema = z.object({
  commissionPercentage: z
    .number({
      required_error: 'A porcentagem de comissão é obrigatória',
      invalid_type_error: 'A porcentagem deve ser um número',
    })
    .min(0, 'A porcentagem não pode ser negativa')
    .max(100, 'A porcentagem não pode ser maior que 100'),
})

export type EditCommissionFormData = z.infer<typeof editCommissionSchema>

export function useEditCommissionForm(
  onSubmit: (data: EditCommissionFormData) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditCommissionFormData>({
    resolver: zodResolver(editCommissionSchema),
    defaultValues: {
      commissionPercentage: 0,
    },
  })

  const handleFormSubmit = (data: EditCommissionFormData) => {
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
    setValue,
  }
}
