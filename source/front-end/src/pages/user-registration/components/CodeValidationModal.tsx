import { useEffect, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { Input } from '../../../components/inputs/Input'
import Title from '../../../components/texts/Title'
import { authAPI } from '../../../store/auth/auth-api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

interface CodeValidationModalProps {
  email: string
  password: string
  isOpen: boolean
  isResendLoading: boolean
  setIsOpen: () => void
  handleUpdateProfileToken: (email: string, password: string) => void
  registerCustomer: () => void
}

function CodeValidationModal({
  email,
  password,
  isOpen,
  isResendLoading,
  setIsOpen,
  handleUpdateProfileToken,
  registerCustomer,
}: CodeValidationModalProps) {
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [resendAvailableAt, setResendAvailableAt] = useState<Date | null>(
    new Date(Date.now() + 60000),
  )

  const handleResend = async () => {
    try {
      await registerCustomer()
      toast.success('Código reenviado com sucesso!')
      setResendAvailableAt(new Date(Date.now() + 60000))
    } catch (error) {
      console.log('Error trying to resend code', error)
      toast.error('Erro ao reenviar código.')
    }
  }

  const [validateCode, { isLoading }] = authAPI.useValidateCodeMutation()

  const handleCodeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCode(event.target.value)
  }

  const handleOnClick = async (data: {
    purpose: string
    email: string
    code: string
  }) => {
    await validateCode(data)
      .unwrap()
      .then(() => {
        handleUpdateProfileToken(email, password)
        toast.success('E-mail validado com sucesso!')
        setIsOpen()
        navigate('/complete-register')
      })
      .catch((error: unknown) => {
        console.error('Error trying to validate code', error)
        toast.error('Ocorreu um erro ao validar seu e-mail.')
      })
  }

  const data = {
    purpose: 'register',
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
    <div>
      {isOpen && (
        <div
          className={`fixed inset-0 flex justify-center items-center animate-fadeIn z-[1000] transition-colors ${isOpen ? 'visible bg-black/60' : 'invisible'} animate-d`}
        >
          <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 w-full h-full max-w-[480px] max-h-[320px] flex flex-col justify-center items-center gap-5">
            <div>
              <Title align="center">Confirmação de E-mail</Title>
              <p className="text-[#979797] text-sm mt-2">
                Nós enviamos um código para{' '}
                <span className="text-primary-0">{email}</span>
              </p>
            </div>
            <div className="flex flex-col gap-5 items-center">
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
                  onClick={setIsOpen}
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
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeValidationModal
