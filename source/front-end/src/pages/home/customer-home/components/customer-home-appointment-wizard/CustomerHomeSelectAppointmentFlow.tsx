import { Button } from '../../../../../components/button/Button'

function CustomerHomeSelectAppointmentFlow() {
  return (
    <div className="flex justify-around">
      <Button label="Por Serviço" variant="text-only" className="text-[20px]" />
      <Button
        label="Por Profissional"
        variant="text-only"
        className="text-[20px]"
      />
    </div>
  )
}

export default CustomerHomeSelectAppointmentFlow
