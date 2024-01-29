import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { ControllerFunction, IBodyEmail, IUser } from '../types.js'
import { getEnv } from '../helpers/getEnv.js'
import { ctrlWrapper } from '../helpers/ctrlWrapper.js'
import { HttpError } from '../helpers/HttpError.js'
import { sendEmail } from '../helpers/sendEmail.js'
import { User } from '../models/User.js'
import dtnv from 'dotenv'
dtnv.config()

const { SECRET_KEY } = process.env
const { BASE_URL_FRONTEND } = getEnv()

const register: ControllerFunction = async (req, res) => {
  //отримуємо дані з фронтенда
  const { email, password } = req.body

  // шукаємо користувача в БД
  const candidate = await User.findOne({ email })

  // Якщо користувач знайдений, викидаємо помилку з повідомленням
  if (candidate) {
    throw HttpError(409, 'Email has already been used')
  }

  //ХЕШУЄМО пароль за допомогою бібліотеки bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10)

  // Створюємо токен верифікації
  const verificationToken = nanoid()

  // Створюємо нового користувача, та записуємо його в базу
  await User.create({
    ...req.body,
    password: hashedPassword,
    verificationToken,
    verify: false,
  })

  // Об'єкт повідомлення
  const bodyEmail: IBodyEmail = {
    to: email,
    subject: 'Verify Email',
    html: `<a target="_blank" href="${BASE_URL_FRONTEND}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  }

  //Відправка повідомлення
  await sendEmail(bodyEmail)

  // повідомляємо фронтенд, що лист дял верифікації відправлено на пошту.
  res.status(201).json({ message: 'Email was sent successfully' })
}

const login: ControllerFunction = async (req, res) => {
  //отримуємо дані з фронтенда
  const { email, password } = req.body

  // шукаємо користувача в БД
  const user: IUser | null = await User.findOne({ email })
  // Якщо користувач не знайдений помилка 401
  if (!user) {
    throw HttpError(401, 'Email or password is wrong')
  }

  // Звіряємо введений пароль та зашифрований пароль у базі.
  const passwordCompare: boolean = await bcrypt.compare(password as string, user.password as string)

  // Якщо НЕ пароль викидаємо помилку 401
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong')
  }

  const authPayload = {
    id: user._id,
  }

  //Створюємо змінну для перевірки чи SECRET_KEY not undefined
  let token = ''

  //Перевіряємо чи SECRET_KEY not undefined, якщо undefined, помилка 401
  if (SECRET_KEY) {
    token = jwt.sign(authPayload, SECRET_KEY, { expiresIn: '23h' })
  } else {
    throw HttpError(500, 'Internal Server Error - Missing SECRET_KEY')
  }

  // Шукаємо користувача в БД та записуємо йому токен на 23 години
  await User.findByIdAndUpdate(user._id, { token })

  //Відповідь на фронтенд
  res.json({ token, user })
}

const logout: ControllerFunction = async (req, res) => {
  const { _id } = req.body
  await User.findByIdAndUpdate(_id, { token: '' })
  res.status(204).json({ message: 'Logout success' })
}

const getCurrent: ControllerFunction = async (req, res) => {
  res.json({ token: req.body.user.token, user: req.body.user })
}

const verifyEmail: ControllerFunction = async (req, res) => {
  const { verificationToken } = req.params
  const user: IUser | null = await User.findOne({ verificationToken })

  if (!user) {
    HttpError(404, 'User not found')
  }
  if (user?.verificationToken) {
    HttpError(404)
  }

  await User.findByIdAndUpdate(user?._id, {
    verify: true,
    verificationToken: '',
  })
  res.status(200).json({ message: 'Verification successful' })
}

const resendVerifyEmail: ControllerFunction = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(404, 'User not found')
  } else if (user.verify) {
    throw HttpError(401, 'Verification has already been passed')
  }
  const bodyEmail: IBodyEmail = {
    to: email,
    subject: 'Verify Email',
    html: `<a target="_blank" href="${BASE_URL_FRONTEND}/afterverify/${user.verificationToken}">Click verify email</a>`,
  }
  await sendEmail(bodyEmail)
  res.json({ message: 'Verify email send success' })
}

const updateUser: ControllerFunction = async (req, res) => {
  const { _id } = req.body
  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  })
  res.json({ user })
}

const ctrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  updateUser: ctrlWrapper(updateUser),
}

export default ctrl
