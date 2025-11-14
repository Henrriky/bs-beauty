import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Role } from '../types'

interface RolesTableProps {
  roles: Role[]
  isLoading: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RolesTable({
  roles,
  isLoading,
  onEdit,
  onDelete,
}: RolesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-primary-800 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 bg-primary-600 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="bg-primary-800 rounded-2xl p-12 text-center">
        <p className="text-primary-100 text-lg mb-2">Nenhuma role encontrada</p>
        <p className="text-primary-200 text-sm">
          Tente ajustar os filtros ou criar uma nova role
        </p>
      </div>
    )
  }

  return (
    <div className="bg-primary-800 rounded-2xl overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-600">
              <th className="text-left p-4 text-primary-0 font-medium">Nome</th>
              <th className="text-left p-4 text-primary-0 font-medium">
                Descrição
              </th>
              <th className="text-left p-4 text-primary-0 font-medium">
                Status
              </th>
              <th className="text-left p-4 text-primary-0 font-medium">
                Usuários
              </th>
              <th className="text-left p-4 text-primary-0 font-medium">
                Permissões
              </th>
              <th className="text-center p-4 text-primary-0 font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b border-primary-700 hover:bg-primary-700 transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="text-primary-0 font-medium">{role.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-primary-100 text-sm max-w-xs">
                    {role.description || 'Sem descrição'}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      role.isActive
                        ? 'bg-green-900 text-green-300 border border-green-800'
                        : 'bg-red-900 text-red-300 border border-red-800'
                    }`}
                  >
                    {role.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-primary-100 text-sm">
                    {/* TODO: Implementar contagem de usuários associados */}-
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-primary-100 text-sm">
                    {/* TODO: Implementar contagem de permissões associadas */}-
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(role)}
                      className="p-2 text-secondary-200 hover:text-secondary-100 hover:bg-primary-600 rounded-lg transition-colors duration-200"
                      title="Editar role"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(role)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                      title="Excluir role"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 p-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-primary-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-primary-0 font-medium">{role.name}</h3>
                <p className="text-primary-100 text-sm mt-1">
                  {role.description || 'Sem descrição'}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  role.isActive
                    ? 'bg-green-900 text-green-300 border border-green-800'
                    : 'bg-red-900 text-red-300 border border-red-800'
                }`}
              >
                {role.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-primary-600">
              <div className="text-sm text-primary-200">
                Usuários: - | Permissões: -
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(role)}
                  className="p-2 text-secondary-200 hover:text-secondary-100 hover:bg-primary-600 rounded-lg transition-colors duration-200"
                  title="Editar role"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(role)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  title="Excluir role"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
