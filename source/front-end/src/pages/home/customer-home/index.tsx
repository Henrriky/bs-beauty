import CustomerHomeHeader from './components/customer-home-header/CustomerHomeHeader'
import CustomerHomeAppointmentWizard from './components/customer-home-appointment-wizard/CustomerHomeAppointmentWizard'

function CustomerHome() {
  return (
    <div className="flex flex-col overflow-y-scroll gap-4">
      <CustomerHomeHeader />
      <CustomerHomeAppointmentWizard />
    </div>
  )
}

export default CustomerHome
