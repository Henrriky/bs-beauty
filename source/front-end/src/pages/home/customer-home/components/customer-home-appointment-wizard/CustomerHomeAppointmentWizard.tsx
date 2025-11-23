/* eslint-disable react/jsx-key */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '../../../../../components/button/Button'
import Subtitle from '../../../../../components/texts/Subtitle'
import useAppSelector from '../../../../../hooks/use-app-selector'
import { appointmentAPI } from '../../../../../store/appointment/appointment-api'
import Modal from '../../../../services/components/Modal'
import CustomerHomeSelectProfessionalContainer from './customer-home-select-professional-step/CustomerHomeSelectProfessional'
import CustomerHomeSelectTimeContainer from './customer-home-select-time-step/CustomerHomeSelectTime'
import { appointmentFormData, CreateAppointmentFormData } from './types'

import SuccessfullAppointmentCreationIcon from '../../../../../assets/create-appointment-success.svg'
import { toast } from 'react-toastify'
import CustomerHomeSelectAppointmentFlow from './CustomerHomeSelectAppointmentFlow'
import CustomerHomeReviewStep from './customer-home-review-step/CustomerHomeReview'
import CustomerHomeSelectServiceContainer from './customer-home-select-service-step'

type StepComponentProps = {
  currentFlow: 'service' | 'professional'
  goNextStep: () => void
  goPreviousStep?: () => void
}

type Step = {
  currentStepName: string
  currentStepAppointmentForm: (props: StepComponentProps) => JSX.Element
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
        ? ({ currentFlow: flowFromProps, goNextStep }) => (
          <CustomerHomeSelectServiceContainer
            currentFlow={flowFromProps}
            goNextStep={goNextStep}
          />
        )
        : ({ currentFlow: flowFromProps, goNextStep }) => (
            <CustomerHomeSelectProfessionalContainer
            currentFlow={flowFromProps}
            goNextStep={goNextStep}
            />
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
        ? ({ currentFlow: flowFromProps, goNextStep, goPreviousStep }) => (
            <CustomerHomeSelectProfessionalContainer
            currentFlow={flowFromProps}
            goNextStep={goNextStep}
            goPreviousStep={goPreviousStep}
            />
          )
        : ({ currentFlow: flowFromProps, goNextStep, goPreviousStep }) => (
          <CustomerHomeSelectServiceContainer
            currentFlow={flowFromProps}
            goNextStep={goNextStep}
            goPreviousStep={goPreviousStep}
          />
          ),
    nextStep: null,
    previousStep: firstSelectStep,
  }

  const selectAppointmentTimeStep: Step = {
    currentStepName: 'Selecionar horário',
    currentStepAppointmentForm: () => <CustomerHomeSelectTimeContainer />,
    nextStep: null,
    previousStep: secondSelectStep,
  }

  const reviewStep: Step = {
    currentStepName: 'Revisão',
    currentStepAppointmentForm: () => <CustomerHomeReviewStep />,
    nextStep: null,
    previousStep: selectAppointmentTimeStep,
  }

  firstSelectStep.nextStep = secondSelectStep
  secondSelectStep.nextStep = selectAppointmentTimeStep
  selectAppointmentTimeStep.nextStep = reviewStep

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
    resolver: zodResolver(appointmentFormData),
  })

  const { handleSubmit, watch } = createAppointmentForm
  const selectedDate = watch('appointmentDate')
  const professionalId = watch('professionalId')

  const [makeAppointment, { isLoading: isLoadingMakeAppointment }] =
    appointmentAPI.useMakeAppointmentMutation()

  const handleSubmitConcrete = async (data: CreateAppointmentFormData) => {
    const payload = {
      observation: data.observation,
      appointmentDate: data.appointmentDate,
      serviceOfferedId: data.serviceOfferedId,
      customerId: customerId!,
      allowImageUse: data.allowImageUse,
    }

    try {
      await makeAppointment(payload).unwrap()

      setModalIsOpen(true)
    } catch (error: any) {
      if (
        error?.data?.message
          ?.toString()
          .includes('maximum number of appointments')
      ) {
        toast.error(
          'Você já atingiu o número máximo de agendamentos por hoje. Por favor, tente novamente amanhã.',
        )
        return
      }
      console.error('❌ Erro ao criar o agendamento:', error)
      toast.error('Erro ao criar o agendamento. Tente novamente.')
    }
  }

  const AppointmentCurrentStepForm = currentStep.currentStepAppointmentForm

  const goNextStep = () =>
    setCurrentStep((step) => {
      if (!step.nextStep) return step
      if (
        currentFlow === 'professional' &&
        step.currentStepName === 'Selecionar profissional' &&
        !professionalId
      ) {
        toast.error(
          'Por favor, selecione um funcionário para acessar a etapa de selecionar os serviços',
        )
        return step
      }

      return { ...step.nextStep }
    })

  const goPreviousStep = () =>
    setCurrentStep((step) => {
      if (!step.previousStep) return step
      return { ...step.previousStep }
    })

  useEffect(() => {
    if (customerId) {
      createAppointmentForm.setValue('customerId', customerId)
    }
  }, [createAppointmentForm, customerId])

  useEffect(() => {
    const firstStep = createSteps(currentFlow)
    setCurrentStep(firstStep)
  }, [currentFlow])

  return (
    <FormProvider {...createAppointmentForm}>
      <CustomerHomeSelectAppointmentFlow
        currentFlow={currentFlow}
        setCurrenFlow={setCurrentFlow}
      />
      <form onSubmit={handleSubmit(handleSubmitConcrete)}>
        <div>
          <AppointmentCurrentStepForm
            currentFlow={currentFlow}
            goNextStep={goNextStep}
            goPreviousStep={currentStep.previousStep ? goPreviousStep : undefined}
          />
        </div>
        <div
          className={`flex mb-4 ${!currentStep.previousStep ? 'justify-end' : 'justify-between'
            } px-4 mt-3`}
        >
          {currentStep.previousStep && (
            <Button
              variant="text-only"
              type="button"
              label={currentStep.previousStep.currentStepName}
              onClick={() =>
                setCurrentStep((currentStep) =>
                  currentStep.previousStep ? { ...currentStep.previousStep } : currentStep,
                )
              }
            />
          )}

          {currentStep.nextStep && (
            <Button
              className="disabled:text-zinc-600"
              variant="text-only"
              type="button"
              label={currentStep.nextStep.currentStepName}
              disabled={
                currentStep.currentStepName === 'Selecionar horário' &&
                (!selectedDate || selectedDate === '')
              }
              onClick={goNextStep}
            />
          )}

          <Button
            className={`${currentStep.nextStep ? 'invisible hidden' : ''
              } disabled:text-zinc-600`}
            type="submit"
            variant="text-only"
            label="Agendar"
            id="submit-button"
            disabled={isLoadingMakeAppointment}
          />
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
