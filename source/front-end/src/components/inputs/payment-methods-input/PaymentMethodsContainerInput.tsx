import { useState, useMemo, useRef } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Input } from '../Input'
import { Button } from '../../button/Button'

const PREDEFINED_METHODS = [
  { value: 'credit-card', label: 'Cartão de Crédito' },
  { value: 'pix', label: 'Pix' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'bank-transfer', label: 'Transferência' },
  { value: 'debit-card', label: 'Cartão de Débito' },
  { value: 'payment-link', label: 'Link de Pagamento' },
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
  const [selectOpen, setSelectOpen] = useState(false)
  const selectRef = useRef<HTMLSelectElement | null>(null)

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

  const availableMethodsInDropdown = useMemo(() => {
    return PREDEFINED_METHODS.filter(
      (predefined) =>
        !value.some((selected) => selected.name === predefined.value),
    )
  }, [value])

  const handleAddMethod = (methodValue: string) => {
    if (methodValue && !value.some((m) => m.name === methodValue)) {
      onChange([...value, { name: methodValue }])
    }
  }

  const handleRemoveMethod = (methodValue: string) => {
    const newSelectedMethods = value.filter((m) => m.name !== methodValue)
    onChange(newSelectedMethods)
  }

  const handleAddCustomMethod = () => {
    const trimmedName = customMethodName.trim()
    if (trimmedName) {
      handleAddMethod(trimmedName)
      setCustomMethodName('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddCustomMethod()
    }
  }

  const findLabelForValue = (methodValue: string) => {
    const method = allDisplayableMethods.find((m) => m.value === methodValue)
    return method ? method.label : methodValue
  }

  return (
    <div className="w-full max-w-lg mx-auto text-white">
      <label className="text-sm font-medium text-[#D9D9D9]">
        Métodos de Pagamento Aceitos
      </label>

      <div className="mt-2 flex min-h-[48px] flex-wrap items-center border border-[#B19B86] gap-2 rounded-3xl p-2 bg-[#1a1a1a]">
        {value.length > 0 ? (
          value.map((method) => (
            <span
              key={method.name}
              className="flex items-center gap-2 rounded-full bg-[#7a6f65] px-3 py-1 text-sm text-white animate-fade-in"
            >
              {findLabelForValue(method.name)}
              <button
                type="button"
                onClick={() => handleRemoveMethod(method.name)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-white transition-colors hover:bg-red-500"
                aria-label={`Remover ${findLabelForValue(method.name)}`}
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))
        ) : (
          <span className="px-2 text-sm text-gray-400">
            Nenhum método selecionado.
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        <div>
          <label htmlFor="payment-method-select" className="sr-only">
            Adicionar método de pagamento da lista
          </label>
          <div className="relative">
            <select
              ref={selectRef}
              id="payment-method-select"
              value=""
              onChange={(e) => {
                handleAddMethod(e.target.value)
                setSelectOpen(false)
              }}
              onFocus={() => setSelectOpen(true)}
              onMouseDown={() => setSelectOpen((s) => !s)}
              onBlur={() => setSelectOpen(false)}
              className="appearance-none h-12 w-full cursor-pointer rounded-full border border-[#B19B86] bg-[#1a1a1a] px-3 pr-10 text-white focus:border-primary-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={availableMethodsInDropdown.length === 0}
            >
              <option value="" disabled className="text-gray-500">
                {availableMethodsInDropdown.length > 0
                  ? 'Adicionar da lista'
                  : 'Opções esgotadas'}
              </option>
              {availableMethodsInDropdown.map((method) => (
                <option
                  key={method.value}
                  value={method.value}
                  className="bg-[#2a2a2a] text-white"
                >
                  {method.label}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-6 h-5 w-5 text-gray-400 transition-transform duration-150 ${selectOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <Input
            id="custom-method-input"
            type="text"
            value={customMethodName}
            onChange={(e) => setCustomMethodName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ou digite um novo"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCustomMethod}
            disabled={!customMethodName.trim()}
            label={<PlusIcon className="size-5" />}
            className="max-w-40 sm:w-12 flex"
          ></Button>
        </div>
      </div>
    </div>
  )
}
