import { Router } from 'express'
import ctrl from '../controllers/auth.controllers.js'
import { joiValidateBody } from '../middlewares/validateBody.middleware.js'
import { joiSchemas } from '../models/JoiSchema.js'
import { isAuth } from '../middlewares/isAuth.middleware.js'

export const authRouter = Router()

// /users/register
authRouter.post('/register', joiValidateBody(joiSchemas.registerSchema), ctrl.register)

// /users/login
authRouter.post('/login', joiValidateBody(joiSchemas.loginSchema), ctrl.login)

// /users/logot
authRouter.post('/logout', isAuth, ctrl.logout)

// /users/current
authRouter.post('/current', isAuth, ctrl.getCurrent)

// /users/verify:verificationToken
authRouter.get('/verify/:verificationToken', ctrl.verifyEmail)

// /users/verify
authRouter.post('/verify', joiValidateBody(joiSchemas.emailSchema), ctrl.resendVerifyEmail)

// /users/
authRouter.put('/', isAuth, joiValidateBody(joiSchemas.updateSchema), ctrl.updateUser)

// /users/avatar
authRouter.put('/avatar', isAuth, uploadFile.single('avatar'), ctrl.updateAvatar)
