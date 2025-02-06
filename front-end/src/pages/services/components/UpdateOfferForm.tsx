import { toast } from 'react-toastify'
import { offerAPI } from '../../../store/offer/offer-api'
import { Offer } from '../../../store/offer/types'
import { OnSubmitUpdateOfferForm, UpdateOfferFormData } from './types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OfferSchemas } from '../../../utils/validation/zod-schemas/offer.zod-schemas.validation.utils'
import { useEffect, useState } from 'react'
import { Formatter } from '../../../utils/formatter/formatter.util'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'

interface UpdateOfferFormInputProps {
  offer: Offer
  onClose: () => void
}

function UpdateOfferForm({ offer, onClose }: UpdateOfferFormInputProps) {
  const [updateOffer, { isLoading }] = offerAPI.useUpdateOfferMutation()

  const handleSubmitUpdateOffer: OnSubmitUpdateOfferForm = async (
    offerData,
  ) => {
    await updateOffer({ data: offerData, id: offer.id })
      .unwrap()
      .then(() => toast.success('Oferta atualizada com sucesso!'))
      .catch((error: unknown) => {
        console.error('Error trying to update offer', error)
        toast.error('Ocorreu um erro ao atualizar a oferta')
      })
  }

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<UpdateOfferFormData>({
    resolver: zodResolver(OfferSchemas.updateSchema),
  })

  const price = parseFloat(offer.price + '').toFixed(2)

  const [priceValue, setPriceValue] = useState<string>(
    ('R$ ' + price).replace('.', ','),
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const formattedValue = Formatter.formatCurrency(inputValue)
    setPriceValue(formattedValue)
  }

  const [offerState, setOfferState] = useState(offer)

  const [estimative, setEstimative] = useState(offer.estimatedTime)

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      setPriceValue('')
      onClose()
    }
  }, [isSubmitSuccessful, reset, onClose])

  return (
    <form
      className="flex flex-col items-center w-full"
      onSubmit={handleSubmit(handleSubmitUpdateOffer)}
    >
      <p className="text-[#D9D9D9] text-base text-center mb-4">
        Atualizar oferta
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
        value={priceValue}
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
        value={estimative}
        onChange={(e) => {
          let estimative = parseInt(e.target.value)
          if (isNaN(estimative)) {
            estimative = ''
          }
          setEstimative(estimative)
          setValue('estimatedTime', estimative)
        }}
      />
      <div className="flex items-center justify-between w-full mb-4">
        <label htmlFor="isOffering" className="text-sm text-[#D9D9D9]">
          Ofertando
        </label>
        <Input
          id="isOffering"
          type="checkbox"
          registration={{ ...register('isOffering') }}
          checked={offerState.isOffering}
          inputClassName="appearance-none rounded-full border-2 border-[#A4978A] checked:bg-[#A4978A] focus:outline-none size-5"
          wrapperClassName="size-5"
          onChange={(e) => {
            const isChecked = e.target.checked
            setOfferState((prev) => ({ ...prev, isOffering: isChecked }))
            setValue('isOffering', isChecked)
          }}
        />
      </div>
      <Button
        type="submit"
        label={
          isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Finalizando...</p>
            </div>
          ) : (
            'Finalizar'
          )
        }
        disabled={isLoading}
        className="max-w-[294px]"
      />
    </form>
  )
}

export default UpdateOfferForm
