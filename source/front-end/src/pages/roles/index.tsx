import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRolesLogic } from './hooks/useRolesLogic'
import { RolesList } from './components/RolesList'
import { RoleFormModal } from './components/RoleFormModal'
import { DeleteRoleModal } from './components/DeleteRoleModal'
import { RolePermissionsModal } from './components/RolePermissionsModal'
import { Button } from '../../components/button/Button'
import SearchInput from '../../components/inputs/SearchInput'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'

export default function Roles() {
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    roles,
    pagination,
    filters,
    selectedRole,
    roleToDelete,
    roleToManagePermissions,
    isLoadingRoles,
    isCreating,
    isUpdating,
    isDeleting,
    isFormModalOpen,
    isDeleteModalOpen,
    isPermissionsModalOpen,
    handlePageChange,
    handleFiltersChange,
    clearFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    openPermissionsModal,
    closePermissionsModal,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
  } = useRolesLogic()

  const handleSearch = (value: string) => {
    handleFiltersChange({
      ...filters,
      name: value || undefined,
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  // Verificar permissões
  const canManageRoles = user?.userType === UserType.MANAGER

  if (!canManageRoles) {
    return (
      <div className="p-6">
        <div className="bg-primary-800 rounded-2xl p-12 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-primary-0 mb-2">
            Acesso Negado
          </h2>
          <p className="text-primary-200">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    )
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    clearFilters()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title align="left">Gerenciamento de Funções</Title>
      </div>

      {/* Filters */}
      <div className="bg-primary-800 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Buscar por nome
          </label>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            onSearch={handleSearch}
            enableDebouncing={false}
            placeholder="Digite o nome da função..."
            aria-label="Buscar por nome da função"
          />
        </div>

        {/* Active Filters */}
        {filters.name && (
          <div className="mt-4 pt-4 border-t border-primary-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-primary-200">Filtros ativos:</span>
              {filters.name && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-secondary-600 text-secondary-100">
                  Nome: {filters.name}
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      handleFiltersChange({ ...filters, name: undefined })
                    }}
                    className="ml-1.5 text-secondary-200 hover:text-secondary-100"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Roles List */}
      <RolesList
        roles={roles}
        isLoading={isLoadingRoles}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onManagePermissions={openPermissionsModal}
      />
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-primary-800 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-200">
              Página {pagination.currentPage} de {pagination.totalPages} •{' '}
              {pagination.totalItems}{' '}
              {pagination.totalItems === 1 ? 'role' : 'roles'}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                variant="outline"
                label="Anterior"
                className="text-sm px-3 py-2"
              />
              <Button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                variant="outline"
                label="Próxima"
                className="text-sm px-3 py-2"
              />
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={openCreateModal}
        variant="solid"
        label={
          <div className="flex items-center justify-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Criar função
          </div>
        }
        className="w-full"
      />

      {/* Modals */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        role={selectedRole}
        isLoading={isCreating || isUpdating}
        onClose={closeFormModal}
        onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}
      />

      {/* Delete Modal */}
      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        role={roleToDelete}
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteRole}
      />

      {/* Permissions Modal */}
      <RolePermissionsModal
        isOpen={isPermissionsModalOpen}
        role={roleToManagePermissions}
        onClose={closePermissionsModal}
      />
    </div>
  )
}
