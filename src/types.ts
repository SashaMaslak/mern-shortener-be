import { Request, Response, NextFunction } from 'express'

export interface IHttpError extends Error {
  status?: number
}

export type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>
