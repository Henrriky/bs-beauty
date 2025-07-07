import { toast } from 'react-toastify'
import { serviceAPI } from '../../../store/service/service-api'
import { Service } from '../../../store/service/types'
import { OnSubmitUpdateServiceForm, UpdateServiceFormData } from './types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'
import { useEffect, useState } from 'react'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'

interface UpdateServiceFormInputProps {
  service: Service
  onClose: () => void
}

function UpdateServiceForm({ service, onClose }: UpdateServiceFormInputProps) {
  const [updateService, { isLoading }] = serviceAPI.useUpdateServiceMutation()

  const handleSubmitUpdateService: OnSubmitUpdateServiceForm = async (
    serviceData,
  ) => {
    await updateService({ data: serviceData, id: service.id })
      .unwrap()
      .then(() => toast.success('Serviço atualizado com sucesso!'))
      .catch((error: unknown) => {
        console.error('Error trying to update offer', error)
        toast.error('Ocorreu um erro ao atualizar o serviço.')
      })
  }

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UpdateServiceFormData>({
    resolver: zodResolver(ServiceSchemas.updateSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      onClose()
    }
  }, [isSubmitSuccessful, reset, onClose])

  const [serviceName, setServiceName] = useState(service.name)
  const [serviceCategory, setServiceCategory] = useState(service.category)
  const [serviceDescription, setServiceDescription] = useState(
    service.description,
  )

  return (
    <div className="animate-fadeIn w-full flex flex-col justify-center items-center">
      <p className="text-[#D9D9D9] text-base text-center mb-4">
        Atualizar serviço
      </p>
      <form
        className="flex flex-col justify-center items-center w-full"
        onSubmit={handleSubmit(handleSubmitUpdateService)}
      >
        <Input
          registration={{ ...register('name') }}
          label="Nome"
          id="name"
          type="text"
          error={errors?.name?.message?.toString()}
          variant="outline"
          inputClassName="pb-0"
          wrapperClassName="w-full max-w-[295px] mb-3"
          autoComplete="off"
          value={serviceName}
          onChange={(e) => {
            const name = e.target.value
            setServiceName(name)
            setValue('name', name)
          }}
        />
        <Input
          registration={{ ...register('category') }}
          label="Categoria"
          id="category"
          type="text"
          error={errors?.category?.message?.toString()}
          variant="outline"
          inputClassName="pb-0"
          wrapperClassName="w-full max-w-[295px] mb-3"
          autoComplete="off"
          value={serviceCategory}
          onChange={(e) => {
            const category = e.target.value
            setServiceCategory(category)
            setValue('category', category)
          }}
        />
        <Input
          registration={{ ...register('description') }}
          label="Descrição"
          id="description"
          type="text"
          error={errors?.description?.message?.toString()}
          variant="outline"
          inputClassName="pb-0"
          wrapperClassName="w-full max-w-[295px] mb-3"
          autoComplete="off"
          value={serviceDescription || undefined}
          onChange={(e) => {
            const description = e.target.value
            setServiceDescription(description)
            setValue('description', description)
          }}
        />
        <Button
          type="submit"
          label={
            isLoading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">Atualizando serviço...</p>
              </div>
            ) : (
              'Atualizar serviço'
            )
          }
          disabled={isLoading}
        />
      </form>
    </div>
  )
}

export default UpdateServiceForm
