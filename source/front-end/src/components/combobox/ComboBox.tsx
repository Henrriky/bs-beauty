import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { UseFormRegisterReturn } from 'react-hook-form'
import React from 'react'

type Pager = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

interface ComboBoxProps<T> {
  label?: React.ReactNode
  id?: string
  registration?: UseFormRegisterReturn
  wrapperClassName?: string
  inputClassName?: string
  options: T[]
  notFoundMessage: string
  placeholder?: string
  value: T | null
  displayValue: (option: T) => string
  setQuery: (query: string) => void
  getOptionIcon?: (option: T) => React.ReactNode
  onChange?: (option: T | null) => void
  /** ✅ paginação opcional do dropdown */
  pager?: Pager
}

function ComboBox<T>({
  label,
  id,
  registration,
  wrapperClassName,
  inputClassName,
  options,
  notFoundMessage,
  placeholder,
  value,
  setQuery,
  getOptionIcon,
  displayValue,
  onChange,
  pager,
}: ComboBoxProps<T>) {
  const canPrev = pager ? pager.currentPage > 1 : false
  const canNext = pager ? pager.currentPage < pager.totalPages : false

  return (
    <div className={clsx('flex gap-3 flex-col items-start', wrapperClassName)}>
      <Combobox
        name={id}
        onClose={() => setQuery('')}
        value={value}
        onChange={onChange}
      >
        {label && (
          <label className="text-sm text-[#D9D9D9]" htmlFor={id}>
            {label}
          </label>
        )}

        {/* wrapper relativo para ancorar o dropdown */}
        <div className="relative w-full">
          <div className="relative w-full" data-hover="true">
            <ComboboxInput
              {...registration}
              id={id}
              className={clsx(
                `w-full text-sm text-primary-0 bg-[#1a1a1a] focus:outline-none cursor-text border border-[#333] rounded-lg pl-2 pr-6 py-[10px] focus-within:border-[#B19B86] transition-colors duration-300 disabled:bg-[#272727] truncate`,
                inputClassName,
              )}
              onChange={(e) => {
                setQuery(e.target.value)
                // opcional: ao alterar query, consumidor pode resetar page externamente
              }}
              placeholder={placeholder}
              displayValue={(option: T | null) =>
                option ? displayValue(option) : ''
              }
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            </ComboboxButton>
          </div>

          {/* dropdown flutuante */}
          <ComboboxOptions
            className={clsx(
              'absolute z-50 mt-1 w-full',
              'bg-[#181818] text-primary-0 rounded-lg shadow-lg',
              'border border-[#333]',
              'max-h-64 overflow-y-auto',
            )}
          >
            {options.length === 0 ? (
              <div className="px-4 py-2 text-center">{notFoundMessage}</div>
            ) : (
              options.map((option, index) => (
                <ComboboxOption
                  key={'option-' + index}
                  value={option}
                  className={({ active, selected }) =>
                    clsx(
                      'px-4 py-2 cursor-pointer text-sm',
                      active && 'bg-[#232323]',
                      selected && 'bg-[#232323] text-[#B19B86] font-semibold',
                    )
                  }
                >
                  <div className="flex items-center">
                    {getOptionIcon && (
                      <span className="mr-2 align-middle">
                        {getOptionIcon(option)}
                      </span>
                    )}
                    {displayValue(option)}
                  </div>
                </ComboboxOption>
              ))
            )}

            {/* ✅ Footer de paginação (só se pager for passado) */}
            {pager && (
              <div className="sticky bottom-0 bg-[#181818] border-t border-[#333]">
                <div className="flex items-center justify-between px-2 py-1">
                  <button
                    type="button"
                    className={clsx(
                      'px-2 py-1 text-xs rounded-md border',
                      canPrev
                        ? 'border-[#3B3B3B] text-[#D9D9D9] hover:bg-[#2A2A2A]'
                        : 'opacity-40 cursor-not-allowed border-[#3B3B3B] text-[#D9D9D9]',
                    )}
                    onMouseDown={(e) => e.preventDefault()} // evita fechar
                    onClick={() => canPrev && pager.onPageChange(pager.currentPage - 1)}
                  >
                    Anterior
                  </button>

                  <div className="text-xs text-[#C0C0C0]">
                    {pager.isLoading ? 'Carregando…' : `Página ${pager.currentPage} de ${pager.totalPages}`}
                  </div>

                  <button
                    type="button"
                    className={clsx(
                      'px-2 py-1 text-xs rounded-md border',
                      canNext
                        ? 'border-[#3B3B3B] text-[#D9D9D9] hover:bg-[#2A2A2A]'
                        : 'opacity-40 cursor-not-allowed border-[#3B3B3B] text-[#D9D9D9]',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => canNext && pager.onPageChange(pager.currentPage + 1)}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  )
}

export default ComboBox
