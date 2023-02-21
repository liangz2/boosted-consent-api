import { Request, Response } from 'express'
import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import { DomainModel } from '../../resources'

type CreateConsentRequest = {
  body: {
    name: string
    consent_url: string
  }
}

// Need to make sure that the body contains both name and consent_url
export const createConsentSchema = Joi.object<CreateConsentRequest>({
  body: Joi.object<CreateConsentRequest['body']>({
    consent_url: Joi.string().required(),
    name: Joi.string().required(),
  }),
})

export const createConsent =
  (domainModel: DomainModel) => async (req: Request, res: Response) => {
    try {
      const { name, consent_url } = req.body
      const { consents } = domainModel

      const consent = await consents.create(
        {
          id: uuidv4(),
          name,
          consent_url,
          version: 0,
        },
        { returning: true }
      )

      res.status(201).json(consent)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
