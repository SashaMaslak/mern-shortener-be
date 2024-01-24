import { Router } from 'express'
import User from '../models/User.js'

const router = Router()

// /api/auth/register
router.post('/register', async (req, res) => {
  try {
    //отримуємо дані з фронтенда
    const { email, password } = req.body

    const candidate = await User.findOne({ email })
  } catch (error) {}
})
