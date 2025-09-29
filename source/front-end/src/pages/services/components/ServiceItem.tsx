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
import StatusBadge from '../../../components/status/StatusBadge'

interface ServiceItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openUpdateModal: () => void
  openDeleteModal: () => void
  onStatusChange: OnSubmitUpdateServiceStatusForm
  service: Service
  isManager: boolean
  isSelected?: boolean
  isChangingStatus?: boolean
}

const getStatusBadge = (status: ServiceStatus) => {
  switch (status) {
    case 'PENDING':
      return <StatusBadge text={'Pendente'} color={'amber'} />
    case 'APPROVED':
      return <StatusBadge text={'Aprovado'} color={'green'} />
    case 'REJECTED':
      return <StatusBadge text={'Aprovado'} color={'red'} />
    default:
      return null
  }
}

function ServiceItem({
  openUpdateModal,
  openDeleteModal,
  onStatusChange,
  service,
  isManager,
  isSelected = false,
  isChangingStatus = false,
  ...props
}: ServiceItemProps) {
  return (
    <Button
      label={
        <div className="flex items-start justify-between gap-3">
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
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            {isManager && service.status === 'PENDING' && (
              <>
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
              </>
            )}
            {(isManager || service.status === 'PENDING') && (
              <>
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
