import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { ControllerFunction } from '../types.js'
import { ctrlWrapper } from '../helpers/ctrlWrapper.js'
import { HttpError } from '../helpers/HttpError.js'
import User from '../models/User.js'

export const register: ControllerFunction = async (req: Request, res: Response) => {
  //отримуємо дані з фронтенда
  const { email, password } = req.body

  // шукаємо користувача в БД
  const candidate = await User.findOne({ email })

  // Якщо користувач знайдений, викидаємо помилку з повідомленням
  if (candidate) {
    throw HttpError(409, 'Email has already been used')
  }

  // Створюємо нового користувача в БД
  const user = new User({ email, password })
  //Зберігаємо користувача в БД
  await user.save()
  //ставимо статус СТВОРЕНО з повідомленням
  res.status(201).json({ message: 'User was created' })
}

export const login: ControllerFunction = async (req: Request, res: Response) => {
  //отримуємо дані з фронтенда
  const { email, password } = req.body

  // шукаємо користувача в БД
  const candidate = await User.findOne({ email })

  // Якщо користувач знайдений, викидаємо помилку з повідомленням
  if (candidate) {
    throw HttpError(409, 'Email has already been used')
  }

  //ХЕШУЄМО пароль за допомогою бібліотеки bcryptjs
  const hashedPassword = await bcrypt.hash(password, 12)

  // Створюємо нового користувача в БД
  const user = new User({ email, password })
  //Зберігаємо користувача в БД
  await user.save()
  //ставимо статус СТВОРЕНО з повідомленням
  res.status(201).json({ message: 'User was created' })
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
}
