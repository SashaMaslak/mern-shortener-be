import { Router } from 'express'
import ctrl from '../controllers/auth.controllers.js'
import { isAuth } from '../middlewares/isAuth.middleware.js'

const router = Router()

// /api/auth/register
router.post('/register', ctrl.register)

// /api/auth/login
router.post('/login', ctrl.login)

// /api/auth/login
router.post('/logout', isAuth, ctrl.logout)
