import { Professional } from '../../../store/auth/types'
import { CogIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'

interface ProfessionalCardProps {
  professional: Professional
  onDelete: (professional: Professional) => void
  onManageProfessionalRoles: (professional: Professional) => void
}

export function ProfessionalCard({
  professional,
  onDelete,
  onManageProfessionalRoles,
}: ProfessionalCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 bg-[#222222] w-full text-left px-6 py-6 rounded-2xl">
      {/* Informations - Left Side */}
      <div className="flex-1 min-w-0">
        {/* Informations - Title */}
        <h3 className="text-base font-medium text-white truncate group-hover:text-[#B19B86] transition-colors">
          {firstLetterOfWordToUpperCase(professional.name || 'Sem nome')}
        </h3>

        {/* Informations - Description */}
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {professional.email || 'Sem descrição'}
        </p>

        {/* Informations - Status Badge */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="mt-4 inline-flex items-center gap-1 py-0.5 text-sm text-secondary-200 font-light
        "
          >
            <UserGroupIcon className="size-4 " />
            {professional.userType === 'MANAGER' ? 'Gerente' : 'Profissional'}
          </span>
        </div>
      </div>
      {/* Actions - Right Side */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onManageProfessionalRoles(professional)}
          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all"
          title="Gerenciar permissões"
        >
          <CogIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(professional)}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
          title="Excluir serviço"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
