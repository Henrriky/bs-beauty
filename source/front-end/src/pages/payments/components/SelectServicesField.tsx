import { CreatePaymentRecordFormData, PaymentItem } from '../types/types'
import { Input } from '../../../components/inputs/Input'
import ComboBox from '../../../components/combobox/ComboBox'
import { Button } from '../../../components/button/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import useAppSelector from '../../../hooks/use-app-selector'
import { professionalAPI } from '../../../store/professional/professional-api'
import { useState } from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'

interface SelectServicesFieldProps {
  totalAmount: number
  paymentItems: PaymentItem
  control: Control<CreatePaymentRecordFormData>
  appendItems: (item: PaymentItem) => void
  removeItems: (index: number) => void
  setValue: UseFormSetValue<CreatePaymentRecordFormData>
}

function SelectServicesField({
  totalAmount,
  paymentItems,
  control,
  appendItems,
  removeItems,
  setValue,
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

  return (
    <div className="flex flex-col gap-3 animate-fadeIn text-primary-0">
      <p className="text-sm w-">Serviços prestados</p>
      {paymentItems.map((item, index) => (
        <div key={item.id} className="flex gap-3 items-start">
          <div className="flex gap-2 items-start">
            <Controller
              name={`items.${index}.quantity`}
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
              render={({ field: { value, onChange } }) => {
                const selectedOffer =
                  filteredServices.find((offer) => offer.id === value) || null

                return (
                  <ComboBox
                    id={'item-' + index + 'service'}
                    value={selectedOffer}
                    onChange={(serviceOffered) => {
                      onChange(serviceOffered?.id ?? '')
                      setValue(
                        `items.${index}.price`,
                        Number(serviceOffered?.price) ?? 0,
                      )
                    }}
                    options={filteredServices}
                    notFoundMessage="Serviço não encontrado"
                    setQuery={setServiceQuery}
                    displayValue={(option) => option?.service?.name ?? ''}
                    inputClassName="w-42"
                    label={index === 0 ? 'Serviço' : ''}
                    placeholder="Buscar serviço..."
                  />
                )
              }}
            />
            <Controller
              name={`items.${index}.price`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id={'item-' + index + 'price'}
                  type="text"
                  variant="solid"
                  wrapperClassName="w-[82px]"
                  inputClassName="rounded-lg w-[82px] text-primary-0"
                  label={index === 0 ? 'Valor' : ''}
                  placeholder="R$"
                  value={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)}
                  onChange={(e) => {
                    const rawValue = e.target.value
                      .replace(/[^0-9,]/g, '')
                      .replace(',', '.')
                    onChange(Number(rawValue))
                  }}
                />
              )}
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
