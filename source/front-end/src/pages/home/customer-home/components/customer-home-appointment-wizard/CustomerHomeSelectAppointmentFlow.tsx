import { SetStateAction } from 'react'
import { Button } from '../../../../../components/button/Button'

interface CustomerHomeSelectAppointmentFlowProps {
  setCurrenFlow: (flow: SetStateAction<'service' | 'professional'>) => void
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectAppointmentFlow({
  setCurrenFlow,
  currentFlow,
}: CustomerHomeSelectAppointmentFlowProps) {
  return (
    <div className="flex justify-around">
      <Button
        label="Por Serviço"
        variant="text-only"
        onClick={() => setCurrenFlow('service')}
        className={`text-[21px] ${currentFlow === 'service' ? '' : 'text-[#4E483F]'}`}
      />
      <Button
        label="Por Profissional"
        variant="text-only"
        onClick={() => setCurrenFlow('professional')}
        className={`text-[21px] ${currentFlow === 'professional' ? '' : 'text-[#4E483F]'}`}
      />
    </div>
  )
}

export default CustomerHomeSelectAppointmentFlow
