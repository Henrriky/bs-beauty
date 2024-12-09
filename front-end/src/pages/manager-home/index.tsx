import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'

function ManagerHome() {
  return (
    <>
      <h1 className="text-2xl mt-10 mb-8">
        <span className="font-bold text-primary-500">Bem-vindo(a) ao seu </span>
        <span className="text-secondary-200">perfil </span>
        <span className="text-primary-100">como gerente!</span>
      </h1>
      <div className="h-44 bg-secondary-100 rounded-[10px] pt-[18px] pb-[25px] px-[15px]">
        <div className="flex gap-4">
          <ClockIcon className="size-[38px] text-primary-900" />
          <p className="text-primary-300 text-sm">
            compromissos <br />
            na semana
          </p>
        </div>
        <div className="text-secondary-700 flex flex-row gap-5 justify-center mt-7">
          <p>SEG</p>
          <p>TER</p>
          <p>QUA</p>
          <p>QUI</p>
          <p>SEX</p>
          <p>SAB</p>
          <p>DOM</p>
        </div>
      </div>
      <div className="text-secondary-400 mt-12 flex flex-row items-center gap-2.5 ">
        <UserGroupIcon className="size-8" />
        <span className="text-md">3</span>
        <p className="font-medium text-[12px]">Clientes novos</p>
      </div>
    </>
  )
}

export default ManagerHome
