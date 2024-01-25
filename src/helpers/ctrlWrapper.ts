import { Request, Response, NextFunction } from 'express'
import { ControllerFunction } from '../types.js'

export const ctrlWrapper = (ctrl: ControllerFunction) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next)
    } catch (error) {
      next(error)
    }
  }
  return func
}
