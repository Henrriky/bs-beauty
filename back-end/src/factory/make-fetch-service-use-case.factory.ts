import { InMemoryServiceRepository } from '../repository/in-memory-service.repository'
import { FetchServicesUseCase } from '../services/fetch-services.use-case'

function makeFetchServiceUseCaseFactory () {
  const repository = new InMemoryServiceRepository()
  const usecase = new FetchServicesUseCase(
    repository
  )

  return usecase
}

export { makeFetchServiceUseCaseFactory }
