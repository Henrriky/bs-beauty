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
import { appointmentAPI } from '../../../../../store/appointment/appointment-api'
import useAppSelector from '../../../../../hooks/use-app-selector'
import { toast } from 'react-toastify'
import Modal from '../../../../services/components/Modal'
import { useNavigate } from 'react-router'
import Subtitle from '../../../../../components/texts/Subtitle'
import SuccessfullAppointmentCreationIcon from '../../../../../assets/create-appointment-success.svg'

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
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<Step>(selectServiceStep)
  const userRole = useAppSelector((state) => state?.auth?.user?.role)
  const navigate = useNavigate()
  const createAppointmentForm = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(AppointmentServiceSchemas.createSchemaForm),
  })
  const { handleSubmit } = createAppointmentForm

  const [makeAppointment, { isLoading: isLoadingMakeAppointment }] =
    appointmentAPI.useMakeAppointmentMutation()
  const [associateOfferWithAppointment] =
    appointmentAPI.useAssociateOfferWithAppointmentMutation()

  const handleSubmitConcrete = async (data: CreateAppointmentFormData) => {
    await makeAppointment({
      observation: undefined,
    })
      .unwrap()
      .then((response) => {
        associateOfferWithAppointment({
          appointmentDate: data.appointmentDate,
          serviceOfferedId: data.serviceOfferedId,
          appointmentId: response.id,
        })
          .then(() => {
            setModalIsOpen(true)
          })
          .catch((error: unknown) => {
            console.error(
              'Error trying to associate offer with appointment',
              error,
            )
            toast.error(
              'Ocorreu um erro ao associar o serviço com o agendamento.',
            )
          })
      })
      .catch((error: unknown) => {
        console.error('Error trying to create appointment', error)
        toast.error('Ocorreu um erro ao criar o agendamento.')
      })
  }

  const AppointmentCurrentStepForm = currentStep.currentStepAppointmentForm

  return (
    <FormProvider {...createAppointmentForm}>
      <form
        // className="flex flex-col gap-10 w-full"
        onSubmit={handleSubmit(handleSubmitConcrete)}
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
          navigate(`/${userRole?.toString().toLowerCase()}/home`)
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
              navigate(`/${userRole?.toString().toLowerCase()}/home`)
              navigate(0)
            }}
          />
        </div>
      </Modal>
    </FormProvider>
  )
}

export default CustomerHomeAppointmentWizard
