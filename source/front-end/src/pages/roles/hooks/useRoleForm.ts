import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { RoleSchemas } from '../../../utils/validation/zod-schemas/role.zod-schemas.validation.utils'
import { CreateRoleFormData, Role } from '../types'

export function useRoleForm(
  role: Role | null,
  onSubmit: (data: CreateRoleFormData) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(RoleSchemas.createSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  })

  // Preencher formulário quando editando
  useEffect(() => {
    if (role) {
      setValue('name', role.name)
      setValue('description', role.description)
      setValue('isActive', role.isActive)
    } else {
      reset({
        name: '',
        description: '',
        isActive: true,
      })
    }
  }, [role, setValue, reset])

  const handleFormSubmit = (data: CreateRoleFormData) => {
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
