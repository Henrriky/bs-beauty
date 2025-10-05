import { useState } from 'react'
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { Checkbox } from '../../../components/inputs/Checkbox'
import { Button } from '../../../components/button/Button'
import SearchInput from '../../../components/inputs/SearchInput'
import Loading from '../../../components/feedback/Loading'
import Tooltip from '../../../components/tooltip/Tooltip'
import { Role } from '../../roles/types'
import { useProfessionalRolesManager } from '../hooks/useProfessionalRolesManager'

interface ProfessionalRolesManagerProps {
  professionalId: string
  professionalName: string
  isOpen: boolean
}

const MAX_ROLES_DISPLAY = 5

export function ProfessionalRolesManager({
  professionalId,
  professionalName,
  isOpen,
}: ProfessionalRolesManagerProps) {
  const {
    searchTerm,
    selectedRoleIds,
    filteredRoles,
    hasChanges,
    pendingChanges,
    isLoadingRoles,
    isLoadingProfessionalRoles,
    isSaving,
    setSearchTerm,
    toggleRole,
    saveChanges,
    resetChanges,
  } = useProfessionalRolesManager({ professionalId, isOpen })

  const [showAllRoles, setShowAllRoles] = useState(false)

  // Group roles by category or show all
  const rolesToShow = showAllRoles
    ? filteredRoles
    : filteredRoles.slice(0, MAX_ROLES_DISPLAY)

  if (isLoadingRoles || isLoadingProfessionalRoles) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-medium text-primary-0 mb-1">
            Profissional:{' '}
            <span className="font-medium text-primary-200">
              {professionalName}
            </span>
          </h3>
        </div>
      </div>

      {/* Search */}
      <div>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar funcões por nome..."
          aria-label="Buscar funções por nome"
          className="w-full"
        />
      </div>

      {/* Roles Statistics */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-primary-0">
          Funções disponíveis
        </h4>
        <span className="text-sm text-primary-200">
          {selectedRoleIds.length} de {filteredRoles.length} selecionadas
        </span>
      </div>

      {/* Roles List */}
      <div className="space-y-3 max-h-52 overflow-y-auto">
        {rolesToShow.length === 0 ? (
          <div className="text-center py-8 text-primary-300">
            <InformationCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma role encontrada</p>
          </div>
        ) : (
          <>
            {rolesToShow.map((role: Role) => (
              <RoleItem
                key={role.id}
                role={role}
                isSelected={selectedRoleIds.includes(role.id)}
                onToggle={() => toggleRole(role.id)}
                isAdding={pendingChanges.toAdd.includes(role.id)}
              />
            ))}

            {/* Show More/Less Button */}
            {filteredRoles.length > MAX_ROLES_DISPLAY && (
              <button
                type="button"
                onClick={() => setShowAllRoles(!showAllRoles)}
                className="w-full py-2 px-4 text-sm text-primary-200 hover:text-primary-0 transition-colors"
              >
                {showAllRoles
                  ? 'Mostrar menos'
                  : `Mostrar mais (${filteredRoles.length - MAX_ROLES_DISPLAY} restantes)`}
              </button>
            )}
          </>
        )}
        {/* Unsaved Changes Warning */}
        {hasChanges && (
          <div className="flex items-center gap-2 text-yellow-400 ml-2">
            <ExclamationTriangleIcon className="size-5" />
            <div className="flex-1">
              <p className="text-xs text-yellow-200">
                Alterações não salvas detectadas
              </p>
              <p className="text-xs text-yellow-300">
                {pendingChanges.toAdd.length > 0 &&
                  `${pendingChanges.toAdd.length} função(s) para adicionar`}
                {pendingChanges.toAdd.length > 0 &&
                  pendingChanges.toRemove.length > 0 &&
                  ', '}
                {pendingChanges.toRemove.length > 0 &&
                  `${pendingChanges.toRemove.length} função(s) para remover`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          label="Descartar"
          variant="outline"
          onClick={resetChanges}
          disabled={!hasChanges || isSaving}
        />
        <Button
          label={isSaving ? 'Salvando...' : 'Salvar alterações'}
          onClick={saveChanges}
          disabled={!hasChanges || isSaving}
        />
      </div>
    </div>
  )
}

interface RoleItemProps {
  role: Role
  isSelected: boolean
  onToggle: () => void
  isAdding: boolean
}

function RoleItem({ role, isSelected, onToggle, isAdding }: RoleItemProps) {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all border-primary-600 hover:border-primary-500
        ${
          isAdding
            ? 'border-primary-400 border-2'
            : 'border-primary-600 hover:border-primary-500'
        }
      `}
    >
      <Checkbox
        id={`role-${role.id}`}
        checked={isSelected}
        onChange={onToggle}
        className="mt-0.5"
        disabled={false}
      />

      <div className="flex-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-medium text-primary-0 truncate">
            {role.name}
          </h5>
          <Tooltip content={role?.description || 'Sem descrição'}>
            <InformationCircleIcon className="w-4 h-4 text-primary-200 hover:text-primary-100 cursor-help transition-colors" />
          </Tooltip>
        </div>
        {!role.isActive && (
          <span className="inline-flex items-center gap-1 py-0.5 text-sm text-red-500 font-light">
            <ExclamationCircleIcon className="size-4 text-red-500" />
            Inativo
          </span>
        )}
      </div>
    </div>
  )
}
