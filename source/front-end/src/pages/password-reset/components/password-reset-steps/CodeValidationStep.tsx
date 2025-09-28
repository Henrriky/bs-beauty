import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { authAPI } from '../../../../store/auth/auth-api'
import { Button } from '../../../../components/button/Button'
import { Input } from '../../../../components/inputs/Input'

interface CodeValidationStepProps {
  email: string
  isResendLoading: boolean
  resendCode: () => void
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'code' | 'newPassword'>
  >
  setTicket: React.Dispatch<React.SetStateAction<string | undefined>>
}

function CodeValidationStep({
  email,
  isResendLoading,
  resendCode,
  setStep,
  setTicket,
}: CodeValidationStepProps) {
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [resendAvailableAt, setResendAvailableAt] = useState<Date | null>(
    new Date(Date.now() + 60000),
  )

  const navigate = useNavigate()

  const handleCodeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCode(event.target.value)
  }

  const handleResend = async () => {
    try {
      await resendCode()
      toast.success('Código reenviado com sucesso!')
      setResendAvailableAt(new Date(Date.now() + 60000))
    } catch (error) {
      console.log('Error trying to resend code', error)
      toast.error('Erro ao reenviar código.')
    }
  }

  const [validateCode, { isLoading }] = authAPI.useValidateCodeMutation()

  const handleOnClick = async (data: {
    purpose: string
    email: string
    code: string
  }) => {
    await validateCode(data)
      .unwrap()
      .then((payload) => {
        toast.success('E-mail validado com sucesso!')
        setStep('newPassword')
        setTicket(payload.ticket)
      })
      .catch((error: unknown) => {
        console.error('Error trying to validate code', error)
        toast.error('Ocorreu um erro ao validar seu e-mail.')
      })
  }

  const data = {
    purpose: 'passwordReset',
    email,
    code: code.trim(),
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!resendAvailableAt) return

      const diff = Math.ceil((resendAvailableAt.getTime() - Date.now()) / 1000)
      setSecondsLeft(diff > 0 ? diff : 0)
    }, 500)

    return () => clearInterval(timer)
  }, [resendAvailableAt])

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <Input
        id="code"
        type="text"
        variant="solid"
        label="Código de verificação"
        inputClassName="w-[300px] text-center text-[20px]"
        onChange={handleCodeInputChange}
      />
      <p className="text-[#DBDBDB] text-xs">
        Não recebeu o código? {''}
        <Button
          variant="text-only"
          label={
            isResendLoading
              ? 'Reenviando...'
              : secondsLeft === 0
                ? 'Clique aqui para reenviar'
                : `Reenviar em ${secondsLeft}`
          }
          disabled={secondsLeft > 0}
          className="text-xs"
          onClick={handleResend}
        />
      </p>
      <div className="flex gap-3 w-full">
        <Button
          label="Cancelar"
          variant="outline"
          onClick={() => navigate('/')}
        />
        <Button
          label={
            isLoading ? (
              <div className="flex justify-center items-center gap-4">
                <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                <p className="text-sm">Validando...</p>
              </div>
            ) : (
              'Validar'
            )
          }
          onClick={() => handleOnClick(data)}
        />
      </div>
    </div>
  )
}

export default CodeValidationStep
