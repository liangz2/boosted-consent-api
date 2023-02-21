import { Request, Response } from 'express'
import { DomainModel } from '../../resources'

export const getConsentsById =
  (domainModel: DomainModel) => async (req: Request, res: Response) => {
    try {
      const { targetId } = req.params
      const { consents } = domainModel

      const consentsWithId = await consents.findAll({ where: { id: targetId } })

      res.status(200).json(consentsWithId)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
