/* eslint-disable react/jsx-key */
import { useState } from 'react'
import CustomerHomeSelectServiceContainer from './customer-home-select-service-step/CustomerHomeSelectService'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppointmentServiceSchemas } from '../../../../../utils/validation/zod-schemas/appointment-service.zod-schemas.validation.util'
import { CreateAppointmentFormData } from './types'
import { Button } from '../../../../../components/button/Button'
import CustomerHomeSelectEmployeeContainer from './customer-home-select-employee-step/CustomerHomeSelectEmployee'
import CustomerHomeSelectTimeContainer from './customer-home-select-time-step/CustomerHomeSelectTime'

type Step = {
  currentStepName: string
  currentStepAppointmentForm: () => JSX.Element
  previousStep: Step | null
  nextStep: Step | null
}

const selectServiceStep: Step = {
  currentStepName: 'Selecionar serviço',
  currentStepAppointmentForm: CustomerHomeSelectServiceContainer,
  nextStep: null,
  previousStep: null,
}

const selectEmployeeStep: Step = {
  currentStepName: 'Selecionar profissional',
  currentStepAppointmentForm: CustomerHomeSelectEmployeeContainer,
  nextStep: null,
  previousStep: null,
}

const selectAppointmentTimeStep: Step = {
  currentStepName: 'Selecionar horário',
  currentStepAppointmentForm: CustomerHomeSelectTimeContainer,
  nextStep: null,
  previousStep: null,
}

selectServiceStep.nextStep = selectEmployeeStep
selectEmployeeStep.previousStep = selectServiceStep
selectEmployeeStep.nextStep = selectAppointmentTimeStep
selectAppointmentTimeStep.previousStep = selectEmployeeStep

function CustomerHomeAppointmentWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(selectServiceStep)
  const createAppointmentForm = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(AppointmentServiceSchemas.createSchema),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = createAppointmentForm

  const AppointmentCurrentStepForm = currentStep.currentStepAppointmentForm

  return (
    <FormProvider {...createAppointmentForm}>
      <form
        // className="flex flex-col gap-10 w-full"
        onSubmit={handleSubmit(() => console.log('ola mundo'))}
      >
        <div className="">
          <AppointmentCurrentStepForm />
        </div>
        <div
          className={`flex mt-6 ${!currentStep.previousStep ? 'justify-end' : 'justify-between'}`}
        >
          {currentStep.previousStep && (
            <Button
              variant="text-only"
              label={currentStep.previousStep.currentStepName}
              onClick={() =>
                setCurrentStep((currentStep) => {
                  if (currentStep.previousStep) {
                    return {
                      ...currentStep.previousStep,
                    }
                  } else {
                    return { ...currentStep }
                  }
                })
              }
            />
          )}
          {currentStep.nextStep ? (
            <Button
              variant="text-only"
              label={currentStep.nextStep.currentStepName}
              onClick={() =>
                setCurrentStep((currentStep) => {
                  if (currentStep.nextStep) {
                    return {
                      ...currentStep.nextStep,
                    }
                  } else {
                    return { ...currentStep }
                  }
                })
              }
            />
          ) : (
            <Button variant="text-only" label={'Agendar'} type="submit" />
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default CustomerHomeAppointmentWizard
