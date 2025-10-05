import { useState } from 'react'
import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { Checkbox } from '../../../components/inputs/Checkbox'
import { Button } from '../../../components/button/Button'
import SearchInput from '../../../components/inputs/SearchInput'
import Loading from '../../../components/feedback/Loading'
import { ErrorMessage } from '../../../components/feedback/ErrorMessage'
import Tooltip from '../../../components/tooltip/Tooltip'
import { useRolePermissionsManager } from '../hooks/useRolePermissionsManager'
import { getPermissionTranslationByCompositeKey } from '../utils'

interface RolePermissionsManagerProps {
  roleId: string
  roleName: string
}

export function RolePermissionsManager({
  roleId,
  roleName,
}: RolePermissionsManagerProps) {
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set(),
  )

  const {
    searchTerm,
    tempPermissions,
    hasUnsavedChanges,
    permissionsByResource,
    totalSelectedCount,
    totalAvailableCount,
    isLoading,
    isSaving,
    permissionsError,
    setSearchTerm,
    handlePermissionToggle,
    handleResourceToggle,
    handleSaveChanges,
    handleDiscardChanges,
    getResourceStats,
  } = useRolePermissionsManager({ roleId })

  const toggleResourceExpanded = (resource: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(resource)) {
        newSet.delete(resource)
      } else {
        newSet.add(resource)
      }
      return newSet
    })
  }

  if (isLoading) {
    return <Loading />
  }

  if (permissionsError) {
    return <ErrorMessage message="Erro ao carregar permissões" />
  }

  const resourceNames = Object.keys(permissionsByResource).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-medium text-primary-0 mb-1">
            Função:{' '}
            <span className="font-medium text-primary-200">{roleName}</span>
          </h3>
        </div>
      </div>

      {/* Search */}
      <div>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar permissões por nome, recurso ou ação..."
          className="w-full"
        />
      </div>

      {/* Permissions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-primary-0">
            Permissões por Recurso
          </h4>
          <span className="text-sm text-primary-200">
            {totalSelectedCount} de {totalAvailableCount} selecionadas
          </span>
        </div>

        {resourceNames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-primary-200">
              {searchTerm
                ? 'Nenhuma permissão encontrada para esta busca'
                : 'Nenhuma permissão disponível'}
            </p>
          </div>
        ) : (
          <div className="bg-primary-800 rounded-xl p-4 max-h-52 overflow-y-auto">
            <div className="space-y-3">
              {resourceNames.map((resource) => {
                const resourcePermission =
                  permissionsByResource[resource][0]?.action || ''
                const { resource: resourceTranslation } =
                  getPermissionTranslationByCompositeKey(
                    `${resource.toLowerCase()}.${resourcePermission.toLowerCase()}`,
                  )

                const permissions = permissionsByResource[resource]
                const stats = getResourceStats(resource)
                const isExpanded = expandedResources.has(resource)

                return (
                  <div
                    key={resource}
                    className="border border-primary-600 rounded-lg"
                  >
                    {/* Resource Header */}
                    <div className="flex items-center gap-3 p-3 bg-primary-700 rounded-t-lg">
                      <button
                        onClick={() => toggleResourceExpanded(resource)}
                        className="p-1 hover:bg-primary-600 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="w-4 h-4 text-primary-200" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4 text-primary-200" />
                        )}
                      </button>

                      <Checkbox
                        id={`resource-${resource}`}
                        checked={stats.isAllSelected}
                        indeterminate={stats.isPartialSelected}
                        onChange={() => handleResourceToggle(resource)}
                        className="flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary-0">
                            {resourceTranslation}
                          </span>
                          <span className="text-xs px-2 py-1 bg-secondary-600 text-secondary-200 rounded-full">
                            {stats.selectedCount}/{stats.totalCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resource Permissions */}
                    {isExpanded && (
                      <div className="ml-1 p-3 space-y-2 bg-primary-800">
                        {permissions.map((permission) => {
                          const { action: actionTranslation } =
                            getPermissionTranslationByCompositeKey(
                              `${permission.resource.toLowerCase()}.${permission.action.toLowerCase()}`,
                            )

                          return (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-700 transition-colors ml-6"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={tempPermissions.has(permission.id)}
                                onChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="flex-shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-primary-0">
                                    {actionTranslation}
                                  </span>
                                  {permission.description && (
                                    <Tooltip content={permission.description}>
                                      <InformationCircleIcon className="w-4 h-4 text-primary-200 hover:text-primary-100 cursor-help transition-colors" />
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          // <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <ExclamationTriangleIcon className="size-5" />
            <span className="text-sm font-light">Alterações não salvas</span>
          </div>
          // </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleDiscardChanges}
          variant="outline"
          label="Descartar Alterações"
          disabled={!hasUnsavedChanges || isSaving}
          className="flex-1"
        />
        <Button
          onClick={handleSaveChanges}
          label={isSaving ? 'Salvando...' : 'Salvar Alterações'}
          disabled={!hasUnsavedChanges || isSaving}
          className="flex-1"
        />
      </div>
    </div>
  )
}
