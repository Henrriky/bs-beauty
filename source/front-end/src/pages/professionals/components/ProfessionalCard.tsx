import { Professional, UserType } from '../../../store/auth/types'
import { TrashIcon } from '@heroicons/react/24/outline'

interface ProfessionalCardProps {
  professional: Professional
  onDelete: (professional: Professional) => void
}

export function ProfessionalCard({
  professional,
  onDelete,
}: ProfessionalCardProps) {
  return (
    <div className="p-4 mb-4 bg-[#222222] text-primary-0 rounded-lg shadow-md relative">
      <p className="text-sm font-bold ">Nome:</p>
      <p className="text-xs">
        {professional.name === 'Usuário'
          ? 'Profissional com cadastro não finalizado'
          : professional.name}
      </p>
      <p className="text-sm font-bold mt-2">E-mail:</p>
      <p className="text-xs">{professional.email}</p>
      <p className="text-sm font-bold mt-2">Cargo:</p>
      <p className="text-xs">
        {professional.userType === UserType.MANAGER
          ? 'Gerente'
          : 'Profissional'}
      </p>

      {professional.userType !== UserType.MANAGER && (
        <button
          className="absolute top-2 right-2"
          onClick={() => onDelete(professional)}
        >
          <TrashIcon
            className="size-5 transition-all"
            onClick={() => onDelete(professional)}
            title="Excluir"
          />
        </button>
      )}
    </div>
  )
}
