import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { authAPI } from '../../../../store/auth/auth-api'
import { Input } from '../../../../components/inputs/Input'
import PasswordEyeIcon from '../../../../components/password/PasswordEyeIcon'
import { Button } from '../../../../components/button/Button'

interface PasswordResetStepProps {
  ticket: string | undefined
}

function PasswordResetStep({ ticket }: PasswordResetStepProps) {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [resetPassword, { isLoading }] = authAPI.useResetPasswordMutation()

  const handleOnClick = async (data: {
    ticket: string | undefined
    newPassword: string
    confirmNewPassword: string
  }) => {
    await resetPassword(data)
      .unwrap()
      .then(() => {
        toast.success('Senha redefinida com sucesso!')
        navigate('/password-reset-completed')
      })
      .catch((error: unknown) => {
        console.error('Error trying to set new password', error)
        toast.error('Ocorreu um erro ao redefinir sua senha.')
      })
  }

  const data = {
    ticket,
    newPassword,
    confirmNewPassword,
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="relative">
        <Input
          id="new-password"
          type={showPassword ? 'text' : 'password'}
          variant="solid"
          placeholder="Nova senha"
          inputClassName="w-full"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordEyeIcon
          showPassword={showPassword}
          showPasswordFunction={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="relative">
        <Input
          id="confirm-new-password"
          type={showPassword ? 'text' : 'password'}
          variant="solid"
          placeholder="Digite sua nova senha novamente"
          inputClassName="w-full"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <PasswordEyeIcon
          showPassword={showPassword}
          showPasswordFunction={() => setShowPassword(!showPassword)}
        />
      </div>
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
                <p className="text-sm">Carregando...</p>
              </div>
            ) : (
              'Redefinir senha'
            )
          }
          onClick={() => handleOnClick(data)}
        />
      </div>
    </div>
  )
}

export default PasswordResetStep
