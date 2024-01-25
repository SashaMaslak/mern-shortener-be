import { errorMessageList } from '../constants/errorMessageList.js'
import { IHttpError } from '../types.js'

export const HttpError = (status: number, message = errorMessageList[status]) => {
  const error: IHttpError = new Error(message)
  error.status = status
  return error
}
