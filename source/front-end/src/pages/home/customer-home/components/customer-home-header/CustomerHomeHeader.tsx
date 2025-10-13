import { authAPI } from "../../../../../store/auth/auth-api"

function CustomerHomeHeader() {
  const { data, isFetching } = authAPI.useFetchUserInfoQuery()

  const userName = data?.user.name

  return (
    <header>
      <h2 className="text-2xl mt-10 mb-2">
        <span className="text-primary-100">Bem vindo(a), </span>
        <span className="text-[#A4978A]"> {isFetching ? '...' : userName}</span>
      </h2>
      <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>
    </header>
  )
}

export default CustomerHomeHeader
