import { useForm } from 'react-hook-form'
import { CreateServiceFormData, OnSubmitCreateServiceForm } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'
import { useEffect } from 'react'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import { toast } from 'react-toastify'

function CreateServiceForm() {
  const [createService, { isLoading }] = serviceAPI.useCreateServiceMutation()

  const handleSubmitCreateService: OnSubmitCreateServiceForm = async (data) => {
    await createService(data)
      .unwrap()
      .then(() => toast.success('Serviço criado com sucesso!'))
      .catch((error: unknown) => {
        console.error('Error trying to create service', error)
        toast.error('Ocorreu um erro ao criar o serviço.')
      })
  }

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(ServiceSchemas.createSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div className="animate-fadeIn w-full mt-8 flex flex-col justify-center items-center">
      <form
        className="flex flex-col justify-center items-center gap-10 w-full"
        onSubmit={handleSubmit(handleSubmitCreateService)}
      >
        <Input
          registration={{ ...register('name') }}
          label="Nome"
          id="name"
          type="text"
          error={errors?.name?.message?.toString()}
          variant="outline"
          wrapperClassName="w-full"
        />
        <Input
          registration={{ ...register('category') }}
          label="Categoria"
          id="category"
          type="text"
          error={errors?.category?.message?.toString()}
          variant="outline"
          wrapperClassName="w-full"
        />
        <Input
          registration={{ ...register('description') }}
          label="Descrição"
          id="description"
          type="text"
          error={errors?.description?.message?.toString()}
          variant="outline"
          wrapperClassName="w-full"
        />
        <Button
          type="submit"
          label={
            isLoading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">Criar serviço</p>
              </div>
            ) : (
              'Criar serviço'
            )
          }
          disabled={isLoading}
        />
      </form>
    </div>
  )
}

export default CreateServiceForm
