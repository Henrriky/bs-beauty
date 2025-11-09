import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { authAPI } from '../../../../store/auth/auth-api'
import { Button } from '../../../../components/button/Button'
import { Input } from '../../../../components/inputs/Input'
import { SharedSchemas } from '../../../../utils/validation/zod-schemas/shared-zod-schemas.validation.utils'

const codeValidationSchema = z.object({
  code: SharedSchemas.verificationCodeSchema,
})

type CodeValidationFormData = z.infer<typeof codeValidationSchema>

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeValidationFormData>({
    resolver: zodResolver(codeValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
    },
  })

  const [secondsLeft, setSecondsLeft] = useState(60)
  const [resendAvailableAt, setResendAvailableAt] = useState<Date | null>(
    new Date(Date.now() + 60000),
  )

  const navigate = useNavigate()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight']

    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return
    }

    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault()
    }
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

  const handleOnClick = async (formData: CodeValidationFormData) => {
    const data = {
      purpose: 'passwordReset',
      email,
      code: formData.code.trim(),
    }

    await validateCode(data)
      .unwrap()
      .then((payload) => {
        toast.success('E-mail validado com sucesso!')
        setStep('newPassword')
        setTicket(payload.ticket)
      })
      .catch((error: any) => {
        console.error('Error trying to validate code', error)

        if (error?.data?.details === 'Invalid code' || error?.data?.message === 'Invalid code') {
          toast.error('Código de verificação incorreto. Verifique e tente novamente.')
        } else {
          toast.error('Ocorreu um erro ao validar seu e-mail.')
        }
      })
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
        wrapperClassName="items-center"
        inputClassName="w-[300px] text-center text-[20px]"
        error={errors.code?.message}
        maxLength={6}
        onKeyDown={handleKeyDown}
        registration={register('code')}
      />
      <p className="text-[#DBDBDB] text-sm">
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
          className="text-sm"
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
          onClick={handleSubmit(handleOnClick)}
        />
      </div>
    </div>
  )
}

export default CodeValidationStep
