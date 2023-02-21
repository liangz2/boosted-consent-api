import { Request, Response } from 'express'
import Joi from 'joi'
import { DomainModel } from '../../resources'

type UpdateConsentByIdRequest = {
  params: {
    targetId: string
  }
  body: {
    name?: string
    consent_url?: string
  }
}

// The request must contain body and params
// and the body must have either 'name' or 'consent_url'
export const updateConsentByIdSchema = Joi.object<UpdateConsentByIdRequest>({
  body: Joi.object<UpdateConsentByIdRequest['body']>({
    consent_url: Joi.string(),
    name: Joi.string(),
  })
    .or('consent_url', 'name')
    .required(),
  params: Joi.object<UpdateConsentByIdRequest['params']>({
    targetId: Joi.string().required(),
  }).required(),
})

export const updateConsentById =
  (domainModel: DomainModel) => async (req: Request, res: Response) => {
    try {
      const { targetId } = req.params
      const { name, consent_url } = req.body
      const { consents } = domainModel

      const existingConsents = await consents.findAll({
        where: { id: targetId },
        order: [['version', 'ASC']],
      })

      const lastConsent = existingConsents.pop()

      if (lastConsent) {
        const newConsent = await consents.create(
          {
            id: targetId,
            name: name || lastConsent.name,
            consent_url: consent_url || lastConsent.consent_url,
            version: lastConsent.version + 1,
          },
          {
            returning: true,
          }
        )

        res.status(200).json(newConsent)
      } else {
        res.status(404).send(`No consent found by ID ${targetId}`)
      }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
