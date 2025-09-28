import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Role } from '../types'

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="bg-primary-800 rounded-2xl p-6 space-y-4 hover:bg-primary-700 transition-colors duration-200 w-full">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-primary-0 font-medium text-base mb-2 truncate">
            {role.name}
          </h3>
          {role.description && (
            <p className="text-primary-100 text-sm leading-relaxed line-clamp-3">
              {role.description}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
              role.isActive
                ? 'bg-green-900 text-green-300 border border-green-800'
                : 'bg-red-900 text-red-300 border border-red-800'
            }`}
          >
            {role.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-primary-600">
        <div className="text-sm text-primary-200">
          {/* TODO: Implementar contagem */}
          Usuários: - | Permissões: -
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(role)}
            className="p-2.5 text-secondary-200 hover:text-secondary-100 hover:bg-primary-600 rounded-lg transition-colors duration-200"
            title="Editar role"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            title="Excluir role"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
