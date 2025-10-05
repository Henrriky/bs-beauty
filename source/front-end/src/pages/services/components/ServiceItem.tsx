import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Service, ServiceStatus } from '../../../store/service/types'
import { Button } from '../../../components/button/Button'
import React from 'react'
import BSBeautyLoading from '../../../components/feedback/Loading'
import { OnSubmitUpdateServiceStatusForm } from './types'
import { UserCanAccessContainer } from '../../../components/authorization/UserCanAccessContainer'
import { UserType } from '../../../store/auth/types'

interface ServiceItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openUpdateModal: () => void
  openDeleteModal: () => void
  onStatusChange: OnSubmitUpdateServiceStatusForm
  service: Service
  isSelected?: boolean
  isChangingStatus?: boolean
  loggedUserId: string
}

const getStatusBadge = (status: ServiceStatus) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-amber-700 bg-amber-100 rounded border-[1px] border-amber-200 border-opacity-25">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          Pendente
        </span>
      )
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded border-[1px] border-green-200 border-opacity-25">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Aprovado
        </span>
      )
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-red-700 bg-red-100 rounded border-[1px] border-red-200 border-opacity-25">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          Rejeitado
        </span>
      )
    default:
      return null
  }
}

function ServiceItem({
  openUpdateModal,
  openDeleteModal,
  onStatusChange,
  service,
  isSelected = false,
  isChangingStatus = false,
  loggedUserId,
  ...props
}: ServiceItemProps) {
  const isStatusPending = service.status === 'PENDING'
  const isServiceOwner = service.createdBy === loggedUserId
  const canEdit =
    isServiceOwner &&
    (service.status === 'PENDING' || service.status === 'REJECTED')

  console.log('Rendering ServiceItem:', service)
  console.log('service.createdBy', service.createdBy)
  console.log('loggedUserId', loggedUserId)
  console.log('isServiceOwner', isServiceOwner)
  console.log('canEdit', canEdit)

  return (
    <Button
      label={
        <div className="flex items-start justify-between gap-3">
          {/* Service Informations */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate group-hover:text-[#B19B86] transition-colors">
              {service.name}
            </h3>

            {service.description && (
              <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(service.status)}
              {service.category && (
                <span className="px-2 py-0.5 text-xs bg-[#272727] border-[1px] border-[#D9D9D9] border-opacity-25 rounded">
                  {service.category}
                </span>
              )}
            </div>
          </div>
          {/* Actions (Approve/Reject/Edit/Delete) */}
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {isStatusPending && (
              <>
                <UserCanAccessContainer allowedUserTypes={[UserType.MANAGER]}>
                  <button
                    disabled={isChangingStatus}
                    onClick={(e) => {
                      e.stopPropagation()
                      onStatusChange({ status: 'APPROVED' })
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded transition-all"
                    title="Aprovar serviço"
                  >
                    {isChangingStatus ? (
                      <BSBeautyLoading />
                    ) : (
                      <CheckIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    disabled={isChangingStatus}
                    onClick={(e) => {
                      e.stopPropagation()
                      onStatusChange({ status: 'REJECTED' })
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="Rejeitar serviço"
                  >
                    {isChangingStatus ? (
                      <BSBeautyLoading />
                    ) : (
                      <XMarkIcon className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-px h-4 bg-gray-600"></div>
                </UserCanAccessContainer>
                {canEdit ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openUpdateModal()
                    }}
                    className="p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
                    title="Editar serviço"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <UserCanAccessContainer
                    allowedPermissions={['service.edit']}
                    allowedUserTypes={[UserType.MANAGER]}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openUpdateModal()
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#B19B86] hover:bg-[#B19B86]/10 rounded transition-all"
                      title="Editar serviço"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                  </UserCanAccessContainer>
                )}
                <UserCanAccessContainer
                  allowedPermissions={['service.delete']}
                  allowedUserTypes={[UserType.MANAGER]}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteModal()
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="Excluir serviço"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </UserCanAccessContainer>
              </>
            )}
          </div>
        </div>
      }
      variant="outline"
      outlineVariantBorderStyle="dashed"
      className={`
        bg-[#222222] w-full text-left px-4 py-2 
        ${!isSelected ? 'border-none' : ''}
      `}
      {...props}
    />
  )
}

export default ServiceItem
