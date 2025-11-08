import { Pagination } from '../../../components/select/Pagination'
import { FindAppointmentByCustomerId } from '../../../store/appointment/types'
import { UserType } from '../../../store/auth/types'
import { ListAppointmentsButtonStatus } from '../types'
import { CustomerAppointmentCard } from './CustomerAppointmentCard'

interface CustomerAppointmentsProps {
  appointmentsService: FindAppointmentByCustomerId[]
  switchButtonStatus: ListAppointmentsButtonStatus
  userType: UserType
  isLoading?: boolean
  skeletonCount?: number
  pagination?: {
    currentPage: number
    totalPages: number
    total: number
    onPageChange: (page: number) => void
  }
}

function CustomerAppointments(props: CustomerAppointmentsProps) {
  const { isLoading, skeletonCount = 10 } = props

  if (isLoading) return <CustomerAppointmentsSkeleton count={skeletonCount} />

  return (
    <div>
      {props.appointmentsService.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-[#D9D9D9]">
          Nenhum agendamento encontrado
        </div>
      ) : (
        <>
          <div>
              {props.appointmentsService.map((appointment) => (
                <CustomerAppointmentCard
                  appointment={appointment}
                  switchButtonStatus={props.switchButtonStatus}
                  userType={props.userType}
                  key={appointment.id}
                />
              ))}
          </div>
          {props.pagination && props.pagination.totalPages > 1 && (
            <Pagination
              totalItems={props.pagination.total}
              totalPages={props.pagination.totalPages}
              currentPage={props.pagination.currentPage}
              onPageChange={props.pagination.onPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

function CustomerAppointmentsSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <label key={i} className="flex gap-12 text-[#C0C0C0] mt-2 items-center">
          <div className="text-lg w-14">
            <div className="h-5 w-10 bg-[#3A3A3A] rounded mb-2" />
            <div className="flex items-end gap-1">
              <div className="h-4 w-8 bg-[#3A3A3A] rounded" />
              <div className="h-3 w-8 bg-[#3A3A3A] rounded" />
            </div>
          </div>

          <div className="flex justify-between py-4 px-6 rounded-2xl mt-5 bg-[#262626] flex-grow flex-col sm:flex-row sm:items-center border-secondary-300">
            <div className="flex items gap-4">
              <div className="h-12 w-12 rounded-full bg-[#3A3A3A]" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 bg-[#3A3A3A] rounded" />
                <div className="h-3 w-32 bg-[#3A3A3A] rounded" />
              </div>
            </div>

            <div className="flex flex-wrap mt-4 gap-3 sm:flex-col sm:mt-0">
              <div className="h-4 w-28 bg-[#3A3A3A] rounded" />
              <div className="h-4 w-36 bg-[#3A3A3A] rounded" />
              <div className="h-6 w-24 bg-[#3A3A3A] rounded" />
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}

export { CustomerAppointments }
