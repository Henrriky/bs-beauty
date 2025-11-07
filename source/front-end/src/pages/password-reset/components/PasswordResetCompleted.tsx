import { useNavigate } from 'react-router'
import { Button } from '../../../components/button/Button'
import Subtitle from '../../../components/texts/Subtitle'
import Title from '../../../components/texts/Title'

function PasswordResetCompleted() {
  const navigate = useNavigate()

  return (
    <div className="flex max-w-[500px] justify-center items-center flex-col h-full opacity-0 animate-fadeIn mx-auto">
      <div className="flex justify-center items-center flex-col gap-4 mb-8 animate-moveUp">
        <Title align="center">Sua Senha foi Redefinida!</Title>
        <Subtitle align="center">
          Senha redefinida com sucesso! Agora você já pode acessar sua conta
          novamente e agendar novos procedimentos!
        </Subtitle>
      </div>

      <Button
        variant="solid"
        label="Ir para a Tela de Login"
        onClick={() => navigate('/login')}
        className="animate-moveUp"
      />
    </div>
  )
}

export default PasswordResetCompleted
