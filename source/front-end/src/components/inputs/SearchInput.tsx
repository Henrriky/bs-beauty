import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  onSearch?: (value: string) => void
  enableDebouncing?: boolean
  debounceMs?: number
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  onSearch,
  enableDebouncing = false,
  debounceMs = 500,
  placeholder = 'Pesquisar...',
  className = '',
  'aria-label': ariaLabel,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value)

  // Sincronizar valor interno com prop external
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Lógica de debounce
  useEffect(() => {
    if (!enableDebouncing || !onSearch) return

    const timeoutId = setTimeout(() => {
      onSearch(internalValue)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [internalValue, enableDebouncing, onSearch, debounceMs])

  const handleInputChange = (newValue: string) => {
    setInternalValue(newValue)
    if (!enableDebouncing) {
      onChange(newValue)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (onSearch) {
        onSearch(internalValue)
      }
    }
  }

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(internalValue)
    }
  }

  const handleClear = () => {
    const newValue = ''
    setInternalValue(newValue)
    onChange(newValue)
    onClear?.()
    if (enableDebouncing && onSearch) {
      onSearch(newValue)
    }
  }

  return (
    <div
      className={`flex items-stretch h-[42px] w-full border border-[#3B3B3B] focus-within:ring-1 focus-within:border-[#B19B86] rounded-md ${className}`}
    >
      {/* Input */}
      <div className="flex items-center px-3 flex-1">
        <input
          type="text"
          className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-[#bebebe] text-sm placeholder:text-[#bebebe]/70"
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label={ariaLabel || placeholder}
        />
      </div>

      {internalValue && (
        <>
          <div className="h-full w-[1px] bg-[#3B3B3B]/50" />
          <div className="flex items-center px-3">
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#bebebe] hover:text-[#B19B86] transition-colors duration-200"
              title="Limpar busca"
              aria-label="Limpar busca"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* Botão de pesquisa na direita */}
      {onSearch && (
        <>
          <div className="h-full w-[1px] bg-[#3B3B3B]/50" />
          <div className="flex items-center px-3">
            <button
              type="button"
              onClick={handleSearchClick}
              className="p-1 text-[#bebebe] hover:text-[#B19B86] hover:cursor-pointer transition-colors duration-200"
              title="Pesquisar"
              aria-label="Pesquisar"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
