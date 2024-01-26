import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { HttpError } from '../helpers/HttpError.js'

export const joiValidateBody = (schema: ObjectSchema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)

    if (error) {
      next(HttpError(400, error.message))
    }

    next()
  }
  return func
}
