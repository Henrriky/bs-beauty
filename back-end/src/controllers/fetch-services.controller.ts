import type e from 'express'
import { makeFetchServiceUseCaseFactory } from '../factory/make-fetch-service-use-case.factory'

class FetchServicesController {
  public static async handle (req: e.Request, res: e.Response) {
    const usecase = makeFetchServiceUseCaseFactory()

    const { services } = await usecase.execute()

    res.send({ services })
  }
}

export { FetchServicesController }
