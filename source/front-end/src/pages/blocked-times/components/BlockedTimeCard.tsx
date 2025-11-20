import {
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { BlockedTime } from '../types'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/16/solid'
import { firstLetterOfWordToUpperCase } from '../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import { UserType } from '../../../store/auth/types'
import { UserCanAccessContainer } from '../../../components/authorization/UserCanAccessContainer'

interface BlockedTimeCardProps {
  blockedtime: BlockedTime
  onEdit: (blockedtime: BlockedTime) => void
  onDelete: (blockedtime: BlockedTime) => void
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

function BlockedTimeCard({
  blockedtime,
  onEdit,
  onDelete,
}: BlockedTimeCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 bg-[#222222] w-full text-left px-6 py-6 rounded-2xl">
      {/* Informations - Left Side */}
      <div className="flex-1 min-w-0">
        {/* Informations - Title */}
        <h3 className="text-base font-medium text-white truncate group-hover:text-[#B19B86] transition-colors">
          {firstLetterOfWordToUpperCase(
            blockedtime.reason.toLowerCase().slice(0, 30),
          )}
        </h3>
        <h4 className="mt-0.5 text-gray-400 text-xs">
          Última atualização às
          {' ' +
            new Date(blockedtime.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
        </h4>
        <div>
          {/* Informations - Status Badge */}
          <div className="flex items-center gap-2 mt-1">
            {getIsActiveBadge(blockedtime.isActive)}
          </div>
          {/* Informations - Owner Badge */}
          <div className="flex items-center gap-2 mt">
            <span
              className="inline-flex items-center gap-1 py-0.5 text-sm text-secondary-200 font-light
        "
            >
              <UserIcon className="size-4 " />
              {firstLetterOfWordToUpperCase(blockedtime.professional.name)}
            </span>
          </div>
        </div>
      </div>
      {/* Actions - Right Side */}
      <div className="flex gap-2 shrink-0">
        <UserCanAccessContainer
          strategy="ANY"
          allowedPermissions={[
            'blocked_time.edit_all',
            'blocked_time.edit_own',
          ]}
          allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
        >
          <button
            onClick={() => onEdit(blockedtime)}
            className="p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
            title="Editar serviço"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </button>
        </UserCanAccessContainer>

        <UserCanAccessContainer
          strategy="ANY"
          allowedPermissions={[
            'blocked_time.delete_all',
            'blocked_time.delete_own',
          ]}
          allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
        >
          <button
            onClick={() => onDelete(blockedtime)}
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

export { BlockedTimeCard }
