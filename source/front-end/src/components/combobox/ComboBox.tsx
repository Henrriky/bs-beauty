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
}: ComboBoxProps<T>) {
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
        <div className="relative w-full" data-hover="true">
          <ComboboxInput
            {...registration}
            id={id}
            className={clsx(
              `w-full text-sm text-primary-0 bg-[#1a1a1a] focus:outline-none cursor-text border border-[#333] rounded-lg pl-2 pr-6 py-[10px] focus-within:border-[#B19B86] transition-colors duration-300 disabled:bg-[#272727] truncate`,
              inputClassName,
            )}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            displayValue={(option: T | null) =>
              option ? displayValue(option) : ''
            }
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>
        <ComboboxOptions className="bg-[#181818] text-primary-0 rounded-lg shadow-lg w-full max-h-20 overflow-y-auto">
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
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}

export default ComboBox
