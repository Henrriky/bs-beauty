import { useState } from 'react'
import { PaymentItem } from '../types/types'
import { Input } from '../../../components/inputs/Input'
import ComboBox from '../../../components/combobox/ComboBox'
import { Button } from '../../../components/button/Button'
import { TrashIcon } from '@heroicons/react/24/outline'
import useAppSelector from '../../../hooks/use-app-selector'
import { professionalAPI } from '../../../store/professional/professional-api'

function SelectServicesField() {
  const { data: professional } =
    professionalAPI.useFetchServicesOfferedByProfessionalQuery({
      professionalId: useAppSelector((state) => state.auth.user?.id as string),
    })

  const [paymentItems, setPaymentItems] = useState<PaymentItem>([
    { offerId: '', quantity: 1, price: 0, discount: 0 },
  ])

  console.log({ paymentItems })

  const addPaymentItem = () => {
    if (paymentItems.length < 5) {
      setPaymentItems([
        ...paymentItems,
        { offerId: '', quantity: 1, price: 0, discount: 0 },
      ])
    }
  }
  const removePaymentItem = (index: number) => {
    setPaymentItems(paymentItems.filter((_, i) => i !== index))
  }

  const [serviceQuery, setServiceQuery] = useState('')
  const filteredServices =
    serviceQuery === ''
      ? professional?.professional.offers || []
      : (professional?.professional.offers || []).filter((offer) =>
          offer.service.name.toLowerCase().includes(serviceQuery.toLowerCase()),
        )

  return (
    <div className="flex flex-col gap-3 animate-fadeIn">
      <p className="text-sm text-primary-0 w-">Serviços prestados</p>
      {paymentItems.map((item, index) => (
        <div key={index} className="flex gap-3 items-start">
          <div className="flex gap-2 items-start">
            <Input
              id={'item-' + index + 'quantity'}
              type="text"
              min={1}
              variant="solid"
              inputClassName="rounded-lg w-10"
              label={index === 0 ? 'Qtd.' : ''}
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...paymentItems]
                newItems[index].quantity = Number(e.target.value)
                setPaymentItems(newItems)
              }}
            />
            <ComboBox
              type="text"
              id={'item-' + index + 'service'}
              options={filteredServices}
              notFoundMessage="Serviço não encontrado"
              setQuery={setServiceQuery}
              getOptionLabel={(option) => option?.service?.name ?? ''}
              getOptionValue={(option) => option}
              inputClassName="w-44"
              label={index === 0 ? 'Serviço' : ''}
              placeholder="Buscar serviço..."
            />
            <Input
              id={'item-' + index + 'price'}
              type="text"
              variant="solid"
              inputClassName="rounded-lg w-[82px]"
              label={index === 0 ? 'Valor' : ''}
              placeholder="R$"
              value={new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(item.price)}
              onChange={(e) => {
                const newItems = [...paymentItems]
                const rawValue = e.target.value
                  .replace(/[^0-9,]/g, '')
                  .replace(',', '.')
                newItems[index].price = Number(rawValue)
                setPaymentItems(newItems)
              }}
            />
            <Input
              id={'item-' + index + 'discount'}
              type="text"
              variant="solid"
              inputClassName="rounded-lg w-16"
              label={index === 0 ? 'Desc.' : ''}
              placeholder="%"
              value={item.discount}
              onChange={(e) => {
                const newItems = [...paymentItems]
                newItems[index].discount = Number(e.target.value)
                setPaymentItems(newItems)
              }}
            />
          </div>
          {paymentItems.length > 1 && index !== 0 && (
            <TrashIcon
              className="size-6 text-[#B19B86] hover:text-primary-0 cursor-pointer mt-2"
              onClick={() => removePaymentItem(index)}
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
        onClick={addPaymentItem}
        disabled={paymentItems.length >= 5}
        variant="text-only"
        type="button"
      />
    </div>
  )
}

export default SelectServicesField
