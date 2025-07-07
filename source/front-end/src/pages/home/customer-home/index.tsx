import CustomerHomeHeader from './components/customer-home-header/CustomerHomeHeader'
import CustomerHomeServiceContainer from './components/customer-home-appointment-wizard/CustomerHomeAppointmentWizard'

function CustomerHome() {
  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-scroll px-4 gap-4">
      <CustomerHomeHeader />
      <CustomerHomeServiceContainer />
    </div>
  )
}

export default CustomerHome
