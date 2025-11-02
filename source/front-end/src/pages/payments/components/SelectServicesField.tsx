import {
  CreatePaymentRecordFormData,
  PaymentItem,
  UpdatePaymentRecordFormData,
} from '../types/types'
import { Input } from '../../../components/inputs/Input'
import ComboBox from '../../../components/combobox/ComboBox'
import { Button } from '../../../components/button/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import useAppSelector from '../../../hooks/use-app-selector'
import { professionalAPI } from '../../../store/professional/professional-api'
import { useEffect, useState } from 'react'
import { Controller, FieldArrayWithId, useFormContext } from 'react-hook-form'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'

interface SelectServicesFieldProps {
  comboboxInputWidth?: string
  totalAmount: number
  paymentItems: FieldArrayWithId<
    CreatePaymentRecordFormData | UpdatePaymentRecordFormData,
    'items',
    'id'
  >[]
  appendItems: (item: PaymentItem) => void
  removeItems: (index: number) => void
}

function SelectServicesField({
  comboboxInputWidth = 'w-42',
  totalAmount,
  paymentItems,
  appendItems,
  removeItems,
}: SelectServicesFieldProps) {
  const { data: professional } =
    professionalAPI.useFetchServicesOfferedByProfessionalQuery({
      professionalId: useAppSelector((state) => state.auth.user?.id as string),
    })

  const [serviceQuery, setServiceQuery] = useState('')
  const filteredServices =
    serviceQuery === ''
      ? professional?.professional.offers || []
      : (professional?.professional.offers || []).filter((offer) =>
          offer.service.name.toLowerCase().includes(serviceQuery.toLowerCase()),
        )

  const { control, setValue } = useFormContext()

  useEffect(() => {
    paymentItems.forEach((item, index) => {
      setValue(`items.${index}.price`, Number(item.price))
    })
  }, [paymentItems, setValue])

  return (
    <div className="flex flex-col gap-3 animate-fadeIn text-primary-0">
      <p className="text-sm w-">Serviços prestados</p>
      {paymentItems.map((item, index) => (
        <div key={item.id} className="flex gap-3 items-start">
          <div className="flex gap-2 items-start">
            <Controller
              name={`items.${index}.quantity` as const}
              control={control}
              render={({ field }) => (
                <Input
                  id={'item-' + index + 'quantity'}
                  type="text"
                  {...field}
                  min={1}
                  variant="solid"
                  wrapperClassName="w-10"
                  inputClassName="rounded-lg text-primary-0"
                  label={index === 0 ? 'Qtd.' : ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name={`items.${index}.offerId`}
              control={control}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => {
                const selectedOffer =
                  filteredServices.find((offer) => offer.id === value) || null

                return (
                  <div>
                    <ComboBox
                      id={'item-' + index + 'service'}
                      value={selectedOffer}
                      onChange={(serviceOffered) => {
                        onChange(serviceOffered?.id)

                        const price = serviceOffered?.price
                          ? Number(serviceOffered.price)
                          : 0

                        setValue(`items.${index}.price`, price)
                      }}
                      options={filteredServices}
                      notFoundMessage="Serviço não encontrado"
                      setQuery={setServiceQuery}
                      displayValue={(option) => option?.service?.name ?? ''}
                      inputClassName={comboboxInputWidth}
                      wrapperClassName="mb-1"
                      label={index === 0 ? 'Serviço' : ''}
                      placeholder="Buscar serviço..."
                    />
                    {error && <ErrorMessage message={error.message} />}
                  </div>
                )
              }}
            />
            <Controller
              name={`items.${index}.price`}
              control={control}
              render={({ field: { value, onChange } }) => {
                const formattedValue = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(value) || 0)

                return (
                  <Input
                    id={'item-' + index + 'price'}
                    type="text"
                    variant="solid"
                    wrapperClassName="w-[82px]"
                    inputClassName="rounded-lg w-[82px] text-primary-0"
                    label={index === 0 ? 'Valor' : ''}
                    placeholder="R$"
                    value={formattedValue}
                    onChange={(e) => {
                      const rawValue = e.target.value
                        .replace(/[^\d,]/g, '')
                        .replace(',', '.')
                      onChange(Number(rawValue))
                    }}
                  />
                )
              }}
            />
            <Controller
              name={`items.${index}.discount`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={'item-' + index + 'discount'}
                  type="text"
                  variant="solid"
                  wrapperClassName="w-12"
                  inputClassName="rounded-lg w-12 text-primary-0"
                  label={index === 0 ? 'Desc.' : ''}
                  placeholder="%"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
          {paymentItems.length > 1 && index !== 0 && (
            <TrashIcon
              className="size-6 text-[#B19B86] hover:text-primary-0 cursor-pointer mt-2"
              onClick={() => removeItems(index)}
              title="Remover serviço"
            />
          )}
        </div>
      ))}
      <Button
        label={
          paymentItems.length >= 5
            ? 'Limite atingido'
            : 'Adicionar outro serviço'
        }
        onClick={() =>
          appendItems([{ offerId: '', quantity: 1, price: 0, discount: 0 }])
        }
        disabled={paymentItems.length >= 5}
        variant="text-only"
        type="button"
      />
      <hr className="border-t border-secondary-200" />
      <div className="flex justify-between">
        <p className="text-base font-bold">Valor Total</p>
        <p className="text-base">
          R$ {totalAmount.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  )
}

export default SelectServicesField
