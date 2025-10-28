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
import { UserType } from '../../store/auth/types'
import { Pagination } from '../../components/select/Pagination'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import Unauthorized from '../../components/feedback/Unauthorized'

export default function Roles() {
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

  const handleClearSearch = () => {
    setSearchTerm('')
    clearFilters()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title align="left">Gerenciamento de Funções</Title>
      </div>
      {/* Filters and Roles List */}
      <UserCanAccessContainer
        allowedPermissions={['roles.read']}
        allowedUserTypes={[UserType.MANAGER]}
        fallback={<Unauthorized />}
      >
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
                <span className="text-sm text-primary-200">
                  Filtros ativos:
                </span>
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
        <Pagination
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          pageLimit={pagination.pageLimit}
          onPageChange={handlePageChange}
        />
      </UserCanAccessContainer>

      {/* Create Role */}
      <UserCanAccessContainer
        allowedPermissions={['roles.create']}
        allowedUserTypes={[UserType.MANAGER]}
      >
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
      </UserCanAccessContainer>

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
