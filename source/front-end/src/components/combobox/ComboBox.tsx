import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { InputProps } from '../inputs/Input'
import clsx from 'clsx'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ComboBoxProps<T> extends InputProps {
  options: T[]
  notFoundMessage: string
  placeholder?: string
  setQuery: (query: string) => void
  getOptionLabel: (option: T) => string | null
  getOptionValue?: (option: T) => T
  getOptionIcon?: (option: T) => React.ReactNode
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
  setQuery,
  getOptionLabel,
  getOptionValue,
  getOptionIcon,
}: ComboBoxProps<T>) {
  const [selected, setSelected] = useState<T | null>(null)

  return (
    <div className={clsx('flex gap-3 flex-col items-start', wrapperClassName)}>
      <Combobox
        name={id}
        onClose={() => setQuery('')}
        value={selected}
        onChange={(value) => setSelected(value)}
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
            value={getOptionLabel(selected as T) || ''}
            placeholder={placeholder}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>
        {options && options.length > 0 ? (
          <ComboboxOptions className="bg-[#181818] text-primary-0 rounded-lg shadow-lg w-full max-h-20 overflow-y-auto">
            {options.map((option, index) => (
              <ComboboxOption
                key={'option-' + index}
                value={
                  getOptionValue
                    ? getOptionValue(option)
                    : getOptionLabel(option)
                }
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
                  {getOptionLabel(option)}
                </div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        ) : (
          <div className="w-full bg-[#181818] text-primary-0 rounded-lg shadow-lg px-4 py-2 text-center">
            {notFoundMessage}
          </div>
        )}
      </Combobox>
    </div>
  )
}

export default ComboBox
