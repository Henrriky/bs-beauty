import { useForm } from 'react-hook-form'
import { CreateServiceFormData, OnSubmitCreateServiceForm } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ServiceSchemas } from '../../../utils/validation/zod-schemas/service.zod-schemas.validation.utils'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'

interface ServiceInputContainerProps {
  isLoading: boolean
  handleSubmit: OnSubmitCreateServiceForm
}

function CreateServiceForm(props: ServiceInputContainerProps) {
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
      toast.success('Serviço criado com sucesso!')
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div className="animate-fadeIn w-full">
      <form
        className="flex flex-col justify-center items-center gap-10 w-full"
        onSubmit={handleSubmit(props.handleSubmit)}
      >
        <Input
          registration={{ ...register('name') }}
          label="Nome"
          id="name"
          type="text"
          error={errors?.name?.message?.toString()}
          variant="solid"
          inputClassName={
            errors.name
              ? `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-10`
              : `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-[0]`
          }
          wrapperClassName="w-full max-w-[370px]"
        />
        <Input
          registration={{ ...register('category') }}
          label="Categoria"
          id="category"
          type="text"
          error={errors?.category?.message?.toString()}
          variant="solid"
          inputClassName={
            errors.category
              ? `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-10`
              : `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-[0]`
          }
          wrapperClassName="w-full max-w-[370px]"
        />
        <Input
          registration={{ ...register('description') }}
          label="Descrição"
          id="description"
          type="text"
          error={errors?.description?.message?.toString()}
          variant="solid"
          inputClassName={
            errors.description
              ? `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-10`
              : `bg-[#222222] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] border-[1px] border-opacity-[0]`
          }
          wrapperClassName="w-full max-w-[370px]"
        />
        <Button
          type="submit"
          label={
            props.isLoading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">Criar serviço</p>
              </div>
            ) : (
              'Criar serviço'
            )
          }
          disabled={props.isLoading}
          className="w-[full] max-w-[190px] text-[#A9A9A9] rounded-[9px] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)]"
        />
      </form>
    </div>
  )
}

export default CreateServiceForm
