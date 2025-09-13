import { useState, useMemo } from 'react'
import { Input } from '../../Input'
import { Button } from '../../../button/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

const PREDEFINED_METHODS = [
  { value: 'credit-card', label: 'Cartão de Crédito' },
  { value: 'pix', label: 'Pix' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'bank-slip', label: 'Boleto Bancário' },
  { value: 'bank-transfer', label: 'Transferência' },
]

type PaymentMethod = {
  name: string
}

type PaymentMethodsInputProps = {
  value?: PaymentMethod[]
  onChange: (value: PaymentMethod[]) => void
}

export default function PaymentMethodsInput({
  value = [],
  onChange,
}: PaymentMethodsInputProps) {
  const [customMethodName, setCustomMethodName] = useState('')

  const allDisplayableMethods = useMemo(() => {
    const customMethodsInValue = value
      .filter(
        (method) =>
          !PREDEFINED_METHODS.some(
            (predefined) => predefined.value === method.name,
          ),
      )
      .map((method) => ({ value: method.name, label: method.name }))

    return [...PREDEFINED_METHODS, ...customMethodsInValue]
  }, [value])

  const handleToggleMethod = (methodValue: string) => {
    const isAlreadySelected = value.some((m) => m.name === methodValue)
    const newSelectedMethods = isAlreadySelected
      ? value.filter((m) => m.name !== methodValue)
      : [...value, { name: methodValue }]
    onChange(newSelectedMethods)
  }

  const handleAddCustomMethod = () => {
    const trimmedName = customMethodName.trim()
    if (trimmedName && !value.some((m) => m.name === trimmedName)) {
      onChange([...value, { name: trimmedName }])
      setCustomMethodName('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddCustomMethod()
    }
  }

  return (
    <>
      <label className="text-sm text-[#D9D9D9]">
        Métodos de Pagamento Aceitos
      </label>
      <div className="mt-4 flex flex-wrap gap-4 justify-between items-center text-sm">
        {allDisplayableMethods.map((method) => {
          const isSelected = value.some((m) => m.name === method.value)
          return (
            <label
              key={method.value}
              className={`flex cursor-pointer items-center justify-center border rounded-full w-[30%] h-12 transition-all ${
                isSelected
                  ? 'bg-[#B19B86] text-white border-[#B19B86]'
                  : 'border-[#B19B86] text-primary-100 hover:bg-[#B19B86] hover:bg-opacity-10'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => handleToggleMethod(method.value)}
              />
              <span className="text-center px-2">{method.label}</span>
            </label>
          )
        })}
      </div>

      <div className="mt-6">
        <div className="mt-2 flex items-center gap-2">
          <Input
            id="custom-method-input"
            type="text"
            value={customMethodName}
            onChange={(e) => setCustomMethodName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Vale Refeição"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <Button
            type="button"
            variant="outline"
            outlineVariantBorderStyle="dashed"
            onClick={handleAddCustomMethod}
            label={
              <div className="flex justify-center items-center gap-1">
                <PlusIcon className="size-5" />
                <span>Clique para um novo</span>
              </div>
            }
          >
            Adicionar
          </Button>
        </div>
      </div>
    </>
  )
}
