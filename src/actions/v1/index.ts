import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest'
import { DomainModel } from '../../resources'
import { createConsent, createConsentSchema } from './createConsent'
import { getConsents } from './getConsents'
import { getConsentsById } from './getConsentsById'
import { updateConsentById, updateConsentByIdSchema } from './updateConsentById'

export const createV1Routes = (domainModel: DomainModel) => {
  const handler = Router()

  handler.get('/consent/target', getConsents(domainModel))

  handler.get('/consent/target/:targetId', getConsentsById(domainModel))

  handler.patch(
    '/consent/target/:targetId',
    validateRequest(updateConsentByIdSchema),
    updateConsentById(domainModel)
  )

  handler.post(
    '/consent/target',
    validateRequest(createConsentSchema),
    createConsent(domainModel)
  )

  return handler
}
