import {
  CogIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { Role } from '../types'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/16/solid'
import { UserType } from '../../../store/auth/types'
import { UserCanAccessContainer } from '../../../components/authorization/UserCanAccessContainer'

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onManagePermissions: (role: Role) => void
}

const getIsActiveBadge = (isActive: boolean) => {
  switch (isActive) {
    case true:
      return (
        <span
          className="mt-4 inline-flex items-center gap-1 py-0.5 text-sm text-green-600 font-light
        "
        >
          <CheckCircleIcon className="size-4 text-green-600" />
          Ativo
        </span>
      )
    case false:
      return (
        <span
          className="mt-4 inline-flex items-center gap-1 py-0.5 text-sm text-red-500 font-light
        "
        >
          <ExclamationCircleIcon className="size-4 text-red-500" />
          Inativo
        </span>
      )
  }
}

function RoleCard({
  role,
  onEdit,
  onDelete,
  onManagePermissions,
}: RoleCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 bg-[#222222] w-full text-left px-6 py-6 rounded-2xl">
      {/* Informations - Left Side */}
      <div className="flex-1 min-w-0">
        {/* Informations - Title */}
        <h3 className="text-base font-medium text-white truncate group-hover:text-[#B19B86] transition-colors">
          {role.name}
        </h3>

        {/* Informations - Description */}
        <p className="mt-1 text-xs text-gray-400 line-clamp-2">
          {role.description || 'Sem descrição'}
        </p>

        {/* Informations - Status Badge */}
        <div className="flex items-center gap-2 mt-2">
          {getIsActiveBadge(role.isActive)}
        </div>
      </div>
      {/* Actions - Right Side */}
      <div className="flex gap-2 shrink-0">
        <UserCanAccessContainer
          allowedPermissions={['roles.change_permissions']}
          allowedUserTypes={[UserType.MANAGER]}
        >
          <button
            onClick={() => onManagePermissions(role)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-all"
            title="Gerenciar permissões"
          >
            <CogIcon className="w-4 h-4" />
          </button>
        </UserCanAccessContainer>
        <UserCanAccessContainer
          allowedPermissions={['roles.edit']}
          allowedUserTypes={[UserType.MANAGER]}
        >
          <button
            onClick={() => onEdit(role)}
            className="p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
            title="Editar serviço"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </button>
        </UserCanAccessContainer>

        <UserCanAccessContainer
          allowedPermissions={['roles.delete']}
          allowedUserTypes={[UserType.MANAGER]}
        >
          <button
            onClick={() => onDelete(role)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
            title="Excluir serviço"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </UserCanAccessContainer>
      </div>
    </div>
  )
}

export { RoleCard }
