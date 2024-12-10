import { useForm } from 'react-hook-form'
import { CreateOfferFormData, OnSubmitCreateOfferForm } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import { OfferSchemas } from '../../../utils/validation/zod-schemas/offer.zod-schemas.validation.utils'
import { useEffect, useState } from 'react'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'
import { offerAPI } from '../../../store/offer/offer-api'
import { toast } from 'react-toastify'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Service } from '../../../store/service/types'

interface CreateOfferFormInputProps {
  service: Service
  employeeId: string | undefined
}

function CreateOfferForm({ service, employeeId }: CreateOfferFormInputProps) {
  const [createOffer, { isLoading }] = offerAPI.useCreateOfferMutation()

  const handleSubmitCreateOffer: OnSubmitCreateOfferForm = async (
    offerData,
  ) => {
    await createOffer(offerData)
      .unwrap()
      .then(() => toast.success('Oferta criada com sucesso!'))
      .catch((error: unknown) => {
        console.error('Error trying to create offer', error)
        toast.error('Ocorreu um erro ao criar a oferta')
      })
  }

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateOfferFormData>({
    resolver: zodResolver(OfferSchemas.createSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const [value, setValue] = useState<string>('R$ 0,01')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const formattedValue = Formatter.formatCurrency(inputValue)
    setValue(formattedValue)
  }

  console.log(errors)

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={handleSubmit(handleSubmitCreateOffer)}
    >
      <p className="text-[#D9D9D9] text-base text-center mb-4">
        Oferecer serviço
      </p>
      <Input
        registration={{ ...register('price') }}
        label="Preço"
        id="price"
        type="text"
        step="0.01"
        min="0.01"
        error={errors?.price?.message?.toString()}
        variant="outline"
        inputClassName="pb-0"
        wrapperClassName="w-full max-w-[295px] mb-5"
        onChange={handleInputChange}
        value={value}
        inputMode="numeric"
        autoComplete="off"
      />
      <Input
        registration={{ ...register('estimatedTime') }}
        label="Estimativa (minutos)"
        id="estimative"
        type="text"
        error={errors?.estimatedTime?.message?.toString()}
        variant="outline"
        inputClassName="pb-0"
        wrapperClassName="w-full max-w-[295px] mb-4"
        autoComplete="off"
      />
      <Input
        type="hidden"
        value={employeeId}
        id="employeeId"
        registration={{ ...register('employeeId') }}
      />
      <Input
        type="hidden"
        value={service.id}
        id="serviceId"
        registration={{ ...register('serviceId') }}
      />
      <Input
        type="hidden"
        value={'true'}
        id="offering"
        registration={{ ...register('isOffering') }}
      />
      <Button
        type="submit"
        label={
          isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Oferecer serviço</p>
            </div>
          ) : (
            'Oferecer serviço'
          )
        }
        disabled={isLoading}
        className="max-w-[294px]"
      />
    </form>
  )
}

export default CreateOfferForm
