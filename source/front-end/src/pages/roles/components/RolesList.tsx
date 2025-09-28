import { Role } from '../types'
import { RoleCard } from './RoleCardNew'

interface RolesListProps {
  roles: Role[]
  isLoading: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RolesList({
  roles,
  isLoading,
  onEdit,
  onDelete,
}: RolesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-primary-800 rounded-2xl p-4 animate-pulse"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-primary-600 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-primary-600 rounded w-32"></div>
                </div>
                <div className="h-6 bg-primary-600 rounded-full w-16"></div>
              </div>
              <div className="border-t border-primary-600 pt-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-primary-600 rounded w-20"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-primary-600 rounded"></div>
                    <div className="h-8 w-8 bg-primary-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div>
        <p className="text-primary-100 text-lg mb-2 text-center">
          Nenhuma função encontrada
        </p>
        <p className="text-primary-200 text-sm text-center">
          Tente ajustar os filtros ou criar uma nova função
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center flex-col gap-6">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
