import { useNavigate } from 'react-router'
import { Button } from '../../../components/button/Button'
import Subtitle from '../../../components/texts/Subtitle'
import Title from '../../../components/texts/Title'

function RegistrationCompleted() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center flex-col h-full opacity-0 animate-fadeIn">
      <div className="flex justify-center items-center flex-col gap-4 mb-16 animate-moveUp">
        <Title align="center">Pronto para Começar!</Title>
        <Subtitle align="center">
          Cadastro concluído com sucesso! Agora você já pode começar a utilizar
          o aplicativo e aproveitar todos os recursos disponíveis. Seja
          bem-vindo(a)
        </Subtitle>
      </div>

      <Button
        variant="solid"
        label="Ir para o Painel Inicial"
        onClick={() => navigate('/home')}
        className="animate-moveUp"
      />
    </div>
  )
}

export default RegistrationCompleted
