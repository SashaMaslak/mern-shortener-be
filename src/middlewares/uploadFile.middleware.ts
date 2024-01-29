import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { nanoid } from 'nanoid'
import { regex } from '../constants/regex.js'
import { errorMessageList } from '../constants/errorMessageList.js'
import { IHttpError } from '../types.js'
export const HttpError = (status: number, message = errorMessageList[status]) => {
  const error = new Error(message)
  ;(error as any).status = status // Використовуйте 'any' для типізації, оскільки 'Error' не має властивості 'status' за замовчуванням
  return error
}

import dtnv from 'dotenv'
dtnv.config()

const { imageFileLimit } = regex
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

/**
 * Файли будуть завантажені одразу після отримання мультером
 */

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder
    let public_id
    switch (file.fieldname) {
      case 'avatar':
        public_id = req.body._id
        folder = 'avatars'
        break
      case 'file':
        public_id = nanoid()
        folder = 'pets'
        break
      default:
        throw new Error('Only file and avatars fields exist')
    }

    return {
      folder,
      allowed_formats: ['jpg', 'png'],
      public_id,
      // transformation: [{ width: 350, height: 350 }],
    }
  },
})

const multerFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (file.mimetype.includes('image/')) {
    callback(null, true)
  } else {
    const error = HttpError(400, 'Please, upload images only!')
    callback(error, false)
  }
}

export const uploadFile = multer({
  storage,
  fileFilter: multerFilter,
  limits: {
    fileSize: imageFileLimit,
  },
})
