import CustomerHomeHeader from './components/customer-home-header/CustomerHomeHeader'
import CustomerHomeAppointmentWizard from './components/customer-home-appointment-wizard/CustomerHomeAppointmentWizard'

function CustomerHome() {
  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-scroll px-4 gap-4">
      <CustomerHomeHeader />
      <CustomerHomeAppointmentWizard />
    </div>
  )
}

export default CustomerHome
