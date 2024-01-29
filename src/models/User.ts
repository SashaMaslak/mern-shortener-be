import { Schema, model, Types } from 'mongoose'
import { regex } from '../constants/regex.js'

const { emailRegex, pswRegex, cityRegex, phoneRegex, dateRegex } = regex
const subList = ['starter', 'pro', 'business']

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegex,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      minlength: 6,
      match: pswRegex,
      required: [true, 'Set password for user'],
    },
    city: {
      type: String,
      match: cityRegex,
      default: '',
    },
    phone: {
      type: String,
      match: phoneRegex,
      default: '',
    },
    birthday: {
      type: String,
      match: dateRegex,
      default: '',
    },
    favorites: [{ type: Types.ObjectId, ref: 'links' }],
    ownPets: [{ type: Types.ObjectId, ref: 'links' }],
    avatar: { type: String },
    token: {
      type: String,
      default: '',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: '',
    },
    subscription: {
      type: String,
      enum: subList,
      default: 'starter',
    },
  },
  { versionKey: false, timestamps: true },
)

export const User = model('user', userSchema)
