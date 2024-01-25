import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User.js'
import { HttpError } from '../helpers/HttpError.js'
import { ControllerFunction } from '../types.js'
import dtnv from 'dotenv'
dtnv.config()

const { SECRET_KEY } = process.env

export const isAuth: ControllerFunction = async (req, res, next) => {
  const { authorization = '' } = req.headers
  const [bearer, token] = authorization.split(' ')

  if (bearer !== 'Bearer') {
    next(HttpError(401))
  }

  try {
    let id = ''
    if (SECRET_KEY) {
      const authPayload = jwt.verify(token, SECRET_KEY) as JwtPayload
      id = authPayload.id
    }
    const user = await User.findById(id)
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401))
    }

    req.body = user
    next()
  } catch {
    next(HttpError(401))
  }
}
