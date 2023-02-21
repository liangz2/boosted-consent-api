import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export const validateRequest =
  <S extends Schema>(schema: S) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validateFields = Object.keys(schema.describe().keys).reduce(
      (acc, key) => ({ ...acc, [key]: req[key] }),
      {}
    )

    const { error } = schema.validate(validateFields, {
      abortEarly: true,
      allowUnknown: false,
      convert: true,
    })

    if (error) {
      res.status(400).json(error)
      return
    }

    next()
  }
