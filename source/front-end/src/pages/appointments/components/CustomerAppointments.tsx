import { Pagination } from '../../../components/select/Pagination'
import { FindAppointmentByCustomerId } from '../../../store/appointment/types'
import { ListAppointmentsButtonStatus } from '../types'
import { CustomerAppointmentCard } from './CustomerAppointmentCard'

interface CustomerAppointmentsProps {
  appointmentsService: FindAppointmentByCustomerId[]
  switchButtonStatus: ListAppointmentsButtonStatus
  pagination?: {
    currentPage: number
    totalPages: number
    total: number
    onPageChange: (page: number) => void
  }
}

function CustomerAppointments(props: CustomerAppointmentsProps) {
  return (
    <div>
      {props.appointmentsService.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-[#D9D9D9]">
          Nenhum agendamento encontrado
        </div>
      ) : (
        <>
          <div>
            {props.appointmentsService.map((appointment) => {
              return (
                <CustomerAppointmentCard
                  appointment={appointment}
                  switchButtonStatus={props.switchButtonStatus}
                  key={appointment.id}
                />
              )
            })}
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

export { CustomerAppointments }
