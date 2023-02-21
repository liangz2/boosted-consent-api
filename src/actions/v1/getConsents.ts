import { Request, Response } from 'express'
import { DomainModel } from '../../resources'

export const getConsents =
  (domainModel: DomainModel) => async (_: Request, res: Response) => {
    try {
      const { consents } = domainModel
      const allConsents = await consents.findAll()
      res.status(200).json(allConsents)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
