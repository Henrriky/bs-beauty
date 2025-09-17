import { Button } from '../../../../components/button/Button'
import { Input } from '../../../../components/inputs/Input'

interface UserEmailRequestStepProps {
  isLoading: boolean
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setStep: React.Dispatch<
    React.SetStateAction<'email' | 'code' | 'newPassword'>
  >
  handleOnClick: () => void
}

function UserEmailRequestStep({
  setEmail,
  isLoading,
  handleOnClick,
}: UserEmailRequestStepProps) {
  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmail(event.target.value)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <Input
        id="email"
        type="email"
        variant="solid"
        inputClassName="w-full"
        placeholder="E-mail"
        onChange={handleEmailInputChange}
      />
      <Button
        label={
          isLoading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Carregando...</p>
            </div>
          ) : (
            'Enviar código de verificação'
          )
        }
        disabled={isLoading}
        onClick={handleOnClick}
      />
    </div>
  )
}

export default UserEmailRequestStep
