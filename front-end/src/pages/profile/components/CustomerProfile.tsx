import { useForm } from "react-hook-form"
import { Input } from "../../../components/inputs/Input"
import { CustomerUpdateProfileFormData } from "./types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomerSchemas } from "../../../utils/validation/zod-schemas/customer.zod-schemas.validation.util"
import { Formatter } from "../../../utils/formatter/formatter.util"
import { authAPI } from "../../../store/auth/auth-api"

function CustomerProfile {
  
  const [updateProfile, { isLoading }] =
    authAPI.upda()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerUpdateProfileFormData>({
    resolver: zodResolver(CustomerSchemas.updateSchema),
  })

  const handleSubmit = async (data: CustomerUpdateProfileFormData) => {
    await completeRegister(data)
      .unwrap()
      .then(() => {
        dispatchRedux(
          // TODO: Improve this refreshing token by complete register route
          setRegisterCompleted(),
        )
        navigate('/register-completed')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  




  return (
    <form
          className="flex flex-col gap-10 w-full"
          onSubmit={handleSubmit(props.handleSubmit)}
        >
          <Input
            registration={{ ...register('name') }}
            label="Nome"
            id="name"
            type="text"
            placeholder="Digite seu nome"
            error={errors?.name?.message?.toString()}
            value={user.name || ''}
          />
          <Input
            registration={{
              ...register('birthdate', {
                onChange: (e) => {
                  const value = Formatter.formatBirthdayWithSlashes(
                    e.target.value,
                  )
                  e.target.value = value
                },
              }),
            }}
            label="Data de nascimento"
            id="birthdate"
            type="text"
            placeholder="Digite sua data de nascimento"
            error={errors?.birthdate?.message?.toString()}
            value={'18/03/2005'}
          />
          <Input
            registration={{
              ...register('phone', {
                onChange: (e) => {
                  const value = Formatter.formatPhoneNumber(e.target.value)
                  e.target.value = value
                },
              }),
            }}
            label="Telefone"
            id="phone"
            type="text"
            placeholder="Digite seu telefone"
            error={errors?.phone?.message?.toString()}
            value={'11954056219'}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={user.email}
            disabled
          />
        </form>
  )

}