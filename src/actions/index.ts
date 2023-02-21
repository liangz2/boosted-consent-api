import { Router } from 'express'
import { DomainModel } from '../resources'
import { createV1Routes } from './v1'

export const setupRoutes = (domainModel: DomainModel) => {
  const router = Router()

  router.use('/v1', createV1Routes(domainModel))

  return router
}
