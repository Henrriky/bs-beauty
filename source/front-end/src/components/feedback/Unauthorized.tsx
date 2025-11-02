import { NoSymbolIcon } from '@heroicons/react/24/outline'

export default function Unauthorized() {
  return (
    <div className="p-6">
      <div className="p-12 text-center">
        <div className="mb-4">
          <NoSymbolIcon className="h-12 w-12 text-red-500 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-primary-0 mb-2">
          Acesso Negado
        </h2>
        <p className="text-primary-200">
          Você não tem permissão para acessar esta funcionalidade.
        </p>
      </div>
    </div>
  )
}
