import { Request, Response, NextFunction } from 'express'

export interface IHttpError extends Error {
  status?: number
}

export type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>

export interface IUser {
  _id: string
  email: string
  password: string
  token: string
  verify: boolean
  verificationToken: string
  name: string
  city: string
  phone: string
  birthday: string
  links: string[]
  favorites: string[]
  ownPets: string[]
  avatar: string
  subscription: string
}

export interface IBodyEmail {
  to: string
  subject: string
  html: string
  from?: string
}
