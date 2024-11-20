import useAppSelector from '../../hooks/use-app-selector'

function Profile() {
  const user = useAppSelector((state) => state.auth.user!)

  return (
    <>
      <h1 className="text-2xl text-blue-200 font-semibold">Nome {user.name}</h1>
      <h1 className="text-2xl text-blue-200 font-semibold">
        Email {user.email}
      </h1>
    </>
  )
}

export default Profile
