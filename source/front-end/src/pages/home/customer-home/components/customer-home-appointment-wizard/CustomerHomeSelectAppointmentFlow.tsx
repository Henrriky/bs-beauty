import { SetStateAction } from 'react'
import { Button } from '../../../../../components/button/Button'

interface CustomerHomeSelectAppointmentFlowProps {
  setCurrenFlow: (flow: SetStateAction<'service' | 'professional'>) => void
}

function CustomerHomeSelectAppointmentFlow({
  setCurrenFlow,
}: CustomerHomeSelectAppointmentFlowProps) {
  return (
    <div className="flex justify-around">
      <Button
        label="Por Serviço"
        variant="text-only"
        className="text-[20px]"
        onClick={() => setCurrenFlow('service')}
      />
      <Button
        label="Por Profissional"
        variant="text-only"
        className="text-[20px]"
        onClick={() => setCurrenFlow('professional')}
      />
    </div>
  )
}

export default CustomerHomeSelectAppointmentFlow
