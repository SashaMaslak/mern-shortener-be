import { Schema, model, Types } from 'mongoose'
import { regex } from '../constants/regex.js'

const { emailRegex, pswRegex } = regex

const schema = new Schema({
  email: { type: String, match: emailRegex, required: true, unique: true },
  password: { type: String, match: pswRegex, required: true },
  links: [{ type: Types.ObjectId, ref: 'Link' }],
})

export default model('User', schema)
