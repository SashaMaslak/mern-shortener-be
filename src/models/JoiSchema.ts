import Joi, { ObjectSchema } from 'joi'
import { regex } from '../constants/regex.js'

const { emailRegex, pswRegex, phoneRegex, dateRegex, cityRegex } = regex

const email = Joi.string().pattern(emailRegex).required().messages({
  'string.base': 'The email must be a string.',
  'string.pattern.base':
    'The email must consist of at least 1 letter at start, then @, then at least 1 letter, then a dot, at the end 2-3 letters.',
  'any.required': 'The email field is required.',
})

const password = Joi.string().pattern(pswRegex).min(6).max(16).required().messages({
  'string.base': 'The password must be a string.',
  'string.pattern.base':
    'The password must consist of at least one UpperCase, one LowerCase, and one digit from 6 to 16 symbols.',
  'string.min': 'The password must be not less than 6 symbols.',
  'string.max': 'The password must be not greater than 16 symbols.',
  'any.required': 'The password field is required.',
})

const name = Joi.string().min(2).max(16).required().messages({
  'string.base': 'The name must be a string.',
  'string.min': 'The name must be not less than 2 symbols.',
  'string.max': 'The name must be not greater than 16 symbols.',
  'any.required': 'The name field is required.',
})

const phone = Joi.string().pattern(phoneRegex).messages({
  'string.base': 'The phone must be a string.',
  'string.pattern.base': 'The phone must be in format +380XXXXXXXXX.',
})

const birthday = Joi.string().pattern(dateRegex).messages({
  'string.base': 'The birthday must be a string.',
  'string.pattern.base': 'The birthday phone must be in format DD.MM.YYYY.',
})

const city = Joi.string().min(2).pattern(cityRegex).messages({
  'string.base': 'The city must be a string.',
  'string.min': 'The city must be not less than 2 symbols.',
  'string.pattern.base': 'The city must consist of only letters, no numbers and no spaces and have at least 2 symbols.',
})

const registerSchema: ObjectSchema = Joi.object({
  email,
  password,
})

const loginSchema: ObjectSchema = Joi.object({
  email,
  password,
})

const updateSchema: ObjectSchema = Joi.object({
  name,
  email,
  phone,
  birthday,
  city,
})

const emailSchema: ObjectSchema = Joi.object({
  email,
})

export const joiSchemas = {
  registerSchema,
  loginSchema,
  updateSchema,
  emailSchema,
}
