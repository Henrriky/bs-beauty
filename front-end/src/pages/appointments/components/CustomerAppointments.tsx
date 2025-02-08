import { FindAppointmentServiceByCustomerId } from '../../../store/appointment/types'
import { ListAppointmentsButtonStatus } from '../types'
import { CustomerAppointmentCard } from './CustomerAppointmentCard'

interface CustomerAppointmentsProps {
  appointmentsService: FindAppointmentServiceByCustomerId[]
  switchButtonStatus: ListAppointmentsButtonStatus
}

function CustomerAppointments(props: CustomerAppointmentsProps) {
  return (
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
  )
}

export { CustomerAppointments }
