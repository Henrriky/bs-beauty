import { useState, useRef, useEffect } from 'react'
import { Professional } from '../../../store/auth/types'

interface ProfessionalSelectorProps {
  professionals: Professional[]
  selectedProfessional: Professional | null
  onSelect: (professional: Professional | null) => void
}

export default function ProfessionalSelector({
  professionals,
  selectedProfessional,
  onSelect,
}: ProfessionalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelectProfessional = (professional: Professional) => {
    onSelect(professional)
    setIsOpen(false)
  }

  const handleClearSelection = () => {
    onSelect(null)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-[#979797] mb-2">Profissional</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#1E1E1E] border border-[#535353] rounded-lg px-4 py-3 text-left text-[#D9D9D9] focus:outline-none focus:border-[#A4978A] transition-colors flex items-center justify-between"
        >
          {selectedProfessional ? (
            <div className="flex items-center gap-3">
              <img
                src={
                  selectedProfessional.profilePhotoUrl || '/default-avatar.png'
                }
                alt={selectedProfessional.name || 'Professional'}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{selectedProfessional.name || 'Sem nome'}</span>
            </div>
          ) : (
            <span className="text-[#979797]">Meu perfil (padrão)</span>
          )}
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#1E1E1E] border border-[#535353] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={handleClearSelection}
              className={`w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors flex items-center gap-3 ${
                !selectedProfessional ? 'bg-[#262626]' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#A4978A] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#1E1E1E]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-[#D9D9D9]">Meu perfil (padrão)</span>
            </button>

            {professionals.map((professional) => (
              <button
                key={professional.id}
                type="button"
                onClick={() => handleSelectProfessional(professional)}
                className={`w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors flex items-center gap-3 ${
                  selectedProfessional?.id === professional.id
                    ? 'bg-[#262626]'
                    : ''
                }`}
              >
                <img
                  src={professional.profilePhotoUrl || '/default-avatar.png'}
                  alt={professional.name || 'Professional'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-[#D9D9D9]">
                  {professional.name || 'Sem nome'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
