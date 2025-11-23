import { SetStateAction } from 'react'
import { SwitchButton } from '../../../../../components/button/SwitchButton'

interface CustomerHomeSelectAppointmentFlowProps {
  setCurrenFlow: (flow: SetStateAction<'service' | 'professional'>) => void
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectAppointmentFlow({
  setCurrenFlow,
  currentFlow,
}: CustomerHomeSelectAppointmentFlowProps) {
  return (
    <div className="w-full flex justify-around">
      <SwitchButton
        options={[
          { value: 'service', label: 'Por Serviço' },
          { value: 'professional', label: 'Por Profissional' },
        ]}
        value={currentFlow}
        onChange={(value) => setCurrenFlow(value)}
      />
    </div>
  )
}

export default CustomerHomeSelectAppointmentFlow
