import { Router } from 'express'
import User from '../models/User.js'
import { HttpError } from '../helpers/HttpError.js'

const router = Router()

// /api/auth/register
router.post('/register')
