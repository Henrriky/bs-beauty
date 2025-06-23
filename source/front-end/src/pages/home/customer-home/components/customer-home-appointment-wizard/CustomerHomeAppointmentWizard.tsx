/* eslint-disable react/jsx-key */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '../../../../../components/button/Button'
import Subtitle from '../../../../../components/texts/Subtitle'
import useAppSelector from '../../../../../hooks/use-app-selector'
import { appointmentAPI } from '../../../../../store/appointment/appointment-api'
import { AppointmentSchemas } from '../../../../../utils/validation/zod-schemas/appointment.zod-schemas.validation.utils'
import Modal from '../../../../services/components/Modal'
import CustomerHomeSelectEmployeeContainer from './customer-home-select-employee-step/CustomerHomeSelectEmployee'
import CustomerHomeSelectServiceContainer from './customer-home-select-service-step/CustomerHomeSelectService'
import CustomerHomeSelectTimeContainer from './customer-home-select-time-step/CustomerHomeSelectTime'
import { CreateAppointmentFormData } from './types'

import SuccessfullAppointmentCreationIcon from '../../../../../assets/create-appointment-success.svg'
import { toast } from 'react-toastify'
import CustomerHomeSelectAppointmentFlow from './CustomerHomeSelectAppointmentFlow'

type Step = {
  currentStepName: string
  currentStepAppointmentForm: (props: {
    currentFlow: 'service' | 'professional'
  }) => JSX.Element
  previousStep: Step | null
  nextStep: Step | null
}

function createSteps(currentFlow: 'service' | 'professional'): Step {
  const firstSelectStep: Step = {
    currentStepName:
      currentFlow === 'service'
        ? 'Selecionar serviço'
        : 'Selecionar profissional',
    currentStepAppointmentForm:
      currentFlow === 'service'
        ? () => <CustomerHomeSelectServiceContainer />
        : () => (
            <CustomerHomeSelectEmployeeContainer currentFlow={currentFlow} />
          ),
    nextStep: null,
    previousStep: null,
  }

  const secondSelectStep: Step = {
    currentStepName:
      currentFlow === 'service'
        ? 'Selecionar profissional'
        : 'Selecionar serviço',
    currentStepAppointmentForm:
      currentFlow === 'service'
        ? () => (
            <CustomerHomeSelectEmployeeContainer currentFlow={currentFlow} />
          )
        : () => <CustomerHomeSelectServiceContainer />,
    nextStep: null,
    previousStep: firstSelectStep,
  }

  const selectAppointmentTimeStep: Step = {
    currentStepName: 'Selecionar horário',
    currentStepAppointmentForm: CustomerHomeSelectTimeContainer,
    nextStep: null,
    previousStep: secondSelectStep,
  }

  firstSelectStep.nextStep = secondSelectStep
  secondSelectStep.nextStep = selectAppointmentTimeStep

  return firstSelectStep
}

function CustomerHomeAppointmentWizard() {
  const customerId = useAppSelector((state) => state?.auth?.user?.id)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [currentFlow, setCurrentFlow] = useState<'service' | 'professional'>(
    'service',
  )
  const [currentStep, setCurrentStep] = useState<Step>(() =>
    createSteps(currentFlow),
  )
  const userType = useAppSelector((state) => state?.auth?.user?.userType)
  const navigate = useNavigate()
  const createAppointmentForm = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(AppointmentSchemas.createSchemaForm),
  })
  const { handleSubmit } = createAppointmentForm

  const [makeAppointment, { isLoading: isLoadingMakeAppointment }] =
    appointmentAPI.useMakeAppointmentMutation()

  const handleSubmitConcrete = async (data: CreateAppointmentFormData) => {
    const payload = {
      observation: data.observation,
      appointmentDate: data.appointmentDate,
      serviceOfferedId: data.serviceOfferedId,
      customerId: customerId!,
    }

    console.log(payload)
    try {
      console.log('PALMEIRAS')
      await makeAppointment(payload).unwrap()
      console.log('VASCO')

      setModalIsOpen(true)
    } catch (error) {
      console.error('❌ Erro ao criar o agendamento:', error)
      toast.error('Erro ao criar o agendamento. Tente novamente.')
    }
  }

  const AppointmentCurrentStepForm = currentStep.currentStepAppointmentForm

  useEffect(() => {
    if (customerId) {
      createAppointmentForm.setValue('customerId', customerId)
    }
  }, [customerId])

  useEffect(() => {
    const firstStep = createSteps(currentFlow)
    setCurrentStep(firstStep)
  }, [currentFlow])

  return (
    <FormProvider {...createAppointmentForm}>
      <CustomerHomeSelectAppointmentFlow setCurrenFlow={setCurrentFlow} />
      <form onSubmit={handleSubmit(handleSubmitConcrete)}>
        <div className="">
          <AppointmentCurrentStepForm currentFlow={currentFlow} />
        </div>
        <div
          className={`flex mt-6 ${!currentStep.previousStep ? 'justify-end' : 'justify-between'}`}
        >
          {currentStep.previousStep && (
            <Button
              variant="text-only"
              type="button"
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
          {currentStep.nextStep && (
            <Button
              variant="text-only"
              type="button"
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
          )}
          {
            <Button
              className={`${currentStep.nextStep ? 'invisible hidden' : ''} disabled:text-zinc-600`}
              type="submit"
              variant="text-only"
              label={'Agendar'}
              id={'submit-button'}
              disabled={isLoadingMakeAppointment}
            />
          }
        </div>
      </form>
      <Modal
        className="bg-[#54493F] font-normal relative"
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false)
          navigate(`/${userType?.toString().toLowerCase()}/home`)
          navigate(0)
        }}
      >
        <img
          src={SuccessfullAppointmentCreationIcon}
          alt="Ícone de seta"
          className="absolute -top-[40px] max-w-[150px] max-h-[150px]"
        />
        <div className="flex flex-col items-center justify-between h-full pt-8 pb-4">
          <div className="flex-grow flex items-center justify-center">
            <Subtitle className="text-[#B5B5B5]" align="center">
              Tudo certo! Seu horário está reservado. Nos vemos em breve!
            </Subtitle>
          </div>
          <Button
            className="transition-all bg-[#A4978A] text-[#54493F] font-medium hover:bg-[#4e483f] hover:text-white"
            type="submit"
            label={'Ok'}
            id={'submit-button'}
            onClick={() => {
              setModalIsOpen(false)
              navigate(`/${userType?.toString().toLowerCase()}/home`)
              navigate(0)
            }}
          />
        </div>
      </Modal>
    </FormProvider>
  )
}

export default CustomerHomeAppointmentWizard
