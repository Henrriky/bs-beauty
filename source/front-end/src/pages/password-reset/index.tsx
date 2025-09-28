import { useState } from 'react'
import Subtitle from '../../components/texts/Subtitle'
import Title from '../../components/texts/Title'
import { authAPI } from '../../store/auth/auth-api'
import { toast } from 'react-toastify'
import CodeValidationStep from './components/password-reset-steps/CodeValidationStep'
import PasswordResetStep from './components/password-reset-steps/PasswordResetStep'
import UserEmailRequestStep from './components/password-reset-steps/UserEmailRequestStep'

function PasswordReset() {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email')
  const [email, setEmail] = useState('')
  const [ticket, setTicket] = useState<string | undefined>('')

  console.log(ticket)

  const subtitlesBasedOnStep = {
    email: (
      <>
        Esqueceu sua senha? Sem problemas! <br />
        Informe seu e-mail para enviarmos um código de verificação.
      </>
    ),
    code: (
      <>
        Enviamos um código para <span className="text-primary-0">{email}</span>
      </>
    ),
    newPassword: <>E-mail verificado! Você pode redefinir sua senha agora.</>,
  }

  const [requestPasswordReset, { isLoading }] =
    authAPI.useRequestPasswordResetMutation()

  const handleOnClick = async (data: { email: string }) => {
    await requestPasswordReset(data)
      .unwrap()
      .then(() => {
        toast.success('Código enviado com sucesso!')
        setStep('code')
      })
      .catch((error: unknown) => {
        console.error('Error trying to validate code', error)
        toast.error('Ocorreu um erro ao validar seu e-mail.')
      })
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-7 animate-fadeIn w-full">
      <div className="flex flex-col gap-5">
        <Title align="center">Redefinição de Senha</Title>
        <Subtitle align="center">{subtitlesBasedOnStep[step]}</Subtitle>
      </div>
      {step === 'email' && (
        <UserEmailRequestStep
          setEmail={setEmail}
          setStep={setStep}
          handleOnClick={() => handleOnClick({ email })}
          isLoading={isLoading}
        />
      )}
      {step === 'code' && (
        <CodeValidationStep
          email={email}
          isResendLoading={isLoading}
          resendCode={() => requestPasswordReset({ email })}
          setStep={setStep}
          setTicket={setTicket}
        />
      )}
      {step === 'newPassword' && <PasswordResetStep ticket={ticket} />}
    </div>
  )
}

export default PasswordReset
