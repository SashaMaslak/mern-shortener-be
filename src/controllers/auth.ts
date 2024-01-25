import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { ControllerFunction } from '../types.js'
import { getEnv } from '../helpers/getEnv.js'
import { ctrlWrapper } from '../helpers/ctrlWrapper.js'
import { HttpError } from '../helpers/HttpError.js'
import User from '../models/User.js'

const { SECRET_KEY } = process.env
//const { BASE_URL_FRONTEND } = getEnv()

const register: ControllerFunction = async (req: Request, res: Response) => {
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
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    verificationToken,
    verify: false,
  })
  //ставимо статус СТВОРЕНО з повідомленням
  res.status(201).json({ message: 'User was created' })
}

const login: ControllerFunction = async (req: Request, res: Response) => {
  //отримуємо дані з фронтенда
  const { email, password } = req.body

  // шукаємо користувача в БД
  const user = await User.findOne({ email })
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

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
}
