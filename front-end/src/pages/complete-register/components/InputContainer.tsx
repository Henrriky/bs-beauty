import useAppSelector from '../../../hooks/use-app-selector'
import { Input } from '../../../components/inputs/Input'

function InputContainer() {
  const user = useAppSelector((state) => state.auth.user!)

  return (
    <div className="flex flex-col gap-10 w-full">
      <Input
        label="Nome"
        name="nome"
        id="nome"
        type="text"
        placeholder="Digite seu nome"
      />
      <Input
        label="Data de nascimento"
        name="dataNascimento"
        id="dataNascimento"
        type="text"
        placeholder="Digite sua data de nascimento"
      />
      <Input
        label="Telefone"
        name="telefone"
        id="telefone"
        type="text"
        placeholder="Digite seu telefone"
      />
      <Input
        label="Email"
        name="email"
        id="email"
        type="email"
        value={user.email}
        disabled
      />
    </div>
  )
}

export default InputContainer
